import type { ReactNode } from "react";
import WatchList from "../sidebar/WatchList";
import HistoryPlans from "../sidebar/HistoryPlans";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex justify-center p-6 text-slate-900 font-sans">
      <div className="w-full max-w-[1440px] flex gap-6">
        <aside className="w-[320px] flex-shrink-0 flex flex-col gap-6">
          <WatchList />
          <HistoryPlans />
        </aside>
        <main className="flex-1 flex flex-col bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
