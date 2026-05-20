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

// ── Format helpers ────────────────────────────────────────────────
function fmtRupiah(n: number): string {
  return n.toLocaleString('id-ID');
}

// ── Year-end boundary ─────────────────────────────────────────────
const YTD_CUTOFF = '-12-31';

function yearEndDateStr(yearNum: number): string {
  return `${yearNum}${YTD_CUTOFF}`;
}

// ── Sub-components ────────────────────────────────────────────────

function SectionRow3({ label, currYear, prevYear, indent = 'pl-4', highlight = false, total = false, sub }: {
  label: string; currYear: number; prevYear: number; indent?: string;
  highlight?: boolean; total?: boolean; sub?: boolean;
}) {
  return (
    <tr className={highlight ? (total ? 'bg-blue-50' : 'bg-gray-50') : ''}>
      <td className={`px-6 py-3 whitespace-nowrap text-sm ${indent} ${total ? 'font-bold text-lg' : sub ? 'font-medium' : 'text-gray-700'}`}>
        {label}
      </td>
      <td className="px-6 py-3 whitespace-nowrap text-sm text-right font-medium">
        {fmtRupiah(currYear)}
      </td>
      <td className="px-6 py-3 whitespace-nowrap text-sm text-right font-medium">
        {fmtRupiah(prevYear)}
      </td>
    </tr>
  );
}

function SubHeaderRow({ label, indent = 'pl-8' }: { label: string; indent?: string }) {
  return (
    <tr>
      <td className={`px-6 py-3 whitespace-nowrap text-sm ${indent} text-gray-600`} colSpan={3}>
        {label}
      </td>
    </tr>
  );
}

function TotalRow3({ label, currYear, prevYear, indent = 'pl-8', isAktiva = false, highlight = false }: {
  label: string; currYear: number; prevYear: number; indent?: string;
  isAktiva?: boolean; highlight?: boolean;
}) {
  return (
    <tr className={highlight ? (isAktiva ? 'bg-blue-50' : 'bg-gray-50') : ''}>
      <td className={`px-6 py-3 whitespace-nowrap text-sm ${indent} font-medium`}>{label}</td>
      <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
        {fmtRupiah(currYear)}
      </td>
      <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
        {fmtRupiah(prevYear)}
      </td>
    </tr>
  );
}

function GrandTotalRow3({ label, currYear, prevYear }: { label: string; currYear: number; prevYear: number }) {
  return (
    <tr className="bg-blue-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-lg">{label}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-lg">
        {fmtRupiah(currYear)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-lg">
        {fmtRupiah(prevYear)}
      </td>
    </tr>
  );
}

// ── Main page ────────────────────────────────────────────────────
export default function NeracaPage() {
  // Dynamic year labels from system clock — auto-adjust every new year
  const yearConfig = useMemo(() => {
    const now     = new Date();
    const curYear = now.getFullYear();
    const prvYear = curYear - 1;
    return {
      currentYear:  curYear,
      prevYear:     prvYear,
      prevYearEnd:  yearEndDateStr(prvYear),   // "YYYY-12-31" — prior year-end position
      currentYtd:   yearEndDateStr(curYear),  // "YYYY-12-31" — YTD end of current year
    };
  }, []);

  const simpananData = useState<Record<string, unknown>[]>(() => {
    return readStored<Record<string, unknown>[]>('ksp_simpanan_data', []);
  })[0];

  // Refresh on storage event (cross-tab)
  useEffect(() => {
    const handler = () => {
      const saved = readStored<Record<string, unknown>[]>('ksp_simpanan_data', []);
      // We can't update useState from callback; store updates happen via setSimpananData
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const pinjamanData = useMemo(
    () => readStored<Record<string, unknown>[]>('ksp_pinjam_data', []),
    []
  );

  // ── Year-scoped accumulator helpers ─────────────────────────────
  // Returns cumulative Pokok / Wajib / Sukarela / All (inflow) from KSP founding
  // up to and including `yearNumber` (which means all tx where tanggal <= YYYY-12-31).
  function accumulateSimpananYE(simpananRows: Record<string, unknown>[], yearNumber: number) {
    const cutoff = yearEndDateStr(yearNumber);
    let p = 0, w = 0, s = 0;
    for (const r of simpananRows) {
      if (!(r.tanggalSetor ?? r.tanggal)) continue;
      const d = convertExcelDate(r.tanggalSetor ?? r.tanggal);
      if (d === '' || d > cutoff) continue;
      const amt = parseNumber(r.jumlah);
      const tipe = String(r.tipe ?? '');
      if (tipe === 'Pokok')      p += amt;
      else if (tipe === 'Wajib') w += amt;
      else                       s += amt;
    }
    return { pokok: p, wajib: w, sukarela: s, semua: p + w + s };
  }

  // Returns cumulative pinjaman outstanding sum from KSP founding up to yearNumber YTD
  function accumulatePinjamanYE(pinjamanRows: Record<string, unknown>[], yearNumber: number) {
    const cutoff = yearEndDateStr(yearNumber);
    let total = 0;
    for (const r of pinjamanRows) {
      if (!(r as any).tanggal) continue;
      const d = convertExcelDate((r as any).tanggal);
      if (d === '' || d > cutoff) continue;
      total += parseNumber((r as any).jumlah);
    }
    return total;
  }

  // ── Accumulate per year ─────────────────────────────────────────
  // Tahun Ini   — cumulative from KSP founding up to YTD (YYYY-12-31)
  const currY = useMemo(() => accumulateSimpananYE(simpananData, yearConfig.currentYear),   [simpananData, yearConfig.currentYear]);
  // Tahun Sebelumnya — cumulative up to prior year-end (prior to YYYY-01-01)
  const prevY = useMemo(() => accumulateSimpananYE(simpananData, yearConfig.prevYear),        [simpananData, yearConfig.prevYear]);

  // Pinjaman / Piutang
  const currPinjaman = useMemo(() => accumulatePinjamanYE(pinjamanData, yearConfig.currentYear), [pinjamanData, yearConfig.currentYear]);
  const prevPinjaman = useMemo(() => accumulatePinjamanYE(pinjamanData, yearConfig.prevYear),   [pinjamanData, yearConfig.prevYear]);

  // ── AKTIVA row helpers ──────────────────────────────────────────
  function aktivaLancarYE(simp: ReturnType<typeof accumulateSimpananYE>, pinj: number) {
    return simp.semua + pinj; // Kas(Pokok+Wajib+Sukarela) + Piutang Pinjaman Anggota
  }

  // ── PASIVA row helpers ──────────────────────────────────────────
  function ekuitasYE(simp: ReturnType<typeof accumulateSimpananYE>) {
    return simp.pokok + simp.wajib + simp.sukarela;
  }

  // ── Year-scope label for display ────────────────────────────────
  const yLabelCurr = yearConfig.currentYear;
  const yLabelPrev = yearConfig.prevYear;

  // ── Current Year (Tahun Ini) derived values ────────────────────
  const currKas   = currY.semua;
  const currPiutang = currPinjaman;
  const currAktivaLancar = aktivaLancarYE(currY, currPiutang);
  const currAktivaTidakLancar = 0;
  const currTotalAktiva = currAktivaLancar + currAktivaTidakLancar;

  const currSimpananPokok = currY.pokok;
  const currSimpananWajib = currY.wajib;
  const currEkuitas       = ekuitasYE(currY);
  const currSimpananSukarela = currY.sukarela;
  const currTotalPasiva    = currEkuitas;

  // ── Previous Year (Tahun Sebelumnya) derived values ────────────
  const prevKas   = prevY.semua;
  const prevPiutang = prevPinjaman;
  const prevAktivaLancar = aktivaLancarYE(prevY, prevPiutang);
  const prevAktivaTidakLancar = 0;
  const prevTotalAktiva = prevAktivaLancar + prevAktivaTidakLancar;

  const prevSimpananPokok = prevY.pokok;
  const prevSimpananWajib = prevY.wajib;
  const prevEkuitas       = ekuitasYE(prevY);
  const prevSimpananSukarela = prevY.sukarela;
  const prevTotalPasiva    = prevEkuitas;

  // ── Balance summary ─────────────────────────────────────────────
  const isBalancedCurr = Math.abs(currTotalAktiva - currTotalPasiva) < 1;
  const isBalancedPrev = Math.abs(prevTotalAktiva - prevTotalPasiva) < 1;

  // ── Balance label strings (computed before JSX) ─────────────────
  const currBalanceStr = isBalancedCurr
    ? `✓ ${yLabelCurr} SEIMBANG — AKTIVA ${fmtRupiah(currTotalAktiva)} = PASIVA ${fmtRupiah(currTotalPasiva)}`
    : `⚠ ${yLabelCurr} Selisih ${fmtRupiah(Math.abs(currTotalAktiva - currTotalPasiva))} — AKTIVA: ${fmtRupiah(currTotalAktiva)}, PASIVA: ${fmtRupiah(currTotalPasiva)}`;

  const prevBalanceStr = isBalancedPrev
    ? `✓ ${yLabelPrev} SEIMBANG — AKTIVA ${fmtRupiah(prevTotalAktiva)} = PASIVA ${fmtRupiah(prevTotalPasiva)}`
    : `⚠ ${yLabelPrev} Selisih ${fmtRupiah(Math.abs(prevTotalAktiva - prevTotalPasiva))} — AKTIVA: ${fmtRupiah(prevTotalAktiva)}, PASIVA: ${fmtRupiah(prevTotalPasiva)}`;

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
                <CardDescription>
                  KSP Mulia Dana Sejahtera — Perbandingan: {yearConfig.prevYear} | {yearConfig.currentYear}
                </CardDescription>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span className="text-xs">
                  {yearConfig.prevYear} → 31 Des {yearConfig.prevYear} &nbsp;|&nbsp;
                  {yearConfig.currentYear} → 31 Des {yearConfig.currentYear}
                </span>
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
                        KETERANGAN
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-emerald-700 uppercase tracking-wider">
                        {yLabelCurr}
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {yLabelPrev}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">

                    {/* ══════ AKTIVA ══════ */}
                    <tr>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">AKTIVA</td>
                      <td className="whitespace-nowrap text-sm text-gray-900"></td>
                      <td className="whitespace-nowrap text-sm text-gray-900"></td>
                    </tr>

                    <SubHeaderRow label="Aktiva Lancar" indent="pl-8" />

                    <SectionRow3
                      label="Kas"
                      currYear={currKas}
                      prevYear={prevKas}
                      indent="pl-10"
                      sub
                    />
                    <SectionRow3
                      label="Piutang Pinjaman Anggota"
                      currYear={currPiutang}
                      prevYear={prevPiutang}
                      indent="pl-10"
                      sub
                    />
                    <SectionRow3 label="Piutang Bunga" currYear={0} prevYear={0} indent="pl-10" sub />
                    <SectionRow3 label="Persediaan"      currYear={0} prevYear={0} indent="pl-10" sub />
                    <TotalRow3
                      label="Jumlah Aktiva Lancar"
                      currYear={currAktivaLancar}
                      prevYear={prevAktivaLancar}
                      highlight
                      isAktiva
                    />

                    <SubHeaderRow label="Aktiva Tidak Lancar" indent="pl-8" />
                    <SectionRow3 label="Investasi Jangka Panjang" currYear={0} prevYear={0} indent="pl-10" sub />
                    <SectionRow3 label="Aset Tetap (netto)"        currYear={0} prevYear={0} indent="pl-10" sub />
                    <TotalRow3
                      label="Jumlah Aktiva Tidak Lancar"
                      currYear={0} prevYear={0}
                      highlight
                      isAktiva
                    />

                    <GrandTotalRow3
                      label="JUMLAH AKTIVA"
                      currYear={currTotalAktiva}
                      prevYear={prevTotalAktiva}
                    />

                    {/* ══════ KEWAJIBAN DAN EKUITAS ══════ */}
                    <tr>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">KEWAJIBAN DAN EKUITAS</td>
                      <td className="whitespace-nowrap text-sm text-gray-900"></td>
                      <td className="whitespace-nowrap text-sm text-gray-900"></td>
                    </tr>

                    <SubHeaderRow label="Kewajiban Jangka Pendek" indent="pl-8" />
                    <SectionRow3 label="Utang Jangka Pendek" currYear={0} prevYear={0} indent="pl-10" sub />
                    <SectionRow3 label="Utang Bunga"         currYear={0} prevYear={0} indent="pl-10" sub />
                    <SectionRow3 label="Cadangan Korto"      currYear={0} prevYear={0} indent="pl-10" sub />
                    <TotalRow3
                      label="Jumlah Kewajiban Jangka Pendek"
                      currYear={0} prevYear={0}
                      highlight
                    />

                    <SubHeaderRow label="Kewajiban Jangka Panjang" indent="pl-8" />
                    <SectionRow3 label="Utang Jangka Panjang" currYear={0} prevYear={0} indent="pl-10" sub />
                    <SectionRow3 label="Imbalan Kerja"        currYear={0} prevYear={0} indent="pl-10" sub />
                    <TotalRow3
                      label="Jumlah Kewajiban Jangka Panjang"
                      currYear={0} prevYear={0}
                      highlight
                    />

                    <SubHeaderRow label="Ekuitas" indent="pl-8" />
                    <SectionRow3
                      label="Simpanan Pokok/Modal Tetap"
                      currYear={currSimpananPokok}
                      prevYear={prevSimpananPokok}
                      indent="pl-10"
                      sub
                    />
                    <SectionRow3
                      label="Simpanan Wajib/Modal Tambahan"
                      currYear={currSimpananWajib}
                      prevYear={prevSimpananWajib}
                      indent="pl-10"
                      sub
                    />
                    <SectionRow3
                      label="Simpanan Sukarela"
                      currYear={currSimpananSukarela}
                      prevYear={prevSimpananSukarela}
                      indent="pl-10"
                      sub
                    />
                    <SectionRow3 label="Cadangan Umum"  currYear={0} prevYear={0} indent="pl-10" sub />
                    <SectionRow3 label="Cadangan Bakan" currYear={0} prevYear={0} indent="pl-10" sub />
                    <SectionRow3 label="Hibah"           currYear={0} prevYear={0} indent="pl-10" sub />
                    <TotalRow3
                      label="Jumlah Ekuitas"
                      currYear={currEkuitas}
                      prevYear={prevEkuitas}
                      highlight
                    />

                    <GrandTotalRow3
                      label="JUMLAH KEWAJIBAN DAN EKUITAS"
                      currYear={currTotalPasiva}
                      prevYear={prevTotalPasiva}
                    />

                    {/* ── Balance check rows ── */}
                    <tr>
                      <td colSpan={3} className="px-6 py-3">
                        <div className="text-xs font-medium text-green-700">{currBalanceStr}</div>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="px-6 py-3">
                        <div className="text-xs font-medium text-green-700">{prevBalanceStr}</div>
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-xs text-gray-500 space-y-1">
                <p><strong>Sumber data:</strong> <code>ksp_simpanan_data</code> dan <code>ksp_pinjam_data</code> (localStorage) — semua nilai akumulatif dari awal berdiri sampai batas tahun yang ditampilkan. Tidak ada hardcoded tahun; tahun otomatis diambil dari sistem.</p>
                <p><strong>Catatan:</strong> Laporan posisi keuangan disusun sesuai standar akuntansi koperasi. Kas dihitung dari seluruh uang masuk anggota (Pokok + Wajib + Sukarela). Simpanan seluruh tipe masuk ke Ekuitas.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
