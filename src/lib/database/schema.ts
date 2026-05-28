import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// ── Master Anggota KSP Table ───────────────────────────────────────
export const masterAnggotaKsp = sqliteTable('Master_Anggota_KSP', {
  noAnggota: text('No_Anggota').primaryKey(),
  namaAnggota: text('NAMA_ANGGOTA').notNull(),
  jenisKelamin: text('Jenis_Kelamin').notNull(),
  agama: text('Agama').notNull(),
  nik: text('NIK').notNull(),
  tempatLahir: text('Tempat_Lahir').notNull(),
  tanggalLahir: text('Tanggal_Lahir').notNull(),
  telepon: text('TELEPON'),
  alamat: text('Alamat'),
  tanggalMasuk: text('Tanggal_Masuk').notNull(),
  statusPerkawinan: text('Status_Perkawinan').notNull(),
  namaPasangan: text('Nama_Pasangan'),
  jumlahAnak: integer('Jumlah_Anak').default(0),
  namaIbuKandung: text('Nama_Ibu_Kandung').notNull(),
  namaSaudara: text('Nama_Saudara').notNull(),
  noHpSaudara: text('No_HP_Saudara').notNull(),
  hubunganSaudara: text('Hubungan_Saudara').notNull(),
  pekerjaan: text('Pekerjaan'),
  penghasilanPerBulan: integer('PENGHASILAN_per_Bulan').default(0),
});

export type MasterAnggota = typeof masterAnggotaKsp.$inferSelect;

// ── Transaksi Simpanan Table ──────────────────────────────────────
export const simpanan = sqliteTable('Transaksi_Simpanan', {
  id: text('id').primaryKey(),
  noAnggota: text('no_anggota').notNull(),
  namaAnggota: text('nama_anggota').notNull(),
  tipe: text('tipe').notNull(),
  jumlah: integer('jumlah').notNull(),
  tanggalSetor: text('tanggal_setor').notNull(),
  status: text('status').notNull(),
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
});

export type SimpananRow = typeof simpanan.$inferSelect;

// ── Transaksi Pinjaman Table ───────────────────────────────────────
export const pinjaman = sqliteTable('Transaksi_Pinjaman', {
  id: text('id').primaryKey(),
  noAnggota: text('no_anggota').notNull(),
  namaAnggota: text('nama_anggota').notNull(),
  tipe: text('tipe').notNull(),
  jumlah: integer('jumlah').notNull(),
  bunga: integer('bunga').default(0),
  tenor: integer('tenor').notNull(),
  tanggalPinjam: text('tanggal_pinjam').notNull(),
  status: text('status').notNull(),
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
});

export type PinjamanRow = typeof pinjaman.$inferSelect;

// ── Pengaturan KSP Table ───────────────────────────────────────────
export const pengaturanKsp = sqliteTable('Pengaturan_KSP', {
  id: text('id').primaryKey().default('main'),
  logo: text('logo'),
  namaKsp: text('namaKsp').notNull(),
  alamat: text('alamat').notNull(),
  badanHukum: text('badanHukum'),
  telepon: text('telepon'),
  email: text('email'),
  ketuaKoperasi: text('ketuaKoperasi'),
  sekretaris: text('sekretaris'),
  bendahara: text('bendahara'),
  managerOperasional: text('managerOperasional'),
  kasir: text('kasir'),
  admin: text('admin'),
  penjamin: text('penjamin', { mode: 'json' }).$type<string[]>(),
});

export type PengaturanRow = typeof pengaturanKsp.$inferSelect;
