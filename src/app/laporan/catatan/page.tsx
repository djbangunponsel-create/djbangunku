import { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Catatan Atas Laporan Keuangan - KSP Mulia Dana Sejahtera",
}

export default function CatatanLaporanPage() {
  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Catatan Atas Laporan Keuangan</h1>
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
            <CardTitle>Catatan Atas Laporan Keuangan (CALK)</CardTitle>
            <CardDescription>Memberikan penjelasan deskriptif dan rincian angka dari pos-pos laporan di atas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="prose">
                <p><strong>1. PENJELASAN UMUM</strong></p>
                <p>Koperasi Simpan Pinjam (KSP) Mulia Dana Sejahtera adalah koperasi yang berdiri berdasarkan Undang-Undang Nomor 25 Tahun 1992 tentang Koperasi, dengan fokus utama pada layanan simpanan dan pinjaman bagi anggotanya. KSP Mulia Dana Sejahtera telah beroperasi sejak tahun 2020 dan memiliki kantor pusat di [alamat kantor].</p>
                
                <p><strong>2. SUMBER SUMBER KEBIJAKAN AKUNTANSI</strong></p>
                <p>Laporan keuangan disusun sesuai dengan:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Pernyataan Standar Akuntansi Keuangan (PSAK) yang berlaku di Indonesia</li>
                  <li>Pedoman Akuntansi Koperasi yang diterbitkan oleh Kementerian Koperasi dan UKM</li>
                  <li>Peraturan perundang-undangan yang terkait dengan kegususan koperasi</li>
                </ul>
                
                <p><strong>3. PENYAJIAN LAPORAN KEUANGAN</strong></p>
                <ul className="list-disc list-inside mt-2">
                  <li>Mata uang yang digunakan adalah Rupiah (Rp)</li>
                  <li>Angka-angka dalam laporan keuangan dibulatkan ke dalam rupiah penuh</li>
                  <li>Laporan keuangan disusun menggunakan basis akumulasi, kecuali untuk arus kas yang menggunakan basis kas</li>
                </ul>
                
                <p><strong>4. PENJELASAN ATAS AKUN-AKUN YANG MATERIALSE</strong></p>
                
                <h3 className="mt-4 text-lg font-semibold">4.1 Kas</h3>
                <p>Kas terdiri dari:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Kas di kantor: Rp 0</li>
                  <li>Kas di bank: Rp 0</li>
                  <li><strong>Total:</strong> Rp 0</li>
                </ul>
                
                <h3 className="mt-4 text-lg font-semibold">4.2 Piutang Pinjaman Anggota</h3>
                <p>Piutang pinjaman anggota terdiri dari:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Pinjaman jangka pendek (≤ 1 tahun): Rp 0</li>
                  <li>Pinjaman jangka panjang (&gt; 1 tahun): Rp 0</li>
                  <li><strong>Total piutang pinjaman anggota:</strong> Rp 0</li>
                  <li>Cadangan kerugian piutang: Rp 0 (considered adequate based on historical collectibility)</li>
                </ul>
                
                <h3 className="mt-4 text-lg font-semibold">4.3 Aset Tetap</h3>
                <p>Aset tetapt terdiri dari:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Gedung: Rp 0 (akumulasi penyusutan: Rp 0)</li>
                  <li>Kendaraan: Rp 0 (akumulasi penyusutan: Rp 0)</li>
                  <li>Peralatan kantor: Rp 0 (akumulasi penyusutan: Rp 0)</li>
                  <li><strong>Netto aset tetapt:</strong> Rp 0</li>
                </ul>
                
                <h3 className="mt-4 text-lg font-semibold">4.4 Utang</h3>
                <p>Utang terdiri dari:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Utang bank: Rp 0 (jangka panjang) + Rp 0 (jangka pendek)</li>
                  <li>Utang bunga yang masih harus dibayar: Rp 0</li>
                  <li><strong>Total utang:</strong> Rp 0</li>
                </ul>
                
                <h3 className="mt-4 text-lg font-semibold">4.5 Ekuitas</h3>
                <p>Komponen ekuitas:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Simpanan pokok: mewakili modal tetap anggota yang tidak dapat ditarik kecuali anggota keluar</li>
                  <li>Simpanan wajib: setoran wajib anggota yang dapat ditarik dengan ketentuan tertentu</li>
                  <li>Cadangan umum: cadangan untuk menutup kerugian yang mungkin timbul</li>
                  <li>Cadangan bahan: cadangan khusus untuk keperluan tertentu sesuai dengan anggaran dasar</li>
                  <li>Hibah: penerimaan hibah dari pihak pihak yang tidak mengajarkan imbalan</li>
                </ul>
                
                <p><strong>5. PENJELASAN ATAS TRANSAKSI YANG MATERIALSE</strong></p>
                
                <h3 className="mt-4 text-lg font-semibold">5.1 Pendapatan Bunga Pinjaman</h3>
                <p>Pendapatan bunga pinjaman berasal dari:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Pinjaman produktif: Rp 0</li>
                  <li>Pinjaman konsumtif: Rp 0</li>
                  <li>Pinjaman darurat: Rp 0</li>
                  <li><strong>Total:</strong> Rp 0</li>
                </ul>
                
                <h3 className="mt-4 text-lg font-semibold">5.2 Beban Operasional</h3>
                <p>Beban operasional mencakup:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Beban karyawan: Rp 0 (0 orang karyawan tetap)</li>
                  <li>Beban umum dan administrasi: Rp 0</li>
                  <li>Penyusutan: Rp 0</li>
                  <li><strong>Total:</strong> Rp 0</li>
                </ul>
                
                <p><strong>6. PERINGATAN TERHADAP KONTINUITAS USAHA</strong></p>
                <p>Berdasarkan evaluasi manajemen, tidak terdapat indikasi bahwa KSP Mulia Dana Sejahtera akan mengalami kesulitan signifikan dalam menjalankan operasinya di masa depan yang dapat dipertimbangkan sebagai lanjutan usaha (going concern).</p>
                
                <p><strong>7. PERISTIWA TERJADI SETELAH TANGKAL LAPORAN</strong></p>
                <p>Tidak terdapat peristiwa penting yang terjadi setelah tanggal laporan yang perlu divulkanisasi dalam catatan atas laporan keuangan ini.</p>
                
                <p><strong>8. PENGUNGKAPAN TERKAIT PENCARIAN</strong></p>
                <p>Tidak terdapat perkara pencarian yang sedang atau telah selesai yang berpotensi mengakibatkan kerugian finansial yang signifikan bagi KSP Mulia Dana Sejahtera.</p>
                
                <p><strong>9. PARTI BERKAITAN</strong></p>
                <p>Transaksi dengan pihak berkaidang meliputi:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Pinjaman kepada pengurus: Rp 0 (dilarang sesuai dengan anggaran dasar)</li>
                  <li>Transaksi dengan anggota keluarga pengurus: dilakukan pada suku bunga dan syarat pasar yang sama</li>
                </ul>
                
                <p><strong>10. KEPATUHAN TERHADAP PERATURAN PERKOPERASIAN</strong></p>
                <p>KSP Mulia Dana Sejahtera telah mematuhi:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Persyaratan penyimpanan cadangan minimal sesuai dengan peraturan koperasi</li>
                  <li>Kewajiban penyusutan laporan keuangan tahunan</li>
                  <li>Ketentuan mengenai pembagian hasil usaha (SHU) kepada anggota</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}