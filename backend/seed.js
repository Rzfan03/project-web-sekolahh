import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabase = createClient(
  'https://yxzcghebztodysffuwqi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4emNnaGVienRvZHlzZmZ1d3FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwMzcxODUsImV4cCI6MjEwMDYxMzE4NX0.x6DhkI6wI3aO17nS3ZEVIJYKUuBVdtsoanXcAKmcYm8'
)

async function seed() {
  console.log('Seeding database...')

  // Check existing admin
  const { data: existingAdmin } = await supabase.from('admins').select('id').limit(1).single()

  let admin = existingAdmin
  if (!admin) {
    const hashedPassword = await bcrypt.hash('admin123', 10)
    const { data } = await supabase.from('admins').insert({ username: 'admin', password: hashedPassword, role: 'admin' }).select().single()
    admin = data
  }
  console.log('Admin:', admin?.username)

  // Check existing gurus
  const { data: existingGurus } = await supabase.from('gurus').select('id, nama')
  let gurus = existingGurus

  if (!gurus || gurus.length === 0) {
    const guruData = [
      { nama: 'Budi Santoso', nip: '198501012010011001', mata_pelajaran: 'Matematika', email: 'budi@sekolah.id', telepon: '081234567890', alamat: 'Jl. Merdeka No. 10', status: 'aktif' },
      { nama: 'Siti Rahayu', nip: '198703152010012002', mata_pelajaran: 'Bahasa Indonesia', email: 'siti@sekolah.id', telepon: '081234567891', alamat: 'Jl. Sudirman No. 25', status: 'aktif' },
      { nama: 'Ahmad Hidayat', nip: '198905202012011003', mata_pelajaran: 'Bahasa Inggris', email: 'ahmad@sekolah.id', telepon: '081234567892', alamat: 'Jl. Thamrin No. 5', status: 'aktif' },
      { nama: 'Dewi Lestari', nip: '199008102013012004', mata_pelajaran: 'IPA', email: 'dewi@sekolah.id', telepon: '081234567893', alamat: 'Jl. Gatot Subroto No. 15', status: 'aktif' },
      { nama: 'Rizki Pratama', nip: '199112252014011005', mata_pelajaran: 'IPS', email: 'rizki@sekolah.id', telepon: '081234567894', alamat: 'Jl. Diponegoro No. 30', status: 'aktif' },
      { nama: 'Putri Wulandari', nip: '199206052015012006', mata_pelajaran: 'Pendidikan Agama', email: 'putri@sekolah.id', telepon: '081234567895', alamat: 'Jl. Ahmad Yani No. 20', status: 'aktif' },
      { nama: 'Hendra Kusuma', nip: '198809012011011007', mata_pelajaran: 'Pendidikan Jasmani', email: 'hendra@sekolah.id', telepon: '081234567896', alamat: 'Jl. Pemuda No. 12', status: 'aktif' },
      { nama: 'Rina Oktaviani', nip: '199301102016012008', mata_pelajaran: 'Seni Budaya', email: 'rina@sekolah.id', telepon: '081234567897', alamat: 'Jl. Kartini No. 8', status: 'aktif' },
    ]
    const { data } = await supabase.from('gurus').insert(guruData).select()
    gurus = data
  }
  console.log('Gurus:', gurus?.length)

  // Check existing kelas
  const { data: existingKelas } = await supabase.from('kelas').select('id, nama')
  let kelas = existingKelas

  if (!kelas || kelas.length === 0) {
    const kelasData = [
      { nama: 'X IPA 1', tingkat: 'X', kapasitas: 36, wali_kelas_id: gurus?.[0]?.id },
      { nama: 'X IPA 2', tingkat: 'X', kapasitas: 36, wali_kelas_id: gurus?.[1]?.id },
      { nama: 'XI IPA 1', tingkat: 'XI', kapasitas: 36, wali_kelas_id: gurus?.[2]?.id },
      { nama: 'XI IPA 2', tingkat: 'XI', kapasitas: 36, wali_kelas_id: gurus?.[3]?.id },
      { nama: 'XII IPA 1', tingkat: 'XII', kapasitas: 36, wali_kelas_id: gurus?.[4]?.id },
    ]
    const { data } = await supabase.from('kelas').insert(kelasData).select()
    kelas = data
  }
  console.log('Kelas:', kelas?.length)

  // Check existing siswa
  const { count: siswaCount } = await supabase.from('siswas').select('*', { count: 'exact', head: true })
  if (siswaCount === 0) {
    const siswaData = [
      { nama_lengkap: 'Andi Saputra', nisn: '0081234001', jenis_kelamin: 'Laki-laki', alamat: 'Jl. Merdeka No. 1', telepon: '081111111101', nama_orang_tua: 'Bapak Saputra', tahun_masuk: 2024, kelas_id: kelas?.[0]?.id },
      { nama_lengkap: 'Rina Wati', nisn: '0081234002', jenis_kelamin: 'Perempuan', alamat: 'Jl. Merdeka No. 2', telepon: '081111111102', nama_orang_tua: 'Bapak Wati', tahun_masuk: 2024, kelas_id: kelas?.[0]?.id },
      { nama_lengkap: 'Deni Kurniawan', nisn: '0081234003', jenis_kelamin: 'Laki-laki', alamat: 'Jl. Merdeka No. 3', telepon: '081111111103', nama_orang_tua: 'Ibu Kurniawan', tahun_masuk: 2024, kelas_id: kelas?.[1]?.id },
      { nama_lengkap: 'Sari Dewi', nisn: '0081234004', jenis_kelamin: 'Perempuan', alamat: 'Jl. Merdeka No. 4', telepon: '081111111104', nama_orang_tua: 'Bapak Dewi', tahun_masuk: 2024, kelas_id: kelas?.[1]?.id },
      { nama_lengkap: 'Fajar Nugroho', nisn: '0071234005', jenis_kelamin: 'Laki-laki', alamat: 'Jl. Sudirman No. 1', telepon: '081111111105', nama_orang_tua: 'Ibu Nugroho', tahun_masuk: 2023, kelas_id: kelas?.[2]?.id },
      { nama_lengkap: 'Maya Putri', nisn: '0071234006', jenis_kelamin: 'Perempuan', alamat: 'Jl. Sudirman No. 2', telepon: '081111111106', nama_orang_tua: 'Bapak Putri', tahun_masuk: 2023, kelas_id: kelas?.[2]?.id },
      { nama_lengkap: 'Rizal Firmansyah', nisn: '0071234007', jenis_kelamin: 'Laki-laki', alamat: 'Jl. Sudirman No. 3', telepon: '081111111107', nama_orang_tua: 'Ibu Firmansyah', tahun_masuk: 2023, kelas_id: kelas?.[3]?.id },
      { nama_lengkap: 'Lisa Anggraini', nisn: '0061234008', jenis_kelamin: 'Perempuan', alamat: 'Jl. Thamrin No. 1', telepon: '081111111108', nama_orang_tua: 'Bapak Anggraini', tahun_masuk: 2022, kelas_id: kelas?.[4]?.id },
      { nama_lengkap: 'Tommy Hermawan', nisn: '0061234009', jenis_kelamin: 'Laki-laki', alamat: 'Jl. Thamrin No. 2', telepon: '081111111109', nama_orang_tua: 'Ibu Hermawan', tahun_masuk: 2022, kelas_id: kelas?.[4]?.id },
      { nama_lengkap: 'Diana Sari', nisn: '0061234010', jenis_kelamin: 'Perempuan', alamat: 'Jl. Thamrin No. 3', telepon: '081111111110', nama_orang_tua: 'Bapak Sari', tahun_masuk: 2022, kelas_id: kelas?.[4]?.id },
    ]
    await supabase.from('siswas').insert(siswaData)
  }
  const { count: sc } = await supabase.from('siswas').select('*', { count: 'exact', head: true })
  console.log('Siswa:', sc)

  // Artikel
  const { count: artCount } = await supabase.from('articles').select('*', { count: 'exact', head: true })
  if (artCount === 0) {
    await supabase.from('articles').insert([
      { judul: 'Penerimaan Peserta Didik Baru 2026', slug: 'ppdb-2026', ringkasan: 'Pendaftaran PPDB tahun ajaran 2026/2027 telah dibuka', deskripsi: '<p>Dengan bangga kami umumkan bahwa pendaftaran PPDB untuk tahun ajaran 2026/2027 telah resmi dibuka.</p>', status: 'published', admin_id: admin?.id },
      { judul: 'Prestasi Siswa Olimpiade Sains', slug: 'prestasi-olimpiade-sains-2026', ringkasan: '3 siswa meraih medali emas', deskripsi: '<p>Selamat kepada 3 siswa kami yang meraih medali emas Olimpiade Sains tingkat provinsi.</p>', status: 'published', admin_id: admin?.id },
      { judul: 'Kegiatan Pramuka Semester Genap', slug: 'kegiatan-pramuka-semester-genap', ringkasan: 'Kegiatan pramuka semester genap dimulai', deskripsi: '<p>Ekstrakurikuler pramuka semester genap telah dimulai setiap hari Jumat.</p>', status: 'published', admin_id: admin?.id },
      { judul: 'Workshop Teknologi Informasi', slug: 'workshop-teknologi-informasi', ringkasan: 'Workshop pemrograman untuk siswa kelas XII', deskripsi: '<p>Workshop TI untuk siswa kelas XII guna menambah keterampilan.</p>', status: 'published', admin_id: admin?.id },
      { judul: 'Ujian Akhir Semester Genap', slug: 'ujian-akhir-semester-genap', ringkasan: 'Jadwal ujian akhir semester genap', deskripsi: '<p>Ujian akhir semester dilaksanakan 15-30 Juni 2026.</p>', status: 'draft', admin_id: admin?.id },
    ])
  }
  const { count: ac } = await supabase.from('articles').select('*', { count: 'exact', head: true })
  console.log('Artikel:', ac)

  // Pengumuman
  const { count: pengCount } = await supabase.from('pengumumans').select('*', { count: 'exact', head: true })
  if (pengCount === 0) {
    await supabase.from('pengumumans').insert([
      { judul: 'Libur Hari Raya', isi: 'Sekolah libur 1-10 April 2026. KBM dimulai 11 April 2026.', tanggal: '2026-04-01', prioritas: 'tinggi', status: 'published', admin_id: admin?.id },
      { judul: 'Pembayaran SPP Bulan April', isi: 'Pembayaran SPP April dibuka hingga 15 April 2026.', tanggal: '2026-04-05', prioritas: 'sedang', status: 'published', admin_id: admin?.id },
      { judul: 'Kunjungan Industri Kelas XII', isi: 'Kunjungan industri 20 April 2026. Hadir tepat waktu dengan seragam lengkap.', tanggal: '2026-04-10', prioritas: 'sedang', status: 'published', admin_id: admin?.id },
      { judul: 'Pemilihan OSIS', isi: 'Pemilihan ketua OSIS 25 April 2026.', tanggal: '2026-04-15', prioritas: 'rendah', status: 'published', admin_id: admin?.id },
    ])
  }
  const { count: pc } = await supabase.from('pengumumans').select('*', { count: 'exact', head: true })
  console.log('Pengumuman:', pc)

  // Jadwal
  const { count: jadCount } = await supabase.from('jadwals').select('*', { count: 'exact', head: true })
  if (jadCount === 0) {
    await supabase.from('jadwals').insert([
      { hari: 'Senin', jam_mulai: '07:00', jam_selesai: '08:30', mata_pelajaran: 'Matematika', guru_id: gurus?.[0]?.id, kelas_id: kelas?.[0]?.id, ruangan: 'Ruang 1' },
      { hari: 'Senin', jam_mulai: '08:30', jam_selesai: '10:00', mata_pelajaran: 'Bahasa Indonesia', guru_id: gurus?.[1]?.id, kelas_id: kelas?.[0]?.id, ruangan: 'Ruang 1' },
      { hari: 'Senin', jam_mulai: '10:30', jam_selesai: '12:00', mata_pelajaran: 'Bahasa Inggris', guru_id: gurus?.[2]?.id, kelas_id: kelas?.[0]?.id, ruangan: 'Ruang 1' },
      { hari: 'Selasa', jam_mulai: '07:00', jam_selesai: '08:30', mata_pelajaran: 'IPA', guru_id: gurus?.[3]?.id, kelas_id: kelas?.[0]?.id, ruangan: 'Ruang 1' },
      { hari: 'Selasa', jam_mulai: '08:30', jam_selesai: '10:00', mata_pelajaran: 'IPS', guru_id: gurus?.[4]?.id, kelas_id: kelas?.[0]?.id, ruangan: 'Ruang 1' },
      { hari: 'Rabu', jam_mulai: '07:00', jam_selesai: '08:30', mata_pelajaran: 'Pendidikan Agama', guru_id: gurus?.[5]?.id, kelas_id: kelas?.[0]?.id, ruangan: 'Ruang 1' },
      { hari: 'Kamis', jam_mulai: '07:00', jam_selesai: '08:30', mata_pelajaran: 'Pendidikan Jasmani', guru_id: gurus?.[6]?.id, kelas_id: kelas?.[0]?.id, ruangan: 'Lapangan' },
      { hari: 'Kamis', jam_mulai: '08:30', jam_selesai: '10:00', mata_pelajaran: 'Seni Budaya', guru_id: gurus?.[7]?.id, kelas_id: kelas?.[0]?.id, ruangan: 'Ruang Seni' },
      { hari: 'Jumat', jam_mulai: '07:00', jam_selesai: '09:00', mata_pelajaran: 'Bahasa Indonesia', guru_id: gurus?.[1]?.id, kelas_id: kelas?.[0]?.id, ruangan: 'Ruang 1' },
    ])
  }
  const { count: jc } = await supabase.from('jadwals').select('*', { count: 'exact', head: true })
  console.log('Jadwal:', jc)

  // Profil
  const { data: existingProfil } = await supabase.from('profil_sekolahs').select('id').limit(1).single()
  if (!existingProfil) {
    await supabase.from('profil_sekolahs').insert({
      nama_sekolah: 'SMA Negeri 1 Nusantara',
      alamat: 'Jl. Pendidikan No. 123, Kota Nusantara, Jawa Barat 40123',
      telepon: '(022) 1234567',
      email: 'info@sman1nusantara.sch.id',
      website: 'https://sman1nusantara.sch.id',
      visi: 'Unggul dalam Prestasi, Berakhlak Mulia, dan Berwawasan Global',
      misi: '1. Menyelenggarakan pendidikan berkualitas\n2. Mengembangkan potensi siswa\n3. Membentuk karakter berakhlak mulia\n4. Mempersiapkan siswa hadapi tantangan global'
    })
  }
  console.log('Profil: OK')

  // Galeri
  const { count: galCount } = await supabase.from('galeris').select('*', { count: 'exact', head: true })
  if (galCount === 0) {
    await supabase.from('galeris').insert([
      { judul: 'Upacara Bendera Senin', deskripsi: 'Upacara bendera rutin setiap hari Senin', image: 'placeholder.jpg', kategori: 'Kegiatan', admin_id: admin?.id },
      { judul: 'Festival Seni Sekolah', deskripsi: 'Festival seni tahunan', image: 'placeholder.jpg', kategori: 'Seni', admin_id: admin?.id },
      { judul: 'Lomba Pramuka', deskripsi: 'Lomba kepramukaan tingkat kabupaten', image: 'placeholder.jpg', kategori: 'Olahraga', admin_id: admin?.id },
      { judul: 'Kunjungan Perpustakaan', deskripsi: 'Siswa kelas X kunjungi perpustakaan daerah', image: 'placeholder.jpg', kategori: 'Edukasi', admin_id: admin?.id },
    ])
  }
  const { count: galC } = await supabase.from('galeris').select('*', { count: 'exact', head: true })
  console.log('Galeri:', galC)

  console.log('\nDone! Login: admin / admin123')
}

seed().catch(console.error)
