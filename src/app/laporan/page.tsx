import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Laporan - KSP Mulia Dana Sejahtera",
}

export default function LaporanPage() {
  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Laporan</h1>
              <p className="text-sm text-gray-600">Laporan keuangan KSP Mulia Dana Sejahtera</p>
            </div>
            <Button asChild>
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Kembali ke Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <nav className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto py-2">
            <Button variant="ghost" asChild><Link href="/">Dashboard</Link></Button>
            <Button variant="ghost" asChild><Link href="/anggota">Data Anggota</Link></Button>
            <Button variant="ghost" asChild><Link href="/simpanan">Simpanan</Link></Button>
            <Button variant="ghost" asChild><Link href="/pinjaman">Pinjaman</Link></Button>
            <Button variant="ghost" asChild><Link href="/laporan">Laporan</Link></Button>
            <Button variant="ghost" asChild><Link href="/statistik">Statistik</Link></Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Laporan Keuangan</CardTitle>
              <CardDescription>Laporan kas dan simpanan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Total Kas</p>
                  <p className="text-2xl font-bold">Rp 750 Jt</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Simpanan</p>
                  <p className="text-2xl font-bold">Rp 452 Jt</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Pinjaman</p>
                  <p className="text-2xl font-bold">Rp 298 Jt</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Laporan SHU</CardTitle>
              <CardDescription>Sisa Hasil Usaha</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Pendapatan Bunga Pinjaman</p>
                  <p className="text-2xl font-bold text-green-600">Rp 11.2 Jt</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pendapatan Administrasi</p>
                  <p className="text-2xl font-bold text-green-600">Rp 2.8 Jt</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total SHU</p>
                  <p className="text-2xl font-bold">Rp 14 Jt</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Laporan Anggota</CardTitle>
              <CardDescription>Statistik anggota KSP</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Total Anggota</p>
                  <p className="text-2xl font-bold">128 orang</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Anggota Aktif</p>
                  <p className="text-2xl font-bold">112 orang</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Anggota Baru (30 hari)</p>
                  <p className="text-2xl font-bold text-blue-600">5 orang</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Export Laporan</CardTitle>
              <CardDescription>Unduh laporan dalam format Excel/PDF</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button>Export Excel</Button>
                <Button variant="outline">Export PDF</Button>
                <Button variant="outline">Print</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}