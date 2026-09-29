"use client";

import { useFolders } from "./FolderProvider";

export function BookmarkCount({ baseCount, folderId }: { baseCount: number; folderId?: string }) {
  const { savedBookmarks } = useFolders();
  const addedCount = folderId ? savedBookmarks.filter((bookmark) => bookmark.folderId === folderId).length : savedBookmarks.length;
  return <>{baseCount + addedCount}개의 링크</>;
}
