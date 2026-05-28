-- Master_Anggota_KSP table
CREATE TABLE IF NOT EXISTS Master_Anggota_KSP (
    No_Anggota TEXT PRIMARY KEY NOT NULL,
    NAMA_ANGGOTA TEXT NOT NULL,
    Jenis_Kelamin TEXT NOT NULL,
    Agama TEXT NOT NULL,
    NIK TEXT NOT NULL,
    Tempat_Lahir TEXT NOT NULL,
    Tanggal_Lahir TEXT NOT NULL,
    TELEPON TEXT,
    Alamat TEXT,
    Tanggal_Masuk TEXT NOT NULL,
    Status_Perkawinan TEXT NOT NULL,
    Nama_Pasangan TEXT,
    Jumlah_Anak INTEGER DEFAULT 0,
    Nama_Ibu_Kandung TEXT NOT NULL,
    Nama_Saudara TEXT NOT NULL,
    No_HP_Saudara TEXT NOT NULL,
    Hubungan_Saudara TEXT NOT NULL,
    Pekerjaan TEXT,
    PENGHASILAN_per_Bulan INTEGER DEFAULT 0
);

-- Transaksi_Pinjaman table
CREATE TABLE IF NOT EXISTS Transaksi_Pinjaman (
    id TEXT PRIMARY KEY NOT NULL,
    no_anggota TEXT NOT NULL,
    nama_anggota TEXT NOT NULL,
    tipe TEXT NOT NULL,
    jumlah INTEGER NOT NULL DEFAULT 0,
    bunga INTEGER DEFAULT 0,
    tenor INTEGER NOT NULL DEFAULT 0,
    tanggal_pinjam TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Aktif',
    created_at TEXT NOT NULL
);

-- Pengaturan_KSP table
CREATE TABLE IF NOT EXISTS Pengaturan_KSP (
    id TEXT PRIMARY KEY NOT NULL DEFAULT 'main',
    logo TEXT,
    namaKsp TEXT NOT NULL,
    alamat TEXT NOT NULL,
    badanHukum TEXT,
    telepon TEXT,
    email TEXT,
    ketuaKoperasi TEXT,
    sekretaris TEXT,
    bendahara TEXT,
    managerOperasional TEXT,
    kasir TEXT,
    admin TEXT,
    penjamin TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_anggota_nik ON Master_Anggota_KSP(NIK);
CREATE INDEX IF NOT EXISTS idx_anggota_nama ON Master_Anggota_KSP(NAMA_ANGGOTA);
CREATE INDEX IF NOT EXISTS idx_pinjaman_no_anggota ON Transaksi_Pinjaman(no_anggota);