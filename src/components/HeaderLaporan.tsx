'use client';

interface HeaderLaporanProps {
  nama?: string;
  badanHukum?: string;
  alamat?: string;
  telepon?: string;
  email?: string;
  logo?: string;
  judul: string;
  periode?: string;
  tahunIni?: number;
  tahunLalu?: number;
}

export function HeaderLaporan({
  nama = 'KSP Mulia Dana Sejahtera',
  badanHukum,
  alamat,
  telepon,
  email,
  logo,
  judul,
  periode,
  tahunIni,
  tahunLalu,
}: HeaderLaporanProps) {
  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">{judul}</h1>
      <p className="text-sm text-gray-600 mb-6">
        {nama}
        {alamat && (
          <> — {alamat}</>
        )}
        {periode && (
          <> — {periode}</>
        )}
      </p>
      <div className="text-center border-b-2 border-double border-gray-400 pb-2 mb-4 print:mb-2 hidden print:block">
        {logo && (
          <img
            src={logo}
            alt="Logo KSP"
            className="w-10 h-10 object-contain mx-auto mb-0.5"
          />
        )}
        <p className="text-xs font-bold tracking-wide">{nama}</p>
        <p className="text-[9px] text-gray-500 leading-tight">{alamat}</p>
        {badanHukum && <p className="text-[9px] text-gray-500">Badan Hukum: {badanHukum}</p>}
        {telepon && <p className="text-[9px] text-gray-500">Telp. {telepon}</p>}
        {email && <p className="text-[9px] text-gray-500">Email: {email}</p>}
      </div>
    </>
  );
}