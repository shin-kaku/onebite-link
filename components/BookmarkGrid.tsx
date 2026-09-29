"use client";

import { ArrowIcon } from "./icons";
import { bookmarks, folders } from "@/data/bookmarks";
import { useFolders, type SavedBookmark } from "./FolderProvider";

type DefaultBookmark = (typeof bookmarks)[number];
type BookmarkItem = DefaultBookmark | SavedBookmark;

function isSavedBookmark(bookmark: BookmarkItem): bookmark is SavedBookmark {
  return "id" in bookmark;
}

function BookmarkCard({ bookmark }: { bookmark: BookmarkItem }) {
  const { customFolders, renamedFolders } = useFolders();
  const defaultFolder = folders.find((item) => item.id === bookmark.folderId);
  const customFolder = customFolders.find((item) => item.id === bookmark.folderId);
  const folderName = customFolder?.name ?? (defaultFolder ? renamedFolders[defaultFolder.id] ?? defaultFolder.name : "폴더 없음");
  const isSaved = isSavedBookmark(bookmark);
  const href = /^https?:\/\//i.test(bookmark.url) ? bookmark.url : `https://${bookmark.url}`;
  const displayUrl = bookmark.url.replace(/^https?:\/\//i, "").replace(/\/$/, "");
  const iconClass = `site-${bookmark.title.toLowerCase().replace(".", "").replace("요즘it", "yozmit")}`;

  return (
    <article className="card-hover flex min-h-52 flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)]">
      {isSaved && bookmark.thumbnail && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="h-44 w-full border-b border-[var(--border)] object-cover" src={bookmark.thumbnail} alt="" loading="lazy" referrerPolicy="no-referrer" />
      )}
      <div className="flex min-w-0 flex-1 flex-col p-5">
        {isSaved ? (
          <>
            <div className="flex items-start justify-between gap-3">
              <h2 className="min-w-0 flex-1 truncate text-lg font-semibold tracking-[-0.025em]">{bookmark.title}</h2>
              <span className="shrink-0 rounded bg-[var(--hover-bg)] px-2 py-1 text-xs text-[var(--text-sub)]">{folderName}</span>
            </div>
            <p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-[var(--text-sub)]">{bookmark.description}</p>
          </>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <div className={`${iconClass} grid size-10 shrink-0 place-items-center rounded-lg text-[13px] font-bold text-white`}>{bookmark.initial}</div>
              <span className="truncate rounded bg-[var(--hover-bg)] px-2 py-1 text-xs text-[var(--text-sub)]">{folderName}</span>
            </div>
            <div className="mt-5"><h2 className="line-clamp-2 text-lg font-semibold tracking-[-0.025em]">{bookmark.title}</h2><p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-[var(--text-sub)]">{bookmark.description}</p></div>
          </>
        )}
        <a className="external-hover mt-auto flex items-center justify-between gap-2 border-t border-[var(--border)] pt-4 text-xs text-[var(--text-sub)]" href={href} target="_blank" rel="noreferrer"><span className="truncate">{displayUrl}</span><ArrowIcon className="size-4 shrink-0" /></a>
      </div>
    </article>
  );
}

export function BookmarkGrid({ items = bookmarks, folderId }: { items?: readonly DefaultBookmark[]; folderId?: string }) {
  const { savedBookmarks } = useFolders();
  const addedItems = folderId ? savedBookmarks.filter((bookmark) => bookmark.folderId === folderId) : savedBookmarks;
  const allItems: BookmarkItem[] = [...items, ...addedItems];

  return <section className="grid grid-cols-1 gap-3 sm:grid-cols-2" id="all" aria-label="저장한 링크">{allItems.map((bookmark) => <BookmarkCard key={isSavedBookmark(bookmark) ? bookmark.id : bookmark.url} bookmark={bookmark}/>)}</section>;
}
