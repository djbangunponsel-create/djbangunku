'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
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
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
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
};

// ── Read localStorage helper ───────────────────────────────────────
function readStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}

// ── Sanitize currency/number string from Excel ────────────────────
// Accepts: "Rp 50.000", "50,000", "50 000", "50000", 50000, 50.5
// Returns: pure Number (50000, 50000, 50000, 50000, 50000, 50.5)
function parseNumber(v: unknown): number {
  if (typeof v === 'number') return v;
  const s = String(v ?? '')
    .replace(/Rp\s?/gi, '')    // strip "Rp "
    .replace(/\./g, '')         // strip thousand-separator dots  "50.000" → "50000"
    .replace(/,/g, '')          // strip commas  "50,000" → "50000"
    .replace(/\s+/g, '')        // strip spaces/nbsp
    .trim();
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

// ── Read all members from localStorage ────────────────────────────
function readAnggotaMap(): Record<string, string> {
  const rows = readStored<Record<string, unknown>[]>('ksp_anggota_data', []);
  const map: Record<string, string> = {};
  for (const row of rows) {
    const no = String(row.No_Anggota ?? '');
    const nama = String(row.NAMA_ANGGOTA ?? '');
    if (no && nama) map[no.toLowerCase()] = nama;
  }
  return map;
}

// ───────────────────────────────────────────────────────────────────

interface Simpanan {
  id: string;
  noAnggota: string;
  namaAnggota: string;
  tipe: 'Pokok' | 'Wajib' | 'Sukarela';
  jumlah: number;
  tanggalSetor: string;
  status: 'Aktif' | 'Ditarik';
}

function generateId(): string {
  return 'TRX-' + Date.now().toString().slice(-6) + '-' + Math.round(Math.random() * 9);
}

// ── Rupiah display helper ─────────────────────────────────────────
function fmtRupiah(n: number): string {
  return n.toLocaleString('id-ID');
}

// ── API endpoints ──────────────────────────────────────────────────
const API_BASE   = '/api/simpanan';
const BULK_API   = '/api/simpanan/bulk';

// ── Fetch all simpanan rows from the SQL database ─────────────────
async function fetchAllFromDB(): Promise<Array<Record<string, unknown>>> {
  try {
    const res = await fetch(
      `${API_BASE}?t=${Date.now()}`,
      { cache: 'no-store', next: { revalidate: 0 } }
    );
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`Server error ${res.status}: ${body || 'unknown'}`);
    }
    return res.json();
  } catch (e: any) {
    // Network failure, CORS, build-race, table-not-found → return empty
    console.warn('fetchAllFromDB:', e.message);
    return [];
  }
}

// ── Post a single row to the SQL database ─────────────────────────
async function postRowToDB(row: Record<string, unknown>): Promise<void> {
  // Skip any residual IMPTR-* test rows — same logic as bulk route
  const rawId = String(row.id ?? '');
  if (rawId.startsWith('IMPTR-')) return;
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => 'Unknown error');
    throw new Error(`Gagal menyimpan: ${msg}`);
  }
}

// ── Bulk import: loop every row and POST individually ─────────────
async function bulkImportToDB(
  rows: Array<Record<string, unknown>>,
  onProgress?: (done: number, total: number) => void,
): Promise<{ success: number; failed: number; total: number }> {
  let success = 0;
  let failed  = 0;
  for (let i = 0; i < rows.length; i++) {
    try {
      await postRowToDB(rows[i]);
      success++;
    } catch (e) {
      console.error('Bulk row error:', e, rows[i]);
      failed++;
    }
    onProgress?.(i + 1, rows.length);
  }
  return { success, failed, total: rows.length };
}

export default function SimpananClientContent() {
  const [simpananData, setSimpananData] = useState<Simpanan[]>([]);
  const [loading, setLoading]             = useState(true);
  const [loadError, setLoadError]         = useState<string>('');
  const [search, setSearch]               = useState('');

  const [importing, setImporting]         = useState(false);
  const [importProgress, setImportProgress] = useState<{ done: number; total: number }>({ done: 0, total: 0 });
  const today = new Date().toISOString().slice(0, 10);

  const [showForm, setShowForm]           = useState(false);
  const [showImport, setShowImport]       = useState(false);
  const [importFile, setImportFile]       = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<Record<string, unknown>[]>([]);
  const [importError, setImportError]     = useState('');
  const fileInputRef                      = useRef<HTMLInputElement>(null);

  const [currentPage, setCurrentPage]     = useState(1);
  const rowsPerPage                       = 10;

  const [showDetail, setShowDetail]       = useState(false);
  const [selectedSimpanan, setSelectedSimpanan] = useState<Simpanan | null>(null);
  const [showEdit, setShowEdit]           = useState(false);
  const [editData, setEditData]           = useState<Simpanan | null>(null);

  // anggota lookup map (reactive to storage events)
  const [anggotaMap, setAnggotaMap] = useState<Record<string, string>>(() => readAnggotaMap());
  useEffect(() => {
    const handler = () => setAnggotaMap(readAnggotaMap());
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  // Load from SQL database on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await fetchAllFromDB();
        if (!cancelled) setSimpananData(rows as unknown as Simpanan[]);
      } catch (e: any) {
        if (!cancelled) setLoadError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
   }, []);

  // ── Form state ───────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    noAnggota: '',
    namaAnggota: '',
    tipe: 'Pokok' as 'Pokok' | 'Wajib' | 'Sukarela',
    jumlah: 0,
    tanggalSetor: today,
    status: 'Aktif' as 'Aktif' | 'Ditarik',
  });

  const [editFormData, setEditFormData] = useState({
    noAnggota: '',
    namaAnggota: '',
    tipe: 'Pokok' as 'Pokok' | 'Wajib' | 'Sukarela',
    jumlah: 0,
    tanggalSetor: today,
    status: 'Aktif' as 'Aktif' | 'Ditarik',
  });

  // ── Search / filter ───────────────────────────────────────────────
  const q = search.trim().toLowerCase();
  const filteredData = (simpananData ?? []).filter((s) => {
    const id    = String(s.id ?? '').toLowerCase();
    const no    = String(s.noAnggota ?? '').toLowerCase();
    const nama  = String(s.namaAnggota ?? '').toLowerCase();
    return q === '' || id.includes(q) || no.includes(q) || nama.includes(q);
  });

  useEffect(() => { setCurrentPage(1); }, [search]);

  // ── Auto-fill nama when No_Anggota matches ───────────────────────
  const handleNoAnggotaChange = (val: string) => {
    const matched = anggotaMap[val.trim().toLowerCase()];
    setFormData((prev) => ({
      ...prev,
      noAnggota: val,
      namaAnggota: matched ?? '',
    }));
  };

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const paginatedData = filteredData.slice(startIdx, endIdx);
  const goPrev = () => { setCurrentPage((p) => Math.max(1, p - 1)); };
  const goNext = () => { setCurrentPage((p) => Math.min(totalPages, p + 1)); };

  // ── Summary cards ────────────────────────────────────────────────
  const totalPokok    = simpananData.filter((s) => s.tipe === 'Pokok').reduce((a, b) => a + b.jumlah, 0);
  const totalWajib    = simpananData.filter((s) => s.tipe === 'Wajib').reduce((a, b) => a + b.jumlah, 0);
  const totalSukarela = simpananData.filter((s) => s.tipe === 'Sukarela').reduce((a, b) => a + b.jumlah, 0);
  const totalSemua    = simpananData.reduce((a, b) => a + b.jumlah, 0);

  // ── CRUD ─────────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSimpanan: Simpanan = {
      id: generateId(),
      noAnggota:   formData.noAnggota,
      namaAnggota: formData.namaAnggota || anggotaMap[formData.noAnggota.toLowerCase()] || '',
      tipe:   formData.tipe,
      jumlah: formData.jumlah,
      tanggalSetor: formData.tanggalSetor,
      status: formData.status,
    };
    setSimpananData([...simpananData, newSimpanan]);
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      noAnggota: '',
      namaAnggota: '',
      tipe: 'Pokok',
      jumlah: 0,
      tanggalSetor: new Date().toISOString().slice(0, 10),
      status: 'Aktif',
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Yakin ingin menghapus transaksi ini?')) {
      setSimpananData((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const openDetail = (simpanan: Simpanan) => { setSelectedSimpanan(simpanan); setShowDetail(true); };
  const closeDetail = () => { setShowDetail(false); setSelectedSimpanan(null); };

  const openEdit = (simpanan: Simpanan) => {
    setEditData({ ...simpanan });
    setShowEdit(true);
  };

  const closeEdit = () => { setShowEdit(false); setEditData(null); };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editData) return;
    setSimpananData((prev) =>
      prev.map((s) => (s.id === editData.id ? editData : s))
    );
    setShowEdit(false);
    setEditData(null);
  };

  // ── Excel Import ─────────────────────────────────────────────────
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

      // Build name map once for bulk -include
      const anggotaLookup = readAnggotaMap();

      const normalised = rows.map((r: Record<string, unknown>, idx: number) => {
        const no  = String(r.noAnggota ?? r.anggota ?? '').trim();
        const tipeVal = String(r.tipe ?? 'Pokok');
        const tipe: Simpanan['tipe'] =
          tipeVal === 'Wajib' || tipeVal === 'Sukarela' ? tipeVal : 'Pokok';
        return {
          id:             String(r.id ?? `IMPTR-${idx + 1}`),
          noAnggota:      no,
          namaAnggota:    anggotaLookup[no.toLowerCase()] ?? String(r.namaAnggota ?? r.anggota ?? ''),
          tipe,
          jumlah:         parseNumber(r.jumlah),
          tanggalSetor:   convertExcelDate(r.tanggalSetor ?? r.tanggal ?? new Date()),
          status:         (r.status === 'Ditarik' ? 'Ditarik' : 'Aktif'),
        };
      });
      setImportPreview(normalised);
    };

    const onError = () => {
      setImportError('Gagal membaca file. Pastikan file yang dipilih valid.');
      setImportPreview([]);
    };

    const bufReader = new FileReader();
    bufReader.onload = async (ev) => {
      try { await parseFile(ev.target?.result as ArrayBuffer); }
      catch { onError(); }
    };
    bufReader.readAsArrayBuffer(file);
  }, []);

  const handleImportConfirm = async () => {
    console.log('[import] onClick fired — preview.length:', importPreview.length, 'importing:', importing);
    if (importPreview.length === 0) return;
    setImporting(true);
    setImportProgress({ done: 0, total: importPreview.length });
    try {
      // POST all rows to the bulk endpoint in a single server-side call
      console.log('[import] POSTing', importPreview.length, 'rows to', BULK_API);
      const res = await fetch(BULK_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: importPreview }),
      });
      console.log('[import] Bulk POST response status:', res.status);
      if (!res.ok) {
        const msg = await res.text().catch(() => 'Gagal meng-import');
        throw new Error(msg);
      }
      const result: { success: number; failed: number; total: number } = await res.json();
      console.log('[import] bulk result:', result);
      if (result.failed > 0) {
        setImportError(`${result.failed} dari ${result.total} baris gagal disimpan. Berhasil: ${result.success}`);
      }

      // ── Re-fetch from DB so table reflects server truth ──────────
      console.log('[import] re-fetching from DB...');
      const rows = await fetchAllFromDB();

      if (rows.length > 0) {
        // DB return data → use it (canonical path)
        console.log('[import] DB returned', rows.length, 'rows — using DB data');
        setSimpananData(rows as unknown as Simpanan[]);
      } else {
        // DB returned nothing — normalise preview locally so table is
        // never left blank immediately after a successful bulk import
        console.log('[import] DB returned 0 rows — normalising importPreview locally');
        const normalised: Simpanan[] = importPreview.map((r, idx) => ({
          id:             String(r.id ?? `IMPTR-${idx + 1}`),
          noAnggota:      String(r.noAnggota ?? ''),
          namaAnggota:    String(r.namaAnggota ?? ''),
          tipe:           (r.tipe === 'Wajib' || r.tipe === 'Sukarela') ? r.tipe : 'Pokok',
          jumlah:         typeof r.jumlah === 'number' ? r.jumlah : Number(r.jumlah) || 0,
          tanggalSetor:   convertExcelDate(r.tanggalSetor ?? r.tanggal ?? new Date()),
          status:         r.status === 'Ditarik' ? 'Ditarik' : 'Aktif',
        }));
        setSimpananData(normalised);
      }
      console.log('[import] simpananData updated');
    } catch (e: any) {
      setImportError(`Import gagal: ${e.message}`);
    } finally {
      setShowImport(false);
      setImportFile(null);
      setImportPreview([]);
      setImportError('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      setImporting(false);
      setImportProgress({ done: 0, total: 0 });
    }
  };

  const handleImportCancel = () => {
    setShowImport(false);
    setImportFile(null);
    setImportPreview([]);
    setImportError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ══════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen">
      {/* ── Header ────────────────────────────────────────────────── */}
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

        {/* ── Loading / Error ─────────────────────────────────────────── */}
        {loading && (
          <div className="text-center py-12 text-gray-500">Memuat data simpanan…</div>
        )}
        {loadError && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {loadError}
          </div>
        )}

        {/* ── Summary Cards ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Simpanan Pokok</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">Rp {fmtRupiah(totalPokok)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Simpanan Wajib</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">Rp {fmtRupiah(totalWajib)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Simpanan Sukarela</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">Rp {fmtRupiah(totalSukarela)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Semua Simpanan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">Rp {fmtRupiah(totalSemua)}</div>
              <p className="text-xs text-gray-500">{simpananData.length} transaksi</p>
            </CardContent>
          </Card>
        </div>

        {/* ── Data Table ────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Transaksi Simpanan</CardTitle>
            <p className="text-sm text-gray-600">
              Total {simpananData.length} transaksi simpanan
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Cari No. Anggota atau nama transaksi..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button variant="outline" onClick={() => !importing && setShowImport(true)}>
                <Upload className="mr-2 h-4 w-4" />
                {importing ? `Meng-import… ${importProgress.done}/${importProgress.total}` : 'Import Excel Simpanan'}
              </Button>
              <Button variant="default" onClick={() => setShowForm(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                + Tambah Setoran Simpanan
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Transaksi</TableHead>
                  <TableHead>No. Anggota</TableHead>
                  <TableHead>Nama Anggota</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Tanggal Setor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                      Belum ada data simpanan
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium text-xs">{item.id}</TableCell>
                      <TableCell className="text-xs">{item.noAnggota}</TableCell>
                      <TableCell className="text-xs">{item.namaAnggota || '-'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-0.5 rounded-full text-[11px] ${
                          item.tipe === 'Pokok'   ? 'bg-blue-100 text-blue-800'   :
                          item.tipe === 'Wajib'   ? 'bg-amber-100 text-amber-800'  :
                                                    'bg-emerald-100 text-emerald-800'
                        }`}>
                          {item.tipe}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs font-semibold">
                        Rp {fmtRupiah(item.jumlah)}
                      </TableCell>
                      <TableCell className="text-xs">{formatDateDDMMYYYY(item.tanggalSetor)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          item.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 justify-center">
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t mt-4">
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

      {/* ═══════════════ ADD MODAL ═══════════════ */}
      {showForm && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-[2px] flex items-center justify-center z-[200]" role="dialog" aria-modal="true">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-lg font-bold text-gray-900 mb-4">+ Tambah Setoran Simpanan</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No. Anggota *</label>
                <Input
                  type="text"
                  placeholder="Ketik No. Anggota..."
                  value={formData.noAnggota}
                  onChange={(e) => handleNoAnggotaChange(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Anggota</label>
                <Input
                  type="text"
                  value={formData.namaAnggota}
                  readOnly
                  tabIndex={-1}
                  className="bg-gray-50 cursor-not-allowed text-gray-500"
                  placeholder="Nama akan muncul otomatis setelah No. Anggota diisi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Simpanan *</label>
                <select
                  value={formData.tipe}
                  onChange={(e) => setFormData({ ...formData, tipe: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  required
                >
                  <option value="Pokok">Pokok</option>
                  <option value="Wajib">Wajib</option>
                  <option value="Sukarela">Sukarela</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Setoran (Rp) *</label>
                <Input
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.jumlah}
                  onChange={(e) => setFormData({ ...formData, jumlah: Number(e.target.value) })}
                  required
                />
                {formData.jumlah > 0 && (
                  <p className="mt-1 text-xs text-gray-500">Rp {fmtRupiah(formData.jumlah)}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Setor *</label>
                <Input
                  type="date"
                  value={formData.tanggalSetor}
                  onChange={(e) => setFormData({ ...formData, tanggalSetor: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  required
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Ditarik">Ditarik</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t">
                <Button variant="outline" type="button" onClick={() => setShowForm(false)}>Batal</Button>
                <Button variant="default" type="submit">Simpan Transaksi</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════ EDIT MODAL ═══════════════ */}
      {showEdit && editData && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-[2px] flex items-center justify-center z-[200]">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Edit Simpanan</h2>
            <form onSubmit={handleEditSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No. Anggota *</label>
                <Input
                  type="text"
                  value={editData.noAnggota}
                  onChange={(e) => setEditData({ ...editData, noAnggota: e.target.value, namaAnggota: anggotaMap[e.target.value.toLowerCase()] ?? editData.namaAnggota })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Anggota</label>
                <Input type="text" value={editData.namaAnggota} readOnly tabIndex={-1} className="bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Simpanan *</label>
                <select
                  value={editData.tipe}
                  onChange={(e) => setEditData({ ...editData, tipe: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  required
                >
                  <option value="Pokok">Pokok</option>
                  <option value="Wajib">Wajib</option>
                  <option value="Sukarela">Sukarela</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah (Rp) *</label>
                <Input
                  type="number"
                  min="0"
                  value={editData.jumlah}
                  onChange={(e) => setEditData({ ...editData, jumlah: Number(e.target.value) })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Setor *</label>
                <Input
                  type="date"
                  value={editData.tanggalSetor}
                  onChange={(e) => setEditData({ ...editData, tanggalSetor: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                <select
                  value={editData.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  required
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Ditarik">Ditarik</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t">
                <Button variant="outline" type="button" onClick={closeEdit}>Batal</Button>
                <Button variant="default" type="submit">Simpan Perubahan</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════ DETAIL MODAL ═══════════════ */}
      {showDetail && selectedSimpanan && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-[2px] flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Detail Simpanan</h2>
              <Button variant="ghost" size="sm" onClick={closeDetail}><X className="h-4 w-4" /></Button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase">ID Transaksi</p>
                <p className="text-sm">{selectedSimpanan.id}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase">No. Anggota</p>
                <p className="text-sm">{selectedSimpanan.noAnggota}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase">Nama Anggota</p>
                <p className="text-sm">{selectedSimpanan.namaAnggota || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase">Tipe</p>
                <p className="text-sm">{selectedSimpanan.tipe}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase">Jumlah</p>
                <p className="text-sm font-semibold">Rp {fmtRupiah(selectedSimpanan.jumlah)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase">Tanggal Setor</p>
                <p className="text-sm">{formatDateDDMMYYYY(selectedSimpanan.tanggalSetor)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase">Status</p>
                <p className="text-sm">{selectedSimpanan.status}</p>
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t mt-2">
              <Button variant="outline" onClick={closeDetail}>Tutup</Button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ IMPORT MODAL ═══════════════ */}
      {showImport && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-[2px] flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Import Data Simpanan dari Excel</h2>
              <Button variant="ghost" size="sm" onClick={handleImportCancel}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-emerald-500 transition-colors bg-gray-50/50">
                <Upload className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                <p className="text-sm text-gray-600 mb-1">Pilih file Excel (.xlsx, .xls, .csv)</p>
                <p className="text-xs text-gray-400 mb-4">
                  Kolom yang wajib ada: <code className="bg-gray-100 px-1 rounded">noAnggota</code>, <code className="bg-gray-100 px-1 rounded">tipe</code>, <code className="bg-gray-100 px-1 rounded">jumlah</code>, <code className="bg-gray-100 px-1 rounded">tanggalSetor</code>
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="import-simpanan-file"
                />
                <label htmlFor="import-simpanan-file" className="cursor-pointer inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium shadow-sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Pilih File Excel
                </label>
                {importFile && (
                  <p className="text-sm text-emerald-700 mt-2">File terpilih: <strong>{importFile.name}</strong></p>
                )}
              </div>

              {importError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm">{importError}</p>
                </div>
              )}

              {importPreview.length > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-emerald-700 mb-3">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">{importPreview.length} baris berhasil dibaca — siap di-import</span>
                  </div>
                  <div className="overflow-x-auto max-h-52 border rounded-lg">
                    <table className="min-w-full text-sm">
                      <thead className="bg-emerald-100 sticky top-0">
                        <tr>
                          <th className="px-3 py-2 text-left">No. Anggota</th>
                          <th className="px-3 py-2 text-left">Nama Anggota</th>
                          <th className="px-3 py-2 text-left">Tipe</th>
                          <th className="px-3 py-2 text-right">Jumlah</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-emerald-100">
                        {importPreview.slice(0, 20).map((row, idx) => (
                          <tr key={idx}>
                            <td className="px-3 py-1.5">{String(row.noAnggota ?? '-')}</td>
                            <td className="px-3 py-1.5">{String(row.namaAnggota ?? '-')}</td>
                            <td className="px-3 py-1.5">{String(row.tipe ?? '-')}</td>
                            <td className="px-3 py-1.5 text-right font-medium">
                              Rp {fmtRupiah(Number(row.jumlah) || 0)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {importPreview.length > 20 && (
                      <p className="text-xs text-gray-500 px-3 py-2">… dan {importPreview.length - 20} baris lainnya</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 mt-4 border-t">
              <Button variant="outline" onClick={handleImportCancel}>Batal</Button>
              <Button
                variant="default"
                onClick={handleImportConfirm}
                disabled={importing}
              >
                <Upload className="mr-2 h-4 w-4" />
                Import {importPreview.length > 0 ? `${importPreview.length} Data` : ''}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
