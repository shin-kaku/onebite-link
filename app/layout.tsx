import type { Metadata } from "next";
import { cookies } from "next/headers";
import { FolderProvider } from "@/components/FolderProvider";
import { MASTER_USER_ID } from "@/utils/supabase/access";
import { createClient } from "@/utils/supabase/server";
import { getCurrentUserProfile, type AppRole } from "@/utils/supabase/user";
import { getMetadataBase, SITE_DESCRIPTION, SITE_NAME, SOCIAL_IMAGE } from "@/utils/metadata";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    locale: "ko_KR",
    type: "website",
    images: [SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [SOCIAL_IMAGE.url],
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id ?? null;
  const currentUser = getCurrentUserProfile(user);
  const [{ data: foldersData }, { data: linksData }, { data: roleData }] = userId
    ? await Promise.all([
        supabase.from("folders").select("id, nam, user_id, is_public").in("user_id", [userId, MASTER_USER_ID]).order("created_at", { ascending: true }).order("id", { ascending: true }),
        supabase.from("links").select("id, url, title, description, thumbanil_url, folder_id, user_id, is_public").in("user_id", [userId, MASTER_USER_ID]).order("created_at", { ascending: true }).order("id", { ascending: true }),
        supabase.from("user_roles").select("role").eq("user_id", userId).maybeSingle(),
      ])
    : [{ data: [] }, { data: [] }, { data: null }];
  const currentRole: AppRole = roleData?.role ?? (userId === MASTER_USER_ID ? "master" : "student");

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
      <body className="min-h-full flex flex-col"><FolderProvider initialUserId={userId} initialCurrentUser={currentUser} initialRole={currentRole} initialDatabaseFolders={databaseFolders} initialDatabaseLinks={databaseLinks}>{children}</FolderProvider></body>
    </html>
  );
}
