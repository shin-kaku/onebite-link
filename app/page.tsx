import { AppHeader } from "@/components/AppHeader";
import { BookmarkGrid } from "@/components/BookmarkGrid";
import { Sidebar } from "@/components/Sidebar";

export default function Home() {
  return (
    <div className="app-shell">
      <AppHeader />
      <div className="app-body">
        <Sidebar />
        <main className="main-content">
          <div className="page-heading">
            <div><p className="eyebrow">MY COLLECTION</p><h1>모든 링크</h1></div>
            <span className="link-count">8개의 링크</span>
          </div>
          <BookmarkGrid />
        </main>
      </div>
    </div>
  );
}
