import type { Metadata } from "next";
import { AppHeader } from "@/components/AppHeader";
import { NewLinkForm } from "@/components/NewLinkForm";
import { Sidebar } from "@/components/Sidebar";
import { createPageMetadata } from "@/utils/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "새 링크 추가",
  description: "새로운 링크를 북마크 컬렉션에 저장하세요.",
  noIndex: true,
});

export default function NewLinkPage() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <div className="md:flex">
        <Sidebar active={false} />
        <main className="w-full px-5 py-10 md:px-10 md:py-14">
          <div className="mx-auto max-w-[720px]"><NewLinkForm /></div>
        </main>
      </div>
    </div>
  );
}
