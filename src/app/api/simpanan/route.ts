import { NextResponse } from 'next/server';
import { db } from '@/lib/database/db';
import { simpanan } from '@/lib/database/schema';
import { eq, asc } from 'drizzle-orm';

// GET  /api/simpanan  — return all simpanan rows ordered by tanggal desc
export async function GET() {
  try {
    const rows = await db
      .select()
      .from(simpanan)
      .orderBy(asc(simpanan.tanggalSetor));
    return NextResponse.json(rows);
  } catch (err) {
    console.error('GET /api/simpanan error:', err);
    return NextResponse.json({ error: 'Gagal mengambil data simpanan' }, { status: 500 });
  }
}

// POST /api/simpanan  — insert a single row (body = one simpanan object)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      noAnggota,
      namaAnggota,
      tipe,
      jumlah,
      tanggalSetor,
      status,
    } = body;

    if (!id || !noAnggota || !jumlah) {
      return NextResponse.json(
        { error: 'Field id, noAnggota, dan jumlah wajib diisi' },
        { status: 400 }
      );
    }

    // Upsert: insert or replace if id already exists
    await db
      .insert(simpanan)
      .values({
        id: String(id),
        noAnggota:  String(noAnggota),
        namaAnggota: String(namaAnggota ?? ''),
        tipe:       String(tipe ?? 'Pokok'),
        jumlah:     Number(jumlah),
        tanggalSetor: String(tanggalSetor ?? ''),
        status:     String(status ?? 'Aktif'),
      })
      .onConflictDoUpdate({
        target: simpanan.id,
        set: {
          noAnggota: String(noAnggota),
          namaAnggota: String(namaAnggota ?? ''),
          tipe:       String(tipe ?? 'Pokok'),
          jumlah:     Number(jumlah),
          tanggalSetor: String(tanggalSetor ?? ''),
          status:     String(status ?? 'Aktif'),
        },
      });

    return NextResponse.json({ success: true, id: String(id) });
  } catch (err) {
    console.error('POST /api/simpanan error:', err);
    return NextResponse.json({ error: 'Gagal menyimpan transaksi simpanan' }, { status: 500 });
  }
}
