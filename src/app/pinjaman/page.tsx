import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Search, Edit, Trash2, Home } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Pinjaman - KSP Mulia Dana Sejahtera",
}

const pinjamanData = [
  { id: "PJ001", anggota: "Siti Aisyah", jumlah: 15000000, bunga: 1.5, tenor: 12, angsuran: 1312500, sisa: 8750000, status: "Aktif" },
  { id: "PJ002", anggota: "Rina Wijaya", jumlah: 22500000, bunga: 1.5, tenor: 24, angsuran: 1015625, sisa: 16300000, status: "Aktif" },
  { id: "PJ003", anggota: "Budi Santoso", jumlah: 10000000, bunga: 1.5, tenor: 10, angsuran: 850000, sisa: 0, status: "Lunas" },
  { id: "PJ004", anggota: "Ahmad Sutrisno", jumlah: 5000000, bunga: 1.5, tenor: 6, angsuran: 425000, sisa: 0, status: "Lunas" },
]

export default function PinjamanPage() {
  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Data Pinjaman</h1>
              <p className="text-sm text-gray-600">Kelola pinjaman anggota KSP</p>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Pinjaman Aktif</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">Rp 298 Jt</div>
              <p className="text-xs text-gray-500">78 pinjaman aktif</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Pinjaman Lunas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">Rp 156 Jt</div>
              <p className="text-xs text-gray-500">42 pinjaman lunas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Angsuran/Bulan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">Rp 22 Jt</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Pendapatan Bunga</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">Rp 4.5 Jt</div>
              <p className="text-xs text-green-600">Tahun ini</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Pinjaman</CardTitle>
            <CardDescription>Total 120 pinjaman</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Cari pinjaman..." className="pl-10" />
              </div>
              <Button variant="outline">Filter</Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Pinjaman</TableHead>
                  <TableHead>Anggota</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Bunga</TableHead>
                  <TableHead>Tenor</TableHead>
                  <TableHead>Angsuran/Bln</TableHead>
                  <TableHead>Sisa</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pinjamanData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.anggota}</TableCell>
                    <TableCell>Rp {item.jumlah.toLocaleString('id-ID')}</TableCell>
                    <TableCell>{item.bunga}%</TableCell>
                    <TableCell>{item.tenor} bln</TableCell>
                    <TableCell>Rp {item.angsuran.toLocaleString('id-ID')}</TableCell>
                    <TableCell>Rp {item.sisa.toLocaleString('id-ID')}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.status === "Aktif" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                      }`}>
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}