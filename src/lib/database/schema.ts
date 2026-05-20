import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// ── Simpanan transaksi table ────────────────────────────────────
export const simpanan = sqliteTable('simpanan', {
  id:           text('id').primaryKey(),
  noAnggota:    text('no_anggota').notNull(),
  namaAnggota:  text('nama_anggota').notNull(),
  tipe:         text('tipe').notNull(),         // 'Pokok' | 'Wajib' | 'Sukarela'
  jumlah:       integer('jumlah').notNull(),    // Rupiah satuan (tanpa desimal)
  tanggalSetor: text('tanggal_setor').notNull(), // YYYY-MM-DD
  status:       text('status').notNull(),       // 'Aktif' | 'Ditarik'
  createdAt:    text('created_at').$defaultFn(() => new Date().toISOString()),
});

export type SimpananRow = typeof simpanan.$inferSelect;
