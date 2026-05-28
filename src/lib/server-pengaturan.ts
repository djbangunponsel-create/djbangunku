import { libsqlDb } from '@/lib/database/db';

export async function getPengaturanServer(): Promise<any> {
  try {
    const result = await libsqlDb.execute(
      'SELECT id, logo, namaKsp, alamat, badanHukum, telepon, email, ketuaKoperasi, sekretaris, bendahara, managerOperasional, kasir, admin, penjamin FROM Pengaturan_KSP WHERE id = \'main\''
    );
    const rows = (result as any).rows ?? [];
    if (rows.length === 0) {
      return {
        id: 'main',
        logo: '',
        namaKsp: 'KSP Mulia Dana Sejahtera',
        alamat: 'Desa Sungai Bundung, Kecamatan Marabahan, Kabupaten Barito Kuala',
        badanHukum: '',
        email: '',
        telepon: '',
        ketuaKoperasi: '',
        sekretaris: '',
        bendahara: '',
        managerOperasional: '',
        kasir: '',
        admin: '',
        penjamin: []
      };
    }
    const row = rows[0];
    return {
      id: row.id,
      logo: row.logo,
      namaKsp: row.namaKsp,
      alamat: row.alamat,
      badanHukum: row.badanHukum || '',
      telepon: row.telepon || '',
      email: row.email || '',
      ketuaKoperasi: row.ketuaKoperasi || '',
      sekretaris: row.sekretaris || '',
      bendahara: row.bendahara || '',
      managerOperasional: row.managerOperasional || '',
      kasir: row.kasir || '',
      admin: row.admin || '',
      penjamin: row.penjamin ? JSON.parse(row.penjamin) : []
    };
  } catch {
    return {
      id: 'main',
      logo: '',
      namaKsp: 'KSP Mulia Dana Sejahtera',
      alamat: 'Desa Sungai Bundung, Kecamatan Marabahan, Kabupaten Barito Kuala',
      badanHukum: '',
      email: '',
      telepon: '',
      ketuaKoperasi: '',
      sekretaris: '',
      bendahara: '',
      managerOperasional: '',
      kasir: '',
      admin: '',
      penjamin: []
    };
  }
}