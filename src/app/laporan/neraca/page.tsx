import { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Neraca - KSP Mulia Dana Sejahtera",
}

export default function NeracaPage() {
  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Neraca</h1>
              <p className="text-sm text-gray-600">Laporan Posisi Keuangan KSP Mulia Dana Sejahtera</p>
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
            <CardTitle>Laporan Posisi Keuangan (Neraca)</CardTitle>
            <CardDescription>KSP Mulia Dana Sejahtera - Periode 31 Desember 2025</CardDescription>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nominal (Rp)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        AKTIVA
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8">
                        Aktiva Lancar
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm"></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-10">Kas</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">50.000.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-10">Piutang Pinjaman Anggota</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">200.000.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-10">Piutang Bunga</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">20.000.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-10">Persediaan</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">10.000.000</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8 font-medium">
                        Jumlah Aktiva Lancar
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">280.000.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8">
                        Aktiva Tidak Lancar
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm"></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-10">Investasi Jangka Panjang</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">100.000.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-10">Aset Tetap (netto)</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">120.000.000</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8 font-medium">
                        Jumlah Aktiva Tidak Lancar
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">220.000.000</td>
                    </tr>
                    <tr className="bg-blue-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-lg">
                        JUMLAH AKTIVA
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-lg">500.000.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        KEWAJIBAN DAN EKUITAS
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8">
                        Kewajiban Jangka Pendek
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm"></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-10">Utang Jangka Pendek</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">30.000.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-10">Utang Bunga</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">10.000.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-10">Cadangan Korto</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">10.000.000</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8 font-medium">
                        Jumlah Kewajiban Jangka Pendek
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">50.000.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8">
                        Kewajiban Jangka Panjang
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm"></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-10">Utang Jangka Panjang</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">100.000.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-10">Imbalan Kerja</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">50.000.000</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8 font-medium">
                        Jumlah Kewajiban Jangka Panjang
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">150.000.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8">
                        Ekuitas
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm"></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-10">Simpanan Pokok/Modal Tetap</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">150.000.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-10">Simpanan Wajib/Modal Tambahan</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">100.000.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-10">Cadangan Umum</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">30.000.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-10">Cadangan Bakan</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">15.000.000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-10">Hibah</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">5.000.000</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8 font-medium">
                        Jumlah Ekuitas
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">300.000.000</td>
                    </tr>
                    <tr className="bg-blue-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-lg">
                        JUMLAH KEWAJIBAN DAN EKUITAS
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-lg">500.000.000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 text-sm text-gray-500">
                <p><strong>Catatan:</strong> Laporan posisi keuangan menunjukkan kondisi keuangan KSP pada tanggal tertentu, mencakup aset, kewajiban/utang, dan ekuitas/modal sesuai dengan standar akuntansi koperasi.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}