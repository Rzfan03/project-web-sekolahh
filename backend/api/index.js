import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import slugify from 'slugify'
import multer from 'multer'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://yxzcghebztodysffuwqi.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4emNnaGVienRvZHlzZmZ1d3FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwMzcxODUsImV4cCI6MjEwMDYxMzE4NX0.x6DhkI6wI3aO17nS3ZEVIJYKUuBVdtsoanXcAKmcYm8'
const JWT_SECRET = process.env.JWT_SECRET || 'f65314669173778372144140f40abe3b87f06db4fd9ef6662b3b85832544dfe65f06364f511ad5d1d137926577e3831c7819e790c2e923f1c5bc3ba641449c82'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const app = express()
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const auth = (req, res, next) => {
  const h = req.headers.authorization
  if (!h || !h.startsWith('Bearer ')) return res.status(401).json({ message: 'Token tidak ditemukan' })
  try { req.admin = jwt.verify(h.split(' ')[1], JWT_SECRET); next() }
  catch { return res.status(401).json({ message: 'Token tidak valid' }) }
}

const upload = (folder, field) => multer({
  storage: multer.diskStorage({ destination: (_, __, cb) => cb(null, '/tmp'), filename: (_, f, cb) => cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(f.originalname)) }),
  fileFilter: (_, f, cb) => cb(null, ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(f.mimetype)),
  limits: { fileSize: 5 * 1024 * 1024 }
}).single(field)

const pag = (req) => { const p = parseInt(req.query.page) || 1, l = parseInt(req.query.limit) || 10; return { p, l, from: (p-1)*l, to: (p-1)*l+l-1 } }
const errH = (e, _, res) => { console.error(e); res.status(500).json({ message: 'Internal server error' }) }

app.get('/', (_, res) => res.json({ status: 'ok' }))

// AUTH
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) return res.status(400).json({ message: 'Username & password wajib' })
    const { data: ex } = await supabase.from('admins').select('id').eq('username', username).single()
    if (ex) return res.status(409).json({ message: 'Username sudah dipakai' })
    const { data, error } = await supabase.from('admins').insert({ username, password: await bcrypt.hash(password, 10) }).select('id,username,role').single()
    if (error) throw error; res.status(201).json({ message: 'Register berhasil', data })
  } catch (e) { res.status(500).json({ message: e.message }) }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) return res.status(400).json({ message: 'Username & password wajib' })
    const { data: a } = await supabase.from('admins').select('*').eq('username', username).single()
    if (!a || !(await bcrypt.compare(password, a.password))) return res.status(401).json({ message: 'Username atau password salah' })
    const token = jwt.sign({ id: a.id, username: a.username, role: a.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
    res.json({ message: 'Login berhasil', token, data: { id: a.id, username: a.username, role: a.role } })
  } catch (e) { res.status(500).json({ message: e.message }) }
})

app.get('/api/auth/me', auth, async (req, res) => {
  const { data } = await supabase.from('admins').select('id,username,role,created_at').eq('id', req.admin.id).single()
  res.json({ data })
})

// PUBLIC
app.get('/api/profil', async (_, res) => {
  const { data } = await supabase.from('profil_sekolahs').select('*').limit(1).single()
  data ? res.json({ data }) : res.status(404).json({ message: 'Profil belum diatur' })
})

app.get('/api/berita', async (req, res) => {
  const { p, l, from, to } = pag(req)
  const { data, error, count } = await supabase.from('articles').select('*, admins(username)', { count: 'exact' }).eq('status', 'published').order('created_at', { ascending: false }).range(from, to)
  if (error) return res.status(500).json({ message: error.message })
  res.json({ data, pagination: { total: count, page: p, limit: l, totalPages: Math.ceil(count / l) } })
})

app.get('/api/berita/:slug', async (req, res) => {
  const { data } = await supabase.from('articles').select('*, admins(username)').eq('slug', req.params.slug).eq('status', 'published').single()
  data ? res.json({ data }) : res.status(404).json({ message: 'Artikel tidak ditemukan' })
})

app.get('/api/pengumuman', async (req, res) => {
  const { p, l, from, to } = pag(req)
  const { data, error, count } = await supabase.from('pengumumans').select('*, admins(username)', { count: 'exact' }).eq('status', 'published').order('tanggal', { ascending: false }).range(from, to)
  if (error) return res.status(500).json({ message: error.message })
  res.json({ data, pagination: { total: count, page: p, limit: l, totalPages: Math.ceil(count / l) } })
})

app.get('/api/guru', async (_, res) => {
  const { data } = await supabase.from('gurus').select('*').eq('status', 'aktif').order('nama')
  res.json({ data })
})

app.get('/api/guru/:id', async (req, res) => {
  const { data } = await supabase.from('gurus').select('*').eq('id', req.params.id).single()
  data ? res.json({ data }) : res.status(404).json({ message: 'Guru tidak ditemukan' })
})

app.get('/api/galeri', async (req, res) => {
  const { p, l, from, to } = pag(req)
  let q = supabase.from('galeris').select('*, admins(username)', { count: 'exact' }).order('created_at', { ascending: false }).range(from, to)
  if (req.query.kategori) q = q.eq('kategori', req.query.kategori)
  const { data, error, count } = await q
  if (error) return res.status(500).json({ message: error.message })
  res.json({ data, pagination: { total: count, page: p, limit: l, totalPages: Math.ceil(count / l) } })
})

app.get('/api/kelas', async (_, res) => {
  const { data: kl } = await supabase.from('kelas').select('*, gurus(nama)').order('nama')
  const r = await Promise.all(kl.map(async k => { const { count } = await supabase.from('siswas').select('*', { count: 'exact', head: true }).eq('kelas_id', k.id); return { ...k, waliKelas: k.gurus, jumlahSiswa: count || 0 } }))
  res.json({ data: r })
})

app.get('/api/jadwal/:kelasId', async (req, res) => {
  const { data } = await supabase.from('jadwals').select('*, gurus(id,nama,mata_pelajaran), kelas(nama)').eq('kelas_id', req.params.kelasId).order('hari').order('jam_mulai')
  res.json({ data })
})

app.post('/api/ppdb', upload('ppdb', 'berkas'), async (req, res) => {
  const { namaLengkap, jenisKelamin, alamat, namaOrangTua } = req.body
  if (!namaLengkap || !jenisKelamin || !alamat || !namaOrangTua) return res.status(400).json({ message: 'Data wajib tidak lengkap' })
  const { data, error } = await supabase.from('ppdbs').insert({ nama_lengkap: namaLengkap, nisn: req.body.nisn, tempat_lahir: req.body.tempatLahir, tanggal_lahir: req.body.tanggalLahir, jenis_kelamin: jenisKelamin, alamat, telepon: req.body.telepon, nama_orang_tua: namaOrangTua, telepon_orang_tua: req.body.teleponOrangTua, asal_sekolah: req.body.asalSekolah, tahun_lulus: req.body.tahunLulus, jurusan: req.body.jurusan, berkas: req.file?.filename }).select('id,nama_lengkap,status').single()
  if (error) return res.status(500).json({ message: error.message })
  res.status(201).json({ message: 'Pendaftaran berhasil', data })
})

// ADMIN
app.get('/api/admin/dashboard', auth, async (_, res) => {
  const c = await Promise.all([ supabase.from('articles').select('*', { count: 'exact', head: true }), supabase.from('gurus').select('*', { count: 'exact', head: true }), supabase.from('siswas').select('*', { count: 'exact', head: true }), supabase.from('kelas').select('*', { count: 'exact', head: true }), supabase.from('pengumumans').select('*', { count: 'exact', head: true }), supabase.from('galeris').select('*', { count: 'exact', head: true }), supabase.from('ppdbs').select('*', { count: 'exact', head: true }).eq('status', 'pending') ])
  const [totalArtikel, totalGuru, totalSiswa, totalKelas, totalPengumuman, totalGaleri, ppdbPending] = c.map(x => x.count || 0)
  const { data: recentArticles } = await supabase.from('articles').select('*').order('created_at', { ascending: false }).limit(5)
  res.json({ stats: { totalArtikel, totalGuru, totalSiswa, totalKelas, totalPengumuman, totalGaleri, ppdbPending }, recentArticles })
})

// Admin Artikel
app.get('/api/admin/artikel', auth, async (req, res) => {
  const { p, l, from, to } = pag(req)
  let q = supabase.from('articles').select('*, admins(username)', { count: 'exact' }).order('created_at', { ascending: false }).range(from, to)
  if (req.query.status) q = q.eq('status', req.query.status)
  const { data, error, count } = await q
  if (error) return res.status(500).json({ message: error.message })
  res.json({ data, pagination: { total: count, page: p, limit: l, totalPages: Math.ceil(count / l) } })
})

app.get('/api/admin/artikel/:id', auth, async (req, res) => {
  const { data } = await supabase.from('articles').select('*').eq('id', req.params.id).single()
  data ? res.json({ data }) : res.status(404).json({ message: 'Tidak ditemukan' })
})

app.post('/api/admin/artikel', auth, upload('artikel', 'image'), async (req, res) => {
  const { judul, ringkasan, deskripsi, status } = req.body
  if (!judul || !deskripsi) return res.status(400).json({ message: 'Judul & deskripsi wajib' })
  let slug = slugify(judul, { lower: true, strict: true })
  const { data: ex } = await supabase.from('articles').select('id').eq('slug', slug).single()
  if (ex) slug += '-' + Date.now()
  const { data, error } = await supabase.from('articles').insert({ judul, slug, ringkasan, deskripsi, image: req.file?.filename, status: status || 'draft', admin_id: req.admin.id }).select().single()
  if (error) throw error; res.status(201).json({ message: 'Artikel dibuat', data })
})

app.put('/api/admin/artikel/:id', auth, upload('artikel', 'image'), async (req, res) => {
  const { data: ex } = await supabase.from('articles').select('*').eq('id', req.params.id).single()
  if (!ex) return res.status(404).json({ message: 'Tidak ditemukan' })
  const u = {}
  if (req.body.judul) { u.judul = req.body.judul; let s = slugify(req.body.judul, { lower: true, strict: true }); const { data: d } = await supabase.from('articles').select('id').eq('slug', s).neq('id', ex.id).single(); if (d) s += '-' + Date.now(); u.slug = s }
  if (req.body.ringkasan !== undefined) u.ringkasan = req.body.ringkasan
  if (req.body.deskripsi) u.deskripsi = req.body.deskripsi
  if (req.body.status) u.status = req.body.status
  if (req.file) u.image = req.file.filename
  const { data, error } = await supabase.from('articles').update(u).eq('id', req.params.id).select().single()
  if (error) throw error; res.json({ message: 'Artikel diupdate', data })
})

app.delete('/api/admin/artikel/:id', auth, async (req, res) => {
  const { data: ex } = await supabase.from('articles').select('id').eq('id', req.params.id).single()
  if (!ex) return res.status(404).json({ message: 'Tidak ditemukan' })
  await supabase.from('articles').delete().eq('id', req.params.id); res.json({ message: 'Artikel dihapus' })
})

// Admin Guru
app.get('/api/admin/guru', auth, async (req, res) => {
  const { p, l, from, to } = pag(req)
  const { data, error, count } = await supabase.from('gurus').select('*', { count: 'exact' }).order('nama').range(from, to)
  if (error) return res.status(500).json({ message: error.message })
  res.json({ data, pagination: { total: count, page: p, limit: l, totalPages: Math.ceil(count / l) } })
})

app.post('/api/admin/guru', auth, upload('guru', 'foto'), async (req, res) => {
  const { nama, mataPelajaran } = req.body
  if (!nama || !mataPelajaran) return res.status(400).json({ message: 'Nama & mata pelajaran wajib' })
  const { data, error } = await supabase.from('gurus').insert({ nama, nip: req.body.nip, mata_pelajaran: mataPelajaran, foto: req.file?.filename, email: req.body.email, telepon: req.body.telepon, alamat: req.body.alamat, status: req.body.status || 'aktif' }).select().single()
  if (error) throw error; res.status(201).json({ message: 'Guru ditambahkan', data })
})

app.put('/api/admin/guru/:id', auth, upload('guru', 'foto'), async (req, res) => {
  const { data: ex } = await supabase.from('gurus').select('id').eq('id', req.params.id).single()
  if (!ex) return res.status(404).json({ message: 'Tidak ditemukan' })
  const u = { ...req.body }; if (req.file) u.foto = req.file.filename
  const { data, error } = await supabase.from('gurus').update(u).eq('id', req.params.id).select().single()
  if (error) throw error; res.json({ message: 'Guru diupdate', data })
})

app.delete('/api/admin/guru/:id', auth, async (req, res) => {
  const { data: ex } = await supabase.from('gurus').select('id').eq('id', req.params.id).single()
  if (!ex) return res.status(404).json({ message: 'Tidak ditemukan' })
  await supabase.from('gurus').delete().eq('id', req.params.id); res.json({ message: 'Guru dihapus' })
})

// Admin Siswa
app.get('/api/admin/siswa', auth, async (req, res) => {
  const { p, l, from, to } = pag(req)
  let q = supabase.from('siswas').select('*, kelas(nama)', { count: 'exact' }).order('nama_lengkap').range(from, to)
  if (req.query.kelasId) q = q.eq('kelas_id', req.query.kelasId)
  const { data, error, count } = await q
  if (error) return res.status(500).json({ message: error.message })
  res.json({ data, pagination: { total: count, page: p, limit: l, totalPages: Math.ceil(count / l) } })
})

app.get('/api/admin/siswa/:id', auth, async (req, res) => {
  const { data } = await supabase.from('siswas').select('*, kelas(nama)').eq('id', req.params.id).single()
  data ? res.json({ data }) : res.status(404).json({ message: 'Tidak ditemukan' })
})

app.post('/api/admin/siswa', auth, async (req, res) => {
  if (!req.body.namaLengkap) return res.status(400).json({ message: 'Nama wajib' })
  const { data, error } = await supabase.from('siswas').insert({ nama_lengkap: req.body.namaLengkap, nisn: req.body.nisn, tanggal_lahir: req.body.tanggalLahir, jenis_kelamin: req.body.jenisKelamin, alamat: req.body.alamat, telepon: req.body.telepon, nama_orang_tua: req.body.namaOrangTua, tahun_masuk: req.body.tahunMasuk, kelas_id: req.body.kelasId }).select().single()
  if (error) throw error; res.status(201).json({ message: 'Siswa ditambahkan', data })
})

app.put('/api/admin/siswa/:id', auth, async (req, res) => {
  const { data: ex } = await supabase.from('siswas').select('id').eq('id', req.params.id).single()
  if (!ex) return res.status(404).json({ message: 'Tidak ditemukan' })
  const { data, error } = await supabase.from('siswas').update(req.body).eq('id', req.params.id).select().single()
  if (error) throw error; res.json({ message: 'Siswa diupdate', data })
})

app.delete('/api/admin/siswa/:id', auth, async (req, res) => {
  const { data: ex } = await supabase.from('siswas').select('id').eq('id', req.params.id).single()
  if (!ex) return res.status(404).json({ message: 'Tidak ditemukan' })
  await supabase.from('siswas').delete().eq('id', req.params.id); res.json({ message: 'Siswa dihapus' })
})

// Admin Kelas
app.get('/api/admin/kelas', auth, async (_, res) => {
  const { data } = await supabase.from('kelas').select('*, gurus(nama)').order('nama')
  res.json({ data })
})

app.get('/api/admin/kelas/:id', auth, async (req, res) => {
  const { data } = await supabase.from('kelas').select('*, gurus(nama), siswas(id,nama_lengkap,nisn)').eq('id', req.params.id).single()
  data ? res.json({ data }) : res.status(404).json({ message: 'Tidak ditemukan' })
})

app.post('/api/admin/kelas', auth, async (req, res) => {
  const { nama, tingkat } = req.body
  if (!nama || !tingkat) return res.status(400).json({ message: 'Nama & tingkat wajib' })
  const { data, error } = await supabase.from('kelas').insert({ nama, tingkat, wali_kelas_id: req.body.waliKelasId, kapasitas: req.body.kapasitas }).select().single()
  if (error) throw error; res.status(201).json({ message: 'Kelas dibuat', data })
})

app.put('/api/admin/kelas/:id', auth, async (req, res) => {
  const { data: ex } = await supabase.from('kelas').select('id').eq('id', req.params.id).single()
  if (!ex) return res.status(404).json({ message: 'Tidak ditemukan' })
  const { data, error } = await supabase.from('kelas').update(req.body).eq('id', req.params.id).select().single()
  if (error) throw error; res.json({ message: 'Kelas diupdate', data })
})

app.delete('/api/admin/kelas/:id', auth, async (req, res) => {
  const { data: ex } = await supabase.from('kelas').select('id').eq('id', req.params.id).single()
  if (!ex) return res.status(404).json({ message: 'Tidak ditemukan' })
  await supabase.from('kelas').delete().eq('id', req.params.id); res.json({ message: 'Kelas dihapus' })
})

// Admin Jadwal
app.get('/api/admin/jadwal', auth, async (_, res) => {
  const { data } = await supabase.from('jadwals').select('*, gurus(id,nama), kelas(nama)').order('hari').order('jam_mulai')
  res.json({ data })
})

app.post('/api/admin/jadwal', auth, async (req, res) => {
  const { hari, jamMulai, jamSelesai, mataPelajaran, kelasId } = req.body
  if (!hari || !jamMulai || !jamSelesai || !mataPelajaran || !kelasId) return res.status(400).json({ message: 'Data wajib tidak lengkap' })
  const { data, error } = await supabase.from('jadwals').insert({ hari, jam_mulai: jamMulai, jam_selesai: jamSelesai, mata_pelajaran: mataPelajaran, guru_id: req.body.guruId, kelas_id: kelasId, ruangan: req.body.ruangan }).select().single()
  if (error) throw error; res.status(201).json({ message: 'Jadwal dibuat', data })
})

app.put('/api/admin/jadwal/:id', auth, async (req, res) => {
  const { data: ex } = await supabase.from('jadwals').select('id').eq('id', req.params.id).single()
  if (!ex) return res.status(404).json({ message: 'Tidak ditemukan' })
  const { data, error } = await supabase.from('jadwals').update(req.body).eq('id', req.params.id).select().single()
  if (error) throw error; res.json({ message: 'Jadwal diupdate', data })
})

app.delete('/api/admin/jadwal/:id', auth, async (req, res) => {
  const { data: ex } = await supabase.from('jadwals').select('id').eq('id', req.params.id).single()
  if (!ex) return res.status(404).json({ message: 'Tidak ditemukan' })
  await supabase.from('jadwals').delete().eq('id', req.params.id); res.json({ message: 'Jadwal dihapus' })
})

// Admin Pengumuman
app.get('/api/admin/pengumuman', auth, async (req, res) => {
  const { p, l, from, to } = pag(req)
  const { data, error, count } = await supabase.from('pengumumans').select('*, admins(username)', { count: 'exact' }).order('created_at', { ascending: false }).range(from, to)
  if (error) return res.status(500).json({ message: error.message })
  res.json({ data, pagination: { total: count, page: p, limit: l, totalPages: Math.ceil(count / l) } })
})

app.post('/api/admin/pengumuman', auth, async (req, res) => {
  const { judul, isi, tanggal } = req.body
  if (!judul || !isi || !tanggal) return res.status(400).json({ message: 'Judul, isi & tanggal wajib' })
  const { data, error } = await supabase.from('pengumumans').insert({ judul, isi, tanggal, prioritas: req.body.prioritas || 'sedang', status: req.body.status || 'draft', admin_id: req.admin.id }).select().single()
  if (error) throw error; res.status(201).json({ message: 'Pengumuman dibuat', data })
})

app.put('/api/admin/pengumuman/:id', auth, async (req, res) => {
  const { data: ex } = await supabase.from('pengumumans').select('id').eq('id', req.params.id).single()
  if (!ex) return res.status(404).json({ message: 'Tidak ditemukan' })
  const { data, error } = await supabase.from('pengumumans').update(req.body).eq('id', req.params.id).select().single()
  if (error) throw error; res.json({ message: 'Pengumuman diupdate', data })
})

app.delete('/api/admin/pengumuman/:id', auth, async (req, res) => {
  const { data: ex } = await supabase.from('pengumumans').select('id').eq('id', req.params.id).single()
  if (!ex) return res.status(404).json({ message: 'Tidak ditemukan' })
  await supabase.from('pengumumans').delete().eq('id', req.params.id); res.json({ message: 'Pengumuman dihapus' })
})

// Admin Galeri
app.get('/api/admin/galeri', auth, async (req, res) => {
  const { p, l, from, to } = pag(req)
  const { data, error, count } = await supabase.from('galeris').select('*, admins(username)', { count: 'exact' }).order('created_at', { ascending: false }).range(from, to)
  if (error) return res.status(500).json({ message: error.message })
  res.json({ data, pagination: { total: count, page: p, limit: l, totalPages: Math.ceil(count / l) } })
})

app.post('/api/admin/galeri', auth, upload('galeri', 'image'), async (req, res) => {
  if (!req.body.judul) return res.status(400).json({ message: 'Judul wajib' })
  if (!req.file) return res.status(400).json({ message: 'Gambar wajib' })
  const { data, error } = await supabase.from('galeris').insert({ judul: req.body.judul, deskripsi: req.body.deskripsi, image: req.file.filename, kategori: req.body.kategori || 'umum', admin_id: req.admin.id }).select().single()
  if (error) throw error; res.status(201).json({ message: 'Galeri ditambahkan', data })
})

app.put('/api/admin/galeri/:id', auth, upload('galeri', 'image'), async (req, res) => {
  const { data: ex } = await supabase.from('galeris').select('id').eq('id', req.params.id).single()
  if (!ex) return res.status(404).json({ message: 'Tidak ditemukan' })
  const u = { ...req.body }; if (req.file) u.image = req.file.filename
  const { data, error } = await supabase.from('galeris').update(u).eq('id', req.params.id).select().single()
  if (error) throw error; res.json({ message: 'Galeri diupdate', data })
})

app.delete('/api/admin/galeri/:id', auth, async (req, res) => {
  const { data: ex } = await supabase.from('galeris').select('id').eq('id', req.params.id).single()
  if (!ex) return res.status(404).json({ message: 'Tidak ditemukan' })
  await supabase.from('galeris').delete().eq('id', req.params.id); res.json({ message: 'Galeri dihapus' })
})

// Admin Profil
app.put('/api/admin/profil', auth, upload('profil', 'logo'), async (req, res) => {
  const { data: ex } = await supabase.from('profil_sekolahs').select('id').limit(1).single()
  const u = { ...req.body }; if (req.file) u.logo = req.file.filename
  if (!ex) { const { data, error } = await supabase.from('profil_sekolahs').insert(u).select().single(); return res.status(201).json({ message: 'Profil dibuat', data }) }
  const { data, error } = await supabase.from('profil_sekolahs').update(u).eq('id', ex.id).select().single()
  if (error) throw error; res.json({ message: 'Profil diupdate', data })
})

// Admin PPDB
app.get('/api/admin/ppdb', auth, async (req, res) => {
  const { p, l, from, to } = pag(req)
  let q = supabase.from('ppdbs').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(from, to)
  if (req.query.status) q = q.eq('status', req.query.status)
  const { data, error, count } = await q
  if (error) return res.status(500).json({ message: error.message })
  res.json({ data, pagination: { total: count, page: p, limit: l, totalPages: Math.ceil(count / l) } })
})

app.put('/api/admin/ppdb/:id', auth, async (req, res) => {
  const { data: ex } = await supabase.from('ppdbs').select('id').eq('id', req.params.id).single()
  if (!ex) return res.status(404).json({ message: 'Tidak ditemukan' })
  if (!req.body.status) return res.status(400).json({ message: 'Status wajib' })
  const { data, error } = await supabase.from('ppdbs').update({ status: req.body.status, catatan: req.body.catatan }).eq('id', req.params.id).select().single()
  if (error) throw error; res.json({ message: `PPDB ${req.body.status}`, data })
})

app.delete('/api/admin/ppdb/:id', auth, async (req, res) => {
  const { data: ex } = await supabase.from('ppdbs').select('id').eq('id', req.params.id).single()
  if (!ex) return res.status(404).json({ message: 'Tidak ditemukan' })
  await supabase.from('ppdbs').delete().eq('id', req.params.id); res.json({ message: 'PPDB dihapus' })
})

app.use(errH)

export default function handler(req, res) {
  return app(req, res)
}
