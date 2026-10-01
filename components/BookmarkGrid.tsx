"use client";

import { ArrowIcon, PencilIcon, PrivateIcon, PublicIcon, TrashIcon } from "./icons";
import { bookmarks, folders } from "@/data/bookmarks";
import { useFolders, type DatabaseLink, type SavedBookmark } from "./FolderProvider";

type DefaultBookmark = (typeof bookmarks)[number];
type BookmarkItem = DefaultBookmark | SavedBookmark | DatabaseLink;

function isDatabaseLink(bookmark: BookmarkItem): bookmark is DatabaseLink {
  return "source" in bookmark && bookmark.source === "database";
}

function isSavedBookmark(bookmark: BookmarkItem): bookmark is SavedBookmark {
  return "id" in bookmark && !isDatabaseLink(bookmark);
}

function BookmarkCard({ bookmark }: { bookmark: BookmarkItem }) {
  const { customFolders, databaseFolders, isMaster, renamedFolders, bookmarkOverrides, requestDeleteBookmark, requestEditBookmark, toggleLinkVisibility } = useFolders();
  const isDatabase = isDatabaseLink(bookmark);
  const isReadOnly = isDatabase && bookmark.isReadOnly;
  const isSaved = isSavedBookmark(bookmark);
  const hasRichPreview = isDatabase || isSaved;
  const key = isDatabase || isSaved ? bookmark.id : bookmark.url;
  const override = hasRichPreview ? undefined : bookmarkOverrides[key];
  const title = override?.title ?? bookmark.title;
  const description = override?.description ?? bookmark.description;
  const folderId = override?.folderId ?? bookmark.folderId;
  const defaultFolder = folders.find((item) => item.id === folderId);
  const customFolder = customFolders.find((item) => item.id === folderId);
  const databaseFolder = databaseFolders.find((item) => item.id === folderId);
  const canPublish = Boolean(databaseFolder?.isPublic);
  const folderName = databaseFolder?.name ?? customFolder?.name ?? (defaultFolder ? renamedFolders[defaultFolder.id] ?? defaultFolder.name : "폴더 없음");
  const href = /^https?:\/\//i.test(bookmark.url) ? bookmark.url : `https://${bookmark.url}`;
  const displayUrl = bookmark.url.replace(/^https?:\/\//i, "").replace(/\/$/, "");
  const iconClass = `site-${bookmark.title.toLowerCase().replace(".", "").replace("요즘it", "yozmit")}`;

  return (
    <article className="bookmark-card card-hover relative flex min-h-52 flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)]">
      {!isReadOnly && <span className="bookmark-actions absolute top-3 right-3 z-10">
        {isDatabase && isMaster && <button className="bookmark-action-button" type="button" aria-label={`${title} 링크를 ${bookmark.isPublic ? "비공개" : "공개"}로 변경`} title={!bookmark.isPublic && !canPublish ? "폴더를 먼저 공개해 주세요" : bookmark.isPublic ? "비공개로 변경" : "공개로 변경"} disabled={!bookmark.isPublic && !canPublish} onClick={() => void toggleLinkVisibility(bookmark)}>{bookmark.isPublic ? <PublicIcon className="size-4"/> : <PrivateIcon className="size-4"/>}</button>}
        <button className="bookmark-action-button" type="button" aria-label={`${title} 링크 수정`} onClick={() => requestEditBookmark({ key, title, description, folderId, isSaved, isDatabase, isReadOnly })}><PencilIcon className="size-4"/></button>
        <button className="bookmark-action-button" type="button" aria-label={`${title} 링크 삭제`} onClick={() => requestDeleteBookmark({ key, title, isSaved, isDatabase, isReadOnly })}><TrashIcon className="size-4"/></button>
      </span>}
      {hasRichPreview && bookmark.thumbnail && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="h-44 w-full border-b border-[var(--border)] object-cover" src={bookmark.thumbnail} alt="" loading="lazy" referrerPolicy="no-referrer" />
      )}
      <div className="flex min-w-0 flex-1 flex-col p-5">
        {hasRichPreview ? (
          <>
            <div className="flex items-start justify-between gap-3">
              <h2 className="min-w-0 flex-1 truncate text-lg font-semibold tracking-[-0.025em]">{title}</h2>
              <span className="shrink-0 rounded bg-[var(--hover-bg)] px-2 py-1 text-xs text-[var(--text-sub)]">{folderName}</span>
            </div>
            <p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-[var(--text-sub)]">{description}</p>
          </>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <div className={`${iconClass} grid size-10 shrink-0 place-items-center rounded-lg text-[13px] font-bold text-white`}>{bookmark.initial}</div>
              <span className="truncate rounded bg-[var(--hover-bg)] px-2 py-1 text-xs text-[var(--text-sub)]">{folderName}</span>
            </div>
            <div className="mt-5"><h2 className="line-clamp-2 text-lg font-semibold tracking-[-0.025em]">{title}</h2><p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-[var(--text-sub)]">{description}</p></div>
          </>
        )}
        <a className="external-hover mt-auto flex items-center justify-between gap-2 border-t border-[var(--border)] pt-4 text-xs text-[var(--text-sub)]" href={href} target="_blank" rel="noreferrer"><span className="truncate">{displayUrl}</span><ArrowIcon className="size-4 shrink-0" /></a>
      </div>
    </article>
  );
}

export function BookmarkGrid({ items = bookmarks, folderId }: { items?: readonly DefaultBookmark[]; folderId?: string }) {
  const { customFolders, databaseFolders, savedBookmarks, databaseLinks, deletedBookmarkKeys, renamedFolders, bookmarkOverrides, searchQuery } = useFolders();
  const addedItems = folderId ? savedBookmarks.filter((bookmark) => bookmark.folderId === folderId) : savedBookmarks;
  const databaseItems = folderId ? databaseLinks.filter((bookmark) => bookmark.folderId === folderId) : databaseLinks;
  const sourceItems = folderId ? bookmarks.filter((bookmark) => (bookmarkOverrides[bookmark.url]?.folderId ?? bookmark.folderId) === folderId) : items;
  const visibleItems = sourceItems.filter((bookmark) => !deletedBookmarkKeys.includes(bookmark.url));
  const allItems: BookmarkItem[] = [...visibleItems, ...addedItems, ...databaseItems];
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase("ko");
  const filteredItems = normalizedQuery ? allItems.filter((bookmark) => {
    const isRichPreview = isDatabaseLink(bookmark) || isSavedBookmark(bookmark);
    const override = isRichPreview ? undefined : bookmarkOverrides[bookmark.url];
    const folderId = override?.folderId ?? bookmark.folderId;
    const defaultFolder = folders.find((folder) => folder.id === folderId);
    const folderName = databaseFolders.find((folder) => folder.id === folderId)?.name
      ?? customFolders.find((folder) => folder.id === folderId)?.name
      ?? (defaultFolder ? renamedFolders[defaultFolder.id] ?? defaultFolder.name : "");
    return [override?.title ?? bookmark.title, override?.description ?? bookmark.description, bookmark.url, folderName]
      .some((value) => value.toLocaleLowerCase("ko").includes(normalizedQuery));
  }) : allItems;

  return <section className="grid grid-cols-1 gap-3 sm:grid-cols-2" id="all" aria-label="저장한 링크">{filteredItems.map((bookmark) => <BookmarkCard key={isDatabaseLink(bookmark) ? `database-${bookmark.id}` : isSavedBookmark(bookmark) ? bookmark.id : bookmark.url} bookmark={bookmark}/>)}{normalizedQuery && filteredItems.length === 0 && <div className="col-span-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-5 py-12 text-center"><p className="text-[14px] font-medium">검색 결과가 없습니다.</p><p className="mt-1 text-xs text-[var(--text-sub)]">다른 검색어를 입력해 보세요.</p></div>}</section>;
}
