-- ============================================
-- DATABASE SETUP - Web Sekolah
-- MySQL / MariaDB
-- ============================================

CREATE DATABASE IF NOT EXISTS db_sekolah;
USE db_sekolah;

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================
-- TABLE: admin
-- ============================================
CREATE TABLE IF NOT EXISTS admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'superadmin') DEFAULT 'admin',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE: article
-- ============================================
CREATE TABLE IF NOT EXISTS article (
  id INT AUTO_INCREMENT PRIMARY KEY,
  judul VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  ringkasan TEXT,
  deskripsi LONGTEXT NOT NULL,
  image VARCHAR(255),
  status ENUM('draft', 'published') DEFAULT 'draft',
  adminId INT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (adminId) REFERENCES admin(id) ON DELETE CASCADE
);

-- ============================================
-- TABLE: guru
-- ============================================
CREATE TABLE IF NOT EXISTS guru (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  nip VARCHAR(255) UNIQUE,
  mataPelajaran VARCHAR(255) NOT NULL,
  foto VARCHAR(255),
  email VARCHAR(255),
  telepon VARCHAR(255),
  alamat TEXT,
  status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE: kelas
-- ============================================
CREATE TABLE IF NOT EXISTS kelas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(255) NOT NULL UNIQUE,
  tingkat VARCHAR(255) NOT NULL,
  waliKelasId INT,
  kapasitas INT DEFAULT 30,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (waliKelasId) REFERENCES guru(id) ON DELETE SET NULL
);

-- ============================================
-- TABLE: siswa
-- ============================================
CREATE TABLE IF NOT EXISTS siswa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  namaLengkap VARCHAR(255) NOT NULL,
  nisn VARCHAR(255) UNIQUE,
  tanggalLahir DATE,
  jenisKelamin ENUM('L', 'P'),
  alamat TEXT,
  telepon VARCHAR(255),
  namaOrangTua VARCHAR(255),
  tahunMasuk INT,
  status ENUM('aktif', 'lulus', 'keluar') DEFAULT 'aktif',
  kelasId INT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (kelasId) REFERENCES kelas(id) ON DELETE SET NULL
);

-- ============================================
-- TABLE: jadwal
-- ============================================
CREATE TABLE IF NOT EXISTS jadwal (
  id INT AUTO_INCREMENT PRIMARY KEY,
  hari ENUM('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu') NOT NULL,
  jamMulai TIME NOT NULL,
  jamSelesai TIME NOT NULL,
  mataPelajaran VARCHAR(255) NOT NULL,
  guruId INT,
  kelasId INT NOT NULL,
  ruangan VARCHAR(255),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (guruId) REFERENCES guru(id) ON DELETE SET NULL,
  FOREIGN KEY (kelasId) REFERENCES kelas(id) ON DELETE CASCADE
);

-- ============================================
-- TABLE: pengumuman
-- ============================================
CREATE TABLE IF NOT EXISTS pengumuman (
  id INT AUTO_INCREMENT PRIMARY KEY,
  judul VARCHAR(255) NOT NULL,
  isi TEXT NOT NULL,
  tanggal DATE NOT NULL,
  prioritas ENUM('tinggi', 'sedang', 'rendah') DEFAULT 'sedang',
  status ENUM('draft', 'published') DEFAULT 'draft',
  adminId INT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (adminId) REFERENCES admin(id) ON DELETE CASCADE
);

-- ============================================
-- TABLE: galeri
-- ============================================
CREATE TABLE IF NOT EXISTS galeri (
  id INT AUTO_INCREMENT PRIMARY KEY,
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  image VARCHAR(255) NOT NULL,
  kategori VARCHAR(255) DEFAULT 'umum',
  adminId INT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (adminId) REFERENCES admin(id) ON DELETE CASCADE
);

-- ============================================
-- TABLE: profil_sekolah
-- ============================================
CREATE TABLE IF NOT EXISTS profil_sekolah (
  id INT AUTO_INCREMENT PRIMARY KEY,
  namaSekolah VARCHAR(255) NOT NULL,
  npsn VARCHAR(255) UNIQUE,
  alamat TEXT NOT NULL,
  telepon VARCHAR(255),
  email VARCHAR(255),
  website VARCHAR(255),
  visi TEXT,
  misi TEXT,
  sejarah TEXT,
  logo VARCHAR(255),
  slogan VARCHAR(255),
  tahunBerdiri INT,
  namaKepalaSekolah VARCHAR(255),
  fotoKepalaSekolah VARCHAR(255),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE: ppdb
-- ============================================
CREATE TABLE IF NOT EXISTS ppdb (
  id INT AUTO_INCREMENT PRIMARY KEY,
  namaLengkap VARCHAR(255) NOT NULL,
  nisn VARCHAR(255),
  tempatLahir VARCHAR(255),
  tanggalLahir DATE,
  jenisKelamin ENUM('L', 'P') NOT NULL,
  alamat TEXT NOT NULL,
  telepon VARCHAR(255),
  namaOrangTua VARCHAR(255) NOT NULL,
  teleponOrangTua VARCHAR(255),
  asalSekolah VARCHAR(255),
  tahunLulus INT,
  jurusan VARCHAR(255),
  berkas VARCHAR(255),
  status ENUM('pending', 'diterima', 'ditolak') DEFAULT 'pending',
  catatan TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- SEED DATA (opsional)
-- ============================================

-- Password: admin123 (bcrypt hash)
INSERT IGNORE INTO admin (username, password, role, createdAt, updatedAt)
VALUES ('admin', '$2a$10$8K1p/a0dL1LXMc.0aStlV.ZfM6YJrSVxjT8J1DQgkHkVfXQ4qY6G', 'superadmin', NOW(), NOW());

INSERT IGNORE INTO profil_sekolah (namaSekolah, npsn, alamat, telepon, email, visi, misi, slogan, createdAt, updatedAt)
VALUES (
  'SMA Negeri 1 Contoh',
  '12345678',
  'Jl. Pendidikan No. 1, Kota Contoh',
  '021-1234567',
  'info@sma1contoh.sch.id',
  'Menjadi sekolah unggul yang menghasilkan lulusan berkarakter, kompeten, dan berwawasan global',
  '1. Menyelenggarakan pendidikan berkualitas\n2. Mengembangkan potensi siswa secara optimal\n3. Membentuk karakter yang beriman dan bertaqwa\n4. Meningkatkan kompetensi guru',
  'Cerdas, Berkarakter, Berwawasan Global',
  NOW(), NOW()
);

INSERT IGNORE INTO guru (nama, nip, mataPelajaran, email, status, createdAt, updatedAt)
VALUES
  ('Pak Budi Santoso', '196805151992031001', 'Matematika', 'budi@sma1.sch.id', 'aktif', NOW(), NOW()),
  ('Ibu Siti Rahayu', '197503202001122002', 'Bahasa Indonesia', 'siti@sma1.sch.id', 'aktif', NOW(), NOW()),
  ('Pak Ahmad Hidayat', '198007102005011003', 'Bahasa Inggris', 'ahmad@sma1.sch.id', 'aktif', NOW(), NOW()),
  ('Ibu Dewi Lestari', '198501252010012004', 'IPA Biologi', 'dewi@sma1.sch.id', 'aktif', NOW(), NOW()),
  ('Pak Rudi Hermawan', '197811182003121005', 'IPS Sejarah', 'rudi@sma1.sch.id', 'aktif', NOW(), NOW());

INSERT IGNORE INTO kelas (nama, tingkat, waliKelasId, kapasitas, createdAt, updatedAt)
VALUES
  ('X-A', 'X', 1, 30, NOW(), NOW()),
  ('X-B', 'X', 2, 30, NOW(), NOW()),
  ('XI-A', 'XI', 3, 30, NOW(), NOW()),
  ('XI-B', 'XI', 4, 30, NOW(), NOW()),
  ('XII-A', 'XII', 5, 30, NOW(), NOW());

INSERT IGNORE INTO siswa (namaLengkap, nisn, tanggalLahir, jenisKelamin, alamat, namaOrangTua, tahunMasuk, kelasId, createdAt, updatedAt)
VALUES
  ('Andi Saputra', '2026001', '2008-05-15', 'L', 'Jl. Merdeka No. 10', 'Pak Saputra', 2026, 1, NOW(), NOW()),
  ('Rina Wati', '2026002', '2008-03-20', 'P', 'Jl. Sudirman No. 25', 'Pak Wati', 2026, 1, NOW(), NOW()),
  ('Dimas Prayoga', '2026003', '2008-09-10', 'L', 'Jl. Gatot Subroto No. 5', 'Pak Prayoga', 2026, 1, NOW(), NOW()),
  ('Sari Dewi', '2026004', '2008-01-28', 'P', 'Jl. Ahmad Yani No. 12', 'Pak Dewi', 2026, 2, NOW(), NOW()),
  ('Fajar Nugroho', '2026005', '2008-07-04', 'L', 'Jl. Pahlawan No. 8', 'Pak Nugroho', 2026, 2, NOW(), NOW());

INSERT IGNORE INTO jadwal (hari, jamMulai, jamSelesai, mataPelajaran, guruId, kelasId, ruangan, createdAt, updatedAt)
VALUES
  ('Senin', '07:00', '08:30', 'Matematika', 1, 1, 'Ruang 101', NOW(), NOW()),
  ('Senin', '08:30', '10:00', 'Bahasa Indonesia', 2, 1, 'Ruang 101', NOW(), NOW()),
  ('Senin', '10:00', '11:30', 'Bahasa Inggris', 3, 1, 'Ruang 101', NOW(), NOW()),
  ('Senin', '13:00', '14:30', 'IPA Biologi', 4, 1, 'Lab Biologi', NOW(), NOW()),
  ('Senin', '14:30', '16:00', 'IPS Sejarah', 5, 1, 'Ruang 101', NOW(), NOW()),
  ('Selasa', '07:00', '08:30', 'Bahasa Indonesia', 2, 1, 'Ruang 101', NOW(), NOW()),
  ('Selasa', '08:30', '10:00', 'Matematika', 1, 1, 'Ruang 101', NOW(), NOW()),
  ('Selasa', '10:00', '11:30', 'IPA Biologi', 4, 1, 'Lab Biologi', NOW(), NOW()),
  ('Rabu', '07:00', '08:30', 'Bahasa Inggris', 3, 1, 'Ruang 101', NOW(), NOW()),
  ('Rabu', '08:30', '10:00', 'IPS Sejarah', 5, 1, 'Ruang 101', NOW(), NOW()),
  ('Rabu', '10:00', '11:30', 'Matematika', 1, 1, 'Ruang 101', NOW(), NOW()),
  ('Kamis', '07:00', '08:30', 'IPA Biologi', 4, 1, 'Lab Biologi', NOW(), NOW()),
  ('Kamis', '08:30', '10:00', 'Bahasa Indonesia', 2, 1, 'Ruang 101', NOW(), NOW()),
  ('Kamis', '10:00', '11:30', 'Bahasa Inggris', 3, 1, 'Ruang 101', NOW(), NOW()),
  ('Jumat', '07:00', '08:30', 'IPS Sejarah', 5, 1, 'Ruang 101', NOW(), NOW()),
  ('Jumat', '08:30', '10:00', 'Matematika', 1, 1, 'Ruang 101', NOW(), NOW());

INSERT IGNORE INTO pengumuman (judul, isi, tanggal, prioritas, status, adminId, createdAt, updatedAt)
VALUES
  ('Libur Nasional - Hari Raya', 'Diberitahukan kepada seluruh siswa dan guru bahwa pada hari [tanggal] sekolah libur dalam rangka hari raya.', '2026-08-17', 'tinggi', 'published', 1, NOW(), NOW()),
  ('Jadwal Ujian Tengah Semester', 'UTS akan dilaksanakan mulai tanggal [tanggal]. Silakan persiapkan diri dengan baik.', '2026-09-15', 'sedang', 'published', 1, NOW(), NOW()),
  ('Penerimaan Siswa Baru 2026/2027', 'Pendaftaran PPDB tahun ajaran 2026/2027 telah dibuka. Silakan daftar melalui website atau datang langsung ke sekretariat.', '2026-07-01', 'tinggi', 'published', 1, NOW(), NOW());

INSERT IGNORE INTO article (judul, slug, ringkasan, deskripsi, image, status, adminId, createdAt, updatedAt)
VALUES
  (
    'Selamat Datang di Website Resmi SMA Negeri 1',
    'selamat-datang-di-website-resmi-sma-negeri-1',
    'Website resmi SMA Negeri 1 Contoh telah resmi diluncurkan untuk memberikan informasi terkini.',
    '<h2>Selamat Datang</h2><p>Kami dengan bangga mengumumkan peluncuran website resmi SMA Negeri 1 Contoh. Website ini akan menjadi pusat informasi bagi seluruh siswa, orang tua, dan masyarakat.</p><h3>Fitur Website</h3><ul><li>Informasi Profil Sekolah</li><li>Berita dan Pengumuman Terkini</li><li>Jadwal Pelajaran Online</li><li>Galeri Kegiatan Sekolah</li><li>PPDB Online</li></ul><p>Silakan menjelajahi seluruh fitur yang tersedia. Untuk informasi lebih lanjut, hubungi sekretariat sekolah.</p>',
    NULL,
    'published',
    1,
    NOW(),
    NOW()
  ),
  (
    'Penerimaan Siswa Baru Tahun Ajaran 2026/2027',
    'penerimaan-siswa-baru-tahun-ajaran-2026-2027',
    'Pendaftaran siswa baru untuk tahun ajaran 2026/2027 telah resmi dibuka.',
    '<h2>PPDB 2026/2027</h2><p>SMA Negeri 1 Contoh membuka pendaftaran siswa baru untuk tahun ajaran 2026/2027.</p><h3>Jadwal Pendaftaran</h3><table><tr><td>Gelombang 1</td><td>1 Juli - 15 Juli 2026</td></tr><tr><td>Gelombang 2</td><td>16 Juli - 31 Juli 2026</td></tr></table><h3>Persyaratan</h3><ol><li>Ijazah SMP/Sederajat</li><li>Akta Kelahiran</li><li>Kartu Keluarga</li><li>Pas foto 3x4 (4 lembar)</li><li>Surat Keterangan Sehat</li></ol><p>Untuk informasi lebih lanjut, silakan kunjungi sekretariat sekolah atau hubungi <strong>021-1234567</strong>.</p>',
    NULL,
    'published',
    1,
    NOW(),
    NOW()
  );

INSERT IGNORE INTO galeri (judul, deskripsi, image, kategori, adminId, createdAt, updatedAt)
VALUES
  ('Upacara Bendera Senin', 'Upacara bendera rutin setiap hari Senin di lapangan sekolah', 'upacara-senin.jpg', 'upacara', 1, NOW(), NOW()),
  ('Lomba 17 Agustus', 'Perayaan HUT RI ke-81 di halaman sekolah', 'lomba-agustus.jpg', 'kegiatan', 1, NOW(), NOW()),
  ('Wisuda Angkatan 2025', 'Wisuda dan pelepasan siswa kelas XII angkatan 2025', 'wisuda-2025.jpg', 'wisuda', 1, NOW(), NOW()),
  ('Study Tour ke Museum', 'Kunjungan edukasi siswa kelas X ke Museum Nasional', 'study-tour.jpg', 'kegiatan', 1, NOW(), NOW()),
  ('Lomba Basket Antar Kelas', 'Kompetisi basket antar kelas yang diselenggarakan OSIS', 'lomba-basket.jpg', 'olahraga', 1, NOW(), NOW());

SET FOREIGN_KEY_CHECKS = 1;
