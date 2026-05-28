import { Metadata } from "next";
import { getPengaturanServer } from "@/lib/server-pengaturan";

export const metadata: Metadata = {
  title: "Neraca - KSP",
};

export default async function NeracaPage() {
  const settings = await getPengaturanServer();
  const namaKsp = settings?.namaKsp || 'KSP Mulia Dana Sejahtera';
  const alamat = settings?.alamat || 'Desa Sungai Bundung, Kecamatan Marabahan, Kabupaten Barito Kuala';
  const logo = settings?.logo || '';
  const telepon = settings?.telepon || '';
  const badanHukum = settings?.badanHukum || '';
  const email = settings?.email || '';

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-6 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Neraca</h1>
        <p className="text-sm text-gray-600 mb-6">
          {namaKsp} — {alamat}
        </p>
        <div className="text-center border-b-2 border-double border-gray-400 pb-2 mb-4 print:mb-2 hidden print:block">
          {logo && (
            <img
              src={logo}
              alt="Logo KSP"
              className="w-10 h-10 object-contain mx-auto mb-0.5"
            />
          )}
          <p className="text-xs font-bold tracking-wide">{namaKsp}</p>
          <p className="text-[9px] text-gray-500 leading-tight">{alamat}</p>
          {badanHukum && <p className="text-[9px] text-gray-500">Badan Hukum: {badanHukum}</p>}
          {telepon && <p className="text-[9px] text-gray-500">Telp. {telepon}</p>}
          {email && <p className="text-[9px] text-gray-500">Email: {email}</p>}
        </div>
        <p className="text-sm text-gray-500">Laporan Neraca belum diimplementasikan. Data KSP ({namaKsp}) telah dimuat.</p>
      </main>
    </div>
  );
}
