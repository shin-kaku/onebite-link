import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { BookmarkGrid } from "@/components/BookmarkGrid";
import { Sidebar } from "@/components/Sidebar";
import { FolderTitle } from "@/components/FolderTitle";
import { BookmarkCount } from "@/components/BookmarkCount";
import { createClient } from "@/utils/supabase/server";
import { MASTER_USER_ID } from "@/utils/supabase/access";
import { cookies } from "next/headers";
import { getFolder, getFolderBookmarks, type FolderId } from "@/data/bookmarks";
import { createPageMetadata } from "@/utils/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/folder/[folderId]">): Promise<Metadata> {
  const { folderId } = await params;
  const staticFolder = getFolder(folderId);
  let folderName = staticFolder?.name;

  if (!folderName) {
    const supabase = createClient(await cookies());
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: databaseFolder } = await supabase
        .from("folders")
        .select("nam")
        .eq("id", folderId)
        .in("user_id", [user.id, MASTER_USER_ID])
        .maybeSingle();

      folderName = databaseFolder?.nam;
    }
  }

  const title = folderName ?? "북마크 폴더";

  return createPageMetadata({
    title,
    description: `${title} 폴더에 모아둔 링크를 둘러보세요.`,
    noIndex: !staticFolder,
  });
}

export default async function FolderPage({ params }: PageProps<"/folder/[folderId]">) {
  const { folderId } = await params;
  const staticFolder = getFolder(folderId);
  let folderName = staticFolder?.name;

  if (!folderName) {
    const supabase = createClient(await cookies());
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) notFound();

    const { data: databaseFolder } = await supabase
      .from("folders")
      .select("nam")
      .eq("id", folderId)
      .in("user_id", [user.id, MASTER_USER_ID])
      .maybeSingle();

    if (!databaseFolder) notFound();
    folderName = databaseFolder.nam;
  }

  if (!folderName) notFound();

  const folderBookmarks = staticFolder ? getFolderBookmarks(folderId as FolderId) : [];

  return (
    <div className="min-h-screen">
      <AppHeader />
      <div className="flex flex-col md:flex-row">
        <Sidebar active={false} activeFolderId={folderId} />
        <main className="order-4 w-full px-5 py-10 md:order-none md:min-w-0 md:flex-1 md:px-10 md:py-14">
          <div className="w-full">
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
