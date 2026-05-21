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
      'SELECT No_Anggota as noAnggota, NAMA_ANGGOTA as namaAnggota, Jenis_Kelamin as jenisKelamin, Agama as agama, NIK as nik, Tempat_Lahir as tempatLahir, Tanggal_Lahir as tanggalLahir, TELEPON as telepon, Alamat as alamat, Tanggal_Masuk as tanggalMasuk, Status_Perkawinan as statusPerkawinan, Nama_Pasangan as namaPasangan, Jumlah_Anak as jumlahAnak, Nama_Ibu_Kandung as namaIbuKandung, Nama_Saudara as namaSaudara, No_HP_Saudara as noHpSaudara, Hubungan_Saudara as hubunganSaudara, Pekerjaan as pekerjaan, PENGHASILAN_per_Bulan as penghasilanPerBulan FROM Master_Anggota_KSP ORDER BY NAMA_ANGGOTA ASC'
    );
    const rows = (result as any).rows ?? [];
    return NextResponse.json(rows.map(toRow));
  } catch (err: any) {
    const msg = (err?.message || '').toLowerCase();
    if (msg.includes('no such table') || msg.includes('does not exist')) {
      return NextResponse.json([]);
    }
    return NextResponse.json(
      { error: 'Gagal mengambil data anggota', detail: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      noAnggota, namaAnggota, jenisKelamin, agama, nik,
      tempatLahir, tanggalLahir, telepon, alamat, tanggalMasuk,
      statusPerkawinan, namaPasangan, jumlahAnak, namaIbuKandung,
      namaSaudara, noHpSaudara, hubunganSaudara, pekerjaan, penghasilanPerBulan
    } = body;

    if (!noAnggota || !namaAnggota) {
      return NextResponse.json(
        { error: 'Field noAnggota dan namaAnggota wajib diisi' },
        { status: 400 }
      );
    }

    await libsqlDb.execute(
      `INSERT INTO Master_Anggota_KSP
         (No_Anggota, NAMA_ANGGOTA, Jenis_Kelamin, Agama, NIK, Tempat_Lahir, Tanggal_Lahir, TELEPON, Alamat, Tanggal_Masuk, Status_Perkawinan, Nama_Pasangan, Jumlah_Anak, Nama_Ibu_Kandung, Nama_Saudara, No_HP_Saudara, Hubungan_Saudara, Pekerjaan, PENGHASILAN_per_Bulan)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        String(noAnggota), String(namaAnggota), String(jenisKelamin ?? ''),
        String(agama ?? ''), String(nik ?? ''), String(tempatLahir ?? ''),
        String(tanggalLahir ?? ''), String(telepon ?? ''), String(alamat ?? ''),
        String(tanggalMasuk ?? ''), String(statusPerkawinan ?? ''),
        String(namaPasangan ?? ''), Number(jumlahAnak ?? 0), String(namaIbuKandung ?? ''),
        String(namaSaudara ?? ''), String(noHpSaudara ?? ''), String(hubunganSaudara ?? ''),
        String(pekerjaan ?? ''), Number(penghasilanPerBulan ?? 0)
      ]
    );

    return NextResponse.json({ success: true, noAnggota: String(noAnggota) });
  } catch (err) {
    const msg = (err as any)?.message || '';
    if (msg.toLowerCase().includes('no such table')) {
      return NextResponse.json(
        { error: 'Tabel Master_Anggota_KSP belum dibuat. Jalankan migrasi dulu.' },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Gagal menyimpan data anggota', detail: msg },
      { status: 500 }
    );
  }
}