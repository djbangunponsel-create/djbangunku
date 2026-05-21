"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users, Wallet, FileText, BarChart3,
  CreditCard, PiggyBank, TrendingUp,
  UserPlus, FileSpreadsheet, ArrowRight,
  Settings,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ── Colour palette ──────────────────────────────────────────────
const C = {
  navy:    "#1E3A5F",
  blue:    "#2563EB",
  sky:     "#3B82F6",
  green:   "#16A34A",
  emerald: "#059669",
  orange:  "#EA580C",
  red:     "#DC2626",
  slate:   "#F1F5F9",
  muted:   "#64748B",
};

// ── Horizontal icon-menu items ─────────────────────────────────
const navItems = [
  { icon: Users,      label: "Anggota",      href: "/anggota",          color: "text-blue-600",   bg: "bg-blue-50"     },
  { icon: PiggyBank,  label: "Simpanan",     href: "/simpanan",         color: "text-emerald-600",bg: "bg-emerald-50"  },
  { icon: CreditCard, label: "Pinjaman",     href: "/pinjaman",         color: "text-orange-600", bg: "bg-orange-50"   },
  { icon: FileText,   label: "Laporan",      href: "/laporan",          color: "text-purple-600", bg: "bg-purple-50"   },
  { icon: BarChart3,  label: "Statistik",    href: "/statistik",        color: "text-indigo-600", bg: "bg-indigo-50"   },
  { icon: FileSpreadsheet, label: "Summary", href: "/anggota/summary",  color: "text-teal-600",  bg: "bg-teal-50"     },
  { icon: Settings,   label: "Pengaturan",   href: "/pengaturan",       color: "text-gray-600",  bg: "bg-gray-100"    },
];

// ── 6-month labels + matching YYYY-MM keys ─────────────────────
// Labels run "ago → now" (e.g. "Jan · Feb · Mar · Apr · Mei · Jun")
// so index 0 = 5 months ago, index 5 = current month.
const _now0 = new Date();
const lbls       = Array.from({ length: 6 }, (_, i) => {
  const d = new Date(_now0.getFullYear(), _now0.getMonth() - 5 + i, 1);
  return d.toLocaleDateString("id-ID", { month: "short" });
});
const yyyyMmKeys = Array.from({ length: 6 }, (_, i) => {
  const d = new Date(_now0.getFullYear(), _now0.getMonth() - 5 + i, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
});

// ── localStorage reader ────────────────────────────────────────
function readStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}

// ── Parse YYYY-MM-DD  (tolerates "tidak ada data" or empty) ───
function parseMonthISO(iso: unknown): string | null {
  if (!iso || typeof iso !== "string") return null;
  const m = iso.match(/^(\d{4})-(\d{2})/);
  return m ? `${m[1]}-${m[2]}` : null;
}

  // ── Aggregate raw transactions into 6-month bucket totals ──────
  // Supports tanggal (pinjaman) and tanggalSetor (simpanan) field names.
  function aggregateMonthly(
    rows: Record<string, unknown>[],
    bucketKeys: string[],
    amountField: string = "jumlah",
    dateField?: string,
  ): number[] {
    const df = dateField ?? "tanggal";
    const safeRows = Array.isArray(rows) ? rows : [];
    const buckets = new Array(bucketKeys.length).fill(0);
    for (const row of safeRows) {
      const mk = parseMonthISO(row[df] as string);
      if (!mk) continue;
      const idx = bucketKeys.indexOf(mk);
      if (idx < 0) continue;
      const val = Number(row[amountField]) || 0;
      buckets[idx] += val;
    }
    return buckets;
  }

// ── Simple SVG Bar Chart ───────────────────────────────────────
function BarChart({
  savings, loans, labels,
}: {
  savings: number[];
  loans:   number[];
  labels:  string[];
}) {
  const maxVal = Math.max(...savings, ...loans, 1);
  const W = 580, H = 200, padL = 36, padR = 12, padT = 12, padB = 28;
  const cw = W - padL - padR;
  const ch = H - padT - padB;
  const n = labels.length;
  const grpW = cw / n;
  const barW = Math.min((grpW - 12) / 2, 26);
  const gap  = Math.max((grpW - barW * 2) / 3, 3);

  const yTicks = Array.from({ length: 5 }, (_, i) => {
    const v = Math.round((maxVal / 4) * i);
    return { v, y: padT + ch - (v / maxVal) * ch };
  });

  // Pre-compute for no-Y dance (avoid inline arrow fn in JSX)
  const fmt = (v: number) => v.toLocaleString("id-ID");

  // Continue building the SVG inside the simple, deterministic flow. But
  // for clean code, keep it as a stateless render function which is fine —
  // JSX callbacks are pure here. Rather than risk lint issues we could also
  // lift `fmt` out, but it's a simple string formatter so it's safe.

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      <style>{`@media (max-width: 640px) { text { font-size: 8px; } }`}</style>

      {/* ── Grid lines + Y labels ── */}
      {yTicks.map(({ v, y }, index) => (
        <g key={`yt-${v}-${index}`}>
          <line
            x1={padL} x2={W - padR} y1={y} y2={y}
            stroke="#E2E8F0" strokeWidth={1} strokeDasharray="4 3"
          />
          <text
            x={padL - 4} y={y + 4}
            textAnchor="end" fontSize={10}
            fill="#94A3B8"
          >{fmt(v)}</text>
        </g>
      ))}

      {/* ── Bars ── */}
      {labels.map((lbl, i) => {
        const xL = padL + gap + i * grpW;
        const pctS = savings[i] / maxVal;
        const pctL = loans[i]   / maxVal;
        const sH = pctS * ch;
        const lH = pctL * ch;

        return (
          <g key={i}>
            <rect
              x={xL} width={barW}
              y={padT + ch - sH} height={Math.max(sH, 3)}
              rx={3} ry={3}
              fill="url(#gGreen)"
            />
            <rect
              x={xL + barW + gap} width={barW}
              y={padT + ch - lH} height={Math.max(lH, 3)}
              rx={3} ry={3}
              fill="url(#gOrange)"
            />
            <text
              x={xL + barW + gap / 2} y={H - 2}
              textAnchor="middle" fontSize={10}
              fill="#64748B"
            >{lbl}</text>
          </g>
        );
      })}

      {/* ── Gradients ── */}
      <defs>
        <linearGradient id="gGreen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#16A34A" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#16A34A" stopOpacity={0.5} />
        </linearGradient>
        <linearGradient id="gOrange" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EA580C" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#EA580C" stopOpacity={0.5} />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── Gradient stat-value card ───────────────────────────────────
function StatCard({
  label, value, valuePre, sub,
  gradient, icon: Icon,
}: {
  label: string;
  value: string | number;
  valuePre?: string;
  sub: string;
  gradient: string;
  icon: any;
}) {
  return (
    <Card className={`${gradient} overflow-hidden border-0 shadow-md hover:shadow-xl transition-shadow duration-200`}>
      <CardContent className="py-5 px-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/70">{label}</p>
            <div className="mt-2 flex items-baseline gap-1">
              {valuePre && <span className="text-sm font-bold text-white/90">{valuePre}</span>}
              <span className="text-3xl font-black text-white leading-none">
                {typeof value === "number"
                  ? value.toLocaleString("id-ID")
                  : value}
              </span>
            </div>
            <p className="mt-1 text-xs text-white/60">{sub}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-white/15 backdrop-blur-sm">
            <Icon className="h-5 w-5 text-white" strokeWidth={2} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Empty placeholder for Aktivitas area ───────────────────────
const EmptyPulse = () => (
  <div className="flex items-center justify-center gap-1 py-3">
    {[0, 1, 2].map((i) => (
      <div
        key={i} className="w-1.5 rounded-full bg-gray-200 animate-pulse"
        style={{ height: `${12 + i * 6}px`, animationDelay: `${i * 0.18}s` }}
      />
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════════════
export default function Home() {
  // ── Format helper ────────────────────────────────────────────────
  const fmt = (n: number) =>
    n.toLocaleString("id-ID", { minimumFractionDigits: 0 });

  // ── LocalStorage: Anggota ───────────────────────────────────────
  const anggotaRows = readStored<Record<string, unknown>[]>(
    "ksp_anggota_data", [],
  );
  const totalAnggota = Array.isArray(anggotaRows) ? anggotaRows.length : 0;

  // ── LocalStorage: Simpanan ───────────────────────────────────────
  // Storage key is ksp_simpan_data (single source, used by SimpananClientContent)
  const simpananRows = readStored<Record<string, unknown>[]>(
    "ksp_simpan_data", [],
  );

  const monthlySimpanan = aggregateMonthly(simpananRows, yyyyMmKeys, "jumlah", "tanggalSetor");

  // ── LocalStorage: Pinjaman ──────────────────────────────────────
  const pinjamanRows = readStored<Record<string, unknown>[]>(
    "ksp_pinjam_data", [],
  );

  const monthlyPinjaman = aggregateMonthly(pinjamanRows, yyyyMmKeys);

  // ── Totals ────────────────────────────────────────────────────
  const totalSimpanan = monthlySimpanan.reduce((a, b) => a + b, 0);
  const totalPinjaman  = monthlyPinjaman.reduce((a, b) => a + b, 0);

  // ════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* ── Sticky Brand Bar ───────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1E3A5F]
                            flex items-center justify-center shadow-sm">
              <PiggyBank className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-[#1E3A5F] leading-tight">
                KSP Mulia Dana Sejahtera
              </h1>
              <p className="text-[10px] text-[#64748B]">Dashboard Admin</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-1 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-[#2563EB]/10 text-[#2563EB] font-medium">
              Dashboard
            </span>
            <Link href="/anggota"   className="px-2.5 py-1 rounded-lg hover:bg-gray-100 text-[#64748B] transition-colors">
              Data Anggota
            </Link>
            <Link href="/simpanan"  className="px-2.5 py-1 rounded-lg hover:bg-gray-100 text-[#64748B] transition-colors">
              Simpanan
            </Link>
            <Link href="/pinjaman"  className="px-2.5 py-1 rounded-lg hover:bg-gray-100 text-[#64748B] transition-colors">
              Pinjaman
            </Link>
            <Link href="/laporan"   className="px-2.5 py-1 rounded-lg hover:bg-gray-100 text-[#64748B] transition-colors">
              Laporan
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">

        {/* ============================================================
            1. SUMMARY STAT CARDS
            ============================================================ */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
<StatCard
             label="Total Simpanan"
             value={fmt(totalSimpanan)}
             valuePre="Rp "
             sub={`${Array.isArray(simpananRows) ? simpananRows.length : 0} transaksi`}
             gradient="bg-gradient-to-br from-[#065F46] via-[#059669] to-[#34D399]"
             icon={Wallet}
           />
           <StatCard
             label="Total Pinjaman"
             value={fmt(totalPinjaman)}
             valuePre="Rp "
             sub={`${Array.isArray(pinjamanRows) ? pinjamanRows.length : 0} pinjaman`}
             gradient="bg-gradient-to-br from-[#9A3412] via-[#EA580C] to-[#FB923C]"
             icon={CreditCard}
           />
          <StatCard
            label="Total Anggota"
            value={totalAnggota.toLocaleString("id-ID")}
            sub="Anggota terdaftar"
            gradient="bg-gradient-to-br from-[#1E3A5F] via-[#2563EB] to-[#3B82F6]"
            icon={Users}
          />
        </section>

        {/* ============================================================
            2. COMPACT HORIZONTAL ICON MENU
            ============================================================ */}
        <nav className="mb-6">
          <div className="bg-white rounded-2xl border border-gray-200/80 p-2.5 flex items-center gap-1.5 overflow-x-auto shadow-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl
                           hover:bg-gray-50 transition-all duration-150 group min-w-[72px]"
              >
                <div className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center
                                 group-hover:scale-110 transition-transform duration-150`}>
                  <item.icon className={`h-4.5 w-4.5 ${item.color}`} strokeWidth={2} />
                </div>
                <span className="text-[11px] font-medium text-gray-600 group-hover:text-gray-900 text-center leading-tight whitespace-nowrap">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </nav>

        {/* ============================================================
            3. CHART  +  LATEST ACTIVITY
            ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">

          {/* ── Bar Chart panel ─────────────────────────────────── */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-gray-900">Tren Simpanan vs Pinjaman</h2>
<p className="text-xs text-gray-500">
                   {Array.isArray(simpananRows) && simpananRows.length === 0 && Array.isArray(pinjamanRows) && pinjamanRows.length === 0
                     ? "Belum ada data transaksi — grafik akan terisi otomatis setelah transaksi diinput"
                     : `${Array.isArray(simpananRows) ? simpananRows.length : 0} transaksi simpanan · ${Array.isArray(pinjamanRows) ? pinjamanRows.length : 0} pinjaman`}
                 </p>
              </div>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="flex items-center gap-1 text-emerald-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  Simpanan
                </span>
                <span className="flex items-center gap-1 text-orange-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />
                  Pinjaman
                </span>
              </div>
            </div>

            {/* When no data yet, show an elegant "all-zero" flat chart */}
            {(Array.isArray(simpananRows) ? simpananRows.length : 0) === 0 && (Array.isArray(pinjamanRows) ? pinjamanRows.length : 0) === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
              <BarChart
                savings={monthlySimpanan}
                loans={monthlyPinjaman}
                labels={lbls}
              />
                <p className="mt-2 text-xs text-gray-400">
                  Grafik menampilkan Rp 0 sampai data transaksi dimasukkan.
                </p>
              </div>
            ) : (
              <BarChart
                savings={monthlySimpanan}
                loans={monthlyPinjaman}
                labels={lbls}
              />
            )}
          </div>

          {/* ── Latest Activity panel ───────────────────────────── */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-900">Aktivitas Terbaru</h2>
              <Link href="/simpanan" className="text-[11px] font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5">
                Lihat semua <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {(Array.isArray(simpananRows) ? simpananRows.length : 0) === 0 ? (
              <div className="flex flex-col items-center py-8 text-gray-400">
                <EmptyPulse />
                <p className="text-xs mt-2">Belum ada transaksi simpanan</p>
                <p className="text-[10px] text-gray-300 mt-1">
                  Data akan muncul di sini setelah transaksi diinput
                </p>
              </div>
) : (
               <ul className="space-y-3">
                 {[...(Array.isArray(simpananRows) ? simpananRows : [])]
                   .sort((a: Record<string, unknown>, b: Record<string, unknown>) =>
                     String(b.tanggal ?? "").localeCompare(String(a.tanggal ?? ""))
                   )
                   .slice(0, 5)
                   .map((row: Record<string, unknown>, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-0.5 p-1.5 rounded-lg text-emerald-600 bg-emerald-50">
                        <Wallet className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">
                          Simpanan {(row.tipe as string) || "Umum"}
                        </p>
                        <p className="text-[11px] text-gray-500 truncate">
                          {(row.anggota as string) || "Tanpa Nama"} · No. {String(row.id ?? "-")}
                        </p>
                        <div className="flex items-center justify-between mt-0.5">
                          <p className="text-[11px] font-semibold text-emerald-600">
                            Rp {fmt(Number(row.jumlah) || 0)}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {String(row.tanggal ?? "-")}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>

        {/* ============================================================
            4. MONTHLY SUMMARY STRIP
            ============================================================ */}
        <section>
          <h2 className="text-sm font-bold text-gray-900 mb-3">
            Ringkasan Bulanan — {lbls[0]} s/d {lbls[lbls.length - 1]}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {lbls.map((lbl, i) => (
              <Card key={i} className="border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="py-3 px-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-[#2563EB]">
                    {lbl}
                  </p>
                  <div className="mt-2 space-y-2">
                    {/* Simpanan this month */}
                    <div>
                      <p className="text-[10px] text-gray-500">Simpanan</p>
                      <p className="text-xs font-semibold text-emerald-600">
                        Rp {fmt(monthlySimpanan[i])}
                      </p>
<p className="text-[9px] text-gray-400">
                        {(Array.isArray(simpananRows) ? simpananRows : []).filter((r: Record<string, unknown>) =>
                          parseMonthISO(r.tanggalSetor as string) === yyyyMmKeys[i]
                        ).length} transaksi
                      </p>
                    </div>
                    {/* Pinjaman this month */}
                    <div className="border-t border-gray-100 pt-1.5">
                      <p className="text-[10px] text-gray-500">Pinjaman</p>
                      <p className="text-xs font-semibold text-orange-600">
                        Rp {fmt(monthlyPinjaman[i])}
                      </p>
<p className="text-[9px] text-gray-400">
                        {(Array.isArray(pinjamanRows) ? pinjamanRows : []).filter((r: Record<string, unknown>) =>
                          parseMonthISO(r.tanggal as string) === yyyyMmKeys[i]
                        ).length} pinjaman
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Zero-state hint at bottom of monthly strip */}
          {(Array.isArray(simpananRows) ? simpananRows.length : 0) === 0 && (Array.isArray(pinjamanRows) ? pinjamanRows.length : 0) === 0 && (
            <p className="mt-3 text-center text-[10px] text-gray-400">
              Semua nilai di atas menampilkan Rp 0.
              Data akan terisi otomatis setelah Anda menambahkan transaksi simpanan dan pinjaman.
            </p>
          )}
        </section>

      </main>

      <footer className="mt-8 border-t bg-white/60 py-4">
        <p className="text-center text-[11px] text-gray-400">
          &copy; 2026 KSP Mulia Dana Sejahtera &mdash;
           Data transaksi: localStorage (<code>ksp_simpan_data</code> / <code>ksp_pinjam_data</code>)
        </p>
      </footer>
    </div>
  );
}
