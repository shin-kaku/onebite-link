import { notFound } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { BookmarkGrid } from "@/components/BookmarkGrid";
import { Sidebar } from "@/components/Sidebar";
import { FolderTitle } from "@/components/FolderTitle";
import { BookmarkCount } from "@/components/BookmarkCount";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { folders, getFolder, getFolderBookmarks, type FolderId } from "@/data/bookmarks";

export function generateStaticParams() {
  return folders.map((folder) => ({ folderId: folder.id }));
}

export default async function FolderPage({ params }: PageProps<"/folder/[folderId]">) {
  const { folderId } = await params;
  const staticFolder = getFolder(folderId);
  let folderName = staticFolder?.name;

  if (!folderName) {
    const supabase = createClient(await cookies());
    const { data: databaseFolder } = await supabase
      .from("folders")
      .select("nam")
      .eq("id", folderId)
      .maybeSingle();

    if (!databaseFolder) notFound();
    folderName = databaseFolder.nam;
  }

  if (!folderName) notFound();

  const folderBookmarks = staticFolder ? getFolderBookmarks(folderId as FolderId) : [];

  return (
    <div className="min-h-screen">
      <AppHeader />
      <div className="md:flex">
        <Sidebar active={false} activeFolderId={folderId} />
        <main className="w-full px-5 py-10 md:px-10 md:py-14">
          <div className="mx-auto max-w-[720px]">
          <div className="mb-7 flex items-end justify-between">
            <div><p className="mb-2 text-xs font-semibold tracking-[0.1em] text-[var(--accent)]">폴더</p><h1 className="text-[30px] font-bold leading-[1.2] tracking-[-0.04em]">{staticFolder ? <FolderTitle folderId={folderId} fallback={folderName} /> : folderName}</h1></div>
            <span className="text-[14px] text-[var(--text-sub)]"><BookmarkCount folderId={folderId} /></span>
          </div>
          <BookmarkGrid items={folderBookmarks} folderId={folderId} />
          </div>
        </main>
      </div>
    </div>
  );
}
