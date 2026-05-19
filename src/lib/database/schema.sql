-- Schema Database Master_Anggota_KSP
-- Tabel untuk menyimpan data anggota KSP Mulia Dana Sejahtera

CREATE TABLE IF NOT EXISTS Master_Anggota_KSP (
    No_Anggota VARCHAR(20) PRIMARY KEY UNIQUE NOT NULL,
    NAMA_ANGGOTA VARCHAR(100) NOT NULL,
    Jenis_Kelamin ENUM('Laki-laki', 'Perempuan') NOT NULL,
    Agama ENUM('Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Khonghucu') NOT NULL,
    NIK CHAR(16) NOT NULL CHECK (NIK REGEXP '^[0-9]{16}$'),
    Tempat_Lahir VARCHAR(50) NOT NULL,
    Tanggal_Lahir DATE NOT NULL,
    TELEPON VARCHAR(20),
    Alamat TEXT,
    Tanggal_Masuk DATE NOT NULL,
    Status_Perkawinan ENUM('Belum Kawin', 'Kawin', 'Cerai Hidup', 'Cerai Mati') NOT NULL,
    Nama_Pasangan VARCHAR(100),
    Jumlah_Anak INT DEFAULT 0 CHECK (Jumlah_Anak >= 0),
    Nama_Ibu_Kandung VARCHAR(100) NOT NULL,
    Nama_Saudara VARCHAR(100) NOT NULL,
    No_HP_Saudara VARCHAR(20) NOT NULL,
    Hubungan_Saudara VARCHAR(50) NOT NULL,
    Pekerjaan VARCHAR(100),
    PENGHASILAN_per_Bulan DECIMAL(15, 2) DEFAULT 0.00 CHECK (PENGHASILAN_per_Bulan >= 0),
    
    -- Index untuk pencarian
    INDEX idx_nik (NIK),
    INDEX idx_nama (NAMA_ANGGOTA),
    INDEX idx_telepon (TELEPON)
);

-- Trigger untuk format No_Anggota otomatis (opsional)
DELIMITER //
CREATE TRIGGER before_anggota_insert
BEFORE INSERT ON Master_Anggota_KSP
FOR EACH ROW
BEGIN
    IF NEW.No_Anggota IS NULL OR NEW.No_Anggota = '' THEN
        SET NEW.No_Anggota = CONCAT('AG', LPAD(LAST_INSERT_ID() + 1, 6, '0'));
    END IF;
END//
DELIMITER ;