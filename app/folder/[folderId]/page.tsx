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
    <div className="min-h-screen">
      <AppHeader />
      <div className="md:flex">
        <Sidebar active={false} activeFolderId={folder.id} />
        <main className="w-full px-5 py-10 md:px-10 md:py-14">
          <div className="mx-auto max-w-[720px]">
          <div className="mb-7 flex items-end justify-between">
            <div><p className="mb-2 text-xs font-semibold tracking-[0.1em] text-[var(--accent)]">폴더</p><h1 className="text-[30px] font-bold leading-[1.2] tracking-[-0.04em]">{folder.name}</h1></div>
            <span className="text-[14px] text-[var(--text-sub)]">{folderBookmarks.length}개의 링크</span>
          </div>
          <BookmarkGrid items={folderBookmarks} />
          </div>
        </main>
      </div>
    </div>
  );
}
