type Folder = { id: string; name: string; color: string };
type Bookmark = { title: string; url: string; description: string; folderId: string; color: string; initial: string };

export const folders: readonly Folder[] = [];
export const bookmarks: readonly Bookmark[] = [];

export type FolderId = string;

export function getFolder(folderId: string) {
  return folders.find((folder) => folder.id === folderId);
}

export function getFolderBookmarks(folderId: FolderId) {
  return bookmarks.filter((bookmark) => bookmark.folderId === folderId);
}
