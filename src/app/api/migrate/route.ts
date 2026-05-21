import { NextResponse } from 'next/server';
import { libsqlDb } from '@/lib/database/db';

/**
 * Migration endpoint: Copy localStorage data to server database
 * Call this once after deploying to persist existing data
 */
export async function POST(req: Request) {
  try {
    const { localStorageData } = await req.json();
    
    if (!localStorageData) {
      return NextResponse.json({ error: 'localStorageData required' }, { status: 400 });
    }

    const results = { anggota: 0, simpanan: 0, pinjaman: 0, errors: [] as string[] };

    // Migrate Anggota
    if (localStorageData.anggota?.length > 0) {
      for (const a of localStorageData.anggota) {
        try {
          await libsqlDb.execute(
            `INSERT OR REPLACE INTO Master_Anggota_KSP 
             (No_Anggota, NAMA_ANGGOTA, Jenis_Kelamin, Agama, NIK, Tempat_Lahir, Tanggal_Lahir, 
              TELEPON, Alamat, Tanggal_Masuk, Status_Perkawinan, Nama_Pasangan, Jumlah_Anak, 
              Nama_Ibu_Kandung, Nama_Saudara, No_HP_Saudara, Hubungan_Saudara, Pekerjaan, PENGHASILAN_per_Bulan)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              a.No_Anggota || a.noAnggota || '',
              a.NAMA_ANGGOTA || a.namaAnggota || '',
              a.Jenis_Kelamin || '',
              a.Agama || '',
              a.NIK || '',
              a.Tempat_Lahir || '',
              a.Tanggal_Lahir || '',
              a.TELEPON || '',
              a.Alamat || '',
              a.Tanggal_Masuk || '',
              a.Status_Perkawinan || '',
              a.Nama_Pasangan || '',
              a.Jumlah_Anak || 0,
              a.Nama_Ibu_Kandung || '',
              a.Nama_Saudara || '',
              a.No_HP_Saudara || '',
              a.Hubungan_Saudara || '',
              a.Pekerjaan || '',
              a.PENGHASILAN_per_Bulan || 0
            ]
          );
          results.anggota++;
        } catch (e: any) {
          results.errors.push(`Anggota ${a.No_Anggota}: ${e.message}`);
        }
      }
    }

    // Migrate Simpanan
    if (localStorageData.simpanan?.length > 0) {
      for (const s of localStorageData.simpanan) {
        try {
          await libsqlDb.execute(
            `INSERT OR REPLACE INTO Transaksi_Simpanan 
             (id, no_anggota, nama_anggota, tipe, jumlah, tanggal_setor, status, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              s.id || '',
              s.noAnggota || '',
              s.namaAnggota || '',
              s.tipe || 'Pokok',
              s.jumlah || 0,
              s.tanggalSetor || '',
              s.status || 'Aktif',
              s.createdAt || new Date().toISOString()
            ]
          );
          results.simpanan++;
        } catch (e: any) {
          results.errors.push(`Simpanan ${s.id}: ${e.message}`);
        }
      }
    }

    // Migrate Pinjaman
    if (localStorageData.pinjaman?.length > 0) {
      for (const p of localStorageData.pinjaman) {
        try {
          await libsqlDb.execute(
            `INSERT OR REPLACE INTO Transaksi_Pinjaman 
             (id, no_anggota, nama_anggota, tipe, jumlah, bunga, tenor, tanggal_pinjam, status, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              p.id || '',
              p.noAnggota || '',
              p.namaAnggota || '',
              p.tipe || '',
              p.jumlah || 0,
              p.bunga || 0,
              p.tenor || 0,
              p.tanggalPinjam || '',
              p.status || 'Aktif',
              p.createdAt || new Date().toISOString()
            ]
          );
          results.pinjaman++;
        } catch (e: any) {
          results.errors.push(`Pinjaman ${p.id}: ${e.message}`);
        }
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}