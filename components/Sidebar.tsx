"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { bookmarks, folders } from "@/data/bookmarks";
import { createClient } from "@/utils/supabase/client";
import { FolderIcon, GridIcon, LogoutIcon, PencilIcon, PrivateIcon, PublicIcon, SearchIcon, TrashIcon } from "./icons";
import { useFolders } from "./FolderProvider";

export function Sidebar({ active = true, activeFolderId }: { active?: boolean; activeFolderId?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState("");
  const { customFolders, databaseFolders, databaseLinks, isMaster, searchQuery, setSearchQuery, deletedFolderIds, renamedFolders, savedBookmarks, deletedBookmarkKeys, bookmarkOverrides, openFolderModal, requestDeleteFolder, requestEditFolder, toggleFolderVisibility } = useFolders();
  const visibleFolders = folders.filter((folder) => !deletedFolderIds.includes(folder.id));

  const handleSignOut = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);
    setSignOutError("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut({ scope: "local" });

      if (error) {
        setSignOutError("로그아웃에 실패했습니다. 잠시 후 다시 시도해 주세요.");
        setIsSigningOut(false);
        return;
      }

      router.replace("/login");
      router.refresh();
    } catch {
      setSignOutError("로그아웃에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      setIsSigningOut(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (pathname !== "/") router.push("/");
  };

  return (
    <aside className="mobile-scroll border-b border-[var(--border)] px-4 py-3 md:flex md:min-h-[calc(100vh-64px)] md:w-72 md:flex-col md:justify-between md:border-r md:border-b-0 md:px-4 md:py-8">
      {signOutError ? <div className="fixed top-5 left-1/2 z-50 w-[calc(100%-32px)] max-w-[440px] -translate-x-1/2 rounded-lg border border-[var(--error)] bg-[var(--error-bg)] px-4 py-3 text-center text-[14px] font-medium text-[var(--error)]" role="alert" aria-live="assertive">{signOutError}</div> : null}
      <nav className="flex min-w-max gap-1.5 md:block md:min-w-0" aria-label="링크 폴더">
        <Link className={`nav-hover flex h-10 items-center gap-2.5 rounded-md px-3 text-[14px] font-medium ${active ? "nav-active" : "text-[var(--text-sub)]"}`} href="/#all" aria-current={active ? "page" : undefined}>
          <GridIcon className="size-[18px]"/><span>전체</span><span className="ml-auto hidden text-xs opacity-60 md:inline">{bookmarks.filter((bookmark) => !deletedBookmarkKeys.includes(bookmark.url)).length + savedBookmarks.length + databaseLinks.length}</span>
        </Link>
        <label className="relative mt-2 hidden md:block">
          <span className="sr-only">링크 검색</span>
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-[17px] -translate-y-1/2 text-[var(--text-sub)]" />
          <input className="h-10 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] pr-3 pl-9 text-[14px] text-[var(--text)] transition-colors" type="search" value={searchQuery} onChange={(event) => handleSearch(event.target.value)} placeholder="링크 검색" autoComplete="off" />
        </label>
        <div className="mt-7 mb-2 hidden items-center justify-between px-3 text-[11px] font-semibold tracking-[0.08em] text-[var(--text-sub)] md:flex"><span>폴더</span><button className="secondary-hover grid size-6 cursor-pointer place-items-center rounded text-base" type="button" aria-label="새 폴더 추가" onClick={openFolderModal}>+</button></div>
        <ul className="flex gap-1.5 md:grid">{visibleFolders.map((folder) => {
          const count = bookmarks.filter((bookmark) => (bookmarkOverrides[bookmark.url]?.folderId ?? bookmark.folderId) === folder.id && !deletedBookmarkKeys.includes(bookmark.url)).length + savedBookmarks.filter((bookmark) => bookmark.folderId === folder.id).length;
          const isActive = activeFolderId === folder.id;
          const name = renamedFolders[folder.id] ?? folder.name;
          return <li className="folder-row relative" key={folder.id}><Link className={`nav-hover flex h-10 items-center gap-2.5 rounded-md px-3 pr-[72px] text-[14px] font-medium ${isActive ? "nav-active" : "text-[var(--text-sub)]"}`} href={`/folder/${folder.id}`} aria-current={isActive ? "page" : undefined}><FolderIcon className="size-[18px]"/><span>{name}</span><span className="folder-count ml-auto hidden text-xs opacity-60 md:inline">{count}</span></Link><span className="folder-actions absolute top-1/2 right-2 -translate-y-1/2"><button className="folder-action-button" type="button" aria-label={`${name} 폴더 수정`} onClick={() => requestEditFolder({ id: folder.id, name, isCustom: false })}><PencilIcon className="size-4"/></button><button className="folder-action-button" type="button" aria-label={`${name} 폴더 삭제`} onClick={() => requestDeleteFolder({ id: folder.id, name, isCustom: false })}><TrashIcon className="size-4"/></button></span></li>;
        })}
          {customFolders.map((folder) => <li className="folder-row relative" key={folder.id}><Link className="nav-hover flex h-10 items-center gap-2.5 rounded-md px-3 pr-[72px] text-[14px] font-medium text-[var(--text-sub)]" href={`/#folder-${folder.id}`}><FolderIcon className="size-[18px]"/><span>{folder.name}</span><span className="folder-count ml-auto hidden text-xs opacity-60 md:inline">{savedBookmarks.filter((bookmark) => bookmark.folderId === folder.id).length + bookmarks.filter((bookmark) => bookmarkOverrides[bookmark.url]?.folderId === folder.id && !deletedBookmarkKeys.includes(bookmark.url)).length}</span></Link><span className="folder-actions absolute top-1/2 right-2 -translate-y-1/2"><button className="folder-action-button" type="button" aria-label={`${folder.name} 폴더 수정`} onClick={() => requestEditFolder({ ...folder, isCustom: true })}><PencilIcon className="size-4"/></button><button className="folder-action-button" type="button" aria-label={`${folder.name} 폴더 삭제`} onClick={() => requestDeleteFolder({ ...folder, isCustom: true })}><TrashIcon className="size-4"/></button></span></li>)}
          {databaseFolders.map((folder) => <li className="folder-row relative" key={folder.id}><Link className={`nav-hover flex h-10 items-center gap-2.5 rounded-md px-3 ${folder.isReadOnly ? "" : isMaster ? "pr-[100px]" : "pr-[72px]"} text-[14px] font-medium ${activeFolderId === folder.id ? "nav-active" : "text-[var(--text-sub)]"}`} href={`/folder/${folder.id}`} aria-current={activeFolderId === folder.id ? "page" : undefined}><FolderIcon className="size-[18px]"/><span className="truncate">{folder.name}</span><span className="folder-count ml-auto hidden text-xs opacity-60 md:inline">{databaseLinks.filter((bookmark) => bookmark.folderId === folder.id).length}</span></Link>{!folder.isReadOnly && <span className="folder-actions absolute top-1/2 right-2 -translate-y-1/2">{isMaster && <button className="folder-action-button" type="button" aria-label={`${folder.name} 폴더를 ${folder.isPublic ? "비공개" : "공개"}로 변경`} title={folder.isPublic ? "비공개로 변경" : "공개로 변경"} onClick={() => void toggleFolderVisibility(folder)}>{folder.isPublic ? <PublicIcon className="size-4"/> : <PrivateIcon className="size-4"/>}</button>}<button className="folder-action-button" type="button" aria-label={`${folder.name} 폴더 수정`} onClick={() => requestEditFolder({ ...folder, isCustom: false, isDatabase: true })}><PencilIcon className="size-4"/></button><button className="folder-action-button" type="button" aria-label={`${folder.name} 폴더 삭제`} onClick={() => requestDeleteFolder({ ...folder, isCustom: false, isDatabase: true })}><TrashIcon className="size-4"/></button></span>}</li>)}
        </ul>
      </nav>
      <div className="mt-3 grid gap-3 md:mt-0">
        <div className="hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 md:block"><span className="text-[11px] font-semibold text-[var(--accent)]">TIP</span><p className="mt-2 text-xs leading-relaxed text-[var(--text-sub)]">링크를 폴더로 정리하면<br/>나중에 더 쉽게 찾을 수 있어요.</p></div>
        <button className="logout-hover flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-[14px] font-medium text-[var(--text-sub)] disabled:cursor-not-allowed disabled:opacity-40" type="button" onClick={handleSignOut} disabled={isSigningOut}>
          <LogoutIcon className="size-[18px]" />
          <span>{isSigningOut ? "로그아웃 중..." : "로그아웃"}</span>
        </button>
      </div>
    </aside>
  );
}
