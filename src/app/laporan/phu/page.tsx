import { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "PHU - KSP Mulia Dana Sejahtera",
}

export default function PhuPage() {
  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Laporan Perhitungan Hasil Usaha (PHU)</h1>
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
            <CardTitle>Laporan Perhitungan Hasil Usaha (PHU)</CardTitle>
            <CardDescription>Menghitung Sisa Hasil Usaha (SHU) yang diperoleh dalam satu periode akuntansi</CardDescription>
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
                        Nominal (Rp)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        PENDAPATAN OPERASIONAL
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8">Pendapatan Bunga Pinjaman</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">45.000.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8">Pendapatan Administrasi</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">5.000.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8">Pendapatan Lain-lain</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">2.000.000</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8 font-medium">
                        Jumlah Pendapatan Operasional
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">52.000.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        BEBAN OPERASIONAL
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8">Beban Gaji</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">15.000.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8">Beban Sewa</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">6.000.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8">Beban Listrik dan Air</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">2.000.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8">Beban Telekomunikasi</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">1.500.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8">Beban Perlengkapan Kantor</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">1.000.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8">Beban Penyusutan Aset Tetap</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">8.000.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8">Beban Umum dan Administrasi</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">3.000.000</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8 font-medium">
                        Jumlah Beban Operasional
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">36.500.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        SISA HASIL USAHA SEBELUM PAJAK
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">15.500.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8">Beban Pajak Penghasilan Badan (22%)</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">3.410.000</td>
                    </tr>
                    <tr className="bg-blue-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-lg">
                        SISA HASIL USAHA (SHU)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-lg">12.090.000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 text-sm text-gray-500">
                <p><strong>Catatan:</strong> Laporan perhitungan hasil usaha menunjukkan kinerja operasional KSP selama satu periode akuntansi, menyandingkan pendapatan operasional dengan beban operasional dan beban pajak untuk mendapatkan Sisa Hasil Usaha (SHU).</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}