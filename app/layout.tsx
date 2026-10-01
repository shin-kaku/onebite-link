import type { Metadata } from "next";
import { cookies } from "next/headers";
import { FolderProvider } from "@/components/FolderProvider";
import { MASTER_USER_ID } from "@/utils/supabase/access";
import { createClient } from "@/utils/supabase/server";
import "./globals.css";

export const metadata: Metadata = {
  title: "타이포그래피 기초 북마크",
  description: "좋아하는 링크를 한입에 모아보세요.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id ?? null;
  const [{ data: foldersData }, { data: linksData }] = userId
    ? await Promise.all([
        supabase.from("folders").select("id, nam, user_id, is_public").in("user_id", [userId, MASTER_USER_ID]).order("created_at", { ascending: true }).order("id", { ascending: true }),
        supabase.from("links").select("id, url, title, description, thumbanil_url, folder_id, user_id, is_public").in("user_id", [userId, MASTER_USER_ID]).order("created_at", { ascending: true }).order("id", { ascending: true }),
      ])
    : [{ data: [] }, { data: [] }];

  const databaseFolders = (foldersData ?? []).map((folder) => ({
    id: String(folder.id),
    name: folder.nam,
    isReadOnly: folder.user_id !== userId,
    isPublic: folder.is_public,
  }));
  const databaseLinks = (linksData ?? []).map((link) => ({
    id: String(link.id),
    title: link.title ?? link.url,
    description: link.description ?? "",
    thumbnail: link.thumbanil_url,
    url: link.url,
    folderId: link.folder_id === null ? "" : String(link.folder_id),
    source: "database" as const,
    isReadOnly: link.user_id !== userId,
    isPublic: link.is_public,
  }));

  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col"><FolderProvider initialUserId={userId} initialDatabaseFolders={databaseFolders} initialDatabaseLinks={databaseLinks}>{children}</FolderProvider></body>
    </html>
  );
}
