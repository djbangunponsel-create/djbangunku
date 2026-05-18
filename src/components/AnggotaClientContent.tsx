'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Search, Edit, Trash2, Home, ArrowLeft, Upload, CheckCircle, X } from 'lucide-react';
import Link from 'next/link';

interface Anggota {
  id: number;
  nama: string;
  nik: string;
  telepon: string;
  alamat: string;
  tanggalMasuk: string; // DD-MM-YYYY
  status: 'Aktif' | 'Pasif';
  simpanan: number;
  pinjaman: number;
}

const anggotaData: Anggota[] = [];

export default function AnggotaClientContent() {
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    id: 0,
    nama: '',
    nik: '',
    telepon: '',
    alamat: '',
    tanggalLahir: '',
    jenisKelamin: 'L' as 'L' | 'P',
    agama: '',
    status: 'Aktif' as 'Aktif' | 'Pasif',
    simpanan: 0,
    pinjaman: 0,
  });

  const nextId = anggotaData.length > 0 ? Math.max(...anggotaData.map(a => a.id)) + 1 : 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tglLahir = formData.tanggalLahir
      ? new Date(formData.tanggalLahir).toLocaleDateString('id-ID')
      : '';
    const newAnggota: Anggota = {
      id: formData.id,
      nama: formData.nama,
      nik: formData.nik,
      telepon: formData.telepon,
      alamat: formData.alamat,
      tanggalMasuk: new Date().toLocaleDateString('id-ID'),
      status: formData.status,
      simpanan: formData.simpanan,
      pinjaman: formData.pinjaman,
    };
    setAnggotaData([...anggotaData, newAnggota]);
    setShowForm(false);
    setFormData({
      id: nextId,
      nama: '',
      nik: '',
      telepon: '',
      alamat: '',
      tanggalLahir: '',
      jenisKelamin: 'L',
      agama: '',
      status: 'Aktif',
      simpanan: 0,
      pinjaman: 0,
    });
  };

  const filteredData = anggotaData.filter((a) =>
    a.nama.toLowerCase().includes(search.toLowerCase()) ||
    a.nik.includes(search) ||
    a.telepon.includes(search)
  );

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Kelola Data Anggota
              </h1>
              <p className="text-sm text-gray-600">
                Total {anggotaData.length} anggota terdaftar
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Input
                type="text"
                placeholder="Cari anggota..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-[200px] md:w-[250px]"
              />
              <Button variant="outline" asChild>
                <Upload className="mr-2 h-4 w-4" />
                Import Excel
              </Button>
              <Button
                variant="default"
                asChild
                onClick={(e) => {
                  setFormData({
                    id: nextId,
                    nama: '',
                    nik: '',
                    telepon: '',
                    alamat: '',
                    tanggalLahir: '',
                    jenisKelamin: 'L',
                    agama: '',
                    status: 'Aktif',
                    simpanan: 0,
                    pinjaman: 0,
                  });
                  setShowForm(true);
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Tambah Anggota Baru
              </Button>
            </div>
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
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID Anggota
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      NIK
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Telepon
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal Masuk
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Simpanan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pinjaman
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td className="px-6 py-4 text-center text-gray-500" colSpan="9">
                        Tidak ada data anggota
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((anggota) => (
                      <tr key={anggota.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {anggota.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {anggota.nama}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {anggota.nik}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {anggota.telepon}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {anggota.tanggalMasuk}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            anggota.status === 'Aktif'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {anggota.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          Rp {anggota.simpanan.toLocaleString('id-ID')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          Rp {anggota.pinjaman.toLocaleString('id-ID')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Tambah Anggota Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Tambah Anggota Baru
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Anggota
                </label>
                <Input
                  type="text"
                  value={formData.id}
                  readOnly
                  className="w-full bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap
                </label>
                <Input
                  type="text"
                  placeholder="Nama lengkap"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NIK
                </label>
                <Input
                  type="text"
                  maxLength={16}
                  placeholder="16 digit NIK"
                  value={formData.nik}
                  onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Telepon
                </label>
                <Input
                  type="tel"
                  placeholder="+62 xxx xxx xxx"
                  value={formData.telepon}
                  onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat Lengkap
                </label>
                <Input
                  type="text"
                  placeholder="Alamat lengkap"
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Lahir
                </label>
                <Input
                  type="date"
                  value={formData.tanggalLahir}
                  onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                  className="w-full"
                />
              </div>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <Input
                    type="radio"
                    name="jenisKelamin"
                    value="L"
                    checked={formData.jenisKelamin === 'L'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        jenisKelamin: e.target.value as 'L' | 'P',
                      })
                    }
                    className="mr-2"
                  />
                  Laki-laki
                </label>
                <label className="flex items-center">
                  <Input
                    type="radio"
                    name="jenisKelamin"
                    value="P"
                    checked={formData.jenisKelamin === 'P'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        jenisKelamin: e.target.value as 'L' | 'P',
                      })
                    }
                    className="mr-2"
                  />
                  Perempuan
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agama
                </label>
                <select
                  value={formData.agama}
                  onChange={(e) => setFormData({ ...formData, agama: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Pilih Agama --</option>
                  <option value="Islam">Islam</option>
                  <option value="Kristen">Kristen</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddha">Buddha</option>
                  <option value="Konghucu">Konghucu</option>
                </select>
              </div>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <Input
                    type="radio"
                    name="status"
                    value="Aktif"
                    checked={formData.status === 'Aktif'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as 'Aktif' | 'Pasif',
                      })
                    }
                    className="mr-2"
                  />
                  Aktif
                </label>
                <label className="flex items-center">
                  <Input
                    type="radio"
                    name="status"
                    value="Pasif"
                    checked={formData.status === 'Pasif'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as 'Aktif' | 'Pasif',
                      })
                    }
                    className="mr-2"
                  />
                  Pasif
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Simpanan (Rp)
                  </label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={formData.simpanan}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        simpanan: e.target.value ? parseInt(e.target.value) : 0,
                      })
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pinjaman (Rp)
                  </label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={formData.pinjaman}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pinjaman: e.target.value ? parseInt(e.target.value) : 0,
                      })
                    }
                    className="w-full"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" asChild onClick={() => setShowForm(false)}>
                  Batal
                </Button>
                <Button variant="default" type="submit">
                  Simpan Data
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Excel Modal */}
      {showImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Import Data Anggota dari Excel
            </h2>
            <div className="space-y-4">
              <div className="text-center">
                <Upload className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <p className="text-sm text-gray-600">
                  Seret dan drop file .xlsx atau .csv di sini, atau klik untuk memilih file
                </p>
                <input
                  type="file"
                  accept=".xlsx,.csv"
                  className="hidden"
                  id="fileInput"
                  onChange={(e) => {
                    console.log('File selected:', e.target.files[0]);
                    setShowImport(false);
                  }}
                />
                <label
                  htmlFor="fileInput"
                  className="btn btn-ghost btn-primary"
                >
                  Pilih File
                </label>
              </div>
              <p className="text-sm text-gray-500">
                Format file harus sesuai dengan template KSP. Kolom wajib: ID, Nama, NIK, Telepon, Alamat, Tanggal Lahir, Jenis Kelamin, Agama, Status, Simpanan, Pinjaman.
              </p>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" asChild onClick={() => setShowImport(false)}>
                Batal
              </Button>
              <Button variant="default" onClick={() => setShowImport(false)}>
                Impor
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}