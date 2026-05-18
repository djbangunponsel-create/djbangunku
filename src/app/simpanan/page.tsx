import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Search, Edit, Trash2, Home } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Simpanan - KSP Mulia Dana Sejahtera",
}

const simpananData = [
  { id: "TS001", anggota: "Ahmad Sutrisno", tipe: "Simpanan Pokok", jumlah: 1000000, tanggal: "2024-01-15", status: "Aktif" },
  { id: "TS002", anggota: "Siti Aisyah", tipe: "Simpanan Wajib", jumlah: 500000, tanggal: "2024-02-20", status: "Aktif" },
  { id: "TS003", anggota: "Budi Santoso", tipe: "Simpanan Sukarela", jumlah: 2750000, tanggal: "2024-03-10", status: "Aktif" },
  { id: "TS004", anggota: "Rina Wijaya", tipe: "Simpanan Wajib", jumlah: 500000, tanggal: "2024-02-28", status: "Aktif" },
]

export default function SimpananPage() {
  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Data Simpanan</h1>
              <p className="text-sm text-gray-600">Kelola simpanan anggota KSP</p>
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
              <CardTitle className="text-sm">Total Simpanan Pokok</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">Rp 128 Jt</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Simpanan Wajib</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">Rp 64 Jt</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Simpanan Sukarela</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">Rp 260 Jt</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Semua Simpanan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">Rp 452 Jt</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Transaksi Simpanan</CardTitle>
            <CardDescription>Total 1.245 transaksi simpanan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Cari transaksi..." className="pl-10" />
              </div>
              <Button variant="outline">Filter</Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Transaksi</TableHead>
                  <TableHead>Anggota</TableHead>
                  <TableHead>Tipe Simpanan</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {simpananData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.anggota}</TableCell>
                    <TableCell>{item.tipe}</TableCell>
                    <TableCell>Rp {item.jumlah.toLocaleString('id-ID')}</TableCell>
                    <TableCell>{item.tanggal}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
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