import { Metadata } from "next";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, BarChart3, TrendingUp, CreditCard, PiggyBank, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Laporan Keuangan - KSP",
};

interface ReportCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

function ReportCard({ href, icon, title, description, color }: ReportCardProps) {
  return (
    <Link href={href} className="block">
      <Card className="hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]">
        <CardHeader>
          <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-2`}>
            {icon}
          </div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}

export default function LaporanPage() {
  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Laporan Keuangan</h1>
          <p className="text-sm text-gray-600">Laporan lengkap Koperasi Simpan Pinjam</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ReportCard
            href="/laporan/neraca"
            icon={<FileText className="w-6 h-6 text-white" />}
            title="Neraca"
            description="Laporan Posisi Keuangan"
            color="bg-blue-500"
          />
          <ReportCard
            href="/laporan/phu"
            icon={<BarChart3 className="w-6 h-6 text-white" />}
            title="PHU"
            description="Laporan Perhitungan Hasil Usaha"
            color="bg-green-500"
          />
          <ReportCard
            href="/laporan/perubahan-ekuitas"
            icon={<TrendingUp className="w-6 h-6 text-white" />}
            title="Perubahan Ekuitas"
            description="Laporan Perubahan Modal"
            color="bg-purple-500"
          />
          <ReportCard
            href="/laporan/arus-kas"
            icon={<CreditCard className="w-6 h-6 text-white" />}
            title="Arus Kas"
            description="Laporan Arus Kas KSP"
            color="bg-indigo-500"
          />
          <ReportCard
            href="/laporan/promosi-ekonomi"
            icon={<PiggyBank className="w-6 h-6 text-white" />}
            title="Promosi Ekonomi"
            description="Laporan Manfaat Anggota"
            color="bg-pink-500"
          />
          <ReportCard
            href="/laporan/catatan"
            icon={<HelpCircle className="w-6 h-6 text-white" />}
            title="Catatan Laporan"
            description="Catatan Atas Laporan Keuangan"
            color="bg-yellow-500"
          />
        </div>
      </main>
    </div>
  )
}