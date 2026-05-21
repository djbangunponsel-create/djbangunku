'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import KwitansiPinjaman from '@/components/KwitansiPinjaman';
import { PlusCircle, Upload, FileSpreadsheet, X, AlertCircle, CheckCircle, Eye, Pencil, Trash2, Search } from 'lucide-react';
import Link from 'next/link';

// ── Read localStorage helper ───────────────────────────────────────
function readStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}

// ── Read all members from localStorage ────────────────────────────
function readAnggotaMap(): Record<string, string> {
  const rows = readStored<Record<string, unknown>[]>('ksp_anggota_data', []);
  const map: Record<string, string> = {};
  for (const row of rows) {
    const nama = String(row.NAMA_ANGGOTA ?? '');
    const no = String(row.No_Anggota ?? '');
    if (no && nama) map[no.toLowerCase()] = nama;
  }
  return map;
}

// ── Read name-to-no lookup for Excel import ─────────────────────────
function readAnggotaNameToNo(): Record<string, string> {
  const rows = readStored<Record<string, unknown>[]>('ksp_anggota_data', []);
  const map: Record<string, string> = {};
  for (const row of rows) {
    const nama = String(row.NAMA_ANGGOTA ?? '').toLowerCase().trim();
    const no = String(row.No_Anggota ?? '');
    if (nama && no) map[nama] = no;
  }
  return map;
}

// ── Sanitize currency/number string from Excel ────────────────────
function parseNumber(v: unknown): number {
  if (typeof v === 'number') return v;
  const s = String(v ?? '')
    .replace(/Rp\s?/gi, '')
    .replace(/\./g, '')
    .replace(/,/g, '')
    .replace(/\s+/g, '')
    .trim();
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

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
}
// ── Format number with thousand separator ────────────────────────
function formatNumberWithSeparator(v: number): string {
  return v.toLocaleString('id-ID');
}

// ── Parse number from formatted string ──────────────────────────────
function parseFormattedNumber(v: string): number {
  return Number(v.replace(/[^\d]/g, '')) || 0;
}

// ── Read all members for autocomplete ─────────────────────────────
function readAllAnggota(): { no: string; nama: string }[] {
  const rows = readStored<Record<string, unknown>[]>('ksp_anggota_data', []);
  return rows.map((r) => ({
    no: String(r.No_Anggota ?? ''),
    nama: String(r.NAMA_ANGGOTA ?? ''),
  })).filter((a) => a.no && a.nama);
}

// ─────────────────────────────────────────────────────────────────────

interface Pinjaman {
  id: string;
  anggota: string;
  jumlah: number;
  bunga: number;
  tenor: number;
  angsuran: number;
  sisa: number;
  status: 'Aktif' | 'Lunas';
  tanggal: string;
  administrasi?: number;
  danaResiko?: number;
  danaSosial?: number;
  insentifPJ?: number;
  netto?: number;
  penanggungJawab?: string;
  jenisAgunan?: 'Pendiri' | 'Simpanan' | 'Akta Tanah' | 'Sertifikat Hak Milik (SHM)' | 'BPKB Roda 2' | 'BPKB Roda 4' | 'BPKB Roda 6/8' | 'Simpanan Sukarela Berjangka (Sisujang)';
  pemilikAgunan?: string;
  biayaMaterai?: number;
  biayaNotaris?: number;
  biayaBpjstk?: number;
  legalisasiNotaris?: 'Ya' | 'Tidak';
  iuranBpjstk?: 'Ya' | 'Tidak';
  masaBpjstk?: number;
  opsiSwk?: '1%' | 'flat';
  nilaiPasarAgunan?: number;
  nilaiLikuidasiAgunan?: number;
  agunanMencukupi?: boolean;
  // Detail agunan (sesuai jenis, disimpan sebagai flat key/value)
  bpkbMerkMbl?: string;
  bpkbTipeMbl?: string;
  bpkbTahun?: string;
  bpkbNoRangka?: string;
  bpkbNoMesin?: string;
  bpkbNoPolisi?: string;
  bpkbWarna?: string;
  bpkbTipeKet?: string;
  aktaNoSertifikat?: string;
  aktaLuasTanah?: string;
  aktaLuasBangunan?: string;
  aktaLokasi?: string;
  simpananNoRekening?: string;
  simpananMasaBerjangka?: string;
}

function generateId(): string {
  return 'PIN-' + Date.now().toString().slice(-6);
}

export default function PinjamanClientContent() {
  const [pinjamanData, setPinjamanData] = useState<Pinjaman[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showKwitansi, setShowKwitansi] = useState(false);
  const [lastPinjaman, setLastPinjaman] = useState<Pinjaman | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<Record<string, unknown>[]>([]);
  const [importError, setImportError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [showDetail, setShowDetail] = useState(false);
  const [selectedPinjaman, setSelectedPinjaman] = useState<Pinjaman | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState<Pinjaman | null>(null);

  // Load from localStorage on mount + clear IMPTR test rows
  useEffect(() => {
    const saved = readStored<Pinjaman[]>('ksp_pinjam_data', []);
    const cleaned = saved.filter((p) => !p.id.startsWith('IMPTR-'));
    if (cleaned.length !== saved.length) {
      setPinjamanData(cleaned);
      window.localStorage.setItem('ksp_pinjam_data', JSON.stringify(cleaned));
    } else {
      setPinjamanData(saved);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('ksp_pinjam_data', JSON.stringify(pinjamanData));
  }, [pinjamanData]);

  const [formData, setFormData] = useState({
    anggota: '',
    anggotaNo: '',
    jumlah: '',
    bunga: '',
    jenisPinjaman: 'Flat' as 'Flat' | 'Musiman',
    tenor: '',
    tanggal: new Date().toISOString().slice(0, 10),
    penanggungJawab: '',
    jenisAgunan: '' as 'Pendiri' | 'Simpanan' | 'Akta Tanah' | 'Sertifikat Hak Milik (SHM)' | 'BPKB Roda 2' | 'BPKB Roda 4' | 'BPKB Roda 6/8' | 'Simpanan Sukarela Berjangka (Sisujang)',
    legalisasiNotaris: 'Tidak' as 'Ya' | 'Tidak',
    iuranBpjstk: 'Tidak' as 'Ya' | 'Tidak',
    masaBpjstk: '1',
    opsiSwk: '1%' as '1%' | 'flat' | '',
    // Detail Agunan
    pemilikAgunan: '',
    nilaiPasar: '',
    // Detail sesuai jenis agunan (semua nullable)
    bpkbMerkMbl: '',
    bpkbTipeMbl: '',
    bpkbTahun: '',
    bpkbNoRangka: '',
    bpkbNoMesin: '',
    bpkbNoPolisi: '',
    bpkbWarna: '',
    bpkbTipeKet: '',
    aktaNoSertifikat: '',
    aktaLuasTanah: '',
    aktaLuasBangunan: '',
    aktaLokasi: '',
    simpananNoRekening: '',
    simpananMasaBerjangka: '',
  });

  // Nilai dasar pinjaman (diperlukan Agunan & semua potongan)
  const jumlahNum = parseFormattedNumber(formData.jumlah);

  // ── Nilai Agunan (pasar diisi manual, likuidasi dihitung otomatis) ───
  const nilaiPasarAgunan    = parseFormattedNumber(formData.nilaiPasar);
  const AGUNAN_PCT_LIKUIDASI = formData.jenisAgunan === 'Pendiri' || formData.jenisAgunan === 'Simpanan'
    ? 100
    : ['BPKB Roda 2', 'BPKB Roda 4', 'BPKB Roda 6/8'].includes(formData.jenisAgunan)
      ? 70
      : 80;
  const nilaiLikuidasiAgunan = Math.round(nilaiPasarAgunan * AGUNAN_PCT_LIKUIDASI / 100);
  const agunanMencukupi      = jumlahNum > 0 ? jumlahNum <= nilaiPasarAgunan : true;

  // Hitung potongan otomatis (total 5%)
  // Insentif Penanggung Jawab: 1% HANYA jika agunan TIDAK mencukupi pinjaman
  const administrasi = Math.round(jumlahNum * 0.02);
  const danaResiko = Math.round(jumlahNum * 0.01);
  const danaSosial = Math.round(jumlahNum * 0.01);
  const insentifPJ  = !agunanMencukupi ? Math.round(jumlahNum * 0.01) : 0;

  // Biaya tambahan otomatis
  const biayaMaterai = formData.legalisasiNotaris === 'Ya' ? 24000 : 12000;
  const biayaNotaris  = formData.legalisasiNotaris === 'Ya' ? 400000 : 0;
  const biayaBpjstk   = formData.iuranBpjstk === 'Ya'
    ? (parseInt(formData.masaBpjstk) || 0) * 20000
    : 0;

  const netto = jumlahNum - administrasi - danaResiko - danaSosial - insentifPJ - biayaMaterai - biayaNotaris - biayaBpjstk;

  // Simpanan Wajib Kapitalisasi (SWK)
  const nilaiSwk = formData.opsiSwk === '1%'
    ? Math.round(jumlahNum * 0.01)
    : formData.opsiSwk === 'flat'
      ? 25000
      : 0;

  // Rincian angsuran per bulan
  const tenorNum = parseInt(formData.tenor) || 0;
  const bungaNum = parseFloat(formData.bunga) || 0;
  const angsuranPokok = tenorNum > 0 ? Math.round(jumlahNum / tenorNum) : 0;
  const angsuranBunga = Math.round(jumlahNum * bungaNum / 100);
  const totalAngsuranPerBulan = angsuranPokok + angsuranBunga + nilaiSwk;

  
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');
  const memberSearchRef = useRef<HTMLDivElement>(null);

  // Clickoutside untuk menutup dropdown pencarian anggota
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (memberSearchRef.current && !memberSearchRef.current.contains(event.target as Node)) {
        setShowMemberDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper: update satu field detail agunan tanpa membuat baru keseluruhan formData
  const applyDetail = (field: string, value: string) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  useEffect(() => {
    if (formData.jenisPinjaman === 'Musiman') {
      setFormData(prev => ({ ...prev, bunga: '2.5' }));
    }
  }, [formData.jenisPinjaman]);

  const q = search.trim().toLowerCase();
  const filteredData = (pinjamanData ?? [])
    .filter((p) => {
      const anggota = String(p.anggota ?? '').toLowerCase();
      const id = String(p.id ?? '').toLowerCase();
      return q === '' || anggota.includes(q) || id.includes(q);
    });

  useEffect(() => { setCurrentPage(1); }, [search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const jumlah = jumlahNum;
    const tenor = parseInt(formData.tenor) || 0;
    const bunga = parseFloat(formData.bunga) || 0;
    const angsuran = tenor > 0 ? Math.round(jumlah / tenor) : 0;

    const newPinjaman: Pinjaman = {
      id: generateId(),
      anggota: formData.anggotaNo || formData.anggota,
      jumlah,
      bunga,
      tenor,
      angsuran,
      sisa: jumlah,
      status: 'Aktif',
      tanggal: formData.tanggal,
      administrasi,
      danaResiko,
      danaSosial,
      insentifPJ,
      netto,
      penanggungJawab: formData.penanggungJawab,
      jenisAgunan: formData.jenisAgunan,
      biayaMaterai,
      biayaNotaris,
      biayaBpjstk,
      legalisasiNotaris: formData.legalisasiNotaris,
      iuranBpjstk: formData.iuranBpjstk,
      masaBpjstk: parseInt(formData.masaBpjstk) || 0,
      pemilikAgunan: formData.pemilikAgunan || undefined,
      nilaiPasarAgunan,
      nilaiLikuidasiAgunan,
      agunanMencukupi,
      bpkbMerkMbl: formData.bpkbMerkMbl || undefined,
      bpkbTipeMbl: formData.bpkbTipeMbl || undefined,
      bpkbTahun: formData.bpkbTahun || undefined,
      bpkbNoRangka: formData.bpkbNoRangka || undefined,
      bpkbNoMesin: formData.bpkbNoMesin || undefined,
      bpkbNoPolisi: formData.bpkbNoPolisi || undefined,
      bpkbWarna: formData.bpkbWarna || undefined,
      bpkbTipeKet: formData.bpkbTipeKet || undefined,
      aktaNoSertifikat: formData.aktaNoSertifikat || undefined,
      aktaLuasTanah: formData.aktaLuasTanah || undefined,
      aktaLuasBangunan: formData.aktaLuasBangunan || undefined,
      aktaLokasi: formData.aktaLokasi || undefined,
      simpananNoRekening: formData.simpananNoRekening || undefined,
      simpananMasaBerjangka: formData.simpananMasaBerjangka || undefined,
    };
    const saved = [...pinjamanData, newPinjaman];
    setPinjamanData(saved);
    setLastPinjaman(newPinjaman);
    setShowForm(false);
    setShowKwitansi(true);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      anggota: '',
      anggotaNo: '',
      jumlah: '',
      bunga: '',
      jenisPinjaman: 'Flat',
      tenor: '',
      tanggal: new Date().toISOString().slice(0, 10),
      penanggungJawab: '',
      jenisAgunan: '' as 'Pendiri' | 'Simpanan' | 'Akta Tanah' | 'Sertifikat Hak Milik (SHM)' | 'BPKB Roda 2' | 'BPKB Roda 4' | 'BPKB Roda 6/8' | 'Simpanan Sukarela Berjangka (Sisujang)',
      legalisasiNotaris: 'Tidak' as 'Ya' | 'Tidak',
      iuranBpjstk: 'Tidak' as 'Ya' | 'Tidak',
      masaBpjstk: '1',
      opsiSwk: '1%' as '1%' | 'flat' | '',
      // Detail Agunan
      pemilikAgunan: '',
      nilaiPasar: '',
      bpkbMerkMbl: '',
      bpkbTipeMbl: '',
      bpkbTahun: '',
      bpkbNoRangka: '',
      bpkbNoMesin: '',
      bpkbNoPolisi: '',
      bpkbWarna: '',
      bpkbTipeKet: '',
      aktaNoSertifikat: '',
      aktaLuasTanah: '',
      aktaLuasBangunan: '',
      aktaLokasi: '',
      simpananNoRekening: '',
      simpananMasaBerjangka: '',
    });
    setMemberSearch('');
  };

  const handleDelete = (id: string) => {
    if (confirm('Yakin ingin menghapus pinjaman ini?')) {
      setPinjamanData((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const openDetail = (pinjaman: Pinjaman) => {
    setSelectedPinjaman(pinjaman);
    setShowDetail(true);
  };

  const closeDetail = () => {
    setShowDetail(false);
    setSelectedPinjaman(null);
  };

  const openEdit = (pinjaman: Pinjaman) => {
    setEditData({ ...pinjaman });
    setShowEdit(true);
  };

  const closeEdit = () => {
    setShowEdit(false);
    setEditData(null);
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editData) return;
    setPinjamanData((prev) =>
      prev.map((p) => (p.id === editData.id ? editData : p))
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

      // Build name-to-no lookup for name-based matching
      const nameToNo = readAnggotaNameToNo();
      const allNames = Object.keys(nameToNo);

const errors: string[] = [];
       const validatedData: Record<string, unknown>[] = [];

      rows.forEach((r: Record<string, unknown>, idx: number) => {
        const rowNum = idx + 2; // +2 because row 1 is header
        let hasError = false;

        // Get nama from Excel (column: 'nama') and find matching member
        const namaRaw = r.nama ?? '';
        const namaFromExcel = String(namaRaw).toLowerCase().trim();

        // Validation 1: Check if name exists in database
        if (!namaFromExcel) {
          errors.push(`Eror Baris ${rowNum}: Nama tidak boleh kosong.`);
          hasError = true;
        } else if (!nameToNo[namaFromExcel]) {
          errors.push(`Eror Baris ${rowNum}: Nama '${String(namaRaw)}' tidak terdaftar di database anggota KSP.`);
          hasError = true;
        }

        // Validation 2: Check numeric fields for currency/format symbols
        const numericFields = [
          { key: 'besarPinjaman', label: 'besarPinjaman' },
          { key: 'bunga', label: 'bunga' },
          { key: 'jangkaWaktu', label: 'jangkaWaktu' },
        ];

        for (const field of numericFields) {
          const val = String(r[field.key] ?? '');
          if (val && /Rp|%|\$|€|£|¥|[\.,]/.test(val) && !/^\d+([.,]\d+)?$/.test(val.replace(/[.,]/g, ''))) {
            errors.push(`Eror Baris ${rowNum}: Kolom ${field.label} harus berupa angka murni tanpa simbol.`);
            hasError = true;
          }
        }

        // Validation 3: Check date format
        const tgl = r.tanggalPinjam ?? '';
        if (!tgl) {
          errors.push(`Eror Baris ${rowNum}: Format tanggal harus YYYY-MM-DD.`);
          hasError = true;
        } else {
          const dateStr = String(tgl);
          const isoMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
          if (!isoMatch) {
            errors.push(`Eror Baris ${rowNum}: Format tanggal harus YYYY-MM-DD.`);
            hasError = true;
          }
        }

        if (!hasError) {
          const matchedNo = nameToNo[namaFromExcel];
          const jumlah = parseNumber(r.besarPinjaman ?? r.jumlah);
          const tenor = parseNumber(r.jangkaWaktu ?? r.tenor);
          const angsuran = tenor > 0 ? Math.round(jumlah / tenor) : 0;

          const validatedItem: Record<string, unknown> = {
            id: String(r.id ?? generateId()),
            anggota: matchedNo || String(namaRaw),
            jumlah,
            bunga: parseNumber(r.bunga),
            tenor,
            angsuran,
            sisa: jumlah,
            status: 'Aktif',
            tanggal: convertExcelDate(r.tanggalPinjam ?? r.tanggal) || new Date().toISOString().slice(0, 10),
          };
          validatedData.push(validatedItem);
        }
      });

      if (errors.length > 0) {
        setImportError(errors.join('\n'));
        setImportPreview([]);
      } else {
        setImportPreview(validatedData);
      }
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
    const newRows = importPreview.map((r) => r as unknown as Pinjaman);
    setPinjamanData((prev) => [...prev, ...newRows]);
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

  const totalAktif = pinjamanData.filter((p) => p.status === 'Aktif');
  const totalPinjamanAktif = totalAktif.reduce((a, b) => a + b.jumlah, 0);
  const totalPinjamanLunas = pinjamanData.filter((p) => p.status === 'Lunas').reduce((a, b) => a + b.jumlah, 0);
  const totalAngsuran = pinjamanData.reduce((a, b) => a + b.angsuran, 0);
  const totalBunga = pinjamanData.filter((p) => p.status === 'Aktif').reduce((a, b) => a + (b.jumlah * b.bunga / 100), 0);

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Data Pinjaman</h1>
              <p className="text-sm text-gray-600">Kelola pinjaman anggota KSP</p>
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
            <Button variant="ghost" asChild><Link href="/simpanan">Simpanan</Link></Button>
            <Button variant="default" asChild><Link href="/pinjaman">Pinjaman</Link></Button>
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
              <div className="text-xl font-bold">Rp {totalPinjamanAktif.toLocaleString('id-ID')}</div>
              <p className="text-xs text-gray-500">{totalAktif.length} pinjaman aktif</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Pinjaman Lunas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">Rp {totalPinjamanLunas.toLocaleString('id-ID')}</div>
              <p className="text-xs text-gray-500">{pinjamanData.filter((p) => p.status === 'Lunas').length} pinjaman lunas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Angsuran/Bulan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">Rp {totalAngsuran.toLocaleString('id-ID')}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Pendapatan Bunga</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">Rp {totalBunga.toLocaleString('id-ID')}</div>
              <p className="text-xs text-gray-500">Tahun ini</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Pinjaman</CardTitle>
            <p className="text-sm text-gray-600">Total {pinjamanData.length} pinjaman</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Cari pinjaman..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Button variant="outline" onClick={() => setShowImport(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Import Excel
              </Button>
              <Button variant="default" onClick={() => setShowForm(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Tambah Pinjaman
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Pinjaman</TableHead>
                  <TableHead>NAMA</TableHead>
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
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                      Belum ada data pinjaman
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item) => (
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
                          item.status === 'Aktif' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
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
                  Menampilkan {startIdx + 1}–{Math.min(endIdx, filteredData.length)} dari {filteredData.length} pinjaman
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

{/* Tambah Pinjaman Modal */}
       {showForm && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200]" role="dialog" aria-modal="true">
           <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
             <h2 className="text-xl font-bold text-gray-900 mb-4">Tambah Pinjaman Baru</h2>
             <form onSubmit={handleSubmit} className="space-y-4">
               {/* Nama Anggota - Auto Complete */}
               <div className="relative" ref={memberSearchRef}>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Nama Anggota *</label>
                 <Input
                   type="text"
                   placeholder="Ketik nama atau nomor anggota..."
                   value={formData.anggota}
                   onChange={(e) => {
                     const val = e.target.value;
                     setFormData({ ...formData, anggota: val });
                     setMemberSearch(val);
                   }}
                   onFocus={() => {
                     setShowMemberDropdown(true);
                     setMemberSearch(formData.anggota);
                   }}
                   required
                 />
                 {showMemberDropdown && (
                   <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                     {(() => {
                       const members = readAllAnggota();
                       const q = memberSearch.toLowerCase().trim();
                       const filtered = members.filter(
                         (a) => a.nama.toLowerCase().includes(q) || a.no.toLowerCase().includes(q)
                       );
                       if (filtered.length === 0) {
                         return <div className="px-3 py-2 text-gray-500 text-sm">Tidak ada data</div>;
                       }
                       return (
                         <>
                           {filtered.slice(0, 10).map((a) => (
                             <button
                               key={a.no}
                               type="button"
                               className="w-full text-left px-3 py-2 hover:bg-blue-50 text-sm"
                               onClick={() => {
                                 setFormData({ ...formData, anggota: `${a.no} - ${a.nama}`, anggotaNo: a.no });
                                 setShowMemberDropdown(false);
                                 setMemberSearch("");
                               }}
                             >
                               <span className="font-medium">{a.nama}</span>
                               <span className="text-gray-400 ml-2">No. {a.no}</span>
                             </button>
                           ))}
                         </>
                       );
                     })()}
                   </div>
                 )}
               </div>


               {/* Jumlah Pinjaman dengan Separator Ribuan */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Pinjaman (Rp) *</label>
                 <Input
                   type="text"
                   placeholder="Contoh: 10.000.000"
                   value={formatNumberWithSeparator(parseFormattedNumber(formData.jumlah))}
                   onChange={(e) => setFormData({...formData, jumlah: e.target.value.replace(/[^\d]/g, '')})}
                   required
                 />
               </div>

               {/* Jenis Pinjaman Dropdown */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Pinjaman *</label>
                 <select
                   value={formData.jenisPinjaman}
                   onChange={(e) => setFormData({...formData, jenisPinjaman: e.target.value as any})}
                   className="w-full px-3 py-2 border"
                   required
                 >
                   <option value="Flat">Flat</option>
                   <option value="Musiman">Musiman</option>
                 </select>
               </div>

               {/* Bunga - Conditional Disabled */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Bunga (%) *</label>
                 <Input
                   type="number"
                   min="0"
                   step="0.1"
                   value={formData.bunga}
                   onChange={(e) => setFormData({...formData, bunga: e.target.value})}
                   disabled={formData.jenisPinjaman === 'Musiman'}
                   required
                 />
               </div>

{/* Tenor - Dropdown with conditional options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tenor (bulan) *</label>
                  <select
                    value={formData.tenor}
                    onChange={(e) => setFormData({...formData, tenor: e.target.value})}
                    className="w-full px-3 py-2 border"
                    required
                  >
                    <option value="">Pilih Tenor</option>
                    {formData.jenisPinjaman === 'Musiman'
                      ? [1, 2, 3, 4, 5, 6, 7, 8].map((m) => <option key={m} value={m}>{m} bulan</option>)
                      : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36].map((m) => <option key={m} value={m}>{m} bulan</option>)}
                  </select>
                </div>

                {/* Potongan Pinjaman */}
                <div className="border-t pt-3 mt-2">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Potongan Pinjaman (Total 5%)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Administrasi Pinjaman (2%)</label>
                      <Input type="text" value={formatNumberWithSeparator(administrasi)} readOnly className="bg-gray-50" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Dana Resiko (1%)</label>
                      <Input type="text" value={formatNumberWithSeparator(danaResiko)} readOnly className="bg-gray-50" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Dana Sosial (1%)</label>
                      <Input type="text" value={formatNumberWithSeparator(danaSosial)} readOnly className="bg-gray-50" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Insentif Penanggung Jawab (1%)</label>
                      <Input type="text" value={formatNumberWithSeparator(insentifPJ)} readOnly className="bg-gray-50" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <label className="block text-xs text-gray-500 mb-1">Nama Penanggung Jawab</label>
                    <select
                      value={formData.penanggungJawab}
                      onChange={(e) => setFormData({...formData, penanggungJawab: e.target.value})}
                      className="w-full px-3 py-2 border"
                    >
                      <option value="">Pilih Petugas</option>
                      {readAllAnggota().map((p) => (
                        <option key={p.no} value={p.nama}>{p.no} - {p.nama}</option>
                      ))}
                    </select>
                  </div>
                </div>
                  <div className="mt-2">
                    <label className="block text-xs text-gray-500 mb-1">Jenis Agunan *</label>
                    <select
                      value={formData.jenisAgunan}
                      onChange={(e) => setFormData({...formData, jenisAgunan: e.target.value as any})}
                      className="w-full px-3 py-2 border"
                      required
                    >
                      <option value="">Pilih Jenis Agunan</option>
                      <option value="Pendiri">Pendiri</option>
                      <option value="Simpanan">Simpanan</option>
                      <option value="Akta Tanah">Akta Tanah</option>
                      <option value="Sertifikat Hak Milik (SHM)">Sertifikat Hak Milik (SHM)</option>
                      <option value="BPKB Roda 2">BPKB Roda 2</option>
                      <option value="BPKB Roda 4">BPKB Roda 4</option>
                      <option value="BPKB Roda 6/8">BPKB Roda 6/8</option>
                      <option value="Simpanan Sukarela Berjangka (Sisujang)">Simpanan Sukarela Berjangka (Sisujang)</option>
                        </select>
                    </div>

                  {/* ───────────── Detail Agunan ───────────── */}
                  <div className="border-t pt-3 mt-2">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Detail Agunan</h4>
                    {!!formData.jenisAgunan && (
                      <>
                        {/* Nilai Agunan - diisi manual */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Nilai Pasar Agunan (Rp)</label>
                            <Input
                              type="text"
                              placeholder="Contoh: 150.000.000"
                              value={formatNumberWithSeparator(nilaiPasarAgunan)}
                              onChange={(e) => setFormData({ ...formData, nilaiPasar: e.target.value.replace(/[^\d]/g, '') })}
                              className="bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Nilai Likuidasi Agunan (Rp) — {AGUNAN_PCT_LIKUIDASI}% dari Nilai Pasar</label>
                            <Input
                              type="text"
                              value={formatNumberWithSeparator(nilaiLikuidasiAgunan)}
                              readOnly
                              className="bg-gray-50"
                            />
                          </div>
                        </div>
                        <div className="mt-2">
                          <label className="block text-xs text-gray-500 mb-1">Kecukupan Agunan</label>
                          <div className={`flex items-center gap-2 px-3 py-2 rounded ${
                            agunanMencukupi
                              ? 'bg-green-50 border border-green-200'
                              : 'bg-red-50 border border-red-200'
                          }`}>
                            {agunanMencukupi ? (
                              <span className="text-sm font-medium text-green-700">
                                ✓ Agunan CUKUP – Pinjaman Rp {formatNumberWithSeparator(jumlahNum)} ≤ Nilai Pasar Rp {formatNumberWithSeparator(nilaiPasarAgunan)}
                              </span>
                            ) : (
                              <span className="text-sm font-medium text-red-700">
                                ✗ Agunan TIDAK CUKUP – Pinjaman Rp {formatNumberWithSeparator(jumlahNum)} melebihi Nilai Pasar Rp {formatNumberWithSeparator(nilaiPasarAgunan)}. Periksa nilai atau kurangi jumlah pinjaman.
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Detail khusus BPKB */}
                        {['BPKB Roda 2', 'BPKB Roda 4', 'BPKB Roda 6/8'].includes(formData.jenisAgunan) && (
                          <div className="mt-3 border-t pt-3">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Detail Agunan — BPKB {formData.jenisAgunan.replace('BPKB ', '')}</h4>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Nama Pemilik Agunan</label>
                              <Input type="text" placeholder="Nama pemilik sesuai identitas / BPKB" value={formData.pemilikAgunan} onChange={(e) => setFormData({ ...formData, pemilikAgunan: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Merk / Model</label>
                                <Input type="text" placeholder="Contoh: Toyota Avanza" value={formData.bpkbMerkMbl} onChange={(e) => setFormData({ ...formData, bpkbMerkMbl: e.target.value })} />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Tipe Kendaraan</label>
                                <Input type="text" placeholder="Contoh: 1.3 E M/T" value={formData.bpkbTipeMbl} onChange={(e) => setFormData({ ...formData, bpkbTipeMbl: e.target.value })} />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Tahun Pembuatan</label>
                                <Input type="text" placeholder="Contoh: 2020" value={formData.bpkbTahun} onChange={(e) => setFormData({ ...formData, bpkbTahun: e.target.value })} />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Nomor Rangka</label>
                                <Input type="text" placeholder="No. Rangka BPKB" value={formData.bpkbNoRangka} onChange={(e) => setFormData({ ...formData, bpkbNoRangka: e.target.value })} />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Nomor Mesin</label>
                                <Input type="text" placeholder="No. Mesin BPKB" value={formData.bpkbNoMesin} onChange={(e) => setFormData({ ...formData, bpkbNoMesin: e.target.value })} />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Nomor Polisi</label>
                                <Input type="text" placeholder="Contoh: B 1234 XYZ" value={formData.bpkbNoPolisi} onChange={(e) => setFormData({ ...formData, bpkbNoPolisi: e.target.value })} />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Warna</label>
                                <Input type="text" placeholder="Contoh: Silver Metalik" value={formData.bpkbWarna} onChange={(e) => setFormData({ ...formData, bpkbWarna: e.target.value })} />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Tipe / Keterangan BPKB</label>
                                <Input type="text" placeholder="Tipe tambahan BPKB" value={formData.bpkbTipeKet} onChange={(e) => setFormData({ ...formData, bpkbTipeKet: e.target.value })} />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Detail khusus Akta Tanah / SHM */}
                        {['Akta Tanah', 'Sertifikat Hak Milik (SHM)'].includes(formData.jenisAgunan) && (
                          <div className="mt-3 border-t pt-3">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Detail Agunan — {formData.jenisAgunan}</h4>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Nama Pemilik Agunan</label>
                              <Input type="text" placeholder="Nama pemilik sesuai identitas / Sertifikat" value={formData.pemilikAgunan} onChange={(e) => setFormData({ ...formData, pemilikAgunan: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">No. Sertifikat</label>
                                <Input type="text" placeholder="No. Sertifikat tanah" value={formData.aktaNoSertifikat} onChange={(e) => setFormData({ ...formData, aktaNoSertifikat: e.target.value })} />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Luas Tanah (m²)</label>
                                <Input type="text" placeholder="Contoh: 100" value={formData.aktaLuasTanah} onChange={(e) => setFormData({ ...formData, aktaLuasTanah: e.target.value })} />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Luas Bangunan (m²)</label>
                                <Input type="text" placeholder="Contoh: 50" value={formData.aktaLuasBangunan} onChange={(e) => setFormData({ ...formData, aktaLuasBangunan: e.target.value })} />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Lokasi / Desa</label>
                                <Input type="text" placeholder="Nama desa / lokasi tanah" value={formData.aktaLokasi} onChange={(e) => setFormData({ ...formData, aktaLokasi: e.target.value })} />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Detail khusus Simpanan */}
                        {formData.jenisAgunan === 'Simpanan' && (
                          <div className="mt-3 border-t pt-3">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Detail Agunan — Simpanan</h4>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Nama Pemilik Agunan</label>
                              <Input type="text" placeholder="Nama pemilik sesuai identitas / Rekening Simpanan" value={formData.pemilikAgunan} onChange={(e) => setFormData({ ...formData, pemilikAgunan: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">No. Rekening Simpanan</label>
                                <Input type="text" placeholder="No. Rekening Tabungan Anggota" value={formData.simpananNoRekening} onChange={(e) => setFormData({ ...formData, simpananNoRekening: e.target.value })} />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Detail khusus Simpanan Sukarela Berjangka (Sisujang) */}
                        {formData.jenisAgunan === 'Simpanan Sukarela Berjangka (Sisujang)' && (
                          <div className="mt-3 border-t pt-3">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Detail Agunan — Simpanan Sukarela Berjangka (Sisujang)</h4>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Nama Pemilik Agunan</label>
                              <Input type="text" placeholder="Nama pemilik sesuai identitas / Rekening Sukarela" value={formData.pemilikAgunan} onChange={(e) => setFormData({ ...formData, pemilikAgunan: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">No. Rekening Simpanan</label>
                                <Input type="text" placeholder="No. Rekening Sukarela Berjangka" value={formData.simpananNoRekening} onChange={(e) => setFormData({ ...formData, simpananNoRekening: e.target.value })} />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Masa Berjangka / Keterangan</label>
                                <Input type="text" placeholder="Contoh: 12 bulan, 6 bulan" value={formData.simpananMasaBerjangka} onChange={(e) => setFormData({ ...formData, simpananMasaBerjangka: e.target.value })} />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Detail khusus Pendiri */}
                        {formData.jenisAgunan === 'Pendiri' && (
                          <div className="mt-3 border-t pt-3">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Detail Agunan — Simpanan Pokok (Pendiri)</h4>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Nama Pemilik Agunan</label>
                              <Input type="text" placeholder="Nama pemilik sesuai identitas / Simpanan Pokok" value={formData.pemilikAgunan} onChange={(e) => setFormData({ ...formData, pemilikAgunan: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="col-span-2">
                                <label className="block text-xs text-gray-500 mb-1">Bukti / Keterangan Simpanan Pokok</label>
                                <Input type="text" placeholder="No. Bukti Setoran / Keterangan tambahan" value={formData.bpkbTipeKet} onChange={(e) => setFormData({ ...formData, bpkbTipeKet: e.target.value })} />
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    {!formData.jenisAgunan && (
                      <div className="text-xs text-gray-400 italic">Pilih jenis agunan untuk melihat detail nilai dan formulirnya.</div>
                    )}
                  </div>

                 {/* ───────────── Biaya Tambahan ───────────── */}
                <div className="border-t pt-3 mt-2">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Biaya Tambahan</h4>

                  {/* Biaya Materai — auto computed */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Biaya Materai</label>
                    <Input type="text" value={formatNumberWithSeparator(biayaMaterai)} readOnly className="bg-gray-50" />
                  </div>

                  {/* Legalisasi Notaris — only when Agunan is property / document type */}
                  {['Akta Tanah', 'Sertifikat Hak Milik (SHM)', 'BPKB Roda 2', 'BPKB Roda 4', 'BPKB Roda 6/8'].includes(formData.jenisAgunan) && (
                    <>
                      <div className="mt-2">
                        <label className="block text-xs text-gray-500 mb-1">Legalisasi Notaris</label>
                        <select
                          value={formData.legalisasiNotaris}
                          onChange={(e) => setFormData({ ...formData, legalisasiNotaris: e.target.value as 'Ya' | 'Tidak' })}
                          className="w-full px-3 py-2 border"
                        >
                          <option value="Tidak">Tidak</option>
                          <option value="Ya">Ya</option>
                        </select>
                      </div>

                      {formData.legalisasiNotaris === 'Ya' && (
                        <div className="mt-2">
                          <label className="block text-xs text-gray-500 mb-1">Biaya Notaris</label>
                          <Input type="text" value={formatNumberWithSeparator(biayaNotaris)} readOnly className="bg-gray-50" />
                        </div>
                      )}
                    </>
                  )}

                  {/* Iuran BPJSTK PBPU — optional dropdown with duration */}
                  <div className="mt-2">
                    <label className="block text-xs text-gray-500 mb-1">Iuran BPJSTK PBPU</label>
                    <select
                      value={formData.iuranBpjstk}
                      onChange={(e) => setFormData({ ...formData, iuranBpjstk: e.target.value as 'Ya' | 'Tidak' })}
                      className="w-full px-3 py-2 border"
                    >
                      <option value="Tidak">Tidak</option>
                      <option value="Ya">Ya</option>
                    </select>
                  </div>

                  {formData.iuranBpjstk === 'Ya' && (
                    <>
                      <div className="mt-2">
                        <label className="block text-xs text-gray-500 mb-1">Masa Iuran (Bulan)</label>
                        <select
                          value={formData.masaBpjstk}
                          onChange={(e) => setFormData({ ...formData, masaBpjstk: e.target.value })}
                          className="w-full px-3 py-2 border"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                            <option key={m} value={m}>{m} bulan</option>
                          ))}
                        </select>
                      </div>

                      <div className="mt-2">
                        <label className="block text-xs text-gray-500 mb-1">Biaya Iuran BPJSTK</label>
                        <Input type="text" value={formatNumberWithSeparator(biayaBpjstk)} readOnly className="bg-gray-50" />
                      </div>
                    </>
                  )}
                </div>

{/* Total Uang Diterima */}
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <label className="block text-sm font-medium text-blue-700 mb-1">Total Diterima Anggota</label>
                  <Input type="text" value={formatNumberWithSeparator(netto)} readOnly className="bg-white font-bold text-blue-700" />
                </div>

                {/* ───────────── Opsi Simpanan Wajib Kapitalisasi (SWK) + Rincian Angsuran ───────────── */}
                <div className="border-t pt-3 mt-2">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Simpanan Wajib Kapitalisasi (SWK)</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Opsi SWK</label>
                      <select
                        value={formData.opsiSwk}
                        onChange={(e) => setFormData({ ...formData, opsiSwk: e.target.value as '1%' | 'flat' | '' })}
                        className="w-full px-3 py-2 border"
                      >
                        <option value="">Pilih Opsi SWK</option>
                        <option value="1%">1% dari Besar Pinjaman</option>
                        <option value="flat">Flat Rp 25.000</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Nominal SWK</label>
                      <Input type="text" value={formatNumberWithSeparator(nilaiSwk)} readOnly className="bg-gray-50" />
                    </div>
                  </div>

                  <div className="mt-3 border-t pt-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">RINCIAN ANGSURAN PER BULAN</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-gray-50 px-3 py-2 rounded">Angsuran Pokok / Bulan</div>
                      <div className="bg-gray-50 px-3 py-2 rounded text-right font-medium">Rp {formatNumberWithSeparator(angsuranPokok)}</div>

                      <div className="bg-gray-50 px-3 py-2 rounded">Angsuran Bunga / Bulan</div>
                      <div className="bg-gray-50 px-3 py-2 rounded text-right font-medium">Rp {formatNumberWithSeparator(angsuranBunga)}</div>

                      <div className="bg-gray-50 px-3 py-2 rounded">Simpanan Wajib Kapitalisasi (SWK) / Bulan</div>
                      <div className="bg-gray-50 px-3 py-2 rounded text-right font-medium">Rp {formatNumberWithSeparator(nilaiSwk)}</div>

                      <div className="bg-blue-50 border border-blue-200 px-3 py-2 rounded font-bold text-blue-700">TOTAL ANGSURAN PER BULAN</div>
                      <div className="bg-blue-50 border border-blue-200 px-3 py-2 rounded text-right font-bold text-blue-700">Rp {formatNumberWithSeparator(totalAngsuranPerBulan)}</div>
                    </div>
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

      {/* ═══════════════ KWITANSI PINJAMAN ═══════════════ */}
      {showKwitansi && lastPinjaman && (
        <KwitansiPinjaman
          data={{
            ...lastPinjaman,
            potongan: {
              administrasi,
              danaResiko,
              danaSosial,
              insentifPJ,
              biayaMaterai,
              biayaNotaris,
              biayaBpjstk,
            },
            masaBpjstk: parseInt(formData.masaBpjstk) || 0,
            opsiSwk: formData.opsiSwk,
          } as Parameters<typeof KwitansiPinjaman>[0]['data']}
          onClose={() => { setShowKwitansi(false); setLastPinjaman(null); }}
        />
      )}

      {/* Import Excel Modal */}
      {showImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Import Data Pinjaman dari Excel</h2>
              <Button variant="ghost" size="sm" onClick={handleImportCancel}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <p className="text-sm text-gray-600 mb-2">Pilih file Excel (.xlsx, .xls, .csv) yang berisi data pinjaman</p>
                <p className="text-xs text-gray-400 mb-4">Kolom yang dibutuhkan: nama, tanggalPinjam, besarPinjaman, bunga, jangkaWaktu, jenisPinjaman</p>
                <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFileSelect} className="hidden" id="import-pinjaman-file" />
                <label htmlFor="import-pinjaman-file" className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">
                  <Upload className="mr-2 h-4 w-4" />
                  Pilih File Excel
                </label>
                {importFile && (<p className="text-sm text-green-600 mt-2">File terpilih: <strong>{importFile.name}</strong></p>)}
              </div>
{importError && (
                 <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                   <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                   <div className="text-sm whitespace-pre-line">{importError}</div>
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
                        <tr><th className="px-2 py-1 text-left">NAMA</th><th className="px-2 py-1 text-left">Jumlah</th><th className="px-2 py-1 text-left">Bunga</th></tr>
                      </thead>
                      <tbody className="divide-y divide-green-100">
                        {(importPreview as any[]).slice(0, 20).map((row, idx) => (
                          <tr key={idx}><td className="px-2 py-1">{row.anggota || '-'}</td><td className="px-2 py-1">{row.jumlah || '-'}</td><td className="px-2 py-1">{row.bunga || '-'}</td></tr>
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
      {showDetail && selectedPinjaman && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Detail Pinjaman</h2>
              <Button variant="ghost" size="sm" onClick={closeDetail}><X className="h-4 w-4" /></Button>
            </div>
            <div className="space-y-3">
              <div><p className="text-xs font-medium text-gray-400 uppercase">ID Pinjaman</p><p className="text-sm">{selectedPinjaman.id}</p></div>
              <div><p className="text-xs font-medium text-gray-400 uppercase">Anggota</p><p className="text-sm">{selectedPinjaman.anggota}</p></div>
              <div><p className="text-xs font-medium text-gray-400 uppercase">Jumlah</p><p className="text-sm">Rp {selectedPinjaman.jumlah.toLocaleString('id-ID')}</p></div>
              <div><p className="text-xs font-medium text-gray-400 uppercase">Bunga</p><p className="text-sm">{selectedPinjaman.bunga}%</p></div>
              <div><p className="text-xs font-medium text-gray-400 uppercase">Tenor</p><p className="text-sm">{selectedPinjaman.tenor} bulan</p></div>
              <div><p className="text-xs font-medium text-gray-400 uppercase">Angsuran/Bulan</p><p className="text-sm">Rp {selectedPinjaman.angsuran.toLocaleString('id-ID')}</p></div>
              <div><p className="text-xs font-medium text-gray-400 uppercase">Sisa</p><p className="text-sm">Rp {selectedPinjaman.sisa.toLocaleString('id-ID')}</p></div>
              <div><p className="text-xs font-medium text-gray-400 uppercase">Status</p><p className="text-sm">{selectedPinjaman.status}</p></div>
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
              <h2 className="text-xl font-bold text-gray-900">Edit Pinjaman</h2>
              <Button variant="ghost" size="sm" onClick={closeEdit}><X className="h-4 w-4" /></Button>
            </div>
            <form onSubmit={handleEditSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Anggota *</label>
                <Input type="text" value={editData.anggota} onChange={(e) => setEditData({...editData, anggota: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Pinjaman (Rp) *</label>
                <Input type="number" min="0" value={editData.jumlah} onChange={(e) => setEditData({...editData, jumlah: Number(e.target.value)})} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bunga (%) *</label>
                <Input type="number" min="0" step="0.1" value={editData.bunga} onChange={(e) => setEditData({...editData, bunga: Number(e.target.value)})} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tenor (bulan) *</label>
                <Input type="number" min="0" value={editData.tenor} onChange={(e) => setEditData({...editData, tenor: Number(e.target.value)})} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Angsuran/Bulan (Rp) *</label>
                <Input type="number" min="0" value={editData.angsuran} onChange={(e) => setEditData({...editData, angsuran: Number(e.target.value)})} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sisa Pinjaman (Rp) *</label>
                <Input type="number" min="0" value={editData.sisa} onChange={(e) => setEditData({...editData, sisa: Number(e.target.value)})} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                <select value={editData.status} onChange={(e) => setEditData({...editData, status: e.target.value as any})} className="w-full px-3 py-2 border" required>
                  <option value="Aktif">Aktif</option>
                  <option value="Lunas">Lunas</option>
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