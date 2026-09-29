"use client";

import { useFolders } from "./FolderProvider";

export function BookmarkCount({ baseKeys, folderId }: { baseKeys: readonly string[]; folderId?: string }) {
  const { savedBookmarks, deletedBookmarkKeys } = useFolders();
  const addedCount = folderId ? savedBookmarks.filter((bookmark) => bookmark.folderId === folderId).length : savedBookmarks.length;
  const baseCount = baseKeys.filter((key) => !deletedBookmarkKeys.includes(key)).length;
  return <>{baseCount + addedCount}개의 링크</>;
}
