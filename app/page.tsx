import type { Metadata } from "next";
import { AppHeader } from "@/components/AppHeader";
import { BookmarkGrid } from "@/components/BookmarkGrid";
import { Sidebar } from "@/components/Sidebar";
import { BookmarkCount } from "@/components/BookmarkCount";
import { createPageMetadata } from "@/utils/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "모든 링크",
  description: "저장한 타이포그래피 자료와 즐겨 찾는 링크를 한곳에서 둘러보세요.",
});

export default function Home() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <main className="order-4 w-full px-5 py-10 md:order-none md:px-10 md:py-14">
          <div className="mx-auto max-w-[720px]">
          <div className="mb-7 flex items-end justify-between">
            <div><p className="mb-2 text-xs font-semibold tracking-[0.1em] text-[var(--accent)]">내 컬렉션</p><h1 className="text-[30px] font-bold leading-[1.2] tracking-[-0.04em]">모든 링크</h1></div>
            <span className="text-[14px] text-[var(--text-sub)]"><BookmarkCount /></span>
          </div>
          <BookmarkGrid />
          </div>
        </main>
      </div>
    </div>
  );
}
