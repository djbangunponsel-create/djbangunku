import { NextResponse } from 'next/server';
import { libsqlDb } from '@/lib/database/db';

// POST /api/anggota/bulk — raw SQL INSERT per row, returns { success, failed, total }
export async function POST(req: Request) {
  try {
    const body = await req.json();
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
    let failed = 0;

    const INSERT_SQL = [
      'INSERT INTO Master_Anggota_KSP',
      '(No_Anggota, NAMA_ANGGOTA, Jenis_Kelamin, Agama, NIK, Tempat_Lahir, Tanggal_Lahir, TELEPON, Alamat, Tanggal_Masuk, Status_Perkawinan, Nama_Pasangan, Jumlah_Anak, Nama_Ibu_Kandung, Nama_Saudara, No_HP_Saudara, Hubungan_Saudara, Pekerjaan, PENGHASILAN_per_Bulan)',
      'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    ].join(' ');

    for (const r of rows) {
      try {
        await libsqlDb.execute(INSERT_SQL, [
          String(r.No_Anggota ?? r.noAnggota ?? ''),
          String(r.NAMA ?? r.NAMA_ANGGOTA ?? r.namaAnggota ?? ''),
          String(r.Jenis_Kelamin ?? r.jenisKelamin ?? ''),
          String(r.Agama ?? r.agama ?? ''),
          String(r.NIK ?? r.nik ?? ''),
          String(r.Tempat_Lahir ?? r.tempatLahir ?? ''),
          String(r.Tanggal_Lahir ?? r.tanggalLahir ?? ''),
          String(r.TELEPON ?? r.telepon ?? ''),
          String(r.Alamat ?? r.alamat ?? ''),
          String(r.Tanggal_Masuk ?? r.tanggalMasuk ?? ''),
          String(r.Status_Perkawinan ?? r.statusPerkawinan ?? ''),
          String(r.Nama_Pasangan ?? r.namaPasangan ?? ''),
          Number(r.Jumlah_Anak ?? r.jumlahAnak ?? 0),
          String(r.Nama_Ibu_Kandung ?? r.namaIbuKandung ?? ''),
          String(r.Nama_Saudara ?? r.namaSaudara ?? ''),
          String(r.No_HP_Saudara ?? r.noHpSaudara ?? ''),
          String(r.Hubungan_Saudara ?? r.hubunganSaudara ?? ''),
          String(r.Pekerjaan ?? r.pekerjaan ?? ''),
          Number(r.PENGHASILAN_per_Bulan ?? r.penghasilanPerBulan ?? 0),
        ]);
        success++;
      } catch (rowErr: any) {
        console.error('Bulk anggota insert error:', rowErr, r);
        failed++;
      }
    }

    return NextResponse.json({ success, failed, total: rows.length });
  } catch (err) {
    console.error('POST /api/anggota/bulk error:', err);
    const msg = (err as any)?.message || '';
    if (msg.toLowerCase().includes('no such table')) {
      return NextResponse.json(
        { error: 'Tabel Master_Anggota_KSP belum dibuat. Jalankan migrasi dulu.' },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Gagal meng-import data', detail: msg },
      { status: 500 }
    );
  }
}
