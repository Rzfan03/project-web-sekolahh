# API Documentation - Web Sekolah Backend

Base URL: `http://localhost:3000/api`
Content-Type: `application/json` (kecuali upload file)
Auth: `Authorization: Bearer <token>` (untuk route admin)

---

## Quick Reference

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | No | Register admin baru |
| `POST` | `/api/auth/login` | No | Login, dapat JWT token |
| `GET` | `/api/auth/me` | Yes | Data admin yang login |

### Public (Halaman Utama)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/profil` | No | Profil sekolah |
| `GET` | `/api/berita` | No | Daftar berita (paginated) |
| `GET` | `/api/berita/:slug` | No | Detail berita by slug |
| `GET` | `/api/pengumuman` | No | Daftar pengumuman (paginated) |
| `GET` | `/api/guru` | No | Daftar guru aktif |
| `GET` | `/api/guru/:id` | No | Detail guru |
| `GET` | `/api/galeri` | No | Galeri foto (filter kategori) |
| `GET` | `/api/kelas` | No | Daftar kelas + jumlah siswa |
| `GET` | `/api/jadwal/:kelasId` | No | Jadwal per kelas |
| `POST` | `/api/ppdb` | No | Form pendaftaran PPDB |

### Admin (Dashboard)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/admin/dashboard` | Yes | Statistik + recent data |
| | | | |
| `GET` | `/api/admin/artikel` | Yes | Daftar semua artikel |
| `GET` | `/api/admin/artikel/:id` | Yes | Detail artikel |
| `POST` | `/api/admin/artikel` | Yes | Buat artikel baru |
| `PUT` | `/api/admin/artikel/:id` | Yes | Update artikel |
| `DELETE` | `/api/admin/artikel/:id` | Yes | Hapus artikel |
| | | | |
| `GET` | `/api/admin/guru` | Yes | Daftar semua guru |
| `POST` | `/api/admin/guru` | Yes | Tambah guru |
| `PUT` | `/api/admin/guru/:id` | Yes | Update guru |
| `DELETE` | `/api/admin/guru/:id` | Yes | Hapus guru |
| | | | |
| `GET` | `/api/admin/siswa` | Yes | Daftar semua siswa |
| `GET` | `/api/admin/siswa/:id` | Yes | Detail siswa |
| `POST` | `/api/admin/siswa` | Yes | Tambah siswa |
| `PUT` | `/api/admin/siswa/:id` | Yes | Update siswa |
| `DELETE` | `/api/admin/siswa/:id` | Yes | Hapus siswa |
| | | | |
| `GET` | `/api/admin/kelas` | Yes | Daftar kelas |
| `GET` | `/api/admin/kelas/:id` | Yes | Detail kelas + siswa |
| `POST` | `/api/admin/kelas` | Yes | Buat kelas baru |
| `PUT` | `/api/admin/kelas/:id` | Yes | Update kelas |
| `DELETE` | `/api/admin/kelas/:id` | Yes | Hapus kelas |
| | | | |
| `GET` | `/api/admin/jadwal` | Yes | Semua jadwal |
| `POST` | `/api/admin/jadwal` | Yes | Buat jadwal baru |
| `PUT` | `/api/admin/jadwal/:id` | Yes | Update jadwal |
| `DELETE` | `/api/admin/jadwal/:id` | Yes | Hapus jadwal |
| | | | |
| `GET` | `/api/admin/pengumuman` | Yes | Semua pengumuman |
| `POST` | `/api/admin/pengumuman` | Yes | Buat pengumuman |
| `PUT` | `/api/admin/pengumuman/:id` | Yes | Update pengumuman |
| `DELETE` | `/api/admin/pengumuman/:id` | Yes | Hapus pengumuman |
| | | | |
| `GET` | `/api/admin/galeri` | Yes | Semua foto galeri |
| `POST` | `/api/admin/galeri` | Yes | Upload foto galeri |
| `PUT` | `/api/admin/galeri/:id` | Yes | Update foto galeri |
| `DELETE` | `/api/admin/galeri/:id` | Yes | Hapus foto galeri |
| | | | |
| `PUT` | `/api/admin/profil` | Yes | Update profil sekolah |
| | | | |
| `GET` | `/api/admin/ppdb` | Yes | Semua pendaftar PPDB |
| `PUT` | `/api/admin/ppdb/:id` | Yes | Update status PPDB |
| `DELETE` | `/api/admin/ppdb/:id` | Yes | Hapus data PPDB |

---

## Response Format

### Success

```json
{
  "message": "Pesan sukses",
  "data": { ... }
}
```

### Success (Paginated)

```json
{
  "data": [ ... ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

### Error

```json
{
  "message": "Pesan error",
  "errors": ["Detail error (opsional)"]
}
```

### Error Codes

| Status | Keterangan |
|--------|------------|
| `400` | Validasi gagal |
| `401` | Tidak terautentikasi / token invalid |
| `404` | Data tidak ditemukan |
| `409` | Data sudah ada (duplicate) |
| `413` | File terlalu besar |
| `500` | Server error |

---

## Authentication

### Register

**`POST /api/auth/register`**

```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response 201:**
```json
{
  "message": "Register berhasil",
  "data": { "id": 1, "username": "admin", "role": "admin" }
}
```

---

### Login

**`POST /api/auth/login`**

```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response 200:**
```json
{
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "data": { "id": 1, "username": "admin", "role": "admin" }
}
```

> Token berlaku selama 1 hari (configurable di `.env`)

---

### Get Me

**`GET /api/auth/me`**

Headers: `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "data": {
    "id": 1,
    "username": "admin",
    "role": "admin",
    "createdAt": "2026-07-26T00:48:06.000Z",
    "updatedAt": "2026-07-26T00:48:06.000Z"
  }
}
```

---

## Public Routes

### Profil Sekolah

**`GET /api/profil`**

```json
{
  "data": {
    "id": 1,
    "namaSekolah": "SMA Negeri 1",
    "npsn": "12345678",
    "alamat": "Jl. Pendidikan No. 1",
    "telepon": "021-1234567",
    "email": "info@sma1.sch.id",
    "website": "https://sma1.sch.id",
    "visi": "Menjadi sekolah unggul...",
    "misi": "1. Menyelenggarakan...",
    "sejarah": "Sekolah ini didirikan pada...",
    "logo": "1785026886-logo.png",
    "slogan": "Cerdas, Berkarakter",
    "tahunBerdiri": 1990,
    "namaKepalaSekolah": "Drs. Budi Santoso",
    "fotoKepalaSekolah": "1785026886-ks.jpg"
  }
}
```

---

### Berita

**`GET /api/berita`**

Query: `?page=1&limit=10`

```json
{
  "data": [
    {
      "id": 1,
      "judul": "Penerimaan Siswa Baru 2026",
      "slug": "penerimaan-siswa-baru-2026",
      "ringkasan": "Pendaftaran tahun ajaran 2026/2027 dibuka...",
      "deskripsi": "<p>Pendaftaran dibuka mulai <strong>1 Juli</strong>...</p>",
      "image": "1785026886-artikel.jpg",
      "status": "published",
      "admin": { "username": "admin" }
    }
  ],
  "pagination": { "total": 15, "page": 1, "limit": 10, "totalPages": 2 }
}
```

> `deskripsi` berisi HTML dari rich text editor. `ringkasan` untuk preview.

---

**`GET /api/berita/:slug`**

```json
{
  "data": {
    "id": 1,
    "judul": "Penerimaan Siswa Baru 2026",
    "slug": "penerimaan-siswa-baru-2026",
    "ringkasan": "Pendaftaran tahun ajaran 2026/2027 dibuka...",
    "deskripsi": "<h2>Pendaftaran Dibuka</h2><p>...</p>",
    "image": "1785026886-artikel.jpg",
    "admin": { "username": "admin" }
  }
}
```

---

### Pengumuman

**`GET /api/pengumuman`**

Query: `?page=1&limit=10`

```json
{
  "data": [
    {
      "id": 1,
      "judul": "Libur Nasional",
      "isi": "Hari senin depan libur",
      "tanggal": "2026-08-01",
      "prioritas": "tinggi",
      "status": "published",
      "admin": { "username": "admin" }
    }
  ],
  "pagination": { "total": 1, "page": 1, "limit": 10, "totalPages": 1 }
}
```

---

### Guru

**`GET /api/guru`**

```json
{
  "data": [
    {
      "id": 1,
      "nama": "Pak Budi",
      "nip": "123456",
      "mataPelajaran": "Matematika",
      "foto": "1785026886-guru.jpg",
      "email": "budi@sekolah.com",
      "telepon": "08123456789",
      "alamat": "Jl. Guru No. 1",
      "status": "aktif"
    }
  ]
}
```

---

**`GET /api/guru/:id`**

```json
{
  "data": {
    "id": 1,
    "nama": "Pak Budi",
    "nip": "123456",
    "mataPelajaran": "Matematika",
    "foto": "1785026886-guru.jpg",
    "email": "budi@sekolah.com",
    "telepon": "08123456789",
    "alamat": "Jl. Guru No. 1",
    "status": "aktif"
  }
}
```

---

### Galeri

**`GET /api/galeri`**

Query: `?page=1&limit=12&kategori=upacara`

```json
{
  "data": [
    {
      "id": 1,
      "judul": "Upacara Bendera",
      "deskripsi": "Upacara hari Senin",
      "image": "1785026886-galeri.jpg",
      "kategori": "upacara",
      "admin": { "username": "admin" }
    }
  ],
  "kategori": ["upacara", "kegiatan", "wisuda"],
  "pagination": { "total": 25, "page": 1, "limit": 12, "totalPages": 3 }
}
```

---

### Kelas

**`GET /api/kelas`**

```json
{
  "data": [
    {
      "id": 1,
      "nama": "X-A",
      "tingkat": "X",
      "kapasitas": 30,
      "waliKelas": { "id": 1, "nama": "Pak Budi" },
      "jumlahSiswa": 25
    }
  ]
}
```

---

### Jadwal

**`GET /api/jadwal/:kelasId`**

```json
{
  "data": [
    {
      "id": 1,
      "hari": "Senin",
      "jamMulai": "07:00:00",
      "jamSelesai": "08:30:00",
      "mataPelajaran": "Matematika",
      "ruangan": "Ruang 1",
      "guru": { "id": 1, "nama": "Pak Budi", "mataPelajaran": "Matematika" },
      "kela": { "id": 1, "nama": "X-A" }
    }
  ]
}
```

---

### PPDB (Pendaftaran)

**`POST /api/ppdb`**

Content-Type: `multipart/form-data`

| Field | Type | Required | Keterangan |
|-------|------|----------|------------|
| namaLengkap | string | Ya | Nama lengkap |
| nisn | string | No | NISN |
| tempatLahir | string | No | Tempat lahir |
| tanggalLahir | date | No | YYYY-MM-DD |
| jenisKelamin | string | Ya | "L" atau "P" |
| alamat | string | Ya | Alamat lengkap |
| telepon | string | No | No. telepon |
| namaOrangTua | string | Ya | Nama orang tua |
| teleponOrangTua | string | No | Telepon orang tua |
| asalSekolah | string | No | Asal sekolah |
| tahunLulus | number | No | Tahun lulus |
| jurusan | string | No | Jurusan |
| berkas | file | No | Max 3MB |

```json
{
  "message": "Pendaftaran PPDB berhasil, data akan diverifikasi oleh admin",
  "data": { "id": 1, "namaLengkap": "Andi Saputra", "status": "pending" }
}
```

---

## Admin Routes

> Semua route `/api/admin/*` membutuhkan header:
> ```
> Authorization: Bearer <token>
> ```

### Dashboard

**`GET /api/admin/dashboard`**

```json
{
  "stats": {
    "totalArtikel": 15,
    "totalGuru": 20,
    "totalSiswa": 450,
    "totalKelas": 12,
    "totalPengumuman": 5,
    "totalGaleri": 30,
    "ppdbPending": 8,
    "siswaAktif": 445,
    "guruAktif": 18
  },
  "recentArticles": [],
  "recentPpdb": []
}
```

---

### Artikel

**`GET /api/admin/artikel`**

Query: `?page=1&limit=10&status=published`

**`GET /api/admin/artikel/:id`**

---

**`POST /api/admin/artikel`**

Content-Type: `multipart/form-data`

| Field | Type | Required | Keterangan |
|-------|------|----------|------------|
| judul | string | Ya | Judul artikel |
| ringkasan | string | No | Ringkasan untuk preview |
| deskripsi | string | Ya | Isi artikel (HTML dari rich text editor) |
| image | file | No | Gambar cover (max 5MB) |
| status | string | No | "draft" atau "published" |

```json
{
  "message": "Artikel berhasil dibuat",
  "data": {
    "id": 1,
    "judul": "Artikel Baru",
    "slug": "artikel-baru",
    "ringkasan": "Ringkasan artikel...",
    "deskripsi": "<h2>Isi Artikel</h2><p>Konten HTML dari editor...</p>",
    "image": "1785026886-artikel.jpg",
    "status": "draft",
    "adminId": 1
  }
}
```

---

**`PUT /api/admin/artikel/:id`**

Content-Type: `multipart/form-data`
Semua field opsional.

---

**`DELETE /api/admin/artikel/:id`**

```json
{ "message": "Artikel berhasil dihapus" }
```

---

### Guru

**`GET /api/admin/guru`**

Query: `?page=1&limit=20`

---

**`POST /api/admin/guru`**

Content-Type: `multipart/form-data`

| Field | Type | Required | Keterangan |
|-------|------|----------|------------|
| nama | string | Ya | Nama guru |
| nip | string | No | NIP |
| mataPelajaran | string | Ya | Mata pelajaran |
| foto | file | No | Foto (max 2MB) |
| email | string | No | Email |
| telepon | string | No | No. telepon |
| alamat | string | No | Alamat |
| status | string | No | "aktif" atau "nonaktif" |

---

**`PUT /api/admin/guru/:id`**

**`DELETE /api/admin/guru/:id`**

---

### Siswa

**`GET /api/admin/siswa`**

Query: `?page=1&limit=20&kelasId=1`

**`GET /api/admin/siswa/:id`**

---

**`POST /api/admin/siswa`**

| Field | Type | Required | Keterangan |
|-------|------|----------|------------|
| namaLengkap | string | Ya | Nama lengkap |
| nisn | string | No | NISN |
| tanggalLahir | date | No | YYYY-MM-DD |
| jenisKelamin | string | No | "L" atau "P" |
| alamat | string | No | Alamat |
| telepon | string | No | No. telepon |
| namaOrangTua | string | No | Nama orang tua |
| tahunMasuk | number | No | Tahun masuk |
| kelasId | number | No | ID kelas |

---

**`PUT /api/admin/siswa/:id`**

**`DELETE /api/admin/siswa/:id`**

---

### Kelas

**`GET /api/admin/kelas`**

**`GET /api/admin/kelas/:id`**

```json
{
  "data": {
    "id": 1,
    "nama": "X-A",
    "tingkat": "X",
    "kapasitas": 30,
    "waliKelas": { "id": 1, "nama": "Pak Budi" },
    "siswas": [
      { "id": 1, "namaLengkap": "Andi", "nisn": "001" }
    ]
  }
}
```

---

**`POST /api/admin/kelas`**

| Field | Type | Required | Keterangan |
|-------|------|----------|------------|
| nama | string | Ya | Nama kelas (unik) |
| tingkat | string | Ya | X, XI, XII |
| waliKelasId | number | No | ID guru wali |
| kapasitas | number | No | Default: 30 |

---

**`PUT /api/admin/kelas/:id`**

**`DELETE /api/admin/kelas/:id`**

> Tidak bisa hapus kelas yang masih punya siswa.

---

### Jadwal

**`GET /api/admin/jadwal`**

---

**`POST /api/admin/jadwal`**

| Field | Type | Required | Keterangan |
|-------|------|----------|------------|
| hari | string | Ya | Senin/Selasa/Rabu/Kamis/Jumat/Sabtu |
| jamMulai | time | Ya | HH:MM |
| jamSelesai | time | Ya | HH:MM |
| mataPelajaran | string | Ya | Nama mata pelajaran |
| guruId | number | No | ID guru |
| kelasId | number | Ya | ID kelas |
| ruangan | string | No | Nama ruangan |

---

**`PUT /api/admin/jadwal/:id`**

**`DELETE /api/admin/jadwal/:id`**

---

### Pengumuman

**`GET /api/admin/pengumuman`**

Query: `?page=1&limit=10`

---

**`POST /api/admin/pengumuman`**

| Field | Type | Required | Keterangan |
|-------|------|----------|------------|
| judul | string | Ya | Judul pengumuman |
| isi | string | Ya | Isi pengumuman |
| tanggal | date | Ya | YYYY-MM-DD |
| prioritas | string | No | "tinggi", "sedang", "rendah" |
| status | string | No | "draft" atau "published" |

---

**`PUT /api/admin/pengumuman/:id`**

**`DELETE /api/admin/pengumuman/:id`**

---

### Galeri

**`GET /api/admin/galeri`**

Query: `?page=1&limit=12`

---

**`POST /api/admin/galeri`**

Content-Type: `multipart/form-data`

| Field | Type | Required | Keterangan |
|-------|------|----------|------------|
| judul | string | Ya | Judul foto |
| deskripsi | string | No | Deskripsi |
| image | file | Ya | Gambar (max 5MB) |
| kategori | string | No | Kategori (default: "umum") |

---

**`PUT /api/admin/galeri/:id`**

**`DELETE /api/admin/galeri/:id`**

---

### Profil Sekolah

**`PUT /api/admin/profil`**

Content-Type: `multipart/form-data`

| Field | Type | Required | Keterangan |
|-------|------|----------|------------|
| namaSekolah | string | No | Nama sekolah |
| npsn | string | No | NPSN |
| alamat | string | No | Alamat |
| telepon | string | No | No. telepon |
| email | string | No | Email |
| website | string | No | Website |
| visi | string | No | Visi sekolah |
| misi | string | No | Misi sekolah |
| sejarah | string | No | Sejarah sekolah |
| logo | file | No | Logo sekolah (max 2MB) |
| slogan | string | No | Slogan |
| tahunBerdiri | number | No | Tahun berdiri |
| namaKepalaSekolah | string | No | Nama kepala sekolah |
| fotoKepalaSekolah | string | No | Path foto KS |

> Profil bersifat singleton. PUT pertama = create, selanjutnya = update.

---

### PPDB (Admin)

**`GET /api/admin/ppdb`**

Query: `?page=1&limit=20&status=pending`

```json
{
  "data": [
    {
      "id": 1,
      "namaLengkap": "Andi Saputra",
      "nisn": "001",
      "tempatLahir": "Jakarta",
      "tanggalLahir": "2008-05-15",
      "jenisKelamin": "L",
      "alamat": "Jl. Merdeka No. 1",
      "telepon": "08123456789",
      "namaOrangTua": "Pak Saputra",
      "teleponOrangTua": "08198765432",
      "asalSekolah": "SMP Negeri 1",
      "tahunLulus": 2026,
      "jurusan": "IPA",
      "berkas": "1785026886-berkas.pdf",
      "status": "pending",
      "catatan": null
    }
  ],
  "pagination": { "total": 8, "page": 1, "limit": 20, "totalPages": 1 }
}
```

---

**`PUT /api/admin/ppdb/:id`**

Update status pendaftaran.

```json
{
  "status": "diterima",
  "catatan": "Lulus seleksi"
}
```

> Status: `pending`, `diterima`, `ditolak`

---

**`DELETE /api/admin/ppdb/:id`**

---

## Database Schema

### Relationships

```
Admin ──1:N── Article     (adminId)
Admin ──1:N── Pengumuman  (adminId)
Admin ──1:N── Galeri      (adminId)

Guru  ──1:N── Jadwal      (guruId)
Guru  ──1:1── Kelas       (waliKelasId)

Kelas ──1:N── Jadwal      (kelasId)
Kelas ──1:N── Siswa       (kelasId)
```

### Tables

| Table | Columns |
|-------|---------|
| **admin** | id, username, password (bcrypt), role (admin/superadmin), createdAt, updatedAt |
| **article** | id, judul, slug (unique), ringkasan, deskripsi (LONGTEXT/HTML), image, status (draft/published), adminId, createdAt, updatedAt |
| **guru** | id, nama, nip (unique), mataPelajaran, foto, email, telepon, alamat, status (aktif/nonaktif), createdAt, updatedAt |
| **kelas** | id, nama (unique), tingkat, waliKelasId (FK guru), kapasitas, createdAt, updatedAt |
| **siswa** | id, namaLengkap, nisn (unique), tanggalLahir, jenisKelamin (L/P), alamat, telepon, namaOrangTua, tahunMasuk, status (aktif/lulus/keluar), kelasId (FK kelas), createdAt, updatedAt |
| **jadwal** | id, hari (Senin-Sabtu), jamMulai, jamSelesai, mataPelajaran, guruId (FK guru), kelasId (FK kelas), ruangan, createdAt, updatedAt |
| **pengumuman** | id, judul, isi, tanggal, prioritas (tinggi/sedang/rendah), status (draft/published), adminId, createdAt, updatedAt |
| **galeri** | id, judul, deskripsi, image, kategori, adminId, createdAt, updatedAt |
| **profil_sekolah** | id, namaSekolah, npsn, alamat, telepon, email, website, visi, misi, sejarah, logo, slogan, tahunBerdiri, namaKepalaSekolah, fotoKepalaSekolah, createdAt, updatedAt |
| **ppdb** | id, namaLengkap, nisn, tempatLahir, tanggalLahir, jenisKelamin, alamat, telepon, namaOrangTua, teleponOrangTua, asalSekolah, tahunLulus, jurusan, berkas, status (pending/diterima/ditolak), catatan, createdAt, updatedAt |

---

## Upload Files

### Limits

| Endpoint | Max Size | Allowed Types |
|----------|----------|---------------|
| `/api/admin/artikel` | 5 MB | jpg, jpeg, png, gif, webp |
| `/api/admin/guru` | 2 MB | jpg, jpeg, png, gif, webp |
| `/api/admin/galeri` | 5 MB | jpg, jpeg, png, gif, webp |
| `/api/admin/profil` | 2 MB | jpg, jpeg, png, gif, webp |
| `/api/ppdb` | 3 MB | jpg, jpeg, png, gif, webp |

### File URL

```
http://localhost:3000/uploads/<folder>/<filename>

Contoh:
http://localhost:3000/uploads/artikel/1785026886-artikel.jpg
http://localhost:3000/uploads/guru/1785026886-guru.jpg
```

### Directory Structure

```
public/uploads/
├── artikel/     # Gambar artikel
├── guru/        # Foto guru
├── galeri/      # Foto galeri
├── profil/      # Logo sekolah
└── ppdb/        # Berkas pendaftaran
```

---

## Setup

```bash
# Install
npm install

# Run
npm start
```

### .env

```env
DB_NAME=db_sekolah
DB_USERNAME=dbreaver
DB_PASSWORD=20082008
DB_HOST=localhost

JWT_SECRET=super_rahasia_jwt_token_sekolah_2026
JWT_EXPIRES_IN=1d

PORT=3000
```

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Runtime | Node.js |
| Framework | Express 5 |
| ORM | Sequelize 6 |
| Database | MySQL |
| Auth | JWT + bcryptjs |
| Upload | Multer |
| Security | Helmet |
| Env | dotenv |
