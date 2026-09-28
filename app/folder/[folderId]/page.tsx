import { notFound } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { BookmarkGrid } from "@/components/BookmarkGrid";
import { Sidebar } from "@/components/Sidebar";
import { folders, getFolder, getFolderBookmarks, type FolderId } from "@/data/bookmarks";

export function generateStaticParams() {
  return folders.map((folder) => ({ folderId: folder.id }));
}

export default async function FolderPage({ params }: PageProps<"/folder/[folderId]">) {
  const { folderId } = await params;
  const folder = getFolder(folderId);

  if (!folder) notFound();

  const folderBookmarks = getFolderBookmarks(folderId as FolderId);

  return (
    <div className="app-shell">
      <AppHeader />
      <div className="app-body">
        <Sidebar active={false} activeFolderId={folder.id} />
        <main className="main-content">
          <div className="page-heading">
            <div><p className="eyebrow">FOLDER</p><h1>{folder.name}</h1></div>
            <span className="link-count">{folderBookmarks.length}개의 링크</span>
          </div>
          <BookmarkGrid items={folderBookmarks} />
        </main>
      </div>
    </div>
  );
}
