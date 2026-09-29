"use client";

import { useFolders } from "./FolderProvider";

export function FolderTitle({ folderId, fallback }: { folderId: string; fallback: string }) {
  const { renamedFolders } = useFolders();
  return <>{renamedFolders[folderId] ?? fallback}</>;
}
