'use client';

import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Search, Upload, FileSpreadsheet, X, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface Anggota {
  No_Anggota: string
  NAMA_ANGGOTA: string
  Jenis_Kelamin: "Laki-laki" | "Perempuan"
  Agama: string
  NIK: string
  Tempat_Lahir: string
  Tanggal_Lahir: string
  TELEPON: string
  Alamat: string
  Tanggal_Masuk: string
  Status_Perkawinan: "Belum Kawin" | "Kawin" | "Cerai Hidup" | "Cerai Mati"
  Nama_Pasangan?: string
  Jumlah_Anak: number
  Nama_Ibu_Kandung: string
  Nama_Saudara: string
  No_HP_Saudara: string
  Hubungan_Saudara: string
  Pekerjaan?: string
  PENGHASILAN_per_Bulan: number
}

export default function AnggotaClientContent() {
  const [anggotaData, setAnggotaData] = useState<Anggota[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<Anggota[]>([]);
  const [importError, setImportError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState('');
  
  const [formData, setFormData] = useState({
    No_Anggota: '',
    NAMA_ANGGOTA: '',
    Jenis_Kelamin: 'Laki-laki' as "Laki-laki" | "Perempuan",
    Agama: '',
    NIK: '',
    Tempat_Lahir: '',
    Tanggal_Lahir: '',
    TELEPON: '',
    Alamat: '',
    Tanggal_Masuk: '',
    Status_Perkawinan: 'Belum Kawin' as "Belum Kawin" | "Kawin" | "Cerai Hidup" | "Cerai Mati",
    Nama_Pasangan: '',
    Jumlah_Anak: 0,
    Nama_Ibu_Kandung: '',
    Nama_Saudara: '',
    No_HP_Saudara: '',
    Hubungan_Saudara: '',
    Pekerjaan: '',
    PENGHASILAN_per_Bulan: 0,
  });

  const filteredData = anggotaData.filter((a) =>
    a.NAMA_ANGGOTA.toLowerCase().includes(search.toLowerCase()) ||
    a.NIK.includes(search) ||
    a.TELEPON.includes(search) ||
    a.No_Anggota.includes(search)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAnggota: Anggota = { ...formData };
    setAnggotaData([...anggotaData, newAnggota]);
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      No_Anggota: '',
      NAMA_ANGGOTA: '',
      Jenis_Kelamin: 'Laki-laki',
      Agama: '',
      NIK: '',
      Tempat_Lahir: '',
      Tanggal_Lahir: '',
      TELEPON: '',
      Alamat: '',
      Tanggal_Masuk: '',
      Status_Perkawinan: 'Belum Kawin',
      Nama_Pasangan: '',
      Jumlah_Anak: 0,
      Nama_Ibu_Kandung: '',
      Nama_Saudara: '',
      No_HP_Saudara: '',
      Hubungan_Saudara: '',
      Pekerjaan: '',
      PENGHASILAN_per_Bulan: 0,
    });
  };

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportFile(file);
    setImportError('');
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'csv') {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const XLSX = require('xlsx');
          const text = reader.result as string;
          const workbook = XLSX.read(text, { type: 'string' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
          setImportPreview(rows);
        } catch (err) {
          setImportError('Gagal membaca file CSV. Pastikan format file valid.');
          setImportPreview([]);
        }
      };
      reader.readAsText(file);
      return;
    }
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const XLSX = (await import('xlsx')).default;
        const data = new Uint8Array(ev.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const utils = (XLSX as any).utils;
        const rows = utils.sheet_to_json(worksheet, { defval: '' });
        setImportPreview(rows);
      } catch (err) {
        setImportError('Gagal membaca file Excel. Pastikan file .xlsx yang valid.');
        setImportPreview([]);
      }
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const handleImportConfirm = () => {
    if (importPreview.length === 0) return;
    const validCount = importPreview.filter((r) => 
      r.NAMA_ANGGOTA && r.NAMA_ANGGOTA.trim() !== ''
    ).length;
    setAnggotaData((prev) => [...prev, ...importPreview]);
    setShowImport(false);
    setImportFile(null);
    setImportPreview([]);
    setImportError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImportCancel = () => {
    setShowImport(false);
    setImportFile(null);
    setImportPreview([]);
    setImportError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Kelola Data Anggota KSP
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
              <Button variant="outline" onClick={() => setShowImport(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Import Excel
              </Button>
              <Button variant="default" onClick={() => { resetForm(); setShowForm(true); }}>
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
            <Button variant="ghost" asChild><Link href="/anggota/summary">Summary</Link></Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Daftar Anggota (19 Kolom)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. Anggota</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">JK</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agama</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIK</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tmp Lahir</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl Lahir</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telepon</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alamat</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tgl Masuk</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status Nikah</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pasangan</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Anak</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ibu</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Saudara</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">HP Saudara</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hubungan</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kerja</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gaji</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={19} className="px-6 py-4 text-center text-gray-500">
                        Tidak ada data anggota
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((anggota) => (
                      <tr key={anggota.No_Anggota}>
                        <td className="px-2 py-3 whitespace-nowrap text-sm font-medium">{anggota.No_Anggota}</td>
                        <td className="px-2 py-3 whitespace-nowrap text-sm">{anggota.NAMA_ANGGOTA}</td>
                        <td className="px-2 py-3 whitespace-nowrap text-sm">{anggota.Jenis_Kelamin === "Laki-laki" ? "L" : "P"}</td>
                        <td className="px-2 py-3 whitespace-nowrap text-sm">{anggota.Agama}</td>
                        <td className="px-2 py-3 whitespace-nowrap text-sm">{anggota.NIK}</td>
                        <td className="px-2 py-3 whitespace-nowrap text-sm">{anggota.Tempat_Lahir}</td>
                        <td className="px-2 py-3 whitespace-nowrap text-sm">{anggota.Tanggal_Lahir}</td>
                        <td className="px-2 py-3 whitespace-nowrap text-sm">{anggota.TELEPON}</td>
                        <td className="px-2 py-3 whitespace-nowrap text-sm max-w-xs truncate">{anggota.Alamat}</td>
                        <td className="px-2 py-3 whitespace-nowrap text-sm">{anggota.Tanggal_Masuk}</td>
                        <td className="px-2 py-3 whitespace-nowrap text-sm">{anggota.Status_Perkawinan}</td>
                        <td className="px-2 py-3 whitespace-nowrap text-sm">{anggota.Nama_Pasangan || "-"}</td>
                        <td className="px-2 py-3 whitespace-nowrap text-sm text-center">{anggota.Jumlah_Anak}</td>
                        <td className="px-2 py-3 whitespace-nowrap text-sm">{anggota.Nama_Ibu_Kandung}</td>
                        <td className="px-2 py-3 whitespace-nowrap text-sm">{anggota.Nama_Saudara}</td>
                        <td className="px-2 py-3 whitespace-nowrap text-sm">{anggota.No_HP_Saudara}</td>
                        <td className="px-2 py-3 whitespace-nowrap text-sm">{anggota.Hubungan_Saudara}</td>
                        <td className="px-2 py-3 whitespace-nowrap text-sm">{anggota.Pekerjaan || "-"}</td>
                        <td className="px-2 py-3 whitespace-nowrap text-sm text-right">Rp {anggota.PENGHASILAN_per_Bulan.toLocaleString('id-ID')}</td>
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
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Tambah Anggota Baru (19 Kolom)
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No. Anggota *</label>
                  <Input type="text" value={formData.No_Anggota} onChange={(e) => setFormData({...formData, No_Anggota: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Masuk *</label>
                  <Input type="date" value={formData.Tanggal_Masuk} onChange={(e) => setFormData({...formData, Tanggal_Masuk: e.target.value})} required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Anggota *</label>
                  <Input type="text" value={formData.NAMA_ANGGOTA} onChange={(e) => setFormData({...formData, NAMA_ANGGOTA: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NIK (16 digit) *</label>
                  <Input type="text" maxLength={16} pattern="[0-9]{16}" value={formData.NIK} onChange={(e) => setFormData({...formData, NIK: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin *</label>
                  <select value={formData.Jenis_Kelamin} onChange={(e) => setFormData({...formData, Jenis_Kelamin: e.target.value as any})} className="w-full px-3 py-2 border" required>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Agama *</label>
                  <select value={formData.Agama} onChange={(e) => setFormData({...formData, Agama: e.target.value})} className="w-full px-3 py-2 border" required>
                    <option value="">-- Pilih Agama --</option>
                    <option value="Islam">Islam</option>
                    <option value="Kristen">Kristen</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Khonghucu">Khonghucu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tempat Lahir *</label>
                  <Input type="text" value={formData.Tempat_Lahir} onChange={(e) => setFormData({...formData, Tempat_Lahir: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir *</label>
                  <Input type="date" value={formData.Tanggal_Lahir} onChange={(e) => setFormData({...formData, Tanggal_Lahir: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telepon *</label>
                  <Input type="tel" value={formData.TELEPON} onChange={(e) => setFormData({...formData, TELEPON: e.target.value})} required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alamat *</label>
                  <Textarea value={formData.Alamat} onChange={(e) => setFormData({...formData, Alamat: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status Perkawinan *</label>
                  <select value={formData.Status_Perkawinan} onChange={(e) => setFormData({...formData, Status_Perkawinan: e.target.value as any})} className="w-full px-3 py-2 border" required>
                    <option value="Belum Kawin">Belum Kawin</option>
                    <option value="Kawin">Kawin</option>
                    <option value="Cerai Hidup">Cerai Hidup</option>
                    <option value="Cerai Mati">Cerai Mati</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pasangan</label>
                  <Input type="text" value={formData.Nama_Pasangan} onChange={(e) => setFormData({...formData, Nama_Pasangan: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Anak *</label>
                  <Input type="number" min="0" value={formData.Jumlah_Anak} onChange={(e) => setFormData({...formData, Jumlah_Anak: Number(e.target.value)})} required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Ibu Kandung *</label>
                  <Input type="text" value={formData.Nama_Ibu_Kandung} onChange={(e) => setFormData({...formData, Nama_Ibu_Kandung: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Saudara *</label>
                  <Input type="text" value={formData.Nama_Saudara} onChange={(e) => setFormData({...formData, Nama_Saudara: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No. HP Saudara *</label>
                  <Input type="tel" value={formData.No_HP_Saudara} onChange={(e) => setFormData({...formData, No_HP_Saudara: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hubungan *</label>
                  <select value={formData.Hubungan_Saudara} onChange={(e) => setFormData({...formData, Hubungan_Saudara: e.target.value})} className="w-full px-3 py-2 border" required>
                    <option value="">-- Pilih Hubungan --</option>
                    <option value="Kakak">Kakak</option>
                    <option value="Adik">Adik</option>
                    <option value="Orang Tua">Orang Tua</option>
                    <option value="Saudara Kandung">Saudara Kandung</option>
                    <option value="Saudara Ipuk">Saudara Ipuk</option>
                    <option value="Famili">Famili</option>
                    <option value="Teman">Teman</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pekerjaan</label>
                  <Input type="text" value={formData.Pekerjaan} onChange={(e) => setFormData({...formData, Pekerjaan: e.target.value})} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Penghasilan/Bulan (Rp) *</label>
                  <Input type="number" min="0" value={formData.PENGHASILAN_per_Bulan} onChange={(e) => setFormData({...formData, PENGHASILAN_per_Bulan: Number(e.target.value)})} required />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" type="button" onClick={() => setShowForm(false)}>Batal</Button>
                <Button variant="default" type="submit">Simpan</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Excel Modal */}
      {showImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Import Data Anggota dari Excel
              </h2>
              <Button variant="ghost" size="sm" onClick={handleImportCancel}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <p className="text-sm text-gray-600 mb-2">
                  Pilih file Excel (.xlsx, .xls, .csv) yang berisi data anggota
                </p>
                <p className="text-xs text-gray-400 mb-4">
                  Kolom yang dibutuhkan: No_Anggota, NAMA_ANGGOTA, Jenis_Kelamin, Agama, NIK, Tempat_Lahir, Tanggal_Lahir, TELEPON, Alamat, Tanggal_Masuk, Status_Perkawinan, Nama_Pasangan, Jumlah_Anak, Nama_Ibu_Kandung, Nama_Saudara, No_HP_Saudara, Hubungan_Saudara, Pekerjaan, PENGHASILAN_per_Bulan
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="import-file-input"
                />
                <label htmlFor="import-file-input" className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">
                  <Upload className="mr-2 h-4 w-4" />
                  Pilih File Excel
                </label>
                {importFile && (
                  <p className="text-sm text-green-600 mt-2">
                    File terpilih: <strong>{importFile.name}</strong>
                  </p>
                )}
              </div>

              {importError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm">{importError}</p>
                </div>
              )}

              {importPreview.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">
                      {importPreview.length} baris data berhasil dibaca
                    </span>
                  </div>
                  <div className="overflow-x-auto max-h-48">
                    <table className="min-w-full text-sm">
                      <thead className="bg-green-100 sticky top-0">
                        <tr>
                          <th className="px-2 py-1 text-left">No. Anggota</th>
                          <th className="px-2 py-1 text-left">Nama</th>
                          <th className="px-2 py-1 text-left">NIK</th>
                          <th className="px-2 py-1 text-left">Telepon</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-green-100">
                        {importPreview.slice(0, 20).map((row, idx) => (
                          <tr key={idx}>
                            <td className="px-2 py-1">{row.No_Anggota || '-'}</td>
                            <td className="px-2 py-1">{row.NAMA_ANGGOTA || '-'}</td>
                            <td className="px-2 py-1">{row.NIK || '-'}</td>
                            <td className="px-2 py-1">{row.TELEPON || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {importPreview.length > 20 && (
                      <p className="text-xs text-gray-500 mt-1">
                        ... dan {importPreview.length - 20} baris lainnya
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4 mt-4 border-t">
              <Button variant="outline" type="button" onClick={handleImportCancel}>
                Batal
              </Button>
              <Button
                variant="default"
                type="button"
                onClick={handleImportConfirm}
                disabled={importPreview.length === 0}
              >
                <Upload className="mr-2 h-4 w-4" />
                Import {importPreview.length > 0 ? `${importPreview.length} Anggota` : ''}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}