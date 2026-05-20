CREATE TABLE IF NOT EXISTS simpanan (
    id TEXT PRIMARY KEY NOT NULL,
    no_anggota TEXT NOT NULL,
    nama_anggota TEXT NOT NULL,
    tipe TEXT NOT NULL,
    jumlah INTEGER NOT NULL DEFAULT 0,
    tanggal_setor TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Aktif',
    created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_simpanan_tipe ON simpanan(tipe);
CREATE INDEX IF NOT EXISTS idx_simpanan_no_anggota ON simpanan(no_anggota);
