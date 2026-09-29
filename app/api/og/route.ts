import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

const MAX_HTML_BYTES = 2_000_000;

function isPrivateAddress(address: string) {
  if (address === "::1" || address === "::" || address.startsWith("fc") || address.startsWith("fd") || /^fe[89ab]/i.test(address)) return true;
  const normalized = address.startsWith("::ffff:") ? address.slice(7) : address;
  if (isIP(normalized) !== 4) return false;
  const [a, b] = normalized.split(".").map(Number);
  return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127);
}

async function validateUrl(value: string) {
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error("HTTP 또는 HTTPS 주소만 사용할 수 있습니다.");
  if (url.username || url.password) throw new Error("인증 정보가 포함된 주소는 사용할 수 없습니다.");
  if (url.hostname === "localhost" || url.hostname.endsWith(".localhost")) throw new Error("내부 주소는 사용할 수 없습니다.");
  const addresses = await lookup(url.hostname, { all: true });
  if (!addresses.length || addresses.some(({ address }) => isPrivateAddress(address))) throw new Error("내부 주소는 사용할 수 없습니다.");
  return url;
}

async function fetchHtml(input: string) {
  let url = await validateUrl(input);
  for (let redirects = 0; redirects <= 3; redirects += 1) {
    const response = await fetch(url, {
      cache: "no-store",
      redirect: "manual",
      signal: AbortSignal.timeout(8_000),
      headers: { "user-agent": "Mozilla/5.0 (compatible; OnebiteLinkPreview/1.0)", accept: "text/html,application/xhtml+xml" },
    });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) throw new Error("리디렉션 주소를 확인할 수 없습니다.");
      url = await validateUrl(new URL(location, url).toString());
      continue;
    }
    if (!response.ok) throw new Error(`페이지를 불러오지 못했습니다. (${response.status})`);
    if (!response.headers.get("content-type")?.includes("text/html")) throw new Error("HTML 페이지 주소를 입력해주세요.");
    const length = Number(response.headers.get("content-length") ?? 0);
    if (length > MAX_HTML_BYTES) throw new Error("페이지 크기가 너무 큽니다.");
    return { html: (await response.text()).slice(0, MAX_HTML_BYTES), finalUrl: url };
  }
  throw new Error("리디렉션이 너무 많습니다.");
}

function decodeHtml(value: string) {
  return value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code))).trim();
}

function getMeta(html: string, key: string) {
  for (const match of html.matchAll(/<meta\s+[^>]*>/gi)) {
    const attributes = Object.fromEntries([...match[0].matchAll(/([\w:-]+)\s*=\s*["']([^"']*)["']/g)].map((item) => [item[1].toLowerCase(), item[2]]));
    if (attributes.property?.toLowerCase() === key || attributes.name?.toLowerCase() === key) return decodeHtml(attributes.content ?? "");
  }
  return "";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = typeof body.url === "string" ? body.url.trim() : "";
    if (!input) return Response.json({ error: "링크 주소를 입력해주세요." }, { status: 400 });
    const normalized = /^https?:\/\//i.test(input) ? input : `https://${input}`;
    const { html, finalUrl } = await fetchHtml(normalized);
    const titleTag = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "";
    const title = getMeta(html, "og:title") || decodeHtml(titleTag) || finalUrl.hostname;
    const description = getMeta(html, "og:description") || getMeta(html, "description") || "설명이 제공되지 않은 링크입니다.";
    const image = getMeta(html, "og:image") || getMeta(html, "twitter:image");
    const thumbnail = image ? new URL(image, finalUrl).toString() : null;
    return Response.json({ title, description, thumbnail, url: finalUrl.toString() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "링크 정보를 가져오지 못했습니다.";
    return Response.json({ error: message }, { status: 400 });
  }
}
