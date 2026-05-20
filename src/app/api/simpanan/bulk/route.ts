import { NextResponse } from 'next/server';
import { libsqlDb } from '@/lib/database/db';

// Row helper
function toRow(raw: any): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (v !== null && v !== undefined && v !== '') obj[k] = v;
  }
  return obj;
}

// POST /api/simpanan/bulk — raw SQL ON CONFLICT upsert per row
// Returns { success, failed, total }
export async function POST(req: Request) {
  try {
    const body       = await req.json();
    const rows: Array<Record<string, unknown>> = Array.isArray(body?.rows)
      ? body.rows
      : [];

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Tidak ada data untuk di-import' },
        { status: 400 }
      );
    }

    let success = 0;
    let failed  = 0;

    // Upsert SQL — preserves created_at via COALESCE on INSERT path
    const UPSERT_SQL = [
      'INSERT INTO simpanan',
      '(id, no_anggota, nama_anggota, tipe, jumlah, tanggal_setor, status, created_at)',
      'VALUES (?, ?, ?, ?, ?, ?, ?, COALESCE(?, datetime(\'now\')))',
      'ON CONFLICT(id) DO UPDATE SET',
      '  no_anggota    = excluded.no_anggota,',
      '  nama_anggota  = excluded.nama_anggota,',
      '  tipe          = excluded.tipe,',
      '  jumlah        = excluded.jumlah,',
      '  tanggal_setor = excluded.tanggal_setor,',
      '  status        = excluded.status',
    ].join(' ');

    for (const r of rows) {
      try {
        // Skip any residual IMPTR-* test rows
        const rawId = String(r.id ?? '');
        if (rawId.startsWith('IMPTR-')) { success++; continue; }

        await libsqlDb.execute(UPSERT_SQL, [
          String(r.id         ?? ''),
          String(r.noAnggota  ?? ''),
          String(r.namaAnggota ?? ''),
          String(r.tipe       ?? 'Pokok'),
          Number(r.jumlah     ?? 0),
          String(r.tanggalSetor ?? ''),
          String(r.status     ?? 'Aktif'),
          // COALESCE placeholder — only used on fresh INSERT
          String(r.tanggalSetor ?? ''),
        ]);
        success++;
      } catch (rowErr) {
        console.error('Bulk row insert error:', rowErr, r);
        failed++;
      }
    }

    return NextResponse.json({ success, failed, total: rows.length });
  } catch (err) {
    console.error('POST /api/simpanan/bulk error:', err);
    const msg = (err as any)?.message || '';
    if (msg.toLowerCase().includes('no such table')) {
      return NextResponse.json(
        { error: 'Tabel simpanan belum dibuat. Jalankan migrasi dulu.' },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Gagal meng-import data', detail: msg },
      { status: 500 }
    );
  }
}
