'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ── localStorage helpers ──────────────────────────────────────────
function readStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch  { return fallback; }
}

function parseNumber(v: unknown): number {
  if (typeof v === 'number') return v;
  const s = String(v ?? '')
    .replace(/Rp\s?/gi, '')
    .replace(/\./g, '')
    .replace(/,/g, '')
    .replace(/\s+/g, '')
    .trim();
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

// ── Date helpers ──────────────────────────────────────────────────
const EXCEL_EPOCH_OFFSET = 25569;

function isExcelSerial(v: unknown): v is number {
  return typeof v === 'number' && v > 40000 && v < 60000;
}

function convertExcelDate(v: unknown): string {
  if (isExcelSerial(v)) {
    const ms = Math.round((v - EXCEL_EPOCH_OFFSET) * 86400_000);
    const d = new Date(ms);
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  }
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  const s = String(v ?? '');
  const isoMatch = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
  return s;
}

function toYMD(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// ── Format helpers ────────────────────────────────────────────────
function fmtRupiah(n: number): string {
  return n.toLocaleString('id-ID');
}

// ── Sub-components (separate components — no inline JSX expression mixing) ────

function SectionRow({ label, value, indent = 'pl-4', highlight = false, total = false, sub }: {
  label: string; value: number; indent?: string; highlight?: boolean; total?: boolean; sub?: boolean;
}) {
  return (
    <tr className={highlight ? (total ? 'bg-blue-50' : 'bg-gray-50') : ''}>
      <td className={`px-6 py-3 whitespace-nowrap text-sm ${indent} ${total ? 'font-bold text-lg' : sub ? 'font-medium' : 'text-gray-700'}`}>
        {label}
      </td>
      <td className="px-6 py-3 whitespace-nowrap text-sm text-right font-medium">
        {fmtRupiah(value)}
      </td>
    </tr>
  );
}

// ── Main page ────────────────────────────────────────────────────
export default function NeracaPage() {
  const [reportDate, setReportDate] = useState<string>('2025-12-31');
  const [simpananData, setSimpananData] = useState<Record<string, unknown>[]>(() => {
    return readStored<Record<string, unknown>[]>('ksp_simpanan_data', []);
  });
  const [periode, setPeriode] = useState<string>('all');

  // Refresh when the storage event fires (other tabs updated)
  useEffect(() => {
    const handler = () => {
      const saved = readStored<Record<string, unknown>[]>('ksp_simpanan_data', []);
      setSimpananData(saved);
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  // ── Build periode options from simpanan data ──────────────────
  const periodeOptions = useMemo(() => {
    const years = new Set<number>();
    for (const r of simpananData) {
      const d = convertExcelDate(r.tanggalSetor ?? r.tanggal ?? '');
      const y = Number(d.slice(0, 4));
      if (!isNaN(y)) years.add(y);
    }
    return Array.from(years).sort((a, b) => b - a);
  }, [simpananData]);

  // ── Derived: period start/end boundaries ───────────────────────
  const { periodStart, periodEnd, periodLabel } = useMemo(() => {
    if (periode === 'all') {
      return { periodStart: '', periodEnd: reportDate, periodLabel: `s/d ${reportDate}` };
    }
    const [yearStr, monthStr] = periode.split('-');
    const year = Number(yearStr);
    const month = Number(monthStr); // 1-based
    const start = `${yearStr}-${monthStr}-01`;
    // Last day of month
    const lastDay = new Date(year, month, 0).getDate();
    const end = `${yearStr}-${monthStr}-${String(lastDay).padStart(2, '0')}`;
    return { periodStart: start, periodEnd: end, periodLabel: `${start} s/d ${end}` };
  }, [periode, reportDate]);

  // ── Derived: cumulative filtered simpanan ─────────────────────
  const filteredSimpanan = useMemo(() => {
    if (periode === 'all') return simpananData;
    return simpananData.filter((r) => {
      const d = convertExcelDate(r.tanggalSetor ?? r.tanggal ?? '');
      return d !== '' && d <= periodEnd;
    });
  }, [simpananData, periode, periodEnd]);

  // ── Derived: cumulative sums through reportDate ───────────────
  const totalPokok    = useMemo(() => filteredSimpanan
    .filter((s) => String(s.tipe ?? '') === 'Pokok')
    .reduce((a, b) => a + parseNumber(b.jumlah), 0), [filteredSimpanan]);
  const totalWajib    = useMemo(() => filteredSimpanan
    .filter((s) => String(s.tipe ?? '') === 'Wajib')
    .reduce((a, b) => a + parseNumber(b.jumlah), 0), [filteredSimpanan]);
  const totalSukarela = useMemo(() => filteredSimpanan
    .filter((s) => String(s.tipe ?? '') === 'Sukarela')
    .reduce((a, b) => a + parseNumber(b.jumlah), 0), [filteredSimpanan]);
  const totalSemua    = totalPokok + totalWajib + totalSukarela;

  // Pinjaman (for Piutang Pinjaman Anggota — currently 0 because data type is different)
  const pinjamanData  = readStored<Record<string, unknown>[]>('ksp_pinjam_data', []);
  const totalPinjaman = useMemo(() => pinjamanData
    .filter((p) => String((p as any).tanggal ?? '') !== '' &&
                   convertExcelDate((p as any).tanggal ?? '') !== '' &&
                   convertExcelDate((p as any).tanggal ?? '') <= reportDate)
    .reduce((a, b) => a + parseNumber((b as any).jumlah), 0), [pinjamanData, reportDate]);

  // ── AKTIVA ─────────────────────────────────────────────────────
  const kas           = totalSemua;
  const aktivaLancar  = kas + totalPinjaman; // Kas + Piutang Pinjaman
  const totalAktiva   = aktivaLancar;

  // ── PASIVA ─────────────────────────────────────────────────────
  const simpananPokok   = totalPokok;   // Simpanan Pokok / Modal Tetap
  const simpananWajib   = totalWajib;   // Simpanan Wajib / Modal Tambahan
  const ekuitas         = simpananPokok + simpananWajib + totalSukarela;
  const totalPasiva     = ekuitas;

  // ── Balance ────────────────────────────────────────────────────
  const isBalanced = Math.abs(totalAktiva - totalPasiva) < 1;

  // ── Handlers ───────────────────────────────────────────────────
  const handlePeriodeChange = useCallback((val: string) => {
    setPeriode(val);
  }, []);

  const onReportDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setReportDate(e.target.value);
  }, []);

  // ── Build period options for select ────────────────────────────
  const periodeOptionsList = useMemo(() => {
    const list: { key: string; label: string }[] = [
      { key: 'all', label: 'Semua Transaksi (Kumulatif)' },
    ];
    for (const y of periodeOptions) {
      // Monthly options for each year found in data
      for (let m = 12; m >= 1; m--) {
        const ym = `${y}-${String(m).padStart(2, '0')}`;
        const [, mo] = ym.split('-');
        const monthNames = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
        list.push({ key: ym, label: `${monthNames[Number(mo) - 1]} ${y}` });
      }
    }
    return list;
  }, [periodeOptions]);

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Neraca</h1>
              <p className="text-sm text-gray-600">Laporan Posisi Keuangan KSP Mulia Dana Sejahtera</p>
            </div>
            <Link href="/laporan">
              <Button variant="ghost">
                <FileText className="mr-2 h-4 w-4" />
                Kembali ke Laporan
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle>Laporan Posisi Keuangan (Neraca)</CardTitle>
                <CardDescription>KSP Mulia Dana Sejahtera — Periode: {periodLabel}</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <input
                    type="date"
                    value={reportDate}
                    onChange={onReportDateChange}
                    className="border rounded-md px-2 py-1 text-sm"
                  />
                </div>
                <select
                  value={periode}
                  onChange={(e) => handlePeriodeChange(e.target.value)}
                  className="border rounded-md px-3 py-1.5 text-sm"
                >
                  {periodeOptionsList.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pos
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nominal (Rp)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {/* ── AKTIVA ── */}
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">AKTIVA</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8 text-gray-600">Aktiva Lancar</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm"></td>
                    </tr>
                    <SectionRow label="Kas"             value={kas}           indent="pl-10" sub />
                    <SectionRow label="Piutang Pinjaman Anggota"  value={totalPinjaman} indent="pl-10" sub />
                    <SectionRow label="Piutang Bunga"    value={0}             indent="pl-10" sub />
                    <SectionRow label="Persediaan"       value={0}             indent="pl-10" sub />
                    <SectionRow label="Jumlah Aktiva Lancar"  value={aktivaLancar} indent="pl-8" total />

                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8 text-gray-600">Aktiva Tidak Lancar</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm"></td>
                    </tr>
                    <SectionRow label="Investasi Jangka Panjang" value={0} indent="pl-10" sub />
                    <SectionRow label="Aset Tetap (netto)"       value={0} indent="pl-10" sub />
                    <SectionRow label="Jumlah Aktiva Tidak Lancar" value={0} indent="pl-8" total />

                    {/* ── JUMLAH AKTIVA ── */}
                    <tr className="bg-blue-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-lg">JUMLAH AKTIVA</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-lg">
                        {fmtRupiah(totalAktiva)}
                      </td>
                    </tr>

                    {/* ── KEWAJIBAN DAN EKUITAS ── */}
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        KEWAJIBAN DAN EKUITAS
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8 text-gray-600">Kewajiban Jangka Pendek</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm"></td>
                    </tr>
                    <SectionRow label="Utang Jangka Pendek" value={0} indent="pl-10" sub />
                    <SectionRow label="Utang Bunga"         value={0} indent="pl-10" sub />
                    <SectionRow label="Cadangan Korto"      value={0} indent="pl-10" sub />
                    <SectionRow label="Jumlah Kewajiban Jangka Pendek" value={0} indent="pl-8" total />

                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8 text-gray-600">Kewajiban Jangka Panjang</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm"></td>
                    </tr>
                    <SectionRow label="Utang Jangka Panjang" value={0} indent="pl-10" sub />
                    <SectionRow label="Imbalan Kerja"        value={0} indent="pl-10" sub />
                    <SectionRow label="Jumlah Kewajiban Jangka Panjang" value={0} indent="pl-8" total />

                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8 text-gray-600">Ekuitas</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm"></td>
                    </tr>
                    <SectionRow label="Simpanan Pokok/Modal Tetap"     value={simpananPokok} indent="pl-10" sub />
                    <SectionRow label="Simpanan Wajib/Modal Tambahan"  value={simpananWajib} indent="pl-10" sub />
                    <SectionRow label="Simpanan Sukarela"              value={totalSukarela} indent="pl-10" sub />
                    <SectionRow label="Cadangan Umum"                  value={0} indent="pl-10" sub />
                    <SectionRow label="Cadangan Bakan"                 value={0} indent="pl-10" sub />
                    <SectionRow label="Hibah"                          value={0} indent="pl-10" sub />
                    <SectionRow label="Jumlah Ekuitas"                 value={ekuitas} indent="pl-8" total />

                    {/* ── JUMLAH KEWAJIBAN DAN EKUITAS ── */}
                    <tr className="bg-blue-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-lg">
                        JUMLAH KEWAJIBAN DAN EKUITAS
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-lg">
                        {fmtRupiah(totalPasiva)}
                      </td>
                    </tr>

                    {/* ── Balance check row ── */}
                    <tr>
                      <td colSpan={2} className="px-6 py-3">
                        <div className={`text-xs font-medium ${isBalanced ? 'text-green-700' : 'text-amber-700'}`}>
                          {isBalanced
                            ? `✓ Neraca SEIMBANG — AKTIVA (${fmtRupiah(totalAktiva)}) = PASIVA (${fmtRupiah(totalPasiva)})`
                            : `⚠ Selisih ${fmtRupiah(Math.abs(totalAktiva - totalPasiva))} — AKTIVA: ${fmtRupiah(totalAktiva)}, PASIVA: ${fmtRupiah(totalPasiva)}`}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-xs text-gray-500 space-y-1">
                <p><strong>Sumber data:</strong> <code>ksp_simpanan_data</code> (localStorage) — kumulatif sampai {periodLabel}. Belum ada data pinjaman aktif untuk pos Piutang.</p>
                <p><strong>Catatan:</strong> Laporan posisi keuangan menunjukkan kondisi keuangan KSP pada tanggal yang dipilih, sesuai standar akuntansi koperasi. Semua pos Anggota (Pokok/Wajib/Sukarela) dari tabel Simpanan masuk ke Ekuitas.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
