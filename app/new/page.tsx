import { AppHeader } from "@/components/AppHeader";
import { NewLinkForm } from "@/components/NewLinkForm";
import { Sidebar } from "@/components/Sidebar";

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
