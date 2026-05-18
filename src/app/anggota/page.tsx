import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Search, Edit, Trash2, Home } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Data Anggota - KSP Mulia Dana Sejahtera",
}

const anggotaData = [
  { id: "AG001", nama: "Ahmad Sutrisno", nik: "3201234567890001", telepon: "081234567890", alamat: "Jl. Merdeka No. 12", simpanan: 5500000, pinjaman: 0 },
  { id: "AG002", nama: "Siti Aisyah", nik: "3201234567890002", telepon: "081234567891", alamat: "Jl. Pemuda No. 45", simpanan: 3200000, pinjaman: 15000000 },
  { id: "AG003", nama: "Budi Santoso", nik: "3201234567890003", telepon: "081234567892", alamat: "Jl. Diponegoro No. 67", simpanan: 2750000, pinjaman: 0 },
  { id: "AG004", nama: "Rina Wijaya", nik: "3201234567890004", telepon: "081234567893", alamat: "Jl. Gatot Subroto No. 89", simpanan: 4100000, pinjaman: 22500000 },
  { id: "AG005", nama: "Dedi Kurniawan", nik: "3201234567890005", telepon: "081234567894", alamat: "Jl. Ahmad Dahlan No. 23", simpanan: 1800000, pinjaman: 0 },
]

export default function AnggotaPage() {
  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Data Anggota</h1>
              <p className="text-sm text-gray-600">Kelola data anggota KSP Mulia Dana Sejahtera</p>
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
            <Button variant="default" asChild><Link href="/anggota">Data Anggota</Link></Button>
            <Button variant="ghost" asChild><Link href="/simpanan">Simpanan</Link></Button>
            <Button variant="ghost" asChild><Link href="/pinjaman">Pinjaman</Link></Button>
            <Button variant="ghost" asChild><Link href="/laporan">Laporan</Link></Button>
            <Button variant="ghost" asChild><Link href="/statistik">Statistik</Link></Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Daftar Anggota</CardTitle>
            <CardDescription>Total 128 anggota terdaftar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Cari anggota..." className="pl-10" />
              </div>
              <Button variant="outline">Filter</Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Anggota</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>NIK</TableHead>
                  <TableHead>Telepon</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>Simpanan</TableHead>
                  <TableHead>Pinjaman</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {anggotaData.map((anggota) => (
                  <TableRow key={anggota.id}>
                    <TableCell className="font-medium">{anggota.id}</TableCell>
                    <TableCell>{anggota.nama}</TableCell>
                    <TableCell>{anggota.nik}</TableCell>
                    <TableCell>{anggota.telepon}</TableCell>
                    <TableCell>{anggota.alamat}</TableCell>
                    <TableCell>Rp {anggota.simpanan.toLocaleString('id-ID')}</TableCell>
                    <TableCell>Rp {anggota.pinjaman.toLocaleString('id-ID')}</TableCell>
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