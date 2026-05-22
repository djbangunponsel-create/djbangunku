"use client";

import Sidebar from "./Sidebar";

export default function AppLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      <Sidebar />
      {/* ── Content area (offset by sidebar width) ───────────── */}
      <div className="flex-1 ml-[220px]">
        {/* ── Thin page title bar ────────────────────────────── */}
        {title && (
          <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b">
            <div className="max-w-7xl mx-auto px-6 py-3">
              <h1 className="text-base font-bold text-[#1E3A5F]">{title}</h1>
            </div>
          </header>
        )}
        <main className="max-w-7xl mx-auto px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
