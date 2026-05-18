"use client";

import Link from "next/link";
import { Users, Wallet, FileText, BarChart3, CreditCard, PiggyBank, TrendingUp, UserPlus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Data Anggota",
    description: "Kelola data anggota KSP",
    icon: Users,
    href: "/anggota",
    color: "bg-blue-500",
  },
  {
    title: "Simpanan",
    description: "Kelola simpanan anggota",
    icon: PiggyBank,
    href: "/simpanan",
    color: "bg-green-500",
  },
  {
    title: "Pinjaman",
    description: "Kelola pinjaman anggota",
    icon: CreditCard,
    href: "/pinjaman",
    color: "bg-orange-500",
  },
  {
    title: "Laporan",
    description: "Lihat laporan keuangan",
    icon: FileText,
    href: "/laporan",
    color: "bg-purple-500",
  },
  {
    title: "Statistik",
    description: "Statistik dan grafik",
    icon: BarChart3,
    href: "/statistik",
    color: "bg-indigo-500",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">KSP Mulia Dana Sejahtera</h1>
              <p className="text-sm text-gray-600">Aplikasi Koperasi Simpan Pinjam</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <UserPlus className="w-4 h-4 mr-2" />
                Tambah Anggota Baru
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${item.color} flex items-center justify-center mb-2`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Anggota</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">128</div>
              <p className="text-xs text-gray-500">+5 bulan ini</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Simpanan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp 452 Jt</div>
              <p className="text-xs text-green-600">+12% dari bulan lalu</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Pinjaman</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp 298 Jt</div>
              <p className="text-xs text-gray-500">78 pinjaman aktif</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}