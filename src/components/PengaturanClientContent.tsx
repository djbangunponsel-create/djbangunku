'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Upload, Trash2, Plus, Save, Eye, User } from 'lucide-react';
import { readStored, writeStored, KEYS, readAllAnggota } from '@/lib/storage';

// ── Default empty shape ──────────────────────────────────────────
const EMPTY_SETTINGS: KspSettings = {
  logo: '',
  namaKsp: 'KSP Mulia Dana Sejahtera',
  alamat: 'Desa Sungai Bundung, Kecamatan Marabahan, Kabupaten Barito Kuala',
  badanHukum: '',
  telepon: '',
  email: '',
  ketuaKoperasi: '',
  sekretaris: '',
  bendahara: '',
  managerOperasional: '',
  kasir: '',
  admin: '',
  penjamin: [],
};

interface KspSettings {
  logo: string;
  namaKsp: string;
  alamat: string;
  badanHukum: string;
  telepon: string;
  email: string;
  ketuaKoperasi: string;
  sekretaris: string;
  bendahara: string;
  managerOperasional: string;
  kasir: string;
  admin: string;
  penjamin: string[];
}

// ── Anggota dropdown helper ──────────────────────────────────────
function getAllAnggotaNames(): string[] {
  const rows = readAllAnggota();
  const names = new Set<string>();
  for (const r of rows) {
    const n = String((r as any).NAMA_ANGGOTA ?? (r as any).nama ?? '').trim();
    if (n) names.add(n);
  }
  return [...names].sort((a, b) => a.localeCompare(b, 'id-ID'));
}

// ── Deterministic local fallback key (no seed drift between builds) ──
function toLocalKey(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h * 31) ^ s.charCodeAt(i)) >>> 0;
  }
  return h % 360;
}

export default function PengaturanClientContent() {
  const [settings, setSettings] = useState<KspSettings>(() => {
    const stored = readStored<KspSettings | null>(KEYS.SETTINGS, null);
    if (stored) {
      return {
        ...EMPTY_SETTINGS,
        ...stored,
        penjamin: stored.penjamin ?? [],
      };
    }
    return EMPTY_SETTINGS;
  });
  const [saved, setSaved] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Logo upload ──────────────────────────────────────────────
  const readLogoFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const buf = await file.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    const b64 = btoa(binary);
    if (b64.length > 2_000_000) return; // ~1.5 MB guard
    setSettings((prev) => ({ ...prev, logo: `data:${file.type};base64,${b64}` }));
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) await readLogoFile(f);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) await readLogoFile(f);
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);

  const removeLogo = () => setSettings((prev) => ({ ...prev, logo: '' }));

  // ── Field change ─────────────────────────────────────────────
  const updateField = <K extends keyof KspSettings>(key: K, value: KspSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  // ── Penjamin add/remove ───────────────────────────────────────
  const addPenjamin = () => {
    setSettings((prev) => ({ ...prev, penjamin: [...prev.penjamin, ''] }));
    setSaved(false);
  };

  const removePenjamin = (idx: number) => {
    setSettings((prev) => ({
      ...prev,
      penjamin: prev.penjamin.filter((_, i) => i !== idx),
    }));
    setSaved(false);
  };

  const updatePenjamin = (idx: number, value: string) => {
    setSettings((prev) => {
      const next = [...prev.penjamin];
      next[idx] = value;
      return { ...prev, penjamin: next };
    });
    setSaved(false);
  };

  // ── Save ─────────────────────────────────────────────────────
  const handleSave = () => {
    const ok = writeStored(KEYS.SETTINGS, settings);
    setSaved(ok);
  };

  // Local deterministic colour palette for the logo placeholder
  const logoBg = settings.logo
    ? undefined
    : (() => {
        const hue = toLocalKey(settings.namaKsp || 'KSP');
        return `hsl(${hue}, 55%, 88%)`;
      })();
  const logoFg = settings.logo
    ? undefined
    : (() => {
        const hue = toLocalKey(settings.namaKsp || 'KSP');
        return `hsl(${hue}, 55%, 28%)`;
      })();

  const anggotaOptions = getAllAnggotaNames();
  const isSettingsLoaded = settings !== null;

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* ─── Page Header ───────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Settings className="w-7 h-7 text-blue-600" />
        <h1 className="text-2xl font-bold" style={{ color: '#1E3A5F' }}>
          Pengaturan KSP
        </h1>
      </div>

      {!isSettingsLoaded && (
        <p className="text-sm text-gray-400">Memuat pengaturan…</p>
      )}

      {/* ══════════════════════════════════════════════════════════
           BAGIAN 1 — LOGO & IDENTITAS KOPERASI
           ══════════════════════════════════════════════════════════ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold tracking-wide" style={{ color: '#1E3A5F' }}>
            Logo &amp; Identitas Koperasi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Logo drop-zone */}
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              cursor-pointer rounded-lg border-2 border-dashed p-6 flex flex-col items-center gap-2
              transition-colors select-none
              ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
            `}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleFileChange}
              className="hidden"
            />
            {settings.logo ? (
              <img
                src={settings.logo}
                alt="Logo KSP"
                className="w-32 h-32 object-contain rounded-lg border border-gray-200"
              />
            ) : (
              logoBg && logoFg && (
                <div
                  className="w-32 h-32 rounded-lg flex items-center justify-center text-3xl font-black border border-gray-300"
                  style={{ background: logoBg, color: logoFg }}
                >
                  {settings.namaKsp.charAt(0).toUpperCase()}
                </div>
              )
            )}
            <span className="text-xs text-gray-500 text-center">
              {settings.logo ? 'Klik untuk ganti logo' : 'Klik atau seret gambar ke sini (.png / .jpg / .jpeg)'}
            </span>
            {settings.logo && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => { e.stopPropagation(); removeLogo(); }}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-1"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" /> Hapus Logo
              </Button>
            )}
          </div>

          {/* Nama KSP */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Nama KSP</label>
            <Input
              value={settings.namaKsp}
              onChange={(e) => updateField('namaKsp', e.target.value)}
              placeholder="Contoh: KSP Mulia Dana Sejahtera"
            />
          </div>

          {/* Alamat */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Alamat Lengkap KSP</label>
            <Textarea
              value={settings.alamat}
              onChange={(e) => updateField('alamat', e.target.value)}
              placeholder="Desa …, Kecamatan …, Kabupaten …"
              rows={2}
            />
          </div>

          {/* Badan Hukum ───┐┌─ Telepon ─────────────────┐ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Nomor Badan Hukum</label>
              <Input
                value={settings.badanHukum}
                onChange={(e) => updateField('badanHukum', e.target.value)}
                placeholder="AHU-…./AH.01.1/…"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Nomor Telepon</label>
              <Input
                value={settings.telepon}
                onChange={(e) => updateField('telepon', e.target.value)}
                placeholder="0812-xxxx-xxxx"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Email KSP</label>
              <Input
                value={settings.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="ksp@domain.com"
                type="email"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ══════════════════════════════════════════════════════════
           BAGIAN 2 — MANAJEMEN &amp; PENGURUS INTI
           ══════════════════════════════════════════════════════════ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold tracking-wide" style={{ color: '#1E3A5F' }}>
            Manajemen &amp; Pengurus Inti
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PengurusSelect
            label="Ketua Koperasi"
            value={settings.ketuaKoperasi}
            onChange={(v) => updateField('ketuaKoperasi', v)}
            options={anggotaOptions}
            placeholder="Pilih dari data Anggota atau ketik manual…"
          />
          <PengurusSelect
            label="Sekretaris"
            value={settings.sekretaris}
            onChange={(v) => updateField('sekretaris', v)}
            options={anggotaOptions}
            placeholder="Pilih dari data Anggota atau ketik manual…"
          />
          <PengurusSelect
            label="Bendahara"
            value={settings.bendahara}
            onChange={(v) => updateField('bendahara', v)}
            options={anggotaOptions}
            placeholder="Pilih dari data Anggota atau ketik manual…"
          />
          <PengurusSelect
            label="Manager Operasional"
            value={settings.managerOperasional}
            onChange={(v) => updateField('managerOperasional', v)}
            options={anggotaOptions}
            placeholder="Pilih dari data Anggota atau ketik manual…"
          />
        </CardContent>
      </Card>

      {/* ══════════════════════════════════════════════════════════
           BAGIAN 3 — TIM OPERASIONAL / PETUGAS LAPANGAN
           ══════════════════════════════════════════════════════════ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold tracking-wide" style={{ color: '#1E3A5F' }}>
            Tim Operasional / Petugas Lapangan
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PengurusSelect
            label="Kasir"
            value={settings.kasir}
            onChange={(v) => updateField('kasir', v)}
            options={anggotaOptions}
            placeholder="Nama petugas kasir…"
          />
          <PengurusSelect
            label="Admin"
            value={settings.admin}
            onChange={(v) => updateField('admin', v)}
            options={anggotaOptions}
            placeholder="Nama petugas admin…"
          />
        </CardContent>
      </Card>

      {/* ══════════════════════════════════════════════════════════
           BAGIAN 4 — STRUKTUR DATA PENJAMIN
           ══════════════════════════════════════════════════════════ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold tracking-wide" style={{ color: '#1E3A5F' }}>
            Struktur Data Penjamin
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {settings.penjamin.map((name, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <User className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              <Input
                value={name}
                onChange={(e) => updatePenjamin(idx, e.target.value)}
                placeholder={`Nama penjamin / lembaga penjamin #${idx + 1}`}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removePenjamin(idx)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addPenjamin} className="mt-1">
            <Plus className="w-4 h-4 mr-1" /> Tambah Penjamin
          </Button>
        </CardContent>
      </Card>

      {/* ══════════════════════════════════════════════════════════
           SIMPAN PENGATURAN
           ══════════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-3">
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white px-8">
          <Save className="w-4 h-4 mr-2" /> Simpan Pengaturan
        </Button>
        {saved && (
          <span className="text-sm text-green-600 font-medium flex items-center gap-1">
            <Eye className="w-4 h-4" /> Tersimpan
          </span>
        )}
      </div>
    </div>
  );
}

// ── Sub-component: Pengurus / Petugas select ─────────────────────
interface PengurusSelectProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}

function PengurusSelect({ label, value, onChange, options, placeholder }: PengurusSelectProps) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      <div className="flex gap-2">
        {/* Label alias only: dropdown from anggota + manual text override side-by-side */}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 h-9 rounded-md border border-gray-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <option value="">{placeholder}</option>
          {options.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Atau ketik manual…"
          className="flex-1"
        />
      </div>
    </div>
  );
}
