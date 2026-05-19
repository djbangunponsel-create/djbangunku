import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Ringkasan Anggota - KSP Mulia Dana Sejahtera",
}

interface AnggotaSummary {
  No_Anggota: string
  NAMA_ANGGOTA: string
  Jenis_Kelamin: "Laki-laki" | "Perempuan"
  Agama: string
  NIK: string
  Tempat_Lahir: string
  Tanggal_Lahir: string
  TELEPON: string
  Alamat: string
  Tanggal_Masuk: string
  Status_Perkawinan: string
  Nama_Pasangan?: string
  Jumlah_Anak: number
  Nama_Ibu_Kandung: string
  Nama_Saudara: string
  No_HP_Saudara: string
  Hubungan_Saudara: string
  Pekerjaan?: string
  PENGHASILAN_per_Bulan: number
}

const dummyData: AnggotaSummary[] = []

export default function AnggotaSummaryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Ringkasan Data Anggota KSP
              </h1>
              <p className="text-sm text-gray-600">
                Total {dummyData.length} anggota terdaftar
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/anggota">Kembali ke Daftar</Link>
              </Button>
              <Button asChild>
                <Link href="/anggota/register">+ Tambah Anggota</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Data Master Anggota KSP (19 Kolom)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Anggota</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Anggota</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">JK</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agama</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIK</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tmp Lahir</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Lahir</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telepon</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alamat</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Masuk</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Nikah</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pasangan</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jml Anak</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ibu Kandung</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saudara</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HP Saudara</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hubungan</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pekerjaan</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penghasilan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dummyData.length === 0 ? (
                    <tr>
                      <td colSpan={19} className="px-6 py-4 text-center text-gray-500">
                        Belum ada data anggota. 
                        <Link href="/anggota/register" className="text-blue-600 hover:underline ml-1">
                          Tambah anggota baru
                        </Link>
                      </td>
                    </tr>
                  ) : (
                    dummyData.map((item) => (
                      <tr key={item.No_Anggota}>
                        <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">{item.No_Anggota}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm">{item.NAMA_ANGGOTA}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm">{item.Jenis_Kelamin === "Laki-laki" ? "L" : "P"}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm">{item.Agama}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm">{item.NIK}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm">{item.Tempat_Lahir}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm">{item.Tanggal_Lahir}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm">{item.TELEPON}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm max-w-xs truncate">{item.Alamat}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm">{item.Tanggal_Masuk}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm">{item.Status_Perkawinan}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm">{item.Nama_Pasangan || "-"}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-center">{item.Jumlah_Anak}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm">{item.Nama_Ibu_Kandung}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm">{item.Nama_Saudara}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm">{item.No_HP_Saudara}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm">{item.Hubungan_Saudara}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm">{item.Pekerjaan || "-"}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-right">Rp {item.PENGHASILAN_per_Bulan.toLocaleString('id-ID')}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}