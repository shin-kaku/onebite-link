import Link from "next/link";
import { folders } from "@/data/bookmarks";

export function NewLinkForm() {
  return (
    <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8" aria-labelledby="new-link-title">
      <div className="border-b border-[var(--border)] pb-6">
        <p className="mb-2 text-xs font-semibold tracking-[0.1em] text-[var(--accent)]">컬렉션에 추가</p>
        <h1 className="text-[30px] font-bold leading-[1.2] tracking-[-0.04em]" id="new-link-title">새 링크 저장</h1>
        <p className="mt-2 text-[14px] text-[var(--text-sub)]">나중에 다시 보고 싶은 링크를 저장해 보세요.</p>
      </div>

      <form className="grid gap-6 pt-6">
        <div className="grid gap-2">
          <label className="text-[14px] font-semibold" htmlFor="link-url">링크</label>
          <input className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-base transition-colors" id="link-url" name="url" type="url" placeholder="https://example.com" autoComplete="url" required />
          <span className="text-xs text-[var(--text-sub)]">저장하려는 페이지의 주소를 입력해주세요.</span>
        </div>

        <div className="grid gap-2">
          <label className="text-[14px] font-semibold" htmlFor="link-folder">폴더</label>
          <div className="relative">
            <select className="h-11 w-full appearance-none rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-base transition-colors" id="link-folder" name="folder" defaultValue="">
              <option value="" disabled>폴더를 선택해주세요</option>
              {folders.map((folder) => <option key={folder.id} value={folder.id}>{folder.name}</option>)}
            </select>
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-[var(--text-sub)]">⌄</span>
          </div>
        </div>

        <div className="mt-2 flex justify-end gap-2">
          <Link className="secondary-hover inline-flex h-10 items-center justify-center rounded-md border border-[var(--border)] px-4 text-[14px] font-semibold" href="/">취소</Link>
          <button className="primary-hover h-10 cursor-pointer rounded-md bg-[var(--accent)] px-4 text-[14px] font-semibold text-white" type="submit">링크 저장</button>
        </div>
      </form>
    </section>
  );
}
