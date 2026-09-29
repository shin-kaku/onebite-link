import type { Metadata } from "next";
import { cookies } from "next/headers";
import { FolderProvider } from "@/components/FolderProvider";
import { createClient } from "@/utils/supabase/server";
import "./globals.css";

export const metadata: Metadata = {
  title: "타이포그래피 기초 북마크",
  description: "좋아하는 링크를 한입에 모아보세요.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const supabase = createClient(await cookies());
  const [{ data: foldersData }, { data: linksData }] = await Promise.all([
    supabase.from("folders").select("id, nam").order("created_at", { ascending: true }).order("id", { ascending: true }),
    supabase.from("links").select("id, url, title, description, thumbanil_url, folder_id").order("created_at", { ascending: true }).order("id", { ascending: true }),
  ]);

  const databaseFolders = (foldersData ?? []).map((folder) => ({
    id: String(folder.id),
    name: folder.nam,
  }));
  const databaseLinks = (linksData ?? []).map((link) => ({
    id: String(link.id),
    title: link.title ?? link.url,
    description: link.description ?? "",
    thumbnail: link.thumbanil_url,
    url: link.url,
    folderId: link.folder_id === null ? "" : String(link.folder_id),
    source: "database" as const,
  }));

  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col"><FolderProvider initialDatabaseFolders={databaseFolders} initialDatabaseLinks={databaseLinks}>{children}</FolderProvider></body>
    </html>
  );
}
