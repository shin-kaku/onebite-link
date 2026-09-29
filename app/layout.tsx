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
  const { data } = await supabase
    .from("folders")
    .select("id, nam")
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });

  const databaseFolders = (data ?? []).map((folder) => ({
    id: String(folder.id),
    name: folder.nam,
  }));

  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col"><FolderProvider initialDatabaseFolders={databaseFolders}>{children}</FolderProvider></body>
    </html>
  );
}
