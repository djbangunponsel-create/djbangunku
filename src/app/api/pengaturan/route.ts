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
      'SELECT id, logo, namaKsp, alamat, telepon, ketuaKoperasi, sekretaris, bendahara, managerOperasional, kasir, admin, penjamin FROM Pengaturan_KSP WHERE id = \'main\''
    );
    const rows = (result as any).rows ?? [];
    if (rows.length === 0) {
      return NextResponse.json({
        id: 'main',
        logo: '',
        namaKsp: 'KSP Mulia Dana Sejahtera',
        alamat: 'Desa Sungai Bundung, Kecamatan Marabahan, Kabupaten Barito Kuala',
        telepon: '',
        ketuaKoperasi: '',
        sekretaris: '',
        bendahara: '',
        managerOperasional: '',
        kasir: '',
        admin: '',
        penjamin: []
      });
    }
    return NextResponse.json(toRow(rows[0]));
  } catch (err: any) {
    const msg = (err?.message || '').toLowerCase();
    if (msg.includes('no such table') || msg.includes('does not exist')) {
      return NextResponse.json({
        id: 'main',
        logo: '',
        namaKsp: 'KSP Mulia Dana Sejahtera',
        alamat: 'Desa Sungai Bundung, Kecamatan Marabahan, Kabupaten Barito Kuala',
        telepon: '',
        ketuaKoperasi: '',
        sekretaris: '',
        bendahara: '',
        managerOperasional: '',
        kasir: '',
        admin: '',
        penjamin: []
      });
    }
    return NextResponse.json(
      { error: 'Gagal mengambil data pengaturan', detail: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      logo, namaKsp, alamat, telepon, ketuaKoperasi, sekretaris,
      bendahara, managerOperasional, kasir, admin, penjamin
    } = body;

    await libsqlDb.execute(
      `INSERT INTO Pengaturan_KSP
         (id, logo, namaKsp, alamat, telepon, ketuaKoperasi, sekretaris, bendahara, managerOperasional, kasir, admin, penjamin)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         logo     = excluded.logo,
         namaKsp  = excluded.namaKsp,
         alamat   = excluded.alamat,
         telepon  = excluded.telepon,
         ketuaKoperasi = excluded.ketuaKoperasi,
         sekretaris  = excluded.sekretaris,
         bendahara   = excluded.bendahara,
         managerOperasional = excluded.managerOperasional,
         kasir   = excluded.kasir,
         admin   = excluded.admin,
         penjamin = excluded.penjamin`,
      [
        'main', String(logo ?? ''), String(namaKsp ?? ''), String(alamat ?? ''),
        String(telepon ?? ''), String(ketuaKoperasi ?? ''), String(sekretaris ?? ''),
        String(bendahara ?? ''), String(managerOperasional ?? ''), String(kasir ?? ''),
        String(admin ?? ''), JSON.stringify(penjamin ?? [])
      ]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = (err as any)?.message || '';
    if (msg.toLowerCase().includes('no such table')) {
      return NextResponse.json(
        { error: 'Tabel Pengaturan_KSP belum dibuat. Jalankan migrasi dulu.' },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Gagal menyimpan data pengaturan', detail: msg },
      { status: 500 }
    );
  }
}