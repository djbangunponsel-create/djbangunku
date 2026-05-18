import { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Perubahan Ekuitas - KSP Mulia Dana Sejahtera",
}

export default function PerubahanEkuitasPage() {
  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Laporan Perubahan Ekuitas (Modal)</h1>
              <p className="text-sm text-gray-600">KSP Mulia Dana Sejahtera - Periode 1 Januari - 31 Desember 2025</p>
            </div>
            <Button asChild>
              <Link href="/laporan">
                <FileText className="mr-2 h-4 w-4" />
                Kembali ke Laporan
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Laporan Perubahan Ekuitas (Modal)</CardTitle>
            <CardDescription>Menunjukkan perubahan saldo modal KSP selama satu periode</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Uraian
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jumlah (Rp)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        SALDO EKUITAS AWAL (1 Januari 2025)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8">Simpanan Pokok/Modal Tetap</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">130.000.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8">Simpanan Wajib/Modal Tambahan</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">80.000.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8">Cadangan Umum</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">20.000.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8">Cadangan Bakan</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">10.000.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8">Hibah</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">5.000.000</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8 font-medium">
                        Jumlah Saldo Ekuitas Awal
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">245.000.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        PERUBAHAN SELAMA PERIODE
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8">Penambahan</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm"></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-10">Setoran Simpanan Pokok Baru</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">20.000.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-10">Setoran Simpanan Wajib Baru</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">20.000.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-10">Cadangan Umum dari SHU Tahun Berjalan</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">10.000.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-10">Cadangan Bakan dari SHU Tahun Berjalan</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">5.000.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-10">Hibah Baru</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">0.000.000</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8 font-medium">
                        Jumlah Penambahan
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">55.000.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8">Pengurangan</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm"></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-10">Penarikan Simpanan Pokok</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">0.000.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-10">Penarikan Simpanan Wajib</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">0.000.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-10">Pembagian SHU (Bagi Hasil)</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">0.000.000</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8 font-medium">
                        Jumlah Pengurangan
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">0.000.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-lg">
                        SALDO EKUITAS AKHIR (31 Desember 2025)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-lg"></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8">Simpanan Pokok/Modal Tetap</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">150.000.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8">Simpanan Wajib/Modal Tambahan</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">100.000.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8">Cadangan Umum</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">30.000.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8">Cadangan Bakan</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">15.000.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8">Hibah</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">5.000.000</td>
                    </tr>
                    <tr className="bg-blue-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8 font-bold text-lg">
                        Jumlah Saldo Ekuitas Akhir
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-lg">300.000.000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 text-sm text-gray-500">
                <p><strong>Catatan:</strong> Laporan perubahan ekuitas menunjukkan perubahan saldo modal KSP selama satu periode, mencatat mutasi penambahan simpanan pokok, simpanan wajib, akumulasi cadangan, hingga pembagian SHU.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}