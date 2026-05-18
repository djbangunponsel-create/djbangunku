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
                  <li>Rata-rata bunga pinjaman KSP: 1% per bulan (efektif)</li>
                  <li>Rata-rata bunga pinjaman di lembaga keuangan lain: 2.5% per bulan</li>
                  <li>Selisih bunga yang dihemat oleh anggota: 1.5% per bulan</li>
                  <li>Total pinjaman anggota sepanjang tahun: Rp 350.000.000</li>
                  <li><strong>Penghematan biaya pinjaman:</strong> Rp 350.000.000 × 1.5% × 12 bulan = Rp 63.000.000</li>
                </ul>
                
                <h3 className="mt-4 text-lg font-semibold">2. Bonus Jasa Simpanan</h3>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Rata-rata simpanan anggota: Rp 200.000.000</li>
                  <li>Margin hasil usaha KSP yang dapat dibagikan: 5% per tahun</li>
                  <li><strong>Bonus jasa simpanan:</strong> Rp 200.000.000 × 5% = Rp 10.000.000</li>
                </ul>
                
                <h3 className="mt-4 text-lg font-semibold">3. Layanan Tambahan yang Diberikan Gratis</h3>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Administrasi pengajuan pinjaman: Rp 2.000.000</li>
                  <li>Konsultasi keuangan anggota: Rp 1.500.000</li>
                  <li>Pendidikan dan pelatihan keuangan: Rp 3.000.000</li>
                  <li><strong>Nilai layanan tambahan:</strong> Rp 6.500.000</li>
                </ul>
                
                <h2 className="mt-6 text-xl font-semibold">TOTAL MANFAAT EKONOMI ANGGOTA</h2>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2">
                  <p className="flex justify-between"><span>Penghematan biaya pinjaman:</span> <span className="font-medium">Rp 63.000.000</span></p>
                  <p className="flex justify-between"><span>Bonus jasa simpanan:</span> <span className="font-medium">Rp 10.000.000</span></p>
                  <p className="flex justify-between"><span>Layanan tambahan:</span> <span className="font-medium">Rp 6.500.000</span></p>
                  <div className="mt-2 pt-2 border-t">
                    <p className="flex justify-between text-lg font-bold">
                      <span>Jumlah total manfaat ekonomi anggota:</span> <span className="text-lg font-bold">Rp 79.500.000</span>
                    </p>
                  </div>
                </div>
                
                <h2 className="mt-6 text-xl font-semibold">PENJELASAN</h2>
                <p>Laporan ini menunjukkan bahwa selama satu tahun, anggota KSP XYZ secara koleksi mendapatkan manfaat ekonomi sebesar Rp 79.500.000 dari bertransaksi dengan koperasi, yang terdiri dari:</p>
                <ol className="list-decimal list-inside mt-2 space-y-2">
                  <li>Penghematan bunga pinjaman karena koperasi memberikan suku bunga yang lebih rendah dibandingkan pasar</li>
                  <li>Bonus jasa simpanan berupa bagian dari hasil usaha yang dibagikan kepada anggota</li>
                  <li>Nilai layanan tambahan yang disediakan koperasi secara gratis atau dengan biaya minimal</li>
                </ol>
                <p>Manfaat ini merupakan salah satu landasan koperasi menjalankan prinsip kepentingan anggota sebagai prioritas utama.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}