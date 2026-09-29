"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { createClient } from "@/utils/supabase/client";
import { useFolders } from "./FolderProvider";

type OgResponse = { title: string; description: string; thumbnail: string | null; url: string; error?: never } | { error: string };

export function NewLinkForm() {
  const router = useRouter();
  const { databaseFolders, addDatabaseLink } = useFolders();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const isSavingRef = useRef(false);

  async function saveLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSavingRef.current) return;

    isSavingRef.current = true;
    setIsLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/og", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: form.get("url") }),
      });
      const data = await response.json() as OgResponse;
      if (!response.ok || "error" in data) throw new Error(data.error || "링크 정보를 가져오지 못했습니다.");

      const folderId = String(form.get("folder"));
      const supabase = createClient();
      const { data: insertedLink, error: insertError } = await supabase
        .from("links")
        .insert({
          url: data.url,
          title: data.title,
          description: data.description,
          thumbanil_url: data.thumbnail,
          folder_id: folderId,
        })
        .select("id, url, title, description, thumbanil_url, folder_id")
        .single();

      if (insertError) throw insertError;

      addDatabaseLink({
        id: String(insertedLink.id),
        title: insertedLink.title ?? insertedLink.url,
        description: insertedLink.description ?? "",
        thumbnail: insertedLink.thumbanil_url,
        url: insertedLink.url,
        folderId: insertedLink.folder_id === null ? "" : String(insertedLink.folder_id),
        source: "database",
      });
      router.push("/");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "링크를 저장하지 못했습니다.");
      setIsLoading(false);
      isSavingRef.current = false;
    }
  }

  return (
    <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8" aria-labelledby="new-link-title">
      <div className="border-b border-[var(--border)] pb-6">
        <p className="mb-2 text-xs font-semibold tracking-[0.1em] text-[var(--accent)]">컬렉션에 추가</p>
        <h1 className="text-[30px] font-bold leading-[1.2] tracking-[-0.04em]" id="new-link-title">새 링크 저장</h1>
        <p className="mt-2 text-[14px] text-[var(--text-sub)]">주소를 입력하면 제목과 설명, 썸네일을 자동으로 가져옵니다.</p>
      </div>

      <form className="grid gap-6 pt-6" onSubmit={saveLink}>
        <div className="grid gap-2">
          <label className="text-[14px] font-semibold" htmlFor="link-url">링크</label>
          <input className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-base transition-colors" id="link-url" name="url" type="text" inputMode="url" placeholder="https://example.com" autoComplete="url" required disabled={isLoading} />
          <span className="text-xs text-[var(--text-sub)]">저장하려는 페이지의 주소를 입력해주세요.</span>
        </div>

        <div className="grid gap-2">
          <label className="text-[14px] font-semibold" htmlFor="link-folder">폴더</label>
          <div className="relative">
            <select className="h-11 w-full appearance-none rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-base transition-colors" id="link-folder" name="folder" defaultValue="" required disabled={isLoading}>
              <option value="" disabled>폴더를 선택해주세요</option>
              {databaseFolders.map((folder) => <option key={folder.id} value={folder.id}>{folder.name}</option>)}
            </select>
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-[var(--text-sub)]">⌄</span>
          </div>
        </div>

        {error && <p className="rounded-md bg-[var(--error-bg)] px-3 py-2.5 text-[14px] text-[var(--error)]" role="alert">{error}</p>}

        <div className="mt-2 flex justify-end gap-2">
          <Link className="secondary-hover inline-flex h-10 items-center justify-center rounded-md border border-[var(--border)] px-4 text-[14px] font-semibold" href="/">취소</Link>
          <button className="primary-hover h-10 cursor-pointer rounded-md bg-[var(--accent)] px-4 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40" type="submit" disabled={isLoading}>{isLoading ? "저장 중…" : "확인"}</button>
        </div>
      </form>
    </section>
  );
}
