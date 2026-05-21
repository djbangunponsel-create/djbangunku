'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, X } from 'lucide-react';

interface Potongan {
  administrasi: number;
  danaResiko: number;
  danaSosial: number;
  insentifPJ: number;
  biayaMaterai: number;
  biayaNotaris: number;
  biayaBpjstk: number;
}

interface PinjamanKwitansi {
  id: string;
  anggota: string;
  anggotaNo?: string;
  jumlah: number;
  bunga: number;
  tenor: number;
  angsuran: number;
  tanggal: string;
  netto: number;
  penanggungJawab: string;
  jenisAgunan: string;
  pemilikAgunan?: string;
  nilaiPasarAgunan?: number;
  nilaiLikuidasiAgunan?: number;
  agunanMencukupi?: boolean;
  bpkbMerkMbl?: string;
  bpkbTipeMbl?: string;
  bpkbTahun?: string;
  bpkbNoRangka?: string;
  bpkbNoMesin?: string;
  bpkbNoPolisi?: string;
  bpkbWarna?: string;
  bpkbTipeKet?: string;
  aktaNoSertifikat?: string;
  aktaLuasTanah?: string;
  aktaLuasBangunan?: string;
  aktaLokasi?: string;
  simpananNoRekening?: string;
  simpananMasaBerjangka?: string;
  opsiSwk?: string;
  potongan: Potongan;
  masaBpjstk?: number;
}

interface Props {
  data: PinjamanKwitansi;
  onClose: () => void;
}

function fmt(n: number): string {
  return n.toLocaleString('id-ID');
}

export default function KwitansiPinjaman({ data, onClose }: Props) {
  const now = new Date();
  const tglCetak = now.toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
  const jamCetak = now.toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });

  const agunan = ['Akta Tanah', 'Sertifikat Hak Milik (SHM)'].includes(data.jenisAgunan);
  const isKendaraan = ['BPKB Roda 2', 'BPKB Roda 4', 'BPKB Roda 6/8'].includes(data.jenisAgunan);
  const isSimpananAgunan = data.jenisAgunan === 'Simpanan' || data.jenisAgunan === 'Simpanan Sukarela Berjangka (Sisujang)';

  function handlePrint() {
    window.print();
  }

  /* ── potongan yang obowiązują ── */
  const totalPotongan =
    data.potongan.administrasi +
    data.potongan.danaResiko +
    data.potongan.danaSosial +
    data.potongan.insentifPJ +
    data.potongan.biayaMaterai +
    data.potongan.biayaNotaris +
    data.potongan.biayaBpjstk;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm print:bg-white print:relative print:z-0 print:flex print:items-start print:justify-center print:pt-4">
      {/* Receipt paper */}
      <div className="bg-white w-full max-w-[580px] shadow-2xl rounded-none print:shadow-none print:max-w-[148mm]" id="kwitansi-pinjaman">
        {/* ── PRINT STYLES ── */}
        <style>{`
          @media print {
            @page {
              size: A5;
              margin: 8mm 8mm 10mm 8mm;
            }

            body * { visibility: hidden !important; }
            #kwitansi-pinjaman, #kwitansi-pinjaman * { visibility: visible !important; }
            #kwitansi-pinjaman {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              margin: 0;
              padding: 0;
            }
            .no-print { display: none !important; }
            .print-only { display: block !important; }
            .kwitansi-card { border: none !important; box-shadow: none !important; }
          }
          .print-only { display: none; }
        `}</style>

        <div className="p-5 print:p-0">
          {/* ─── Kop Surat ─────────────────────────────── */}
          <div className="text-center border-b-2 border-double border-gray-400 pb-2 mb-3 print:mb-1.5 print:break-inside-avoid">
            <p className="text-[10px] text-gray-500 leading-tight">
              Alamat: Desa Sungai Bundung, Kecamatan Marabahan, Kabupaten Barito Kuala
            </p>
          </div>

          {/* ─── Judul Kwitansi ───────────────────────── */}
          <div className="text-center mb-3 print:mb-2">
            <h2 className="text-base font-bold border-b-3 border-blue-600 inline-block pb-0.5 px-4 tracking-wide">
              KWITANSI PINJAMAN
            </h2>
          </div>

          {/* ─── Info Umum ─────────────────────────────── */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 mb-3 print:mb-1.5 text-xs print:break-inside-avoid">
            <div className="flex"><span className="font-semibold text-gray-600 w-[110px] shrink-0">No. Pinjaman</span><span className="font-mono text-[10px] bg-gray-50 px-1.5 py-0.5 rounded">{data.id}</span></div>
            <div className="text-right">Tanggal Cicil: {new Date(data.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
            <div className="flex"><span className="font-semibold text-gray-600 w-[110px] shrink-0">Tanggal Cetak</span><span className="text-[10px] text-gray-600">{tglCetak}</span></div>
            <div className="text-right text-[10px] text-gray-500">{jamCetak}</div>
          </div>

          {/* ─── Data Anggota & Pinjaman ────────────────── */}
          <div className="grid grid-cols-1 gap-2 mb-3 print:mb-1.5 print:break-inside-avoid">
            {/* Data Anggota */}
            <div className="border border-gray-200 overflow-hidden">
              <div className="bg-blue-600 text-white font-semibold px-2.5 py-1 text-xs">DATA ANGGOTA</div>
              <div className="p-2.5 text-xs space-y-0.5">
                <div className="flex"><span className="w-28 text-gray-600 shrink-0">Nama Anggota</span><span className="font-semibold">: {data.anggota}</span></div>
                {data.anggotaNo && <div className="flex"><span className="w-28 text-gray-600 shrink-0">No. Anggota</span><span>: {data.anggotaNo}</span></div>}
                <div className="flex"><span className="w-28 text-gray-600 shrink-0">Penanggung Jawab</span><span className="font-semibold">: {data.penanggungJawab}</span></div>
              </div>
            </div>

            {/* Data Pinjaman */}
            <div className="border border-gray-200 overflow-hidden">
              <div className="bg-orange-500 text-white font-semibold px-2.5 py-1 text-xs">DATA PINJAMAN</div>
              <div className="p-2.5 text-xs space-y-0.5">
                <div className="flex"><span className="w-36 text-gray-600 shrink-0">Jumlah Pinjaman</span><span className="font-bold text-base text-orange-600">Rp {fmt(data.jumlah)}</span></div>
                <div className="flex"><span className="w-36 text-gray-600 shrink-0">Bunga per Tahun</span><span>: {data.bunga}% pa</span></div>
                <div className="flex"><span className="w-36 text-gray-600 shrink-0">Jangka Waktu</span><span>: {data.tenor} bulan</span></div>
                <div className="flex"><span className="w-36 text-gray-600 shrink-0">Jenis Pinjaman</span><span>: {data.potongan.insentifPJ > 0 ? 'Bunga Berjalan' : 'Flat'}</span></div>
              </div>
            </div>
          </div>

          {/* ─── Potongan ─────────────────────────────── */}
          <div className="mb-3 print:mb-1.5 print:break-inside-avoid">
            <div className="bg-orange-50 border border-orange-200 overflow-hidden">
              <div className="text-xs font-semibold text-orange-700 px-2.5 py-1 border-b border-orange-200">POTONGAN PINJAMAN</div>
              <div className="divide-y divide-orange-100 text-xs">
                <div className="flex justify-between px-2.5 py-1"><span>Administrasi (2%)</span><span>Rp {fmt(data.potongan.administrasi)}</span></div>
                {data.potongan.danaResiko > 0 && <div className="flex justify-between px-2.5 py-1"><span>Dana Resiko (1%)</span><span>Rp {fmt(data.potongan.danaResiko)}</span></div>}
                {data.potongan.danaSosial > 0 && <div className="flex justify-between px-2.5 py-1"><span>Dana Sosial (1%)</span><span>Rp {fmt(data.potongan.danaSosial)}</span></div>}
                {data.potongan.insentifPJ > 0 && <div className="flex justify-between px-2.5 py-1 bg-red-50 text-red-700"><span>Insentif PJ (1%)</span><span className="font-semibold">Rp {fmt(data.potongan.insentifPJ)}</span></div>}
                {data.potongan.biayaMaterai > 0 && <div className="flex justify-between px-2.5 py-1"><span>Biaya Materai</span><span>Rp {fmt(data.potongan.biayaMaterai)}</span></div>}
                {data.potongan.biayaNotaris > 0 && <div className="flex justify-between px-2.5 py-1"><span>Biaya Notaris</span><span>Rp {fmt(data.potongan.biayaNotaris)}</span></div>}
                {data.potongan.biayaBpjstk > 0 && <div className="flex justify-between px-2.5 py-1"><span>Iuran BPJSTK ({data.masaBpjstk} bln)</span><span>Rp {fmt(data.potongan.biayaBpjstk)}</span></div>}
                <div className="flex justify-between px-2.5 py-1 font-semibold bg-gray-50 text-[10px] text-gray-500"><span>TOTAL POTONGAN</span><span>Rp {fmt(totalPotongan)}</span></div>
              </div>
            </div>
          </div>

          {/* ─── Rincian Angsuran ─────────────────────── */}
          <div className="mb-3 print:mb-1.5 print:break-inside-avoid">
            <div className="bg-blue-50 border border-blue-200 overflow-hidden">
              <div className="text-xs font-semibold text-blue-700 px-2.5 py-1 border-b border-blue-200">RINCIAN ANGSURAN</div>
              <div className="grid grid-cols-3 gap-px bg-blue-100 text-xs">
                <div className="bg-blue-50 px-2.5 py-1 text-gray-600">Angsuran Pokok / Bulan</div>
                <div className="bg-blue-50 px-2.5 py-1 text-right font-semibold">Rp {fmt(data.angsuran)}</div>
                <div className="bg-blue-50 px-2.5 py-1 text-gray-600 font-medium">Bunga / Bulan</div>
                <div className="bg-blue-50 px-2.5 py-1 text-right font-semibold">Rp {fmt(Math.round(data.jumlah * data.bunga / 100))}</div>
                <div className="bg-blue-50 px-2.5 py-1 text-gray-600">Simpanan Wajib Kapitalisasi</div>
                <div className="bg-blue-50 px-2.5 py-1 text-right font-semibold">Rp {fmt(data.opsiSwk === '1%' ? Math.round(data.jumlah * 0.01) : data.opsiSwk === 'flat' ? 25000 : 0)}</div>
                <div className="col-span-2 bg-blue-600 text-white px-2.5 py-1 font-bold text-center text-[10px]">TOTAL ANGSURAN / BULAN</div>
                <div className="bg-blue-600 text-white px-2.5 py-1 text-right font-bold text-[10px]">
                  Rp {fmt(data.angsuran + Math.round(data.jumlah * data.bunga / 100) + (data.opsiSwk === '1%' ? Math.round(data.jumlah * 0.01) : data.opsiSwk === 'flat' ? 25000 : 0))}
                </div>
              </div>
            </div>
          </div>

          {/* ─── Total Diterima ─────────────────────────── */}
          <div className="mb-3 print:mb-1.5 print:break-inside-avoid">
            <div className="bg-blue-600 text-white overflow-hidden">
              <div className="flex justify-between items-center px-3 py-2">
                <span className="font-bold text-sm tracking-wide">TOTAL DITERIMA ANGGOTA</span>
                <span className="text-lg font-black">Rp {fmt(data.netto)}</span>
              </div>
            </div>
          </div>

          {/* ─── Detail Agunan ──────────────────────────── */}
          {data.jenisAgunan && (
            <div className="mb-3 print:mb-1.5 print:break-inside-avoid">
              <div className="bg-gray-50 border border-gray-200 overflow-hidden">
                <div className="text-[10px] font-semibold text-gray-700 px-2.5 py-1 border-b border-gray-200">DETAIL AGUNAN — {data.jenisAgunan.toUpperCase()}</div>
                <div className="p-2.5 text-[10px] space-y-0.5">
                  {data.pemilikAgunan && <div className="flex"><span className="w-36 text-gray-600 shrink-0">Nama Pemilik Agunan</span><span className="font-semibold">: {data.pemilikAgunan}</span></div>}
                  {data.nilaiPasarAgunan !== undefined && <div className="flex"><span className="w-36 text-gray-600 shrink-0">Nilai Pasar Agunan</span><span>: Rp {fmt(data.nilaiPasarAgunan)}</span></div>}
                  {data.nilaiLikuidasiAgunan !== undefined && <div className="flex"><span className="w-36 text-gray-600 shrink-0">Nilai Likuidasi Agunan</span><span>: Rp {fmt(data.nilaiLikuidasiAgunan)}</span></div>}
                  {data.agunanMencukupi !== undefined && (
                    <div className="flex">
                      <span className="w-36 text-gray-600 shrink-0">Status Agunan</span>
                      <span className={data.agunanMencukupi ? 'px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-green-100 text-green-700' : 'px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-red-100 text-red-700'}>
                        {data.agunanMencukupi ? 'CUKUP' : 'TIDAK CUKUP'}
                      </span>
                    </div>
                  )}
                  {agunan && (
                    <>
                      {data.aktaNoSertifikat && <div className="flex"><span className="w-36 text-gray-600 shrink-0">No. Sertifikat</span><span>: {data.aktaNoSertifikat}</span></div>}
                      {data.aktaLuasTanah && <div className="flex"><span className="w-36 text-gray-600 shrink-0">Luas Tanah</span><span>: {data.aktaLuasTanah} m²</span></div>}
                      {data.aktaLuasBangunan && <div className="flex"><span className="w-36 text-gray-600 shrink-0">Luas Bangunan</span><span>: {data.aktaLuasBangunan} m²</span></div>}
                      {data.aktaLokasi && <div className="flex"><span className="w-36 text-gray-600 shrink-0">Lokasi</span><span>: {data.aktaLokasi}</span></div>}
                    </>
                  )}
                  {isKendaraan && (
                    <>
                      {data.bpkbMerkMbl && <div className="flex"><span className="w-36 text-gray-600 shrink-0">Merk / Model</span><span>: {data.bpkbMerkMbl} {data.bpkbTipeMbl ? '/ ' + data.bpkbTipeMbl : ''}</span></div>}
                      {data.bpkbTahun && <div className="flex"><span className="w-36 text-gray-600 shrink-0">Tahun</span><span>: {data.bpkbTahun}</span></div>}
                      {data.bpkbNoRangka && <div className="flex"><span className="w-36 text-gray-600 shrink-0">No. Rangka</span><span>: {data.bpkbNoRangka}</span></div>}
                      {data.bpkbNoMesin && <div className="flex"><span className="w-36 text-gray-600 shrink-0">No. Mesin</span><span>: {data.bpkbNoMesin}</span></div>}
                      {data.bpkbNoPolisi && <div className="flex"><span className="w-36 text-gray-600 shrink-0">No. Polisi</span><span>: {data.bpkbNoPolisi}</span></div>}
                      {data.bpkbWarna && <div className="flex"><span className="w-36 text-gray-600 shrink-0">Warna</span><span>: {data.bpkbWarna}</span></div>}
                    </>
                  )}
                  {(isSimpananAgunan || data.jenisAgunan === 'Pendiri') && (
                    <>
                      {data.simpananNoRekening && <div className="flex"><span className="w-36 text-gray-600 shrink-0">No. Rekening</span><span className="font-mono text-[10px]">: {data.simpananNoRekening}</span></div>}
                      {data.simpananMasaBerjangka && <div className="flex"><span className="w-36 text-gray-600 shrink-0">Masa Berjangka / Ket.</span><span>: {data.simpananMasaBerjangka}</span></div>}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ─── Catatan ────────────────────────────────── */}
          <div className="mb-3 print:mb-1.5 text-[9px] text-gray-400 italic text-center">
            Kwitansi ini digenerate otomatis oleh sistem KSP Mulia Dana Sejahtera.
          </div>
        </div>

        {/* ════════════════ TANDA TANGAN ════════════════ */}
        <div className="border-t border-gray-200 pt-3 pb-4 px-5 print:pt-1.5 print:pb-2 print:px-0 print:break-inside-avoid">
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            {/* Kolom 1: Peminjam */}
            <div>
              <p className="font-semibold mb-8">{data.anggota}</p>
              <div className="border-t border-gray-500 pt-1">
                <p className="text-[10px] font-bold text-gray-700">Peminjam</p>
              </div>
            </div>
            {/* Kolom 2: Kasir — Erni Sembiring */}
            <div>
              <p className="font-semibold mb-8">Erni Sembiring</p>
              <div className="border-t border-gray-500 pt-1">
                <p className="text-[10px] font-bold text-gray-700">Kasir</p>
              </div>
            </div>
            {/* Kolom 3: Manager — Marwan Esra Bangun */}
            <div>
              <p className="font-semibold mb-8">Marwan Esra Bangun</p>
              <div className="border-t border-gray-500 pt-1">
                <p className="text-[10px] font-bold text-gray-700">Manager</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Divider before footer buttons ─── */}
        <div className="border-t print:hidden"></div>

        {/* ─── On-screen footer ─────────────────────── */}
        <div className="flex justify-between items-center px-5 py-3 no-print">
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-1" /> Tutup
          </Button>
          <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Printer className="w-4 h-4 mr-1" /> Cetak Kwitansi
          </Button>
        </div>
      </div>
    </div>
  );
}
