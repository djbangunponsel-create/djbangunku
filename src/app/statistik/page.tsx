import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Statistik - KSP Mulia Dana Sejahtera",
}

export default function StatistikPage() {
  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Statistik</h1>
              <p className="text-sm text-gray-600">Grafik dan statistik KSP Mulia Dana Sejahtera</p>
            </div>
            <Link href="/">
              <Button variant="ghost">
                <Home className="w-4 h-4 mr-2" />
                Kembali ke Dashboard
              </Button>
            </Link>
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
              <CardTitle>Grafik Pertumbuhan Anggota</CardTitle>
              <CardDescription>Grafik pertumbuhan 12 bulan terakhir</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-end justify-between gap-1">
                {[65, 78, 85, 92, 88, 95, 102, 108, 115, 120, 125, 128].map((value, i) => (
                  <div key={i} className="flex-1 bg-blue-500 rounded-t" style={{ height: `${(value/130)*100}%` }}></div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Grafik Simpanan per Bulan</CardTitle>
              <CardDescription>Riwayat simpanan 6 bulan terakhir</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-end justify-between gap-1">
                {[380, 410, 395, 425, 440, 452].map((value, i) => (
                  <div key={i} className="flex-1 bg-green-500 rounded-t" style={{ height: `${(value/460)*100}%` }}></div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Komposisi Simpanan</CardTitle>
              <CardDescription>Persentase tipe simpanan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Simpanan Pokok</span>
                    <span>28%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "28%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Simpanan Wajib</span>
                    <span>14%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "14%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Simpanan Sukarela</span>
                    <span>58%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: "58%" }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}