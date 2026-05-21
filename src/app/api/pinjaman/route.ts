import { NextResponse } from 'next/server';
import { libsqlDb } from '@/lib/database/db';

function toRow(raw: any): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (v !== null && v !== undefined && v !== '') obj[k] = v;
  }
  return obj;
}

export async function GET() {
  try {
    const result = await libsqlDb.execute(
      'SELECT id, no_anggota as noAnggota, nama_anggota as namaAnggota, tipe, jumlah, bunga, tenor, tanggal_pinjam as tanggalPinjam, status, created_at as createdAt FROM Transaksi_Pinjaman ORDER BY tanggal_pinjam DESC'
    );
    const rows = (result as any).rows ?? [];
    return NextResponse.json(rows.map(toRow));
  } catch (err: any) {
    const msg = (err?.message || '').toLowerCase();
    if (msg.includes('no such table') || msg.includes('does not exist')) {
      return NextResponse.json([]);
    }
    return NextResponse.json(
      { error: 'Gagal mengambil data pinjaman', detail: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, noAnggota, namaAnggota, tipe, jumlah, bunga, tenor, tanggalPinjam, status } = body;

    if (!id || !noAnggota || jumlah === undefined) {
      return NextResponse.json(
        { error: 'Field id, noAnggota, dan jumlah wajib diisi' },
        { status: 400 }
      );
    }

    await libsqlDb.execute(
      `INSERT INTO Transaksi_Pinjaman
         (id, no_anggota, nama_anggota, tipe, jumlah, bunga, tenor, tanggal_pinjam, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
       ON CONFLICT(id) DO UPDATE SET
         no_anggota    = excluded.no_anggota,
         nama_anggota  = excluded.nama_anggota,
         tipe          = excluded.tipe,
         jumlah        = excluded.jumlah,
         bunga         = excluded.bunga,
         tenor         = excluded.tenor,
         tanggal_pinjam = excluded.tanggal_pinjam,
         status        = excluded.status`,
      [
        String(id), String(noAnggota), String(namaAnggota ?? ''),
        String(tipe ?? ''), Number(jumlah), Number(bunga ?? 0),
        Number(tenor ?? 0), String(tanggalPinjam ?? ''), String(status ?? 'Aktif')
      ]
    );

    return NextResponse.json({ success: true, id: String(id) });
  } catch (err) {
    const msg = (err as any)?.message || '';
    if (msg.toLowerCase().includes('no such table')) {
      return NextResponse.json(
        { error: 'Tabel Transaksi_Pinjaman belum dibuat. Jalankan migrasi dulu.' },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Gagal menyimpan data pinjaman', detail: msg },
      { status: 500 }
    );
  }
}