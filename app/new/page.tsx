import { AppHeader } from "@/components/AppHeader";
import { NewLinkForm } from "@/components/NewLinkForm";
import { Sidebar } from "@/components/Sidebar";

export default function NewLinkPage() {
  return (
    <div className="app-shell">
      <AppHeader />
      <div className="app-body">
        <Sidebar active={false} />
        <main className="main-content new-link-content">
          <NewLinkForm />
        </main>
      </div>
    </div>
  );
}
