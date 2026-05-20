'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Upload, FileSpreadsheet, X, AlertCircle, CheckCircle, Eye, Pencil, Trash2, Search } from 'lucide-react';
import Link from 'next/link';

// ── Date helper for Excel serial dates ─────────────────────────────
const EXCEL_EPOCH_OFFSET = 25569;

function isExcelSerial(v: unknown): v is number {
  return typeof v === 'number' && v > 40000 && v < 60000;
}

function convertExcelDate(v: unknown): string {
  if (isExcelSerial(v)) {
    const ms = Math.round((v - EXCEL_EPOCH_OFFSET) * 86400_000);
    const d = new Date(ms);
    if (!isNaN(d.getTime())) {
      return d.toISOString().slice(0, 10);
    }
  }
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  const s = String(v ?? '');
  const isoMatch = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
  return s;
}

function formatDateDDMMYYYY(v: unknown): string {
  const iso = convertExcelDate(v);
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return String(v ?? '');
  return `${String(d).padStart(2, '0')}-${String(m).padStart(2, '0')}-${y}`;
}
// ─────────────────────────────────────────────────────────────────────

interface Simpanan {
  id: string;
  anggota: string;
  tipe: 'Pokok' | 'Wajib' | 'Sukarela';
  jumlah: number;
  tanggal: string;
  status: 'Aktif' | 'Ditarik';
}

function generateId(): string {
  return 'TRX-' + Date.now().toString().slice(-6);
}

export default function SimpananClientContent() {
  const [simpananData, setSimpananData] = useState<Simpanan[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<Record<string, unknown>[]>([]);
  const [importError, setImportError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [showDetail, setShowDetail] = useState(false);
  const [selectedSimpanan, setSelectedSimpanan] = useState<Simpanan | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState<Simpanan | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem('ksp_simpanan_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Simpanan[];
        setSimpananData(parsed);
      } catch { /* ignore corrupt data */ }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('ksp_simpanan_data', JSON.stringify(simpananData));
  }, [simpananData]);

  const [formData, setFormData] = useState({
    anggota: '',
    tipe: 'Pokok' as 'Pokok' | 'Wajib' | 'Sukarela',
    jumlah: 0,
    tanggal: new Date().toISOString().slice(0, 10),
    status: 'Aktif' as 'Aktif' | 'Ditarik',
  });

  const q = search.trim().toLowerCase();
  const filteredData = (simpananData ?? [])
    .filter((s) => {
      const anggota = String(s.anggota ?? '').toLowerCase();
      const id = String(s.id ?? '').toLowerCase();
      return q === '' || anggota.includes(q) || id.includes(q);
    });

  useEffect(() => { setCurrentPage(1); }, [search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSimpanan: Simpanan = {
      id: generateId(),
      ...formData,
    };
    setSimpananData([...simpananData, newSimpanan]);
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      anggota: '',
      tipe: 'Pokok',
      jumlah: 0,
      tanggal: new Date().toISOString().slice(0, 10),
      status: 'Aktif',
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Yakin ingin menghapus transaksi ini?')) {
      setSimpananData((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const openDetail = (simpanan: Simpanan) => {
    setSelectedSimpanan(simpanan);
    setShowDetail(true);
  };

  const closeDetail = () => {
    setShowDetail(false);
    setSelectedSimpanan(null);
  };

  const openEdit = (simpanan: Simpanan) => {
    setEditData({ ...simpanan });
    setShowEdit(true);
  };

  const closeEdit = () => {
    setShowEdit(false);
    setEditData(null);
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editData) return;
    setSimpananData((prev) =>
      prev.map((s) => (s.id === editData.id ? editData : s))
    );
    setShowEdit(false);
    setEditData(null);
  };

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportFile(file);
    setImportError('');

    const parseFile = async (data: ArrayBuffer) => {
      const mod = await import('xlsx');
      const XLSX = (mod as any).default ?? (mod as any);
      const wb = XLSX.read(new Uint8Array(data), { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = (XLSX as any).utils.sheet_to_json(ws, { defval: '' });
      const normalised = rows.map((r: Record<string, unknown>) => ({
        id: r.id ?? generateId(),
        anggota: String(r.anggota ?? ''),
        tipe: (r.tipe as 'Pokok' | 'Wajib' | 'Sukarela') ?? 'Pokok',
        jumlah: Number(r.jumlah) || 0,
        tanggal: convertExcelDate(r.tanggal),
        status: (r.status as 'Aktif' | 'Ditarik') ?? 'Aktif',
      }));
      setImportPreview(normalised);
    };

    const onError = () => {
      setImportError('Gagal membaca file. Pastikan file yang dipilih valid.');
      setImportPreview([]);
    };

    const bufReader = new FileReader();
    bufReader.onload = async (ev) => {
      try {
        await parseFile(ev.target?.result as ArrayBuffer);
      } catch { onError(); }
    };
    bufReader.readAsArrayBuffer(file);
  }, []);

  const handleImportConfirm = () => {
    if (importPreview.length === 0) return;
    const newRows = importPreview.map((r) => r as unknown as Simpanan);
    setSimpananData((prev) => [...prev, ...newRows]);
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

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const paginatedData = filteredData.slice(startIdx, endIdx);
  const goPrev = () => { setCurrentPage((p) => Math.max(1, p - 1)); };
  const goNext = () => { setCurrentPage((p) => Math.min(totalPages, p + 1)); };

  const totalPokok = simpananData.filter((s) => s.tipe === 'Pokok').reduce((a, b) => a + b.jumlah, 0);
  const totalWajib = simpananData.filter((s) => s.tipe === 'Wajib').reduce((a, b) => a + b.jumlah, 0);
  const totalSukarela = simpananData.filter((s) => s.tipe === 'Sukarela').reduce((a, b) => a + b.jumlah, 0);
  const totalSemua = simpananData.reduce((a, b) => a + b.jumlah, 0);

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Data Simpanan</h1>
              <p className="text-sm text-gray-600">Kelola simpanan anggota KSP</p>
            </div>
            <Link href="/">
              <Button variant="ghost">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" />
                </svg>
                Kembali ke Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <nav className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto py-2">
            <Button variant="ghost" asChild><Link href="/">Dashboard</Link></Button>
            <Button variant="ghost" asChild><Link href="/anggota">Data Anggota</Link></Button>
            <Button variant="default" asChild><Link href="/simpanan">Simpanan</Link></Button>
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
              <div className="text-xl font-bold">Rp {totalPokok.toLocaleString('id-ID')}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Simpanan Wajib</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">Rp {totalWajib.toLocaleString('id-ID')}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Simpanan Sukarela</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">Rp {totalSukarela.toLocaleString('id-ID')}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Semua Simpanan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">Rp {totalSemua.toLocaleString('id-ID')}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Transaksi Simpanan</CardTitle>
            <p className="text-sm text-gray-600">Total {simpananData.length} transaksi simpanan</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Cari transaksi..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Button variant="outline" onClick={() => setShowImport(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Import Excel
              </Button>
              <Button variant="default" onClick={() => setShowForm(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Tambah Simpanan
              </Button>
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
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      Belum ada data simpanan
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.anggota}</TableCell>
                      <TableCell>{item.tipe}</TableCell>
                      <TableCell>Rp {item.jumlah.toLocaleString('id-ID')}</TableCell>
                      <TableCell>{formatDateDDMMYYYY(item.tanggal)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openDetail(item)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <p className="text-sm text-gray-500">
                  Menampilkan {startIdx + 1}–{Math.min(endIdx, filteredData.length)} dari {filteredData.length} transaksi
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={goPrev} disabled={currentPage === 1}>Previous</Button>
                  <span className="text-sm text-gray-600">Halaman {currentPage} dari {totalPages}</span>
                  <Button variant="outline" size="sm" onClick={goNext} disabled={currentPage === totalPages}>Next</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Tambah Simpanan Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200]" role="dialog" aria-modal="true">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Tambah Transaksi Simpanan</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Anggota *</label>
                <Input type="text" value={formData.anggota} onChange={(e) => setFormData({...formData, anggota: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Simpanan *</label>
                <select value={formData.tipe} onChange={(e) => setFormData({...formData, tipe: e.target.value as any})} className="w-full px-3 py-2 border" required>
                  <option value="Pokok">Pokok</option>
                  <option value="Wajib">Wajib</option>
                  <option value="Sukarela">Sukarela</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah (Rp) *</label>
                <Input type="number" min="0" value={formData.jumlah} onChange={(e) => setFormData({...formData, jumlah: Number(e.target.value)})} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal *</label>
                <Input type="date" value={formData.tanggal} onChange={(e) => setFormData({...formData, tanggal: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as any})} className="w-full px-3 py-2 border" required>
                  <option value="Aktif">Aktif</option>
                  <option value="Ditarik">Ditarik</option>
                </select>
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
              <h2 className="text-xl font-bold text-gray-900">Import Data Simpanan dari Excel</h2>
              <Button variant="ghost" size="sm" onClick={handleImportCancel}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <p className="text-sm text-gray-600 mb-2">Pilih file Excel (.xlsx, .xls, .csv) yang berisi data simpanan</p>
                <p className="text-xs text-gray-400 mb-4">Kolom yang dibutuhkan: anggota, tipe, jumlah, tanggal, status</p>
                <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFileSelect} className="hidden" id="import-simpanan-file" />
                <label htmlFor="import-simpanan-file" className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">
                  <Upload className="mr-2 h-4 w-4" />
                  Pilih File Excel
                </label>
                {importFile && (<p className="text-sm text-green-600 mt-2">File terpilih: <strong>{importFile.name}</strong></p>)}
              </div>
              {importError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" /><p className="text-sm">{importError}</p>
                </div>
              )}
              {importPreview.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    <CheckCircle className="h-5 w-5" /><span className="font-medium">{importPreview.length} baris data berhasil dibaca</span>
                  </div>
                  <div className="overflow-x-auto max-h-48">
                    <table className="min-w-full text-sm">
                      <thead className="bg-green-100 sticky top-0">
                        <tr><th className="px-2 py-1 text-left">Anggota</th><th className="px-2 py-1 text-left">Tipe</th><th className="px-2 py-1 text-left">Jumlah</th></tr>
                      </thead>
                      <tbody className="divide-y divide-green-100">
                        {(importPreview as any[]).slice(0, 20).map((row, idx) => (
                          <tr key={idx}><td className="px-2 py-1">{row.anggota || '-'}</td><td className="px-2 py-1">{row.tipe || '-'}</td><td className="px-2 py-1">{row.jumlah || '-'}</td></tr>
                        ))}
                      </tbody>
                    </table>
                    {importPreview.length > 20 && (<p className="text-xs text-gray-500 mt-1">... dan {importPreview.length - 20} baris lainnya</p>)}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-3 pt-4 mt-4 border-t">
              <Button variant="outline" type="button" onClick={handleImportCancel}>Batal</Button>
              <Button variant="default" type="button" onClick={handleImportConfirm} disabled={importPreview.length === 0}>
                <Upload className="mr-2 h-4 w-4" />Import {importPreview.length > 0 ? `${importPreview.length} Data` : ''}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && selectedSimpanan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Detail Simpanan</h2>
              <Button variant="ghost" size="sm" onClick={closeDetail}><X className="h-4 w-4" /></Button>
            </div>
            <div className="space-y-3">
              <div><p className="text-xs font-medium text-gray-400 uppercase">ID Transaksi</p><p className="text-sm">{selectedSimpanan.id}</p></div>
              <div><p className="text-xs font-medium text-gray-400 uppercase">Anggota</p><p className="text-sm">{selectedSimpanan.anggota}</p></div>
              <div><p className="text-xs font-medium text-gray-400 uppercase">Tipe</p><p className="text-sm">{selectedSimpanan.tipe}</p></div>
              <div><p className="text-xs font-medium text-gray-400 uppercase">Jumlah</p><p className="text-sm">Rp {selectedSimpanan.jumlah.toLocaleString('id-ID')}</p></div>
              <div><p className="text-xs font-medium text-gray-400 uppercase">Tanggal</p><p className="text-sm">{formatDateDDMMYYYY(selectedSimpanan.tanggal)}</p></div>
              <div><p className="text-xs font-medium text-gray-400 uppercase">Status</p><p className="text-sm">{selectedSimpanan.status}</p></div>
            </div>
            <div className="flex justify-end pt-4"><Button variant="outline" onClick={closeDetail}>Tutup</Button></div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEdit && editData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Edit Simpanan</h2>
              <Button variant="ghost" size="sm" onClick={closeEdit}><X className="h-4 w-4" /></Button>
            </div>
            <form onSubmit={handleEditSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Anggota *</label>
                <Input type="text" value={editData.anggota} onChange={(e) => setEditData({...editData, anggota: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Simpanan *</label>
                <select value={editData.tipe} onChange={(e) => setEditData({...editData, tipe: e.target.value as any})} className="w-full px-3 py-2 border" required>
                  <option value="Pokok">Pokok</option>
                  <option value="Wajib">Wajib</option>
                  <option value="Sukarela">Sukarela</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah (Rp) *</label>
                <Input type="number" min="0" value={editData.jumlah} onChange={(e) => setEditData({...editData, jumlah: Number(e.target.value)})} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal *</label>
                <Input type="date" value={editData.tanggal} onChange={(e) => setEditData({...editData, tanggal: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                <select value={editData.status} onChange={(e) => setEditData({...editData, status: e.target.value as any})} className="w-full px-3 py-2 border" required>
                  <option value="Aktif">Aktif</option>
                  <option value="Ditarik">Ditarik</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" type="button" onClick={closeEdit}>Batal</Button>
                <Button variant="default" type="submit">Simpan Perubahan</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}