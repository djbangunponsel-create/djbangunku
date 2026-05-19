import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function RegisterAnggotaForm({ onComplete }: { onComplete: () => void }) {
  // Auto-generated anggota number (example format: AG + timestamp)
  const autoAnggotaNo = `AG${Date.now().toString().slice(-6)}`

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Pendaftaran Anggota Baru KSP
      </h1>
      <form className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        {/* Section 1: Data Keanggotaan & Kontak */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Data Keanggotaan & Kontak
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Masuk
              </label>
              <Input type="date" className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                No. Anggota
              </label>
              <Input
                type="text"
                value={autoAnggotaNo}
                readOnly
                className="w-full bg-gray-50"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap
              </label>
              <Input type="text" placeholder="Nama lengkap sesuai KTP" className="w-full" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nomor Telepon
              </label>
              <Input type="tel" placeholder="+62 xxx xxx xxx" className="w-full" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alamat Lengkap
              </label>
              <Input
                type="text"
                placeholder="Alamat lengkap sesuai KTP"
                className="w-full" />
            </div>
          </div>
        </div>

        {/* Section 2: Identitas Pribadi */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Identitas Pribadi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NIK (16 digit)
              </label>
              <Input
                type="text"
                maxLength={16}
                placeholder="16 digit NIK"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Kelamin
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <Input type="radio" name="jenisKelamin" value="L" className="mr-2" />
                  Laki-laki
                </label>
                <label className="flex items-center">
                  <Input type="radio" name="jenisKelamin" value="P" className="mr-2" />
                  Perempuan
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Agama
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">-- Pilih Agama --</option>
                <option value="Islam">Islam</option>
                <option value="Kristen">Kristen</option>
                <option value="Katolik">Katolik</option>
                <option value="Hindu">Hindu</option>
                <option value="Buddha">Buddha</option>
                <option value="Konghucu">Konghucu</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tempat Lahir
              </label>
              <Input type="text" placeholder="Tempat lahir" className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Lahir
              </label>
              <Input type="date" className="w-full" />
            </div>
          </div>
        </div>

        {/* Section 3: Data Keluarga */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Data Keluarga
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status Perkawinan
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">-- Pilih Status --</option>
                <option value="Belum Kawin">Belum Kawin</option>
                <option value="Kawin">Kawin</option>
                <option value="Cerai Hidup">Cerai Hidup</option>
                <option value="Cerai Mati">Cerai Mati</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Pasangan (jika ada)
              </label>
              <Input type="text" placeholder="Nama pasangan" className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jumlah Anak
              </label>
              <Input type="number" min="0" placeholder="Jumlah anak" className="w-full" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Ibu Kandung
              </label>
              <Input type="text" placeholder="Nama ibu kandung" className="w-full" />
            </div>
          </div>
        </div>

        {/* Section 4: Penjamin / Kontak Darurat */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Penjamin / Kontak Darurat
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Saudara
              </label>
              <Input type="text" placeholder="Nama kontak darurat" className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                No. HP Saudara
              </label>
              <Input type="tel" placeholder="Nomor HP kontak darurat" className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hubungan dengan Saudara
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">-- Pilih Hubungan --</option>
                <option value="Orang Tua">Orang Tua</option>
                <option value="Saudara Kandung">Saudara Kandung</option>
                <option value="Saudara Ipuk">Saudara Ipuk</option>
                <option value="Famili">Famili</option>
                <option value="Teman">Teman</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pekerjaan
              </label>
              <Input type="text" placeholder="Pekerjaan kontak darurat" className="w-full" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Penghasilan per Bulan (Rp)
              </label>
              <div className="flex items-baseline space-x-2">
                <span className="text-gray-500">Rp</span>
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  className="w-full text-right"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onComplete}>
            Batal
          </Button>
          <Button variant="default" onClick={onComplete}>
            Simpan Data
          </Button>
        </div>
      </form>
    </div>
  )
}