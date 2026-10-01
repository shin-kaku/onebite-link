import type { Metadata } from "next";

export const SITE_NAME = "타이포그래피 기초 북마크";
export const SITE_DESCRIPTION = "좋아하는 링크를 한입에 모아보세요.";

export function getMetadataBase(): URL {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL;

  if (!siteUrl) return new URL("http://localhost:3000");

  return new URL(siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`);
}

type PageMetadataOptions = {
  title: string;
  description: string;
  noIndex?: boolean;
};

export function createPageMetadata({
  title,
  description,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
