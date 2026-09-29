"use client";

import { useFolders } from "./FolderProvider";
import { bookmarks } from "@/data/bookmarks";

export function BookmarkCount({ folderId }: { folderId?: string }) {
  const { savedBookmarks, deletedBookmarkKeys, bookmarkOverrides } = useFolders();
  const addedCount = folderId ? savedBookmarks.filter((bookmark) => bookmark.folderId === folderId).length : savedBookmarks.length;
  const baseCount = bookmarks.filter((bookmark) => !deletedBookmarkKeys.includes(bookmark.url) && (!folderId || (bookmarkOverrides[bookmark.url]?.folderId ?? bookmark.folderId) === folderId)).length;
  return <>{baseCount + addedCount}개의 링크</>;
}
