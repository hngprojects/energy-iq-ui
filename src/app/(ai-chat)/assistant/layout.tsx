import { Sidebar } from "@/components/ai-chat/layout/Sidebar";
import { Header } from "@/components/ai-chat/layout/Header";
import { MobileHeader } from "@/components/ai-chat/layout/MobileHeader";

export default function AssistantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[100dvh] bg-gray-50 overflow-hidden">
      {/* Desktop sidebar — hidden on mobile */}
      <Sidebar />

      <div className="flex flex-col flex-1 lg:ml-[220px] min-w-0 overflow-hidden">
        {/* Desktop top header */}
        <div className="hidden lg:block">
          <Header />
        </div>

        {/* Mobile top bar */}
        <MobileHeader />

        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
