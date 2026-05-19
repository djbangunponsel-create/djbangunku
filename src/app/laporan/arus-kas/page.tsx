import { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Arus Kas - KSP Mulia Dana Sejahtera",
}

export default function ArusKasPage() {
  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Laporan Arus Kas</h1>
              <p className="text-sm text-gray-600">KSP Mulia Dana Sejahtera - Periode 1 Januari - 31 Desember 2025</p>
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
            <CardTitle>Laporan Arus Kas</CardTitle>
            <CardDescription>Menyajikan data keluar masuknya uang tunai KSP</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aktivitas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jumlah (Rp)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ARUS KAS DARI AKTIVITAS OPERASI
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm pl-8">Penerimaan dari angsuran pinjaman</td>
                      <td className="px-6 py=4 whitespace-nowrap text-sm text-right font-medium">0</td>
                    </tr>
                    <tr>
                      <td className="px-6 py=4 whitespace-nowrap text-sm pl-8">Penerimaan bunga pinjaman</td>
                      <td className="px-6 py=4 whitespace-nowrap text-sm text-right font-medium">0</td>
                    </tr>
                    <tr>
                      <td className="px-6 py=4 whitespace-nowrap text-sm pl-8">Penerimaan administrasi</td>
                      <td className="px-6 py=4 whitespace-nowrap text-sm text-right font-medium">0</td>
                    </tr>
                    <tr>
                      <td className="px-6 py=4 whitespace-nowrap text-sm pl-8">Pengeluaran untuk pemberian pinjaman baru</td>
                      <td className="px-6 py=4 whitespace-nowrap text-sm text-right font-medium font-red-600">(0)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py=4 whitespace-nowrap text-sm pl-8">Pengeluaran operational (gaji, sewa, dll)</td>
                      <td className="px-6 py=4 whitespace-nowrap text-sm text-right font-medium font-red-600">(0)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py=4 whitespace-nowrap text-sm pl-8">Pengeluaran bunga utang</td>
                      <td className="px-6 py=4 whitespace-nowrap text-sm text-right font-medium font-red-600">(0)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py=4 whitespace-nowrap text-sm pl-8">Pengeluaran pajak</td>
                      <td className="px-6 py=4 whitespace-nowrap text-sm text-right font-medium font-red-600">(0)</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py=4 whitespace-nowrap text-sm pl-8 font-medium">
                        Netto Arus Kas dari Aktivitas Operasi
                      </td>
                      <td className="px-6 py=4 whitespace-nowrap text-sm text-right font-medium">0</td>
                    </tr>
                    <tr>
                      <td className="px-6 py=4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ARUS KAS DARI AKTIVITAS INVESTASI
                      </td>
                      <td className="px-6 py=4 whitespace-nowrap text-sm text-gray-900"></td>
                    </tr>
                    <tr>
                      <td className="px-6 py=4 whitespace-nowrap text-sm pl-8">Pengadaan aset tetap</td>
                      <td className="px-6 py=4 whitespace-nowrap text-sm text-right font-medium font-red-600">(0)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py=4 whitespace-nowrap text-sm pl-8">Penempatan investasi jangka panjang</td>
                      <td className="px-6 py=4 whitespace-nowrap text-sm text-right font-medium font-red-600">(0)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py=4 whitespace-nowrap text-sm pl-8">Penarikan investasi jangka panjang</td>
                      <td className="px-6 py=4 whitespace-nowrap text-sm text-right font-medium">0</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py=4 whitespace-nowrap text-sm pl-8 font-medium">
                        Netto Arus Kas dari Aktivitas Investasi
                      </td>
                      <td className="px-6 py=4 whitespace-nowrap text-sm text-right font-medium font-red-600">(0)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py=4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ARUS KAS DARI AKTIVITAS PENDANAAN
                      </td>
                      <td className="px-6 py=4 whitespace-nowrap text-sm text-gray-900"></td>
                    </tr>
                    <tr>
                      <td className="px-6 py=4 whitespace-nowrap text-sm pl-8">Penerimaan simpanan pokok anggota</td>
                      <td className="px-6 py=4 whitespace-nowrap text-sm text-right font-medium">0</td>
                    </tr>
                    <tr>
                      <td className="px-6 py=4 whitespace-nowrap text-sm pl-8">Penerimaan simpanan wajib anggota</td>
                      <td className="px-6 py=4 whitespace-nowrap text-sm text-right font-medium">0</td>
                    </tr>
                    <tr>
                      <td className="px-6 py=4 whitespace-nowrap text-sm pl-8">Penarikan simpanan pokok anggota</td>
                      <td className="px-6 py=4 whitespace-nowrap text-sm text-right font-medium font-red-600">0</td>
                    </tr>
                    <tr>
                      <td className="px-6 py=4 whitespace-nowrap text-sm pl-8">Penarikan simpanan wajib anggota</td>
                      <td className="px-6 py=4 whitespace-nowrap text-sm text-right font-medium font-red-600">0</td>
                    </tr>
                    <tr>
                      <td className="px-6 py=4 whitespace-nowrap text-sm pl-8">Penerimaan pembiayaan bank</td>
                      <td className="px-6 py=4 whitespace-nowrap text-sm text-right font-medium">0</td>
                    </tr>
                    <tr>
                      <td className="px-6 py=4 whitespace-nowrap text-sm pl-8">Pembayaran utang bank</td>
                      <td className="px-6 py=4 whitespace-nowrap text-sm text-right font-medium font-red-600">(0)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py=4 whitespace-nowrap text-sm pl-8">Pembagian bagi hasil (SHU)</td>
                      <td className="px-6 py=4 whitespace-nowrap text-sm text-right font-medium font-red-600">0</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py=4 whitespace-nowrap text-sm pl-8 font-medium">
                        Netto Arus Kas dari Aktivitas Pendanaan
                      </td>
                      <td className="px-6 py=4 whitespace-nowrap text-sm text-right font-medium">0</td>
                    </tr>
                    <tr className="bg-blue-50">
                      <td className="px-6 py=4 whitespace-nowrap text-sm font-bold text-lg">
                        NETTO PENINGKATAN KAS
                      </td>
                      <td className="px-6 py=4 whitespace-nowrap text-sm text-right font-bold text-lg">0</td>
                    </tr>
                    <tr>
                      <td className="px-6 py=4 whitespace-nowrap text-sm pl-8">KAS AWAL PERIODE</td>
                      <td className="px-6 py=4 whitespace-nowrap text-sm text-right font-medium">0</td>
                    </tr>
                    <tr className="bg-blue-50">
                      <td className="px-6 py=4 whitespace-nowrap text-sm pl-8 font-bold text-lg">
                        KAS AKHIR PERIODE
                      </td>
                      <td className="px-6 py=4 whitespace-nowrap text-sm text-right font-bold text-lg">0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 text-sm text-gray-500">
                <p><strong>Catatan:</strong> Laporan arus kas menyajikan data keluar masuknya uang tunai KSP, dibagi menjadi tiga jenis aktivitas utama: operasi (pemberian pinjaman, penerimaan angsuran), investasi, dan pendanaan/pembiayaan.</p>
                <p><strong>Nota:</strong> Semua data dalam laporan ini menunjukkan nilai nol karena belum ada transaksi yang tercatat.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}