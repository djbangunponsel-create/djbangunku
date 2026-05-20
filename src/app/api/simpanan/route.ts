import { NextResponse } from 'next/server';
import { libsqlDb } from '@/lib/database/db';

// Row → plain object
function toRow(raw: any): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (v !== null && v !== undefined && v !== '') obj[k] = v;
  }
  return obj;
}

// ── GET /api/simpanan ────────────────────────────────────────────
// Returns [] for empty DB — no 500 on first visit; no 500 on empty table
export async function GET() {
  try {
    const result = await libsqlDb.execute(
      'SELECT id, no_anggota, nama_anggota, tipe, jumlah, tanggal_setor, status, created_at FROM simpanan ORDER BY tanggal_setor ASC'
    );
    const rows = (result as any).rows ?? [];
    return NextResponse.json(rows.map(toRow));
  } catch (err: any) {
    const msg = (err?.message || '').toLowerCase();
    // Table hasn't been created by migrations yet → graceful empty response
    if (msg.includes('no such table') || msg.includes('does not exist')) {
      return NextResponse.json([]);
    }
    console.error('GET /api/simpanan error:', err);
    return NextResponse.json(
      { error: 'Gagal mengambil data simpanan', detail: err.message },
      { status: 500 }
    );
  }
}

// ── POST /api/simpanan — upsert via ON CONFLICT(id) DO UPDATE ───
// upserts one row; preserves created_at on conflict (SQLite 3.24+)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, noAnggota, namaAnggota, tipe, jumlah, tanggalSetor, status } = body;

    if (!id || !noAnggota || jumlah === undefined) {
      return NextResponse.json(
        { error: 'Field id, noAnggota, dan jumlah wajib diisi' },
        { status: 400 }
      );
    }

    // ON CONFLICT(id) DO UPDATE — SQLite 3.24+
    // created_at only set on INSERT, never overwritten by DO UPDATE
    await libsqlDb.execute(
      `INSERT INTO simpanan
         (id, no_anggota, nama_anggota, tipe, jumlah, tanggal_setor, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
       ON CONFLICT(id) DO UPDATE SET
         no_anggota    = excluded.no_anggota,
         nama_anggota  = excluded.nama_anggota,
         tipe          = excluded.tipe,
         jumlah        = excluded.jumlah,
         tanggal_setor = excluded.tanggal_setor,
         status        = excluded.status`,
      [
        String(id),
        String(noAnggota),
        String(namaAnggota ?? ''),
        String(tipe ?? 'Pokok'),
        Number(jumlah),
        String(tanggalSetor ?? ''),
        String(status ?? 'Aktif'),
      ]
    );

    return NextResponse.json({ success: true, id: String(id) });
  } catch (err) {
    console.error('POST /api/simpanan error:', err);
    const msg = (err as any)?.message || '';
    if (msg.toLowerCase().includes('no such table')) {
      return NextResponse.json(
        { error: 'Tabel simpanan belum dibuat. Jalankan migrasi dulu.' },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Gagal menyimpan transaksi simpanan', detail: msg },
      { status: 500 }
    );
  }
}
