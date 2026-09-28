import Link from "next/link";
import { bookmarks, folders, type FolderId } from "@/data/bookmarks";
import { FolderIcon, GridIcon } from "./icons";

export function Sidebar({ active = true, activeFolderId }: { active?: boolean; activeFolderId?: FolderId }) {
  return (
    <aside className="sidebar">
      <nav aria-label="링크 폴더">
        <Link className={`nav-item${active ? " active" : ""}`} href="/#all" aria-current={active ? "page" : undefined}>
          <GridIcon className="nav-icon"/><span>All</span><span className="nav-count">8</span>
        </Link>
        <div className="folder-heading"><span>FOLDERS</span><button type="button" aria-label="새 폴더 추가">+</button></div>
        <ul className="folder-list">{folders.map((folder) => {
          const count = bookmarks.filter((bookmark) => bookmark.folderId === folder.id).length;
          const isActive = activeFolderId === folder.id;
          return <li key={folder.id}><Link className={`nav-item${isActive ? " active" : ""}`} href={`/folder/${folder.id}`} aria-current={isActive ? "page" : undefined}><span className={`folder-icon ${folder.color}`}><FolderIcon /></span><span>{folder.name}</span><span className="nav-count">{count}</span></Link></li>;
        })}</ul>
      </nav>
      <div className="sidebar-note"><span>TIP</span><p>링크를 폴더로 정리하면<br/>나중에 더 쉽게 찾을 수 있어요.</p></div>
    </aside>
  );
}
