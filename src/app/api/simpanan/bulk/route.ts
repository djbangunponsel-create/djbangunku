import { NextResponse } from 'next/server';
import { db } from '@/lib/database/db';
import { simpanan as simpananTable } from '@/lib/database/schema';
import { eq } from 'drizzle-orm';

// POST /api/simpanan/bulk  — insert multiple rows with per-row upsert
// Body: { rows: SimpananRow[] }
export async function POST(req: Request) {
  try {
    const body          = await req.json();
    const rows: Array<Record<string, unknown>> = Array.isArray(body?.rows)
      ? body.rows
      : [];

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Tidak ada data untuk di-import' }, { status: 400 });
    }

    let success = 0;
    let failed  = 0;

    for (const r of rows) {
      try {
        // Skip any residual IMPTR-* test rows (shouldn't arrive here, but guard anyway)
        const rawId = String(r.id ?? '');
        if (rawId.startsWith('IMPTR-')) continue;

        await db
          .insert(simpananTable)
          .values({
            id:           String(r.id ?? `TRX-${Date.now()}-${Math.round(Math.random() * 9999)}`),
            noAnggota:    String(r.noAnggota ?? ''),
            namaAnggota:  String(r.namaAnggota ?? ''),
            tipe:         String(r.tipe ?? 'Pokok'),
            jumlah:       Number(r.jumlah ?? 0),
            tanggalSetor: String(r.tanggalSetor ?? ''),
            status:       String(r.status ?? 'Aktif'),
          })
          .onConflictDoUpdate({
            target: simpananTable.id,
            set: {
              noAnggota:    String(r.noAnggota ?? ''),
              namaAnggota:  String(r.namaAnggota ?? ''),
              tipe:         String(r.tipe ?? 'Pokok'),
              jumlah:       Number(r.jumlah ?? 0),
              tanggalSetor: String(r.tanggalSetor ?? ''),
              status:       String(r.status ?? 'Aktif'),
            },
          });
        success++;
      } catch (rowErr) {
        console.error('Bulk row insert error:', rowErr, r);
        failed++;
      }
    }

    return NextResponse.json({ success, failed, total: rows.length });
  } catch (err) {
    console.error('POST /api/simpanan/bulk error:', err);
    return NextResponse.json({ error: 'Gagal meng-import data' }, { status: 500 });
  }
}
