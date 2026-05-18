import { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Promosi Ekonomi Anggota - KSP Mulia Dana Sejahtera",
}

export default function PromosiEkonomiPage() {
  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Laporan Promosi Ekonomi Anggota</h1>
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
            <CardTitle>Laporan Promosi Ekonomi Anggota</CardTitle>
            <CardDescription>Laporan khusus koperasi yang mengukur manfaat ekonomi yang diterima langsung oleh anggota</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="prose">
                <p><strong>PENGERTIAN</strong></p>
                <p>Laporan Promosi Ekonomi Anggota adalah laporan khusus koperasi yang mengukur manfaat ekonomi yang diterima langsung oleh anggota sebagai hasil transaksi dengan koperasi, dibandingkan jika mereka melakukan transaksi dengan pihak lain (bank, lembaga keuangan lain, atau sumber daya informal).</p>
                
                <h2 className="mt-6 text-xl font-semibold">MANFAAT EKONOMI ANGGOTA</h2>
                
                <h3 className="mt-4 text-lg font-semibold">1. Penghematan Biaya Pinjaman</h3>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Rata-rata bunga pinjaman KSP: 0% per bulan (belum ada data)</li>
                  <li>Rata-rata bunga pinjaman di lembaga keuangan lain: 0% per bulan (belum ada perbandingan)</li>
                  <li>Selisih bunga yang dihemat oleh anggota: 0% per bulan</li>
                  <li>Total pinjaman anggota sepanjang tahun: Rp 0</li>
                  <li><strong>Penghematan biaya pinjaman:</strong> Rp 0 × 0% × 12 bulan = Rp 0</li>
                </ul>
                
                <h3 className="mt-4 text-lg font-semibold">2. Bonus Jasa Simpanan</h3>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Rata-rata simpanan anggota: Rp 0</li>
                  <li>Margin hasil usaha KSP yang dapat dibagikan: 0% per tahun</li>
                  <li><strong>Bonus jasa simpanan:</strong> Rp 0 × 0% = Rp 0</li>
                </ul>
                
                <h3 className="mt-4 text-lg font-semibold">3. Layanan Tambahan yang Diberikan Gratis</h3>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Administrasi pengajuan pinjaman: Rp 0</li>
                  <li>Konsultasi keuangan anggota: Rp 0</li>
                  <li>Pendidikan dan pelatihan keuangan: Rp 0</li>
                  <li><strong>Nilai layanan tambahan:</strong> Rp 0</li>
                </ul>
                
                <h2 className="mt-6 text-xl font-semibold">TOTAL MANFAAT EKONOMI ANGGOTA</h2>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2">
                  <p className="flex justify-between"><span>Penghematan biaya pinjaman:</span> <span className="font-medium">Rp 0</span></p>
                  <p className="flex justify-between"><span>Bonus jasa simpanan:</span> <span className="font-medium">Rp 0</span></p>
                  <p className="flex justify-between"><span>Layanan tambahan:</span> <span className="font-medium">Rp 0</span></p>
                  <div className="mt-2 pt-2 border-t">
                    <p className="flex justify-between text-lg font-bold">
                      <span>Jumlah total manfaat ekonomi anggota:</span> <span className="text-lg font-bold">Rp 0</span>
                    </p>
                  </div>
                </div>
                
                <h2 className="mt-6 text-xl font-semibold">PENJELASAN</h2>
                <p>Laporan ini menunjukkan bahwa selama satu tahun, anggota KSP XYZ secara koleksi mendapatkan manfaat ekonomi sebesar Rp 0 dari bertransaksi dengan koperasi karena belum ada data transaksi yang tercatat. Manfaat ekonomi akan terlihat setelah ada data transaksi anggota.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}