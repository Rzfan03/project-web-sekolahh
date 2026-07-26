import supabase from '../config/supabase.js'

const paginate = (req) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 20
  return { page, limit, from: (page - 1) * limit, to: (page - 1) * limit + limit - 1 }
}

export const getAllSiswa = async (req, res, next) => {
  try {
    const p = paginate(req)
    let q = supabase.from('siswas').select('*, kelas(nama)', { count: 'exact' }).order('nama_lengkap').range(p.from, p.to)
    if (req.query.kelasId) q = q.eq('kelas_id', req.query.kelasId)
    const { data, error, count } = await q
    if (error) throw error
    res.json({ data, pagination: { total: count, page: p.page, limit: p.limit, totalPages: Math.ceil(count / p.limit) } })
  } catch (e) { next(e) }
}

export const getSiswaById = async (req, res, next) => {
  try {
    const { data } = await supabase.from('siswas').select('*, kelas(nama)').eq('id', req.params.id).single()
    data ? res.json({ data }) : res.status(404).json({ message: 'Tidak ditemukan' })
  } catch (e) { next(e) }
}

export const createSiswa = async (req, res, next) => {
  try {
    if (!req.body.namaLengkap) return res.status(400).json({ message: 'Nama wajib' })
    const { data, error } = await supabase.from('siswas').insert({ nama_lengkap: req.body.namaLengkap, nisn: req.body.nisn, tanggal_lahir: req.body.tanggalLahir, jenis_kelamin: req.body.jenisKelamin, alamat: req.body.alamat, telepon: req.body.telepon, nama_orang_tua: req.body.namaOrangTua, tahun_masuk: req.body.tahunMasuk, kelas_id: req.body.kelasId }).select().single()
    if (error) throw error
    res.status(201).json({ message: 'Siswa ditambahkan', data })
  } catch (e) { next(e) }
}

export const updateSiswa = async (req, res, next) => {
  try {
    const { data: ex } = await supabase.from('siswas').select('id').eq('id', req.params.id).single()
    if (!ex) return res.status(404).json({ message: 'Tidak ditemukan' })
    const { data, error } = await supabase.from('siswas').update(req.body).eq('id', req.params.id).select().single()
    if (error) throw error
    res.json({ message: 'Siswa diupdate', data })
  } catch (e) { next(e) }
}

export const deleteSiswa = async (req, res, next) => {
  try {
    const { data: ex } = await supabase.from('siswas').select('id').eq('id', req.params.id).single()
    if (!ex) return res.status(404).json({ message: 'Tidak ditemukan' })
    await supabase.from('siswas').delete().eq('id', req.params.id)
    res.json({ message: 'Siswa dihapus' })
  } catch (e) { next(e) }
}
