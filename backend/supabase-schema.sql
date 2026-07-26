-- =============================================
-- Web Sekolah - Supabase Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- Disable RLS for all tables (backend API uses service key)
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;

-- Admins
CREATE TABLE IF NOT EXISTS admins (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Articles
CREATE TABLE IF NOT EXISTS articles (
  id BIGSERIAL PRIMARY KEY,
  judul VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  ringkasan TEXT,
  deskripsi TEXT,
  image VARCHAR(255),
  status VARCHAR(50) DEFAULT 'draft',
  admin_id BIGINT REFERENCES admins(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gurus
CREATE TABLE IF NOT EXISTS gurus (
  id BIGSERIAL PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  nip VARCHAR(100),
  mata_pelajaran VARCHAR(255),
  foto VARCHAR(255),
  email VARCHAR(255),
  telepon VARCHAR(50),
  alamat TEXT,
  status VARCHAR(50) DEFAULT 'aktif',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Kelas
CREATE TABLE IF NOT EXISTS kelas (
  id BIGSERIAL PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  tingkat VARCHAR(50),
  kapasitas INTEGER DEFAULT 30,
  wali_kelas_id BIGINT REFERENCES gurus(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Siswas
CREATE TABLE IF NOT EXISTS siswas (
  id BIGSERIAL PRIMARY KEY,
  nama_lengkap VARCHAR(255) NOT NULL,
  nisn VARCHAR(100),
  tanggal_lahir DATE,
  jenis_kelamin VARCHAR(10),
  alamat TEXT,
  telepon VARCHAR(50),
  nama_orang_tua VARCHAR(255),
  tahun_masuk INTEGER,
  kelas_id BIGINT REFERENCES kelas(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'aktif',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jadwals
CREATE TABLE IF NOT EXISTS jadwals (
  id BIGSERIAL PRIMARY KEY,
  hari VARCHAR(50) NOT NULL,
  jam_mulai TIME NOT NULL,
  jam_selesai TIME NOT NULL,
  mata_pelajaran VARCHAR(255) NOT NULL,
  guru_id BIGINT REFERENCES gurus(id) ON DELETE SET NULL,
  kelas_id BIGINT REFERENCES kelas(id) ON DELETE CASCADE,
  ruangan VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pengumumans
CREATE TABLE IF NOT EXISTS pengumumans (
  id BIGSERIAL PRIMARY KEY,
  judul VARCHAR(255) NOT NULL,
  isi TEXT NOT NULL,
  tanggal DATE NOT NULL,
  prioritas VARCHAR(50) DEFAULT 'sedang',
  status VARCHAR(50) DEFAULT 'draft',
  admin_id BIGINT REFERENCES admins(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Galeris
CREATE TABLE IF NOT EXISTS galeris (
  id BIGSERIAL PRIMARY KEY,
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  image VARCHAR(255) NOT NULL,
  kategori VARCHAR(100) DEFAULT 'umum',
  admin_id BIGINT REFERENCES admins(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profil Sekolah (singleton)
CREATE TABLE IF NOT EXISTS profil_sekolahs (
  id BIGSERIAL PRIMARY KEY,
  nama_sekolah VARCHAR(255),
  alamat TEXT,
  telepon VARCHAR(50),
  email VARCHAR(255),
  website VARCHAR(255),
  logo VARCHAR(255),
  visi TEXT,
  misi TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PPDB
CREATE TABLE IF NOT EXISTS ppdbs (
  id BIGSERIAL PRIMARY KEY,
  nama_lengkap VARCHAR(255) NOT NULL,
  nisn VARCHAR(100),
  tempat_lahir VARCHAR(255),
  tanggal_lahir DATE,
  jenis_kelamin VARCHAR(10) NOT NULL,
  alamat TEXT NOT NULL,
  telepon VARCHAR(50),
  nama_orang_tua VARCHAR(255) NOT NULL,
  telepon_orang_tua VARCHAR(50),
  asal_sekolah VARCHAR(255),
  tahun_lulus INTEGER,
  jurusan VARCHAR(255),
  berkas VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  catatan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS on all tables
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE gurus ENABLE ROW LEVEL SECURITY;
ALTER TABLE kelas ENABLE ROW LEVEL SECURITY;
ALTER TABLE siswas ENABLE ROW LEVEL SECURITY;
ALTER TABLE jadwals ENABLE ROW LEVEL SECURITY;
ALTER TABLE pengumumans ENABLE ROW LEVEL SECURITY;
ALTER TABLE galeris ENABLE ROW LEVEL SECURITY;
ALTER TABLE profil_sekolahs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppdbs ENABLE ROW LEVEL SECURITY;

-- Allow all operations (backend API uses anon key)
CREATE POLICY "Allow all" ON admins FOR ALL USING (true);
CREATE POLICY "Allow all" ON articles FOR ALL USING (true);
CREATE POLICY "Allow all" ON gurus FOR ALL USING (true);
CREATE POLICY "Allow all" ON kelas FOR ALL USING (true);
CREATE POLICY "Allow all" ON siswas FOR ALL USING (true);
CREATE POLICY "Allow all" ON jadwals FOR ALL USING (true);
CREATE POLICY "Allow all" ON pengumumans FOR ALL USING (true);
CREATE POLICY "Allow all" ON galeris FOR ALL USING (true);
CREATE POLICY "Allow all" ON profil_sekolahs FOR ALL USING (true);
CREATE POLICY "Allow all" ON ppdbs FOR ALL USING (true);
