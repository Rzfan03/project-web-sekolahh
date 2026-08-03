import { createClient } from '@supabase/supabase-js'
import Swal from 'sweetalert2'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY

const client = createClient(SUPABASE_URL, SUPABASE_KEY)

export const supabase = client

const showSwal = (icon: 'success' | 'error', title: string, text?: string) => {
  return Swal.fire({ icon, title, text, timer: 1500, showConfirmButton: false })
}

const confirmDelete = async (title: string) => {
  const result = await Swal.fire({
    title,
    text: 'Data yang dihapus tidak dapat dikembalikan!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal',
  })
  return result.isConfirmed
}

// ==================== ARTICLES ====================
export const getArticle = async () => {
  const { data, error } = await client.from('articles').select('*')
  if (error) { showSwal('error', 'Gagal mengambil data artikel!'); return [] }
  return data
}

export const createArticle = async (payload: { judul: string; slug: string; kategori: string; ringkasan: string; deskripsi: string; image: string; status: string }) => {
  const { data, error } = await client.from('articles').insert(payload).select().single()
  if (error) { showSwal('error', 'Gagal menambah artikel!'); return null }
  showSwal('success', 'Artikel berhasil ditambahkan!')
  return data
}

export const updateArticle = async (id: number, payload: { judul: string; slug: string; kategori: string; ringkasan: string; deskripsi: string; image: string; status: string }) => {
  const { data, error } = await client.from('articles').update(payload).eq('id', id).select().single()
  if (error) { showSwal('error', 'Gagal mengupdate artikel!'); return null }
  showSwal('success', 'Artikel berhasil diupdate!')
  return data
}

export const deleteArticle = async (id: number) => {
  const ok = await confirmDelete('Hapus artikel ini?')
  if (!ok) return false
  const { error } = await client.from('articles').delete().eq('id', id)
  if (error) { showSwal('error', 'Gagal menghapus artikel!'); return false }
  showSwal('success', 'Artikel berhasil dihapus!')
  return true
}

// ==================== GALERIS ====================
export const getGaleri = async () => {
  const { data, error } = await client.from('galeris').select('*')
  if (error) { showSwal('error', 'Gagal mengambil data galeri!'); return [] }
  return data
}

export const createGaleri = async (payload: { judul: string; deskripsi: string; image: string; kategori: string }) => {
  const { data, error } = await client.from('galeris').insert(payload).select().single()
  if (error) { showSwal('error', 'Gagal menambah galeri!'); return null }
  showSwal('success', 'Galeri berhasil ditambahkan!')
  return data
}

export const updateGaleri = async (id: number, payload: { judul: string; deskripsi: string; image: string; kategori: string }) => {
  const { data, error } = await client.from('galeris').update(payload).eq('id', id).select().single()
  if (error) { showSwal('error', 'Gagal mengupdate galeri!'); return null }
  showSwal('success', 'Galeri berhasil diupdate!')
  return data
}

export const deleteGaleri = async (id: number) => {
  const ok = await confirmDelete('Hapus galeri ini?')
  if (!ok) return false
  const { error } = await client.from('galeris').delete().eq('id', id)
  if (error) { showSwal('error', 'Gagal menghapus galeri!'); return false }
  showSwal('success', 'Galeri berhasil dihapus!')
  return true
}

// ==================== GURUS ====================
export const getGuru = async () => {
  const { data, error } = await client.from('gurus').select('*')
  if (error) { showSwal('error', 'Gagal mengambil data guru!'); return [] }
  return data
}

export const createGuru = async (payload: { nama: string; nip: string; mata_pelajaran: string; foto: string; email: string; telepon: string; alamat: string; status: string }) => {
  const { data, error } = await client.from('gurus').insert(payload).select().single()
  if (error) { showSwal('error', 'Gagal menambah guru!'); return null }
  showSwal('success', 'Guru berhasil ditambahkan!')
  return data
}

export const updateGuru = async (id: number, payload: { nama: string; nip: string; mata_pelajaran: string; foto: string; email: string; telepon: string; alamat: string; status: string }) => {
  const { data, error } = await client.from('gurus').update(payload).eq('id', id).select().single()
  if (error) { showSwal('error', 'Gagal mengupdate guru!'); return null }
  showSwal('success', 'Guru berhasil diupdate!')
  return data
}

export const deleteGuru = async (id: number) => {
  const ok = await confirmDelete('Hapus data guru ini?')
  if (!ok) return false
  const { error } = await client.from('gurus').delete().eq('id', id)
  if (error) { showSwal('error', 'Gagal menghapus guru!'); return false }
  showSwal('success', 'Guru berhasil dihapus!')
  return true
}

// ==================== JADWALS ====================
export const getJadwal = async () => {
  const { data, error } = await client.from('jadwals').select('*')
  if (error) { showSwal('error', 'Gagal mengambil data jadwal!'); return [] }
  return data
}

export const createJadwal = async (payload: { hari: string; jam_mulai: string; jam_selesai: string; mata_pelajaran: string; guru_id: number | null; kelas_id: number | null; ruangan: string }) => {
  const { data, error } = await client.from('jadwals').insert(payload).select().single()
  if (error) { showSwal('error', 'Gagal menambah jadwal!'); return null }
  showSwal('success', 'Jadwal berhasil ditambahkan!')
  return data
}

export const updateJadwal = async (id: number, payload: { hari: string; jam_mulai: string; jam_selesai: string; mata_pelajaran: string; guru_id: number | null; kelas_id: number | null; ruangan: string }) => {
  const { data, error } = await client.from('jadwals').update(payload).eq('id', id).select().single()
  if (error) { showSwal('error', 'Gagal mengupdate jadwal!'); return null }
  showSwal('success', 'Jadwal berhasil diupdate!')
  return data
}

export const deleteJadwal = async (id: number) => {
  const ok = await confirmDelete('Hapus jadwal ini?')
  if (!ok) return false
  const { error } = await client.from('jadwals').delete().eq('id', id)
  if (error) { showSwal('error', 'Gagal menghapus jadwal!'); return false }
  showSwal('success', 'Jadwal berhasil dihapus!')
  return true
}

// ==================== KELAS ====================
export const getKelas = async () => {
  const { data, error } = await client.from('kelas').select('*')
  if (error) { showSwal('error', 'Gagal mengambil data kelas!'); return [] }
  return data
}

export const createKelas = async (payload: { nama: string; tingkat: string; kapasitas: number }) => {
  const { data, error } = await client.from('kelas').insert(payload).select().single()
  if (error) { showSwal('error', 'Gagal menambah kelas!'); return null }
  showSwal('success', 'Kelas berhasil ditambahkan!')
  return data
}

export const updateKelas = async (id: number, payload: { nama: string; tingkat: string; kapasitas: number }) => {
  const { data, error } = await client.from('kelas').update(payload).eq('id', id).select().single()
  if (error) { showSwal('error', 'Gagal mengupdate kelas!'); return null }
  showSwal('success', 'Kelas berhasil diupdate!')
  return data
}

export const deleteKelas = async (id: number) => {
  const ok = await confirmDelete('Hapus kelas ini?')
  if (!ok) return false
  const { error } = await client.from('kelas').delete().eq('id', id)
  if (error) { showSwal('error', 'Gagal menghapus kelas!'); return false }
  showSwal('success', 'Kelas berhasil dihapus!')
  return true
}

// ==================== PENGUMUMANS ====================
export const getPengumuman = async () => {
  const { data, error } = await client.from('pengumumans').select('*')
  if (error) { showSwal('error', 'Gagal mengambil data pengumuman!'); return [] }
  return data
}

export const createPengumuman = async (payload: { judul: string; isi: string; tanggal: string; prioritas: string; status: string }) => {
  const { data, error } = await client.from('pengumumans').insert(payload).select().single()
  if (error) { showSwal('error', 'Gagal menambah pengumuman!'); return null }
  showSwal('success', 'Pengumuman berhasil ditambahkan!')
  return data
}

export const updatePengumuman = async (id: number, payload: { judul: string; isi: string; tanggal: string; prioritas: string; status: string }) => {
  const { data, error } = await client.from('pengumumans').update(payload).eq('id', id).select().single()
  if (error) { showSwal('error', 'Gagal mengupdate pengumuman!'); return null }
  showSwal('success', 'Pengumuman berhasil diupdate!')
  return data
}

export const deletePengumuman = async (id: number) => {
  const ok = await confirmDelete('Hapus pengumuman ini?')
  if (!ok) return false
  const { error } = await client.from('pengumumans').delete().eq('id', id)
  if (error) { showSwal('error', 'Gagal menghapus pengumuman!'); return false }
  showSwal('success', 'Pengumuman berhasil dihapus!')
  return true
}

// ==================== AGENDAS ====================
export const getAgenda = async () => {
  const { data, error } = await client.from('agendas').select('*')
  if (error) { showSwal('error', 'Gagal mengambil data agenda!'); return [] }
  return data
}

export const createAgenda = async (payload: { judul: string; tanggal: string; jam: string; lokasi: string; keterangan: string; status: string }) => {
  const { data, error } = await client.from('agendas').insert(payload).select().single()
  if (error) { showSwal('error', 'Gagal menambah agenda!'); return null }
  showSwal('success', 'Agenda berhasil ditambahkan!')
  return data
}

export const updateAgenda = async (id: number, payload: { judul: string; tanggal: string; jam: string; lokasi: string; keterangan: string; status: string }) => {
  const { data, error } = await client.from('agendas').update(payload).eq('id', id).select().single()
  if (error) { showSwal('error', 'Gagal mengupdate agenda!'); return null }
  showSwal('success', 'Agenda berhasil diupdate!')
  return data
}

export const deleteAgenda = async (id: number) => {
  const ok = await confirmDelete('Hapus agenda ini?')
  if (!ok) return false
  const { error } = await client.from('agendas').delete().eq('id', id)
  if (error) { showSwal('error', 'Gagal menghapus agenda!'); return false }
  showSwal('success', 'Agenda berhasil dihapus!')
  return true
}

// ==================== PPDBS ====================
export const getPpdb = async () => {
  const { data, error } = await client.from('ppdbs').select('*')
  if (error) { showSwal('error', 'Gagal mengambil data PPDB!'); return [] }
  return data
}

export const updatePpdb = async (id: number, payload: { status: string }) => {
  const { data, error } = await client.from('ppdbs').update(payload).eq('id', id).select().single()
  if (error) { showSwal('error', 'Gagal mengupdate status PPDB!'); return null }
  showSwal('success', 'Status PPDB berhasil diupdate!')
  return data
}

export const deletePpdb = async (id: number) => {
  const ok = await confirmDelete('Hapus data PPDB ini?')
  if (!ok) return false
  const { error } = await client.from('ppdbs').delete().eq('id', id)
  if (error) { showSwal('error', 'Gagal menghapus data PPDB!'); return false }
  showSwal('success', 'Data PPDB berhasil dihapus!')
  return true
}

// ==================== PROFIL SEKOLAH ====================
export const getProfil = async () => {
  const { data, error } = await client.from('profil_sekolah').select('*')
  if (error) { showSwal('error', 'Gagal mengambil data profil!'); return [] }
  return data
}

export const updateProfil = async (id: number, payload: { nama_sekolah: string; alamat: string; telepon: string; email: string; website: string; logo: string; visi: string; misi: string }) => {
  const { data, error } = await client.from('profil_sekolah').update(payload).eq('id', id).select().single()
  if (error) { showSwal('error', 'Gagal mengupdate profil!'); return null }
  showSwal('success', 'Profil berhasil diupdate!')
  return data
}

// ==================== SISWAS ====================
export const getSiswa = async () => {
  const { data, error } = await client.from('siswas').select('*')
  if (error) { showSwal('error', 'Gagal mengambil data siswa!'); return [] }
  return data
}

export const createSiswa = async (payload: { nama_lengkap: string; nisn: string; tanggal_lahir: string; jenis_kelamin: string; alamat: string; telepon: string; nama_orang_tua: string; tahun_masuk: number; kelas_id: number | null; status: string }) => {
  const { data, error } = await client.from('siswas').insert(payload).select().single()
  if (error) { showSwal('error', 'Gagal menambah siswa!'); return null }
  showSwal('success', 'Siswa berhasil ditambahkan!')
  return data
}

export const updateSiswa = async (id: number, payload: { nama_lengkap: string; nisn: string; tanggal_lahir: string; jenis_kelamin: string; alamat: string; telepon: string; nama_orang_tua: string; tahun_masuk: number; kelas_id: number | null; status: string }) => {
  const { data, error } = await client.from('siswas').update(payload).eq('id', id).select().single()
  if (error) { showSwal('error', 'Gagal mengupdate siswa!'); return null }
  showSwal('success', 'Siswa berhasil diupdate!')
  return data
}

export const deleteSiswa = async (id: number) => {
  const ok = await confirmDelete('Hapus data siswa ini?')
  if (!ok) return false
  const { error } = await client.from('siswas').delete().eq('id', id)
  if (error) { showSwal('error', 'Gagal menghapus siswa!'); return false }
  showSwal('success', 'Siswa berhasil dihapus!')
  return true
}

// ==================== ADMINS (AKUN) ====================
export const getAdmins = async () => {
  const { data, error } = await client.from('admins').select('*').order('id', { ascending: true })
  if (error) { showSwal('error', 'Gagal mengambil data akun!'); return [] }
  return data
}

export const createAdminAccount = async (payload: { email: string; password: string; role: string }) => {
  const { data: signUpData, error: signUpError } = await client.auth.signUp({ email: payload.email, password: payload.password })

  if (signUpError) {
    const msg = signUpError.message.toLowerCase()
    if (msg.includes('rate limit') || signUpError.status === 429) {
      showSwal('error', 'Terlalu banyak percobaan', 'Supabase membatasi pengiriman email konfirmasi. Tunggu beberapa saat, atau matikan "Confirm email" di Supabase Dashboard > Authentication > Providers agar akun langsung aktif tanpa email konfirmasi.')
    } else if (msg.includes('already registered') || msg.includes('already exists')) {
      showSwal('error', 'Email sudah terdaftar', 'Akun dengan email tersebut sudah ada. Gunakan email lain.')
    } else {
      showSwal('error', 'Gagal membuat akun login!', signUpError.message)
    }
    return null
  }

  const { data, error } = await client.from('admins').insert({ username: payload.email, password: 'managed-by-supabase-auth', role: payload.role }).select().single()
  if (error) { showSwal('error', 'Gagal menambah akun!', error.message); return null }

  if (!signUpData.session) {
    showSwal('success', 'Akun berhasil ditambahkan', 'Cek email untuk konfirmasi sebelum login.')
  } else {
    showSwal('success', 'Akun berhasil ditambahkan!')
  }
  return data
}

export const updateAdmin = async (id: number, payload: { role: string }) => {
  const { data, error } = await client.from('admins').update(payload).eq('id', id).select().single()
  if (error) { showSwal('error', 'Gagal mengupdate akun!'); return null }
  showSwal('success', 'Akun berhasil diupdate!')
  return data
}

export const deleteAdmin = async (id: number) => {
  const ok = await confirmDelete('Hapus akun ini?')
  if (!ok) return false
  const { error } = await client.from('admins').delete().eq('id', id)
  if (error) { showSwal('error', 'Gagal menghapus akun!'); return false }
  showSwal('success', 'Akun berhasil dihapus!')
  return true
}
