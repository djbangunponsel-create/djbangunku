import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BarChart3, TrendingUp, CreditCard, PiggyBank, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Laporan Keuangan - KSP",
};

export default function LaporanPage() {
  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Laporan Keuangan</h1>
          <p className="text-sm text-gray-600">Laporan lengkap Koperasi Simpan Pinjam</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        </div>
      </main>
    </div>
  )
}