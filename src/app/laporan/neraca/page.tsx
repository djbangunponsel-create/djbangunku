'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { readStored, KEYS } from '@/lib/storage';

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

// ── 7-profit simpanan product types ──────────────────────────────
type SimpKey = 'Pokok' | 'Wajib' | 'Sibuhar' | 'Sisujang' | 'Simapan' | 'Sihat' | 'Sihar';

const SIMPANA_PRODUCT_TYPES: readonly SimpKey[] = [
  'Pokok', 'Wajib', 'Sibuhar', 'Sisujang', 'Simapan', 'Sihat', 'Sihar',
];

function emptySimpBucket(): Record<SimpKey, number> {
  return { Pokok: 0, Wajib: 0, Sibuhar: 0, Sisujang: 0, Simapan: 0, Sihat: 0, Sihar: 0 };
}

// ── KSP settings shape ────────────────────────────────────────────
interface KspSettings {
  logo: string;
  namaKsp: string;
  alamat: string;
  badanHukum: string;
  telepon: string;
  email: string;
  ketuaKoperasi: string;
  sekretaris: string;
  bendahara: string;
  managerOperasional: string;
  kasir: string;
  admin: string;
  penjamin: string[];
}

// ── Sub-components ────────────────────────────────────────────────

function SectionRow({ label, currYear, prevYear, indent = 'pl-4', sub = false }: {
  label: string; currYear: number; prevYear: number; indent?: string; sub?: boolean;
}) {
  return (
    <tr>
      <td className={`px-6 py-2 whitespace-nowrap text-sm ${indent} ${sub ? 'font-medium text-gray-700' : 'text-gray-900'}`}>
        {label}
      </td>
      <td className="px-6 py-2 whitespace-nowrap text-sm text-right font-medium">
        {fmtRupiah(currYear)}
      </td>
      <td className="px-6 py-2 whitespace-nowrap text-sm text-right font-medium">
        {fmtRupiah(prevYear)}
      </td>
    </tr>
  );
}

// ── KSP settings: kopsurat + identity (sourced from Pengaturan KSP) ─
const _kspSettingsDefault: KspSettings = {
  logo: '', namaKsp: 'KSP Mulia Dana Sejahtera', alamat:
  'Desa Sungai Bundung, Kecamatan Marabahan, Kabupaten Barito Kuala',
  telepon: '', ketuaKoperasi: '', sekretaris: '', bendahara: '',
  managerOperasional: '', kasir: '', admin: '', penjamin: [],
  email: '', badanHukum: '',
};

function _readKspSettings(): KspSettings {
  try {
    const raw = window.localStorage.getItem(KEYS.SETTINGS);
    return raw ? (JSON.parse(raw) as KspSettings) : _kspSettingsDefault;
  } catch { return _kspSettingsDefault; }
}

const KSP_SET = _readKspSettings();
const KSP_NAMA   = KSP_SET.namaKsp    || _kspSettingsDefault.namaKsp;
const KSP_ALAMAT = KSP_SET.alamat    || _kspSettingsDefault.alamat;
const KSP_LOGO   = KSP_SET.logo;
const KSP_TELP   = KSP_SET.telepon  || '';

function SubHeaderRow({ label, indent = 'pl-8' }: { label: string; indent?: string }) {
  return (
    <tr className="bg-gray-50/60">
      <td className={`px-6 py-3 whitespace-nowrap text-xs font-semibold text-gray-600 uppercase ${indent}`} colSpan={3}>
        {label}
      </td>
    </tr>
  );
}

function TotalPairRow({ label, curr, prev, indent = 'pl-8', highlight = false, isLiabilitas = false }: {
  label: string; curr: number; prev: number; indent?: string; highlight?: boolean; isLiabilitas?: boolean;
}) {
  return (
    <tr className={highlight ? (isLiabilitas ? 'bg-blue-50' : 'bg-gray-50') : ''}>
      <td className={`px-6 py-2.5 whitespace-nowrap text-sm font-semibold ${indent}`}>{label}</td>
      <td className="px-6 py-2.5 whitespace-nowrap text-right text-sm font-semibold">{fmtRupiah(curr)}</td>
      <td className="px-6 py-2.5 whitespace-nowrap text-right text-sm font-semibold">{fmtRupiah(prev)}</td>
    </tr>
  );
}

function GrandTotalRow({ label, curr, prev }: { label: string; curr: number; prev: number }) {
  return (
    <tr className="bg-blue-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-lg">{label}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-lg">{fmtRupiah(curr)}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-lg">{fmtRupiah(prev)}</td>
    </tr>
  );
}

// ═══════════════════════════════════════════════════════════════════
export default function NeracaPage() {
  const yearConfig = useMemo(() => {
    const now     = new Date();
    const curYear = now.getFullYear();
    const prvYear = curYear - 1;
    return {
      currentYear:  curYear,
      prevYear:     prvYear,
      prevYearEnd:  yearEndDateStr(prvYear),
      currentYtd:   yearEndDateStr(curYear),
    };
  }, []);

  const simpananData = useState<Record<string, unknown>[]>(() => {
    return readStored<Record<string, unknown>[]>('ksp_simpan_data', []);
  })[0];

  useEffect(() => {
    const handler = () => {
      const saved = readStored<Record<string, unknown>[]>('ksp_simpan_data', []);
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const pinjamanData = useMemo(
    () => readStored<Record<string, unknown>[]>('ksp_pinjam_data', []),
    []
  );

  // ── Year-scoped accumulator: all 7 products ─────────────────────
  function accumulateSimpananYE(
    simpananRows: Record<string, unknown>[],
    yearNumber: number,
  ): { p: SimpKey; v: Record<SimpKey, number> } {
    const cutoff = yearEndDateStr(yearNumber);
    const bucket = emptySimpBucket();
    for (const r of simpananRows) {
      if (!(r.tanggalSetor ?? r.tanggal)) continue;
      const d = convertExcelDate(r.tanggalSetor ?? r.tanggal);
      if (d === '' || d > cutoff) continue;
      const amt = parseNumber(r.jumlah);
      const tipe = String(r.tipe ?? '') as SimpKey;
      if (SIMPANA_PRODUCT_TYPES.includes(tipe) && bucket[tipe] !== undefined) {
        bucket[tipe] += amt;
      }
    }
    return {
      p: 'Pokok',
      v: bucket,
    };
  }

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

  // ── Per-year derived values ─────────────────────────────────────
  const currYE = useMemo(() => accumulateSimpananYE(simpananData, yearConfig.currentYear),   [simpananData, yearConfig.currentYear]);
  const prevYE = useMemo(() => accumulateSimpananYE(simpananData, yearConfig.prevYear),        [simpananData, yearConfig.prevYear]);

  const currPinjaman = useMemo(() => accumulatePinjamanYE(pinjamanData, yearConfig.currentYear), [pinjamanData, yearConfig.currentYear]);
  const prevPinjaman = useMemo(() => accumulatePinjamanYE(pinjamanData, yearConfig.prevYear),   [pinjamanData, yearConfig.prevYear]);

  // Shorthand
  const c = currYE.v;
  const p = prevYE.v;

  // ── Aktiva ─────────────────────────────────────────────────────
  const currKas           = c.Pokok + c.Wajib + c.Sibuhar + c.Sisujang + c.Simapan + c.Sihat + c.Sihar;
  const prevKas           = p.Pokok + p.Wajib + p.Sibuhar + p.Sisujang + p.Simapan + p.Sihat + p.Sihar;
  const currPiutang = currPinjaman;
  const prevPiutang = prevPinjaman;
  const currAktivaLancar      = currKas + currPiutang;
  const prevAktivaLancar      = prevKas + prevPiutang;
  const currAktivaTidakLancar = 0;
  const prevAktivaTidakLancar = 0;
  const currTotalAktiva       = currAktivaLancar + currAktivaTidakLancar;
  const prevTotalAktiva       = prevAktivaLancar + prevAktivaTidakLancar;

  // ── Kewajiban — SAK ETAP mapping ───────────────────────────────
  // Kewajiban Jangka Pendek  (Simpanan Lancar)
  const cKJP_Pokok  = c.Pokok;
  const cKJP_Wajib  = c.Wajib;
  const cKJP_Sibuhar = c.Sibuhar;
  const cKJP_Sihar   = c.Sihar;
  const cKJP_SubTotal = cKJP_Pokok + cKJP_Wajib + cKJP_Sibuhar + cKJP_Sihar;

  const pKJP_Pokok  = p.Pokok;
  const pKJP_Wajib  = p.Wajib;
  const pKJP_Sibuhar = p.Sibuhar;
  const pKJP_Sihar   = p.Sihar;
  const pKJP_SubTotal = pKJP_Pokok + pKJP_Wajib + pKJP_Sibuhar + pKJP_Sihar;

  // Kewajiban Jangka Panjang (Simpanan Berjangka)
  //   In KSP these funds are locked/withdrawable only at maturity,
  //   therefore they count as long-term.
  const cKJP_Panjang_Sisujang = c.Sisujang;
  const cKJP_Panjang_Simapan  = c.Simapan;
  const cKJP_Panjang_Sihat    = c.Sihat;
  const cKJP_Panjang_SubTotal = cKJP_Panjang_Sisujang + cKJP_Panjang_Simapan + cKJP_Panjang_Sihat;

  const pKJP_Panjang_Sisujang = p.Sisujang;
  const pKJP_Panjang_Simapan  = p.Simapan;
  const pKJP_Panjang_Sihat    = p.Sihat;
  const pKJP_Panjang_SubTotal = pKJP_Panjang_Sisujang + pKJP_Panjang_Simapan + pKJP_Panjang_Sihat;

  // Total Kewajiban (Lancar + Jangka Panjang)
  // → feeds into Grand Total Kewajiban dan Ekuitas (SAK EP / Neraca)
  const cTotalKewajiban     = cKJP_SubTotal + cKJP_Panjang_SubTotal;
  const pTotalKewajiban     = pKJP_SubTotal + pKJP_Panjang_SubTotal;

  // ── Ekuitas ─────────────────────────────────────────────────────
  // Modal Anggota = Pokok (dipindah dari Kewajiban Jangka Pendek ke
  // Ekuitas sesuai SAK Koperasi — Pokok adalah modal tetap anggota)
  // Siswa: Wajib = Modal Anggota Diperlukan;
  //        all other types remain in Kewajiban above.
  // Volume sewa (Sibuhar, Sihar, Sisujang, Simapan, Sihat) tetap di Kewajiban.
  const cModalAnggotaTetap     = c.Pokok;   // SP
  const cModalAnggotaDiperlukan = c.Wajib;  // SW
  const cTotalEkuitas           = cModalAnggotaTetap + cModalAnggotaDiperlukan; // Modal SDM yang termanfaatkan → dihitung

  const pModalAnggotaTetap     = p.Pokok;
  const pModalAnggotaDiperlukan = p.Wajib;
  const pTotalEkuitas           = pModalAnggotaTetap + pModalAnggotaDiperlukan;

  // ── Pasiva Total ───────────────────────────────────────────────
  // Kewajiban (Lancar + Jangka Panjang) + Ekuitas = Total Kewajiban dan Ekuitas
  const cTotalKewajibanDanEkuitas = cTotalKewajiban + cTotalEkuitas;
  const pTotalKewajibanDanEkuitas = pTotalKewajiban + pTotalEkuitas;

  const currTotalPasiva = cTotalKewajibanDanEkuitas;
  const prevTotalPasiva = pTotalKewajibanDanEkuitas;

  // ── Balance check ──────────────────────────────────────────────
  const isBalancedCurr = Math.abs(currTotalAktiva - currTotalPasiva) < 1;
  const isBalancedPrev = Math.abs(prevTotalAktiva - prevTotalPasiva) < 1;

  const currBalanceStr = isBalancedCurr
    ? `✓ ${yearConfig.currentYear} SEIMBANG — AKTIVA ${fmtRupiah(currTotalAktiva)} = KEWAJIBAN+EKUITAS ${fmtRupiah(currTotalPasiva)}`
    : `⚠ ${yearConfig.currentYear} Selisih ${fmtRupiah(Math.abs(currTotalAktiva - currTotalPasiva))} — AKTIVA: ${fmtRupiah(currTotalAktiva)}, KEWAJIBAN+EKUITAS: ${fmtRupiah(currTotalPasiva)}`;

  const prevBalanceStr = isBalancedPrev
    ? `✓ ${yearConfig.prevYear} SEIMBANG — AKTIVA ${fmtRupiah(prevTotalAktiva)} = KEWAJIBAN+EKUITAS ${fmtRupiah(prevTotalPasiva)}`
    : `⚠ ${yearConfig.prevYear} Selisih ${fmtRupiah(Math.abs(prevTotalAktiva - prevTotalPasiva))} — AKTIVA: ${fmtRupiah(prevTotalAktiva)}, KEWAJIBAN+EKUITAS: ${fmtRupiah(prevTotalPasiva)}`;

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
            {/* ── Print-only Kop Surat ─────────────────────────── */}
            <div className="text-center border-b-2 border-double border-gray-400 pb-2 mb-4 print:mb-2 hidden print:block">
              {KSP_LOGO && (
                <img
                  src={KSP_LOGO}
                  alt="Logo KSP"
                  className="w-10 h-10 object-contain mx-auto mb-0.5"
                />
              )}
              <p className="text-xs font-bold tracking-wide">{KSP_NAMA}</p>
              <p className="text-[9px] text-gray-500 leading-tight">{KSP_ALAMAT}</p>
              {KSP_TELP && <p className="text-[9px] text-gray-500">Telp. {KSP_TELP}</p>}
            </div>

            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KETERANGAN</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-emerald-700 uppercase tracking-wider">{yearConfig.currentYear}</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{yearConfig.prevYear}</th>
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

                    <SectionRow
                      label="Kas"
                      currYear={currKas}
                      prevYear={prevKas}
                      indent="pl-10"
                      sub
                    />
                    <SectionRow
                      label="Piutang Pinjaman Anggota"
                      currYear={currPiutang}
                      prevYear={prevPiutang}
                      indent="pl-10"
                      sub
                    />
                    <SectionRow label="Piutang Bunga" currYear={0} prevYear={0} indent="pl-10" sub />
                    <SectionRow label="Persediaan"      currYear={0} prevYear={0} indent="pl-10" sub />
                    <TotalPairRow
                      label="Jumlah Aktiva Lancar"
                      curr={currAktivaLancar}
                      prev={prevAktivaLancar}
                      indent="pl-8"
                      highlight
                      isLiabilitas={false}
                    />

                    <SubHeaderRow label="Aktiva Tidak Lancar" indent="pl-8" />
                    <SectionRow label="Investasi Jangka Panjang" currYear={0} prevYear={0} indent="pl-10" sub />
                    <SectionRow label="Aset Tetap (netto)"        currYear={0} prevYear={0} indent="pl-10" sub />
                    <TotalPairRow
                      label="Jumlah Aktiva Tidak Lancar"
                      curr={0} prev={0}
                      indent="pl-8"
                      highlight
                      isLiabilitas={false}
                    />

                    <GrandTotalRow
                      label="JUMLAH AKTIVA"
                      curr={currTotalAktiva}
                      prev={prevTotalAktiva}
                    />

                    {/* ══════ KEWAJIBAN DAN EKUITAS ══════ */}
                    <tr>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">KEWAJIBAN DAN EKUITAS</td>
                      <td className="whitespace-nowrap text-sm text-gray-900"></td>
                      <td className="whitespace-nowrap text-sm text-gray-900"></td>
                    </tr>

                    {/* ════ KEWAJIBAN JANGKA PENDEK — Simpanan Lancar ════ */}
                    <tr>
                      <td className="px-6 py-2.5 text-sm font-bold text-orange-700 pl-8" colSpan={3}>
                        Kewajiban Jangka Pendek (Simpanan Lancar)
                      </td>
                    </tr>
                    <SectionRow
                      label="Simpanan Pokok (SP)"
                      currYear={cKJP_Pokok}
                      prevYear={pKJP_Pokok}
                      indent="pl-10"
                      sub
                    />
                    <SectionRow
                      label="Simpanan Wajib (SW)"
                      currYear={cKJP_Wajib}
                      prevYear={pKJP_Wajib}
                      indent="pl-10"
                      sub
                    />
                    <SectionRow
                      label="Simpanan Bunga Harian (Sibuhar)"
                      currYear={cKJP_Sibuhar}
                      prevYear={pKJP_Sibuhar}
                      indent="pl-10"
                      sub
                    />
                    <SectionRow
                      label="Simpanan Hari Raya (Sihar)"
                      currYear={cKJP_Sihar}
                      prevYear={pKJP_Sihar}
                      indent="pl-10"
                      sub
                    />
                    <TotalPairRow
                      label="Jumlah Kewajiban Jangka Pendek"
                      curr={cKJP_SubTotal}
                      prev={pKJP_SubTotal}
                      indent="pl-8"
                      highlight
                      isLiabilitas
                    />

                    {/* ════ KEWAJIBAN JANGKA PANJANG — Simpanan Berjangka ════ */}
                    <tr>
                      <td className="px-6 py-2.5 text-sm font-bold text-orange-700 pl-8" colSpan={3}>
                        Kewajiban Jangka Panjang (Simpanan Berjangka)
                      </td>
                    </tr>
                    <SectionRow
                      label="Simpanan Sukarela Berjangka (Sisujang)"
                      currYear={cKJP_Panjang_Sisujang}
                      prevYear={pKJP_Panjang_Sisujang}
                      indent="pl-10"
                      sub
                    />
                    <SectionRow
                      label="Simpanan Masa Depan (Simapan)"
                      currYear={cKJP_Panjang_Simapan}
                      prevYear={pKJP_Panjang_Simapan}
                      indent="pl-10"
                      sub
                    />
                    <SectionRow
                      label="Simpanan Hari Tua (Sihat)"
                      currYear={cKJP_Panjang_Sihat}
                      prevYear={pKJP_Panjang_Sihat}
                      indent="pl-10"
                      sub
                    />
                    <TotalPairRow
                      label="Jumlah Kewajiban Jangka Panjang"
                      curr={cKJP_Panjang_SubTotal}
                      prev={pKJP_Panjang_SubTotal}
                      indent="pl-8"
                      highlight
                      isLiabilitas
                    />

                    {/* ════ TOTAL KEWAJIBAN ════ */}
                    <TotalPairRow
                      label="TOTAL KEWAJIBAN (Lancar + Berjangka)"
                      curr={cTotalKewajiban}
                      prev={pTotalKewajiban}
                      indent="pl-8"
                      highlight
                      isLiabilitas
                    />

                    {/* ════ EKUITAS ════ */}
                    <tr>
                      <td className="px-6 py-2.5 text-sm font-bold text-blue-700 pl-8" colSpan={3}>
                        Ekuitas (SAK ETAP / SAK EP Koperasi)
                      </td>
                    </tr>
                    <SectionRow
                      label="Modal Anggota Tetap — Simpanan Pokok (SP)"
                      currYear={cModalAnggotaTetap}
                      prevYear={pModalAnggotaTetap}
                      indent="pl-10"
                      sub
                    />
                    <SectionRow
                      label="Modal Anggota Diperlukan — Simpanan Wajib (SW)"
                      currYear={cModalAnggotaDiperlukan}
                      prevYear={pModalAnggotaDiperlukan}
                      indent="pl-10"
                      sub
                    />
                    <SectionRow label="Cadangan Umum"    currYear={0} prevYear={0} indent="pl-10" sub />
                    <SectionRow label="Cadangan Bakan"   currYear={0} prevYear={0} indent="pl-10" sub />
                    <SectionRow label="Hibah"             currYear={0} prevYear={0} indent="pl-10" sub />
                    <TotalPairRow
                      label="Jumlah Ekuitas"
                      curr={cTotalEkuitas}
                      prev={pTotalEkuitas}
                      indent="pl-8"
                      highlight
                    />

                    {/* ════ GRAND TOTAL KEWAJIBAN DAN EKUITAS ════ */}
                    <GrandTotalRow
                      label="JUMLAH KEWAJIBAN DAN EKUITAS"
                      curr={cTotalKewajibanDanEkuitas}
                      prev={pTotalKewajibanDanEkuitas}
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
                <p><strong>Sumber data:</strong> <code>ksp_simpan_data</code> dan <code>ksp_pinjam_data</code> (localStorage) — semua nilai akumulatif dari awal berdiri sampai batas tahun yang ditampilkan. Tidak ada hardcoded tahun; tahun otomatis diambil dari sistem.</p>
                <p><strong>Struktur Kewajiban — SAK ETAP / SAK EP Koperasi:</strong> Kewajiban Jangka Pendek (SP, SW, Sibuhar, Sihar) adalah simpanan lancar yang bisa diambil sewaktu-waktu. Kewajiban Jangka Panjang (Sisujang, Simapan, Sihat) adalah simpanan yang terikat masa berjangka. Ekuitas mencakup Modal Anggota Tetap (SP) dan Diperlukan (SW). Total Kewajiban (Lancar + Berjangka) + Ekuitas = Total Kewajiban dan Ekuitas, yang harus seimbang dengan Jumlah Aktiva.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
