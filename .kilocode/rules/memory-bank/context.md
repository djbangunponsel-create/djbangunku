# Active Context: KSP Mulia Dana Sejahtera

## Current State

**Project Status**: ✅ Aplikasi KSP selesai dibuat dengan fitur lengkap

Aplikasi KSP (Koperasi Simpan Pinjam) Mulia Dana Sejahtera telah dibuat dengan fitur lengkap termasuk manajemen anggota, simpanan, pinjaman, laporan keuangan, dan statistik.

## Recently Completed

- [x] Aplikasi KSP Mulia Dana Sejahtera - halaman utama dengan dashboard
- [x] Halaman Data Anggota - kelola data anggota KSP dengan form pendaftaran anggota baru yang muncul saat menekan tombol "Tambah Anggota"
- [x] Menghapus kolom Simpanan dan Pinjaman dari tabel daftar anggota (data simpanan/pinjaman dikelola di halaman terpisah)
- [x] Membuat skema database Master_Anggota_KSP dengan 19 kolom
- [x] Membuat form pendaftaran anggota lengkap dengan 19 kolom
- [x] Membuat halaman summary tabel untuk melihat semua data anggota
- [x] Halaman Simpanan - kelola simpanan (pokok, wajib, sukarela)
- [x] Halaman Pinjaman - kelola pinjaman dengan bunga dan tenor
- [x] Halaman Laporan - laporan keuangan lengkap dengan submenu:
  - [x] Neraca (Laporan Posisi Keuangan)
  - [x] PHU (Laporan Perhitungan Hasil Usaha)
  - [x] Perubahan Ekuitas (Laporan Perubahan Modal)
  - [x] Arus Kas
  - [x] Promosi Ekonomi Anggota
  - [x] Catatan Atas Laporan Keuangan (CALK)
- [x] Halaman Statistik - grafik pertumbuhan anggota dan simpanan
- [x] Komponen UI: Card, Button, Input, Table, Sonner (toast)
- [x] Membersihkan semua data sampel dan mengosongkan array data untuk fresh start
- [x] Memperbaiki error TypeScript dengan menambahkan tipe interface untuk semua data array
- [x] Mengembalikan tampilan Dashboard utama seperti semula tanpa form input
- [x] Memindahkan seluruh komponen form pendaftaran anggota baru ke dalam halaman Data Anggota sebagai fitur tambah anggota
- [x] Memperbarui navigasi dan menu sesuai dengan perubahan
- [x] Menambahkan fitur Import Excel untuk data anggota dengan modal dialog dan parsing file .xlsx menggunakan library xlsx (xlsx@0.18.5)
- [x] **HALAMAN SIMPANAN**: Implementasi CRUD penuh (Create, Read, Update, Delete) dengan localStorage
  - [x] Create: Modal form tambah transaksi simpanan (anggota, tipe, jumlah, tanggal, status)
  - [x] Read: Tabel daftar simpanan dengan pagination dan pencarian
  - [x] Update: Modal edit simpanan dengan pre-fill data
  - [x] Delete: Konfirmasi hapus dengan alert
  - [x] Import Excel: Modal import dengan preview data sebelum konfirmasi
  - [x] Detail view: Modal detail transaksi simpanan
  - [x] Stats cards: Total Pokok, Wajib, Sukarela, dan Semua Simpanan
- [x] **HALAMAN PINJAMAN**: Implementasi CRUD penuh (Create, Read, Update, Delete) dengan localStorage
  - [x] Create: Modal form tambah pinjaman (anggota, jumlah, bunga, tenor, angsuran, sisa, status, tanggal)
  - [x] Read: Tabel daftar pinjaman dengan pagination dan pencarian
  - [x] Update: Modal edit pinjaman dengan pre-fill data
  - [x] Delete: Konfirmasi hapus dengan alert
  - [x] Import Excel: Modal import dengan preview data sebelum konfirmasi
  - [x] Detail view: Modal detail pinjaman
  - [x] Stats cards: Total Aktif, Lunas, Angsuran/Bulan, Pendapatan Bunga
  - [x] **Biaya Tambahan & Logika Otomatis** di form Tambah Pinjaman:
    - [x] Biaya Materai (auto: Rp 12.000 default / Rp 24.000 jika Legalisasi Notaris = Ya)
    - [x] Legalisasi Notaris (Ya/Tidak, muncul hanya jika Jenis Agunan = Akta Tanah/SHM/BPKB; Biaya Notaris Rp 400.000/Rp 0)
    - [x] Iuran BPJSTK PBPU (Ya/Tidak + Masa Iuran bulan 1-12 × Rp 20.000)
    - [x] Rumus Total Diterima Anggota diperbarui: kurangi semua biaya baru secara real-time
    - [x] Semua field baru tersimpan ke localStorage via Pinjaman interface dan handleSubmit
  - [x] **Opsi SWK + Rincian Angsuran Per Bulan** di bawah Total Diterima:
    - [x] Dropdown Opsi SWK: 1% dari Besar Pinjaman atau Flat Rp 25.000; nominal otomatis tampil di kotak read-only
    - [x] Grid RINCIAN ANGSURAN PER BULAN: Angsuran Pokok, Angsuran Bunga, SWK, TOTAL ANGSURAN (bold biru) — semua diformat titik ribuan
  - [x] **Detail Agunan & Kecukupan Pinjaman** di bawah dropdown Jenis Agunan:
    - [x] Nilai Pasar & Nilai Likuidasi untuk setiap jenis agunan (8 tipe) displayed read-only
    - [x] Kotak Kecukupan Agunan: ACCEPTED (hijau) jika pinjaman <= nilai pasar; DITOLAK (merah) jika pinjaman > nilai pasar
    - [x] Nilai persisted ke Pinjaman interface: nilaiPasarAgunan, nilaiLikuidasiAgunan, agunanMencukupi
  - [x] **Detail Agunan Manual + Form Bertingkat** per jenis agunan (menghapus lookup tetap):
    - [x] Nilai Pasar & Nilai Likuidasi **diisi manual** oleh admin dengan input teks + format thousand-separator
    - [x] Kecukupan Agunan: ACCEPTED (hijau) jika jumlahPinjaman <= nilaiPasar; DITOLAK (merah, pesan detail) jika melebihi
    - [x] **BPKB Roda 2 / 4 / 6-8**: Merk/Model, Tipe Kendaraan, Tahun Pembuatan, No. Rangka, No. Mesin, No. Polisi, Warna, Tipe/Ket BPKB
    - [x] **Akta Tanah / SHM**: No. Sertifikat, Luas Tanah (m²), Luas Bangunan (m²), Lokasi/Desa
    - [x] **Simpanan**: No. Rekening Simpanan
    - [x] **Simpanan Sukarela Berjangka (Sisujang)**: No. Rekening, Masa Berjangka/Keterangan
    - [x] **Pendiri / Simpanan Pokok**: Keterangan / No. Bukti Setoran
    - [x] Setiap detail section menampilkan label heading `Detail Agunan — <Jenis>` dan grid 2 kolom
    - [x] Tracehelpers: `applyDetail()` helper + direct setFormData calls; fix TS2367 `jenisAgunan ===>` `!!jenisAgunan`
    - [x] Pinjaman interface diperluas: 9 field optional (bpkbMerkMbl, bpkbTipeMbl, bpkbTahun, bpkbNoRangka, bpkbNoMesin, bpkbNoPolisi, bpkbWarna, bpkbTipeKet, aktaNoSertifikat, aktaLuasTanah, aktaLuasBangunan, aktaLokasi, simpananNoRekening, simpananMasaBerjangka)
    - [x] typecheck + lint pass clean
- [x] **UPDATE DASHBOARD**: Dashboard sudah terhubung dengan data localStorage ksp_simpanan_data dan ksp_pinjam_data
  - [x] Total Simpanan otomatis terupdate dari localStorage
  - [x] Total Pinjaman otomatis terupdate dari localStorage
  - [x] Chart bulanan menggunakan data dari localStorage dengan field tanggal
   - [x] Aktivitas terbaru menampilkan transaksi simpanan terbaru
- [x] **DATA SIMPANAN MIGRATED KE SQL (Drizzle ORM + LibSQL):** `localStorage` tidak lagi menjadi sumber data utama — semua data sekarang persisten di tabel `simpanan` (Cloudflare D1 / Turso atau file SQLite lokal): fetch dari `GET /api/simpanan` saat mount; INSERT/UPSERT via `POST /api/simpanan` per baris; impor Excel bulks loof per baris POST + progress bar + re-fetch dari DB; loading/error states ditampilkan; `search` state (`useState('')`) tetap berfungsi untuk filter tabel; semua error lint/typecheck sulut
- [x] **NERACA TERHUBUNG DATA REAL-TIME**: tabel 3 kolom [KETERANGAN][TAHUN INI][TAHUN SEBELUMNYA]; Tahun Ini = akumulasi sampai 31 Des tahun berjalan, Tahun Sebelumnya = akumulasi sampai 31 Des tahun lalu; yearConfig dibuat dari `new Date().getFullYear()` sehingga tahun otomatis berganti tanpa ubah kode; pos Kas = total simpanan (Pokok+Wajib+Sukarela), Simpanan Pokok/Wajib/Sukarela masuk Ekuitas di PASIVA; balance indicator per tahun; semua key props berbasis index untuk menghindari duplicate-key error; balance row menggunakan computed string sebelum JSX (tidak ada backtick-literal JSX)

## Current Structure

| File/Directory | Purpose |
|----------------|---------|
| `src/app/page.tsx` | Dashboard utama |
| `src/components/Sidebar.tsx` | Komponen navigasi sidebar vertikal — bg-[#1E3A5F] navy, gunakan usePathname untuk highlight halaman aktif |
| `src/components/AppLayout.tsx` | Wrapper layout — posisikan Sidebar fixed kiri (w-[220px]), offset konten dengan ml-[220px], title bar sticky opsional |
| `src/app/layout.tsx` | Root layout — bungkus AppLayout, set body bg-[#F8FAFC] |
| `src/app/anggota/page.tsx` | Data anggota dengan form 19 kolom |
| `src/app/anggota/summary/page.tsx` | Tabel summary semua anggota (19 kolom) |
| `src/app/anggota/register/page.tsx` | Halaman registrasi (menggunakan RegisterAnggotaForm) |
| `src/app/simpanan/page.tsx` | Manajemen simpanan (menggunakan SimpananClientContent) |
| `src/app/pinjaman/page.tsx` | Manajemen pinjaman (menggunakan PinjamanClientContent) |
| `src/lib/database/schema.sql` | Skema database Master_Anggota_KSP (19 kolom) |
| `src/lib/utils.ts` | Utility functions (cn) |
| `src/components/ui/textarea.tsx` | Komponen Textarea baru |
| `src/components/AnggotaClientContent.tsx` | Komponen utama data anggota |
| `src/components/SimpananClientContent.tsx` | Komponen utama data simpanan (CRUD + Excel import) |
| `src/components/PinjamanClientContent.tsx` | Komponen utama data pinjaman (CRUD + Excel import) |
| `src/app/laporan/page.tsx` | Halaman indeks Laporan Keuangan — kartu sub-laporan (Neraca, PHU, Perubahan Ekuitas, Arus Kas, Promosi Ekonomi, Catatan) |
| `src/app/laporan/neraca/page.tsx` | Neraca — 3 kolom perbandingan TAHUN INI / TAHUN SEBELUMNYA, yearConfig dari system date, akumulator per tahun |
| `src/lib/database/db.ts`              | Database connection (drizzle-orm/libsql + @libsql/client) — migrasi auto-run saat import modul |
| `src/lib/database/schema.ts`         | Drizzle ORM schema — simpanan table |
| `drizzle/0001_create_simpanan.sql`  | D1 raw SQL migration — simpanan table DDL |
| `src/app/api/anggota/route.ts`         | GET all / POST single anggota row |
| `src/app/api/anggota/bulk/route.ts`   | POST bulk import anggota — INSERT semua rows, return { success, failed, total } |
| `src/app/api/simpanan/route.ts`       | GET all / POST single simpanan row |
| `src/app/api/simpanan/bulk/route.ts`  | POST bulk import simpanan — per-row upsert, returns success/failed/total |

## Session History

| Date | Changes |
|------|---------|
| 2026-05-18 | Membuat aplikasi KSP Mulia Dana Sejahtera lengkap dengan semua fitur |
| 2026-05-18 | Membersihkan semua data sampel dan mengosongkan array data untuk fresh start |
| 2026-05-18 | Memperbaiki error TypeScript dengan menambahkan tipe interface untuk semua data array |
| 2026-05-18 | Membuat halaman laporan lengkap dengan semua sublaporan yang diperlukan |
| 2026-05-18 | Mengembalikan tampilan Dashboard utama seperti semula tanpa form input |
| 2026-05-18 | Memindahkan komponen form pendaftaran anggota baru ke halaman Data Anggota |
| 2026-05-18 | Memperbarui navigasi dan menu sesuai dengan perubahan |
| 2026-05-19 | Menghapus kolom Simpanan & Pinjaman dari tabel daftar anggota |
| 2026-05-19 | Membuat skema database Master_Anggota_KSP dengan 19 kolom |
| 2026-05-19 | Membuat form pendaftaran anggota lengkap dengan 19 kolom |
| 2026-05-19 | Membuat halaman summary tabel untuk melihat semua data anggota
2026-05-19 | Menambahkan fitur Import Excel untuk data anggota (modal dialog + xlsx parsing)
2026-05-19 | Fix crash CJS: load xlsx via dynamic import dan require() fallback in useCallback
2026-05-19 | Support CSV + XLSX (.csv, .xlsx, .xls) di import dialog anggota
2026-05-19 | Persist anggotaData in localStorage so import survives page refresh
2026-05-19 | Refactor tabel utama: cuma 6 kolom (No_Anggota, Nama, JK, NIK, Telepon, Pekerjaan) + tombol Eye untuk pagination + detail modal (19 kolom)
2026-05-19 | Tambah ikon Pencil (Edit) di kolom Aksi; modal edit dengan form 19 kolom pre-fill + Simpan Perubahan
2026-05-19 | Fix tanggal kosong: normalisasi serial Excel Tanggal_Lahir/Tanggal_Masuk jadi YYYY-MM-DD saat import dan saat load dari localStorage; Detail modal tampil DD-MM-YYYY
2026-05-19 | Form Tambah Anggota: Tanggal_Masuk auto-fill hari ini; No_Anggota auto-increment next number readOnly
2026-05-19 | Fix Tambah modal tidak bisa dibuka: ganti useCallback dengan inline handler; hapus dead code computeNextNo/resetFormData/handleTambahClick; z-index z-[200]
 | 2026-05-20 | Implementasi CRUD penuh untuk Simpanan dan Pinjaman; dashboard terhubung localStorage real-time
 | 2026-05-20 | Fix PinjamanClientContent TS2304: tambah `anggotaLookup = readAnggotaMap()` sebelum `handleFileSelect` parseFile
 | 2026-05-20 | Neraca terhubung data real-time; 3 kolom dinamis [KETERANGAN][TAHUN INI][TAHUN SEBELUMNYA] dengan akumulasi tahun-tahun tertentu (currYear/prevYear dari system date tanpa hardcode), balance indicator per tahun, native select + lazy useState untuk linter
 | 2026-05-20 | SimpananClientContent fix: tambah `const [search, setSearch] = useState('')` + `const [formData, setFormData]`, `editFormData`, search filter block, importConfirm menggunakan bulkImportToDB + fetchAllFromDB dengan loading state + disabled import button enquanto importing; drizzle-orm `drizzle-orm/@libsql/{client,migrator}` → `drizzle-orm/libsql` + `drizzle-orm/libsql/migrator` dengan `createClient(@libsql/client)` instance passing|  | 2026-05-20 | Fix duplicate catch-finally block di SimpananClientContent.tsx (baris 418-428) yang menyebabkan parse error; hapus blok catch-finally duplikat yang tidak memiliki try yang sesuai
|  | 2026-05-20 | Pinjaman import changed: column 'nama' now used for name-based lookup against Master_Anggota_KSP table; header updated to 'NAMA'; supported columns: nama, tanggalPinjam, besarPinjaman, bunga, jangkaWaktu, angsuran, sisa, status
|  | 2026-05-20 | Pinjaman import finalized: required columns locked to nama, tanggalPinjam, besarPinjaman, bunga, jangkaWaktu, jenisPinjaman; angsuran, sisa, status auto-calculated by system
|  | 2026-05-20 | Pinjaman import validation: detailed error messages for NAMA not found, numeric field symbols, and date format issues
|  | 2026-05-20 | Tambah Pinjaman form redesigned: autocomplete member search, thousand separator for jumlah, jenisPinjaman dropdown (Flat/Musiman) with conditional tenor/bunga rules, removed angsuran/sisa fields
|  | 2026-05-20 | Tambah Pinjaman form: added Potongan Administrasi (2%), Dana Resiko (1%), and Total Diterima Netto calculation - all auto-calculated and stored in database
|  | 2026-05-20 | Pinjaman form: added Dana Sosial (1%), Insentif Penanggung Jawab (1%), Nama Penanggung Jawab field - total potongan now 5%, all saved to database
|  | 2026-05-20 | Removed Status field from Tambah Pinjaman form - new loans automatically set to Aktif status
|  | 2026-05-20 | Nama Penanggung Jawab changed to dropdown - filtered to specific No_Anggota (1,3,4,5,6,7,8,9,195) from Master_Anggota_KSP
|  | 2026-05-21 | **Detail Agunan Manual + Form Bertingkat** per jenis agunan: menghapus lookup tetap nilai pasar/likuidasi; Nilai Pasar & Likuidasi sekarang diisi manual oleh admin dengan format thousand-separator; kotak Kecukupan Agunan (ACC hijau / DITOLAK merah dengan pesan detail) real-time; form bertingkat setiap jenis: BPKB (Merk/Model, Tipe, Tahun, No. Rangka/Mesin/Polisi, Warna, Ket), Akta/SHM (No. Sertifikat, Luas Tanah/Bangunan, Lokasi), Simpanan (No. Rekening), Sisujang (No. Rekening + Masa Berjangka), Pendiri (Bukti/Ket); Pinjaman interface diperluas 14 field agunan optional; formData tambah 17 detail field; applyDetail helper + !!jenisAgunan type guards; resetForm da ulas semua field agunan; typecheck + lint pass clean
|  | 2026-05-21 | **Opsi Simpanan Wajib Kapitalisasi (SWK) + Rincian Angsuran Per Bulan** ditambahkan di bawah kotak biru "Total Diterima Anggota":
    - **Opsi SWK** (formData.opsiSwk): dropdown "Pilih Opsi SWK / 1% dari Besar Pinjaman / Flat Rp 25.000"; nominal otomatis dihitung real-time: nilaiSwk = (opsiSwk === '1%') → Math.round(jumlahNum × 0.01) atau (opsiSwk === 'flat') → 25000
    - **RINCIAN ANGSURAN PER BULAN** (read-only grid 2 kolom):
      - Angsuran Pokok / Bulan = jumlahNum / tenor
      - Angsuran Bunga / Bulan = jumlahNum × (bunga / 100)
      - Simpanan Wajib Kapitalisasi (SWK) / Bulan = nilaiSwk
      - **TOTAL ANGSURAN PER BULAN** (baris bold biru) = angsuranPokok + angsuranBunga + nilaiSwk
    - Semua nominal diformat dengan formatNumberWithSeparator()
    - Pinjaman interface diperluas dengan opsiSwk ('1%' | 'flat' | '')
    - resetForm mereset opsiSwk ke '1%'
    - Nama variabel internal dynamically renamed dari `totalAngsuran` → `totalAngsuranPerBulan` untuk menghindari bentrok dengan variabel yang ada
    - typecheck + lint pass clean
|  | 2026-05-21 | **Biaya Tambahan & Logika Otomatis** added to Tambah Pinjaman form (between Jenis Agunan and Total Diterima):
    - **Biaya Materai**: read-only, Rp 12.000 default; jadi Rp 24.000 jika Legalisasi Notaris = Ya
    - **Legalisasi Notaris**: Ya/Tidak dropdown — muncul HANYA jika Jenis Agunan ∈ {Akta Tanah, SHM, BPKB Roda 2/4/6-8}; auto-hide untuk Pendiri, Simpanan, Sisujang; Biaya Notaris Rp 400.000 jika Ya, Rp 0 jika Tidak
    - **Iuran BPJSTK PBPU**: Ya/Tidak dropdown; jika Ya → Muncul "Masa Iuran (Bulan)" 1-12, biaya = bulan × Rp 20.000; jika Tidak → Rp 0
    - **Total Diterima Anggota** rumus baru: Jumlah Pinjaman − [Potongan 5% + Biaya Materai + Biaya Notaris + Biaya BPJSTK]
    - Pinjaman interface diperluas dengan 5 field optional: biayaMaterai, biayaNotaris, biayaBpjstk, legalisasiNotaris, iuranBpjstk, masaBpjstk
    - handleSubmit dan resetForm diperbarui untuk menyimpan dan mereset field baru
    - typecheck + lint pass clean
|  | 2026-05-21 | **Detail Agunan Manual + Nama Pemilik + Likuidasi Otomatis** di bawah dropdown Jenis Agunan:
    - menghapus lookup tetap nilai pasar/likuidasi; **Nilai Pasar** diisi manual oleh admin (format thousand-separator)
    - **Nilai Likuidasi Agunan dihitung otomatis** (bukan diisi manual lagi): Pendiri/Simpanan = 100% dari nilai pasar; Kendaraan BPKB = 70%; Tanah/Bangunan (Akta/SHM) = 80%
    - label Nilai Likuidasi menampilkan persentase relevan (e.g. "80% dari Nilai Pasar"), field read-only + bg-gray-50
    - **Nama Pemilik Agunan** ditambahkan di 5 agunan detail section (BPKB, Akta/SHM, Simpanan, Sisujang, Pendiri) full-width sebelum grid detail
    - kecukupan agunan (ACC/DITOLAK) tetap menggunakan nilaiPasarAgunan (bukan likuidasi)
    - Pinjaman interface + handleSubmit + resetForm ter-update dengan `pemilikAgunan` field
|  | 2026-05-21 | **Fix Insentif Penanggung Jawab (1%) conditional on agunan sufficiency** (`src/components/PinjamanClientContent.tsx:219-236`): pindahkan `nilaiAgunan`/`agunanMencukupi` block (jumlahNum, nilaiPasarAgunan, AGUNAN_PCT_LIKUIDASI, nilaiLikuidasiAgunan, agunanMencukupi) SEBELUM potongan/insentifPJ block agar tidak ada hoisting violation TS2448; hapus duplicate `jumlahNum` di potongan block (sekarang hanya 1 declaration); `insentifPJ` logic baru: `!agunanMencukupi ? Math.round(jumlahNum * 0.01) : 0` — otomatis jadi Rp 0 jika agunan CUKUP (tidak ada flag/tidak ada notifikasi), otomatis tampil 1% jika agunan TIDAK CUKUP (ada flag peringatan merah); struktur sekarang: jumlahNum → Nilai Agunan → agunanMencukupi → Hitung potongan (insentifPJ conditional) → Netto; typecheck + lint PASS clean
  |  | 2026-05-21 | **Fix Pencarian Nama Anggota di form Tambah Pinjaman Baru** (`src/components/PinjamanClientContent.tsx:733-784`): total refactor JSX dropdown autocomplete pencarian anggota:
    - Tambah `memberSearchRef = useRef<HTMLDivElement>(null)` + `useEffect` click-outside handler (mousedown on document, hapus listener saat unmount)
    - Refactor JSX dari chained `.filter().map()` menjadi **IIFE `(() => { ... })()`** sehingga `readAllAnggota()` hanya dipanggil SEKALI per render (bukan 2x di baris 738 dan 754)
    - Filter sekarang pakai `const q = memberSearch.toLowerCase().trim()` (tambahan `.trim()`)
    - `onFocus` input sekarang JUGAA mengisi `memberSearch(formData.anggota)` mencegah stale state jika user memilih lalu mengetik ulang
    - `onClick` di tombol pilihan anggota sekarang memanggil `setMemberSearch("")` mengosongkan pencarian setelah memilih
    - Dropdown z-index dinaikkan dari `z-10` menjadi `z-50` dan `max-h-48` menjadi `max-h-60` agar tidak tertutup oleh elemen lain
    - Display hasil pencarian sekarang menampilkan `<b>Nama Anggota</b>` dengan tebal dan `No. XXX` berwarna abu-abu di sebelahnya agar jelas field mana yang cocok
    - typecheck + lint pass clean
|  | 2026-05-22 | **Fix Import Anggota dan Database Persistence — 3 koreksi krusial**:
|  | - [x] **Root cause 1 — Migrasi tidak pernah dijalankan**: `runMigrations()` di `db.ts` hanya didefinisikan tapi tidak pernah dipanggil sepanjang proyek. Tabel `Master_Anggota_KSP` tidak dibuat, INSERT silent gagal, dan semua operasi database tidak masuk ke DB sama sekali.
|  | - [x] **Fix `db.ts`**: tambah `runMigrations().catch(() => {})` di akhir file sehingga migrasi otomatis berjalan saat modul pertama kali di-import oleh API route. `runMigrations()` sekarang memiliki guard `_migrationsDone` (idempoten).
|  | - [x] **Root cause 2 — Import tidak menunggu konfirmasi server + POST 1-by-1 lambat**: `handleImportConfirm` tidak memeriksa `res.ok`, tidak mengumpulkan baris yang gagal, dan tidak menampilkan notifikasi error.
|  | - [x] **Fix `handleImportConfirm`**: ganti 1-by-1 POST menjadi SATU bulk request ke `POST /api/anggota/bulk`, pakai `await res.json()` + `res.ok` untuk validasi, `toast.success` / `toast.warning` / `toast.error` untuk feedback pengguna, update `anggotaData` hanya untuk baris yang benar-benar baru.
|  | - [x] **Fix `handleSubmit` (Tambah Anggota Baru manual)**: ganti fire-and-forget menjadi `POST /api/anggota` dengan `await res.ok`; `toast.success` jika berhasil, `toast.error` jika gagal.
|  | - [x] **Endpoint baru** `POST /api/anggota/bulk` — INSERT semua rows, return `{ success, failed, total }`, menangani field yang ada di Excel (uppercase) maupun API API (camelCase).
|  |
|  | 2026-05-22 | **Sidebar Navigation Layout Restrukturisasi**:
|  | - [x] **Sidebar baru** `src/components/Sidebar.tsx`: nav vertikal fixed kiri (w-[220px], bg-[#1E3A5F] navy), 7 menu dengan ikon (Dashboard/PiggyBank, Anggota/Users, Simpanan/Wallet, Pinjaman/CreditCard, Laporan/FileText, Statistik/BarChart3, Pengaturan/Settings), active state otomatis via `usePathname()` (matching exact path atau path prefix)
|  | - [x] **AppLayout baru** `src/components/AppLayout.tsx`: wrapper flex dengan Sidebar fixed kiri + area konten `ml-[220px]`, title page bar opsional
|  | - [x] **Root layout** `src/app/layout.tsx`: bungkus semua children dengan `<AppLayout>`, ubah body bg dari `bg-gray-50` jadi `bg-[#F8FAFC]`
|  | - [x] **Hapus brand bar + horizontal nav** dari `src/app/page.tsx` (Dashboard): stripped header kiri+nav kanan, dan COMPLETELY removed 7 shortcut box menu bulanan (`navItems` array + `<nav>` render section)
|  | - [x] **Hapus `<header>` + `<nav>`** dari `src/components/AnggotaClientContent.tsx`: tersisa title + search + action buttons + tabel, tanpa floating nav bar
|  | - [x] **Hapus `<header>` + `<nav>`** dari `src/components/SimpananClientContent.tsx`: kembali ke `<main>` langsung, stat cards + tabel
|  | - [x] **Hapus `<header>` + `<nav>`** dari `src/components/PinjamanClientContent.tsx` & `src/app/statistik/page.tsx` & `src/app/laporan/page.tsx` & semua sub-laporan (neraca, phu, perubahan-ekuitas, arus-kas, promosi-ekonomi, catatan)
|  | - [x] typecheck + lint pass clean (0 new errors introduced)
|  | - [x] **Fix Pengaturan menu crash** (`src/lib/database/db.ts`): `runMigrations()` used `drizzle-orm/libsql/migrator` which requires a `drizzle/meta/_journal.json` file that did not exist; call failed silently on every startup → no tables ever created → `libsqlDb.execute()` vs `Pengaturan_KSP` blocked indefinitely → sidebar Pengaturan link showed error + `/api/pengaturan` never responded. Fixed: replace `migrate(db, {migrationsFolder})` with inline runner that reads each `.sql` file from `drizzle/`, strips comments, splits on `;`, executes each statement via `libsqlDb.execute()`, silently ignores "table already exists" errors. Idempotent — safe on every restart. Commit `df03772`.
|  |
