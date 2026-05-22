"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PiggyBank,
  Users,
  Wallet,
  CreditCard,
  FileText,
  BarChart3,
  Settings,
} from "lucide-react";

const NAV = [
  { href: "/",          label: "Dashboard",   icon: PiggyBank },
  { href: "/anggota",   label: "Data Anggota", icon: Users     },
  { href: "/simpanan",  label: "Simpanan",     icon: Wallet    },
  { href: "/pinjaman",  label: "Pinjaman",     icon: CreditCard },
  { href: "/laporan",   label: "Laporan",      icon: FileText  },
  { href: "/statistik", label: "Statistik",    icon: BarChart3 },
  { href: "/pengaturan",label: "Pengaturan",   icon: Settings  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[220px] bg-[#1E3A5F] flex flex-col z-30 shrink-0">
      {/* ── Brand header ─────────────────────────────────────── */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#60A5FA]
                          flex items-center justify-center shadow-md">
            <PiggyBank className="h-4.5 w-4.5 text-white" strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-white leading-tight truncate">
              KSP Mulia Dana
            </p>
            <p className="text-[10px] text-[#93C5FD] leading-tight truncate">
              Sejahtera
            </p>
          </div>
        </div>
      </div>

      {/* ── Navigation ───────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-4 space-y-0.5">
        {NAV.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href + "/"));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium
                transition-colors duration-150
                ${
                  active
                    ? "bg-white/15 text-white"
                    : "text-[#CBD5E1] hover:bg-white/8 hover:text-white"
                }
              `}
            >
              <item.icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ── Footer ───────────────────────────────────────────── */}
      <div className="px-5 py-3 border-t border-white/10">
        <p className="text-[10px] text-[#64748B] text-center leading-tight">
          &copy; 2026 KSP Mulia Dana Sejahtera
        </p>
      </div>
    </aside>
  );
}
