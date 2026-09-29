import Link from "next/link";
import { bookmarks, folders, type FolderId } from "@/data/bookmarks";
import { FolderIcon, GridIcon } from "./icons";

export function Sidebar({ active = true, activeFolderId }: { active?: boolean; activeFolderId?: FolderId }) {
  return (
    <aside className="mobile-scroll border-b border-[var(--border)] px-4 py-3 md:flex md:min-h-[calc(100vh-64px)] md:w-60 md:flex-col md:justify-between md:border-r md:border-b-0 md:px-4 md:py-8">
      <nav className="flex min-w-max gap-1.5 md:block md:min-w-0" aria-label="링크 폴더">
        <Link className={`nav-hover flex h-10 items-center gap-2.5 rounded-md px-3 text-[14px] font-medium ${active ? "nav-active" : "text-[var(--text-sub)]"}`} href="/#all" aria-current={active ? "page" : undefined}>
          <GridIcon className="size-[18px]"/><span>전체</span><span className="ml-auto hidden text-xs opacity-60 md:inline">8</span>
        </Link>
        <div className="mt-7 mb-2 hidden items-center justify-between px-3 text-[11px] font-semibold tracking-[0.08em] text-[var(--text-sub)] md:flex"><span>폴더</span><button className="secondary-hover grid size-6 cursor-pointer place-items-center rounded text-base" type="button" aria-label="새 폴더 추가">+</button></div>
        <ul className="flex gap-1.5 md:grid">{folders.map((folder) => {
          const count = bookmarks.filter((bookmark) => bookmark.folderId === folder.id).length;
          const isActive = activeFolderId === folder.id;
          return <li key={folder.id}><Link className={`nav-hover flex h-10 items-center gap-2.5 rounded-md px-3 text-[14px] font-medium ${isActive ? "nav-active" : "text-[var(--text-sub)]"}`} href={`/folder/${folder.id}`} aria-current={isActive ? "page" : undefined}><FolderIcon className="size-[18px]"/><span>{folder.name}</span><span className="ml-auto hidden text-xs opacity-60 md:inline">{count}</span></Link></li>;
        })}</ul>
      </nav>
      <div className="hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 md:block"><span className="text-[11px] font-semibold text-[var(--accent)]">TIP</span><p className="mt-2 text-xs leading-relaxed text-[var(--text-sub)]">링크를 폴더로 정리하면<br/>나중에 더 쉽게 찾을 수 있어요.</p></div>
    </aside>
  );
}
