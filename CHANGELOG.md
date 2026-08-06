# Changelog

Semua perubahan penting pada website SMKN 1 Sumbawa Besar.

## [2026-08-06]

### Fitur
- **PPDB self-registration**: formulir pendaftaran langsung dari publik (status otomatis `pending`) + pengecekan hasil cukup dengan NISN. Layout mengikuti referensi SPMB (header grup, tombol penuh, dsb).
- **Upload berkas PPDB**: pas foto, KK, akta, SKL (wajib), KIP (opsional). JPEG/PNG/PDF, maks 0.5MB/file, disimpan sebagai base64 di kolom `berkas`. Admin dapat melihat/mengunduh berkas dari dashboard.
- **Jurusan dropdown**: pilihan Kompetensi Keahlian di form PPDB diubah dari kartu radio menjadi `<select>` yang seragam dengan field lain.
- **Login dashboard berbasis akun lokal**: akun admin baru dibuat dengan password ter-hash (PBKDF2 + salt) di tabel `admins` — langsung aktif tanpa konfirmasi email Supabase. Akun lama tetap login lewat Supabase Auth (fallback). Reset password tersedia saat edit akun.
- **Spinner simpan akun**: tombol di Manajemen Akun menampilkan state loading selama proses pembuatan/update.

### Desain & UI
- **Halaman Agenda** didesain ulang mengikuti referensi (arsip agenda, blok tanggal, sidebar "Rilis Berita").
- **Ikon menu navbar dihapus**; menu berada di tengah.
- **Hero slider**: lebih kecil, `rounded-2xl`, teks di tengah, tanpa bayangan, dan responsif di mobile (`min-h` + padding sehingga tidak terpotong saat konten terbungkus).
- **Badge/label seksi dihapus** dari halaman publik dan seluruh 7 seksi beranda.
- Lebar input di form PPDB disamakan (`w-full` pada semua sel grid).

### Bugfix
- Login akun yang baru dibuat gagal padahal email/password benar — disebabkan konfirmasi email Supabase. Diselesaikan dengan autentikasi lokal (lihat fitur login di atas).

### Catatan
- Halaman Kontak sempat dibuat lalu dihapus karena informasi kontak sudah tersedia di halaman Profil.
- `DESIGN.md` dihapus hanya di lokal, tidak di-push ke GitHub.
