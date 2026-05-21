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

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm print:bg-white print:relative print:z-0 print:block">
      {/* Receipt paper */}
      <div className="bg-white w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl rounded-none print:shadow-none print:max-w-none print:max-h-none" id="kwitansi-pinjaman">
        {/* ── PRINT HEADER (hidden on screen, visible on print) ── */}
        <style>{`
          @media print {
            body * { visibility: hidden !important; }
            #kwitansi-pinjaman, #kwitansi-pinjaman * { visibility: visible !important; }
            #kwitansi-pinjaman { position: absolute; left: 0; top: 0; width: 100%; }
            .no-print { display: none !important; }
            .print-only { display: block !important; }
            .kwitansi-card { border: none !important; box-shadow: none !important; }
          }
          .print-only { display: none; }
        `}</style>

        <div className="p-8 print:p-0">
          {/* ─── Kop Surat ─────────────────────────────── */}
          <div className="text-center border-b-2 border-double border-gray-400 pb-4 mb-6 print:break-inside-avoid">
            <h1 className="text-xl font-bold tracking-wide">KOPERASI SIMPAN PINJAM</h1>
            <h2 className="text-lg font-bold text-blue-700">MULIA DANA SEJAHTERA</h2>
            <p className="text-xs text-gray-500 mt-1">
              Alamat: Desa Sungai Bundung, Kecamatan Marabahan, Kabupaten Barito Kuala
            </p>
          </div>

          {/* ─── Judul Kwitansi ───────────────────────── */}
          <div className="text-center mb-6 print:mb-4">
            <h2 className="text-lg font-bold border-b-4 border-blue-600 inline-block pb-1 px-4">
              KWITANSI PINJAMAN
            </h2>
          </div>

          {/* ─── Info Umum ─────────────────────────────── */}
          <div className="grid grid-cols-2 gap-2 text-sm mb-6 print:mb-2 print:break-inside-avoid">
            <div><span className="font-semibold">No. Pinjaman</span></div>
            <div className="text-right font-mono text-xs bg-gray-50 px-2 py-1 rounded">{data.id}</div>
            <div><span className="font-semibold">Tanggal Cicil</span></div>
            <div className="text-right">{new Date(data.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
            <div><span className="font-semibold">Dicetak</span></div>
            <div className="text-right text-xs text-gray-500">{tglCetak} {jamCetak}</div>
          </div>

          {/* ─── Data Anggota & Pinjaman ────────────────── */}
          <div className="grid grid-cols-1 gap-4 mb-6 print:mb-3 print:break-inside-avoid">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-blue-600 text-white text-xs font-semibold px-3 py-1.5">DATA ANGGOTA</div>
              <div className="p-4 space-y-2 text-sm">
                <div className="flex"><span className="w-40 font-medium text-gray-600">Nama Anggota</span><span className="font-semibold">: {data.anggota}</span></div>
                {data.anggotaNo && <div className="flex"><span className="w-40 font-medium text-gray-600">No. Anggota</span><span>: {data.anggotaNo}</span></div>}
                <div className="flex"><span className="w-40 font-medium text-gray-600">Penanggung Jawab</span><span className="font-semibold">: {data.penanggungJawab}</span></div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-orange-500 text-white text-xs font-semibold px-3 py-1.5">DATA PINJAMAN</div>
              <div className="p-4 space-y-2 text-sm">
                <div className="flex"><span className="w-48 font-medium text-gray-600">Jumlah Pinjaman</span><span className="font-bold text-lg text-orange-600">Rp {fmt(data.jumlah)}</span></div>
                <div className="flex"><span className="w-48 font-medium text-gray-600">Bunga per Tahun</span><span>: {data.bunga}% pa</span></div>
                <div className="flex"><span className="w-48 font-medium text-gray-600">Jangka Waktu</span><span>: {data.tenor} bulan</span></div>
                <div className="flex"><span className="w-48 font-medium text-gray-600">Jenis Pinjaman</span><span>: {data.potongan.insentifPJ > 0 ? 'Bunga Berjalan' : 'Flat'}</span></div>
              </div>
            </div>
          </div>

          {/* ─── Potongan ─────────────────────────────── */}
          <div className="mb-4 print:mb-2 print:break-inside-avoid">
            <div className="bg-orange-50 border border-orange-200 rounded-lg overflow-hidden">
              <div className="text-xs font-semibold text-orange-700 px-3 py-1.5 border-b border-orange-200">POTONGAN PINJAMAN</div>
              <div className="divide-y divide-orange-100 text-sm">
                <div className="flex justify-between px-4 py-2"><span>Administrasi (2%)</span><span>Rp {fmt(data.potongan.administrasi)}</span></div>
                <div className="flex justify-between px-4 py-2"><span>Dana Resiko (1%)</span><span>Rp {fmt(data.potongan.danaResiko)}</span></div>
                <div className="flex justify-between px-4 py-2"><span>Dana Sosial (1%)</span><span>Rp {fmt(data.potongan.danaSosial)}</span></div>
                {data.potongan.insentifPJ > 0 && (
                  <div className="flex justify-between px-4 py-2 bg-red-50 text-red-700"><span>Insentif Penanggung Jawab (1%)</span><span className="font-semibold">Rp {fmt(data.potongan.insentifPJ)}</span></div>
                )}
                {data.potongan.biayaMaterai > 0 && <div className="flex justify-between px-4 py-2"><span>Biaya Materai</span><span>Rp {fmt(data.potongan.biayaMaterai)}</span></div>}
                {data.potongan.biayaNotaris > 0 && <div className="flex justify-between px-4 py-2"><span>Biaya Notaris</span><span>Rp {fmt(data.potongan.biayaNotaris)}</span></div>}
                {data.potongan.biayaBpjstk > 0 && (
                  <div className="flex justify-between px-4 py-2"><span>Iuran BPJSTK ({data.masaBpjstk} bulan)</span><span>Rp {fmt(data.potongan.biayaBpjstk)}</span></div>
                )}
                <div className="flex justify-between px-4 py-2 font-semibold text-xs text-gray-500 bg-gray-50"><span>TOTAL POTONGAN</span><span>Rp {fmt(data.potongan.administrasi + data.potongan.danaResiko + data.potongan.danaSosial + data.potongan.insentifPJ + data.potongan.biayaMaterai + data.potongan.biayaNotaris + data.potongan.biayaBpjstk)}</span></div>
              </div>
            </div>
          </div>

          {/* ─── Rincian Angsuran ─────────────────────── */}
          <div className="mb-4 print:mb-2 print:break-inside-avoid">
            <div className="bg-blue-50 border border-blue-200 rounded-lg overflow-hidden">
              <div className="text-xs font-semibold text-blue-700 px-3 py-1.5 border-b border-blue-200">RINCIAN ANGSURAN</div>
              <div className="grid grid-cols-4 gap-px bg-blue-100 text-sm">
                <div className="bg-blue-50 px-3 py-2 font-medium text-gray-600">Angsuran Pokok / Bulan</div>
                <div className="bg-blue-50 px-3 py-2 text-right font-semibold">Rp {fmt(data.angsuran)}</div>
                <div className="bg-blue-50 px-3 py-2 font-medium text-gray-600">Angsuran Bunga / Bulan</div>
                <div className="bg-blue-50 px-3 py-2 text-right font-semibold">Rp {fmt(Math.round(data.jumlah * data.bunga / 100))}</div>
                <div className="bg-blue-50 px-3 py-2 font-medium text-gray-600">Simpanan Wajib Kapitalisasi</div>
                <div className="bg-blue-50 px-3 py-2 text-right font-semibold">Rp {fmt(data.opsiSwk === '1%' ? Math.round(data.jumlah * 0.01) : data.opsiSwk === 'flat' ? 25000 : 0)}</div>
                <div className="col-span-2 bg-blue-600 text-white px-3 py-2 font-bold text-center">TOTAL ANGSURAN / BULAN</div>
                <div className="bg-blue-600 text-white px-3 py-2 text-right font-bold">
                  Rp {fmt(data.angsuran + Math.round(data.jumlah * data.bunga / 100) + (data.opsiSwk === '1%' ? Math.round(data.jumlah * 0.01) : data.opsiSwk === 'flat' ? 25000 : 0))}
                </div>
              </div>
            </div>
          </div>

          {/* ─── Total Diterima ─────────────────────────── */}
          <div className="mb-6 print:mb-4 print:break-inside-avoid">
            <div className="bg-blue-600 text-white rounded-lg overflow-hidden">
              <div className="flex justify-between items-center px-5 py-3">
                <span className="font-bold text-lg tracking-wide">TOTAL DITERIMA ANGGOTA</span>
                <span className="text-2xl font-black tracking-wider">Rp {fmt(data.netto)}</span>
              </div>
            </div>
          </div>

          {/* ─── Detail Agunan ──────────────────────────── */}
          {data.jenisAgunan && (
            <div className="mb-6 print:mb-4 print:break-inside-avoid">
              <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                <div className="text-xs font-semibold text-gray-700 px-3 py-1.5 border-b border-gray-200">DETAIL AGUNAN — {data.jenisAgunan.toUpperCase()}</div>
                <div className="p-4 text-sm space-y-1">
                  {data.pemilikAgunan && <div className="flex"><span className="w-44 font-medium text-gray-600">Nama Pemilik Agunan</span><span className="font-semibold">: {data.pemilikAgunan}</span></div>}
                  {data.nilaiPasarAgunan !== undefined && <div className="flex"><span className="w-44 font-medium text-gray-600">Nilai Pasar Agunan</span><span>: Rp {fmt(data.nilaiPasarAgunan)}</span></div>}
                  {data.nilaiLikuidasiAgunan !== undefined && <div className="flex"><span className="w-44 font-medium text-gray-600">Nilai Likuidasi Agunan</span><span>: Rp {fmt(data.nilaiLikuidasiAgunan)}</span></div>}
                  {data.agunanMencukupi !== undefined && (
                    <div className="flex">
                      <span className="w-44 font-medium text-gray-600">Status Agunan</span>
                      <span className={data.agunanMencukupi ? 'px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700' : 'px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700'}>
                        {data.agunanMencukupi ? '✓ CUKUP MENGCOVER' : '✗ TIDAK CUKUP MENGCOVER'}
                      </span>
                    </div>
                  )}
                  {agunan && (
                    <>
                      {data.aktaNoSertifikat && <div className="flex"><span className="w-44 font-medium text-gray-600">No. Sertifikat</span><span>: {data.aktaNoSertifikat}</span></div>}
                      {data.aktaLuasTanah && <div className="flex"><span className="w-44 font-medium text-gray-600">Luas Tanah</span><span>: {data.aktaLuasTanah} m²</span></div>}
                      {data.aktaLuasBangunan && <div className="flex"><span className="w-44 font-medium text-gray-600">Luas Bangunan</span><span>: {data.aktaLuasBangunan} m²</span></div>}
                      {data.aktaLokasi && <div className="flex"><span className="w-44 font-medium text-gray-600">Lokasi</span><span>: {data.aktaLokasi}</span></div>}
                    </>
                  )}
                  {isKendaraan && (
                    <>
                      {data.bpkbMerkMbl && <div className="flex"><span className="w-44 font-medium text-gray-600">Merk / Model</span><span>: {data.bpkbMerkMbl} {data.bpkbTipeMbl ? '/ ' + data.bpkbTipeMbl : ''}</span></div>}
                      {data.bpkbTahun && <div className="flex"><span className="w-44 font-medium text-gray-600">Tahun</span><span>: {data.bpkbTahun}</span></div>}
                      {data.bpkbNoRangka && <div className="flex"><span className="w-44 font-medium text-gray-600">No. Rangka</span><span className="font-mono text-xs">: {data.bpkbNoRangka}</span></div>}
                      {data.bpkbNoMesin && <div className="flex"><span className="w-44 font-medium text-gray-600">No. Mesin</span><span className="font-mono text-xs">: {data.bpkbNoMesin}</span></div>}
                      {data.bpkbNoPolisi && <div className="flex"><span className="w-44 font-medium text-gray-600">No. Polisi</span><span className="font-mono">: {data.bpkbNoPolisi}</span></div>}
                      {data.bpkbWarna && <div className="flex"><span className="w-44 font-medium text-gray-600">Warna</span><span>: {data.bpkbWarna}</span></div>}
                    </>
                  )}
                  {(isSimpananAgunan || data.jenisAgunan === 'Pendiri') && (
                    <>
                      {data.simpananNoRekening && <div className="flex"><span className="w-44 font-medium text-gray-600">No. Rekening</span><span className="font-mono text-xs">: {data.simpananNoRekening}</span></div>}
                      {data.simpananMasaBerjangka && <div className="flex"><span className="w-44 font-medium text-gray-600">Masa Berjangka / Ket.</span><span>: {data.simpananMasaBerjangka}</span></div>}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ─── Catatan ────────────────────────────────── */}
          <div className="mb-8 print:mb-6 print:break-inside-avoid text-xs text-gray-400 italic text-center">
            Kwitansi ini digenerate otomatis oleh sistem KSP Mulia Dana Sejahtera.
          </div>

          {/* ─── Footer ────────────────────────────────── */}
          <div className="flex justify-between items-end pt-2 border-t print:hidden">
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-1" /> Tutup
            </Button>
            <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Printer className="w-4 h-4 mr-1" /> Cetak Kwitansi
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
