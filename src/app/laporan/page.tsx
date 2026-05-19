import { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, BarChart3, TrendingUp, PiggyBank, CreditCard, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Laporan Keuangan - KSP Mulia Dana Sejahtera",
}

export default function LaporanPage() {
  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Laporan Keuangan</h1>
              <p className="text-sm text-gray-600">Laporan lengkap Koperasi Simpan Pinjam</p>
            </div>
            <Link href="/">
              <Button variant="ghost">
                <Users className="w-4 h-4 mr-2" />
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
            <Button variant="default" asChild><Link href="/laporan">Laporan</Link></Button>
            <Button variant="ghost" asChild><Link href="/statistik">Statistik</Link></Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <Link href="/laporan/neraca">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center mb-2">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>Neraca</CardTitle>
                  <CardDescription>Laporan Posisi Keuangan</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </Card>
          
          <Card>
            <Link href="/laporan/phu">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center mb-2">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>PHU</CardTitle>
                  <CardDescription>Laporan Perhitungan Hasil Usaha</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </Card>
          
          <Card>
            <Link href="/laporan/perubahan-ekuitas">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-purple-500 flex items-center justify-center mb-2">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>Perubahan Ekuitas</CardTitle>
                  <CardDescription>Laporan Perubahan Modal</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </Card>
          
          <Card>
            <Link href="/laporan/arus-kas">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-indigo-500 flex items-center justify-center mb-2">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>Arus Kas</CardTitle>
                  <CardDescription>Laporan Arus Kas KSP</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </Card>
          
          <Card>
            <Link href="/laporan/promosi-ekonomi">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-pink-500 flex items-center justify-center mb-2">
                    <PiggyBank className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>Promosi Ekonomi</CardTitle>
                  <CardDescription>Laporan Manfaat Anggota</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </Card>
          
          <Card>
            <Link href="/laporan/catatan">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-yellow-500 flex items-center justify-center mb-2">
                    <HelpCircle className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>Catatan Laporan</CardTitle>
                  <CardDescription>Catatan Atas Laporan Keuangan</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </Card>
        </div>
      </main>
    </div>
  )
}