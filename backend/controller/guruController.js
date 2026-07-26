import supabase from '../config/supabase.js'

const paginate = (req) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 20
  return { page, limit, from: (page - 1) * limit, to: (page - 1) * limit + limit - 1 }
}

export const getAllGuruPublic = async (_, res, next) => {
  try {
    const { data } = await supabase.from('gurus').select('*').eq('status', 'aktif').order('nama')
    res.json({ data })
  } catch (e) { next(e) }
}

export const getGuruByIdPublic = async (req, res, next) => {
  try {
    const { data } = await supabase.from('gurus').select('*').eq('id', req.params.id).single()
    data ? res.json({ data }) : res.status(404).json({ message: 'Guru tidak ditemukan' })
  } catch (e) { next(e) }
}

export const getAllGuru = async (req, res, next) => {
  try {
    const p = paginate(req)
    const { data, error, count } = await supabase.from('gurus').select('*', { count: 'exact' }).order('nama').range(p.from, p.to)
    if (error) throw error
    res.json({ data, pagination: { total: count, page: p.page, limit: p.limit, totalPages: Math.ceil(count / p.limit) } })
  } catch (e) { next(e) }
}

export const createGuru = async (req, res, next) => {
  try {
    const { nama, mataPelajaran } = req.body
    if (!nama || !mataPelajaran) return res.status(400).json({ message: 'Nama & mata pelajaran wajib' })
    const { data, error } = await supabase.from('gurus').insert({ nama, nip: req.body.nip, mata_pelajaran: mataPelajaran, foto: req.file?.filename, email: req.body.email, telepon: req.body.telepon, alamat: req.body.alamat, status: req.body.status || 'aktif' }).select().single()
    if (error) throw error
    res.status(201).json({ message: 'Guru ditambahkan', data })
  } catch (e) { next(e) }
}

export const updateGuru = async (req, res, next) => {
  try {
    const { data: ex } = await supabase.from('gurus').select('id').eq('id', req.params.id).single()
    if (!ex) return res.status(404).json({ message: 'Tidak ditemukan' })
    const u = { ...req.body }
    if (req.file) u.foto = req.file.filename
    const { data, error } = await supabase.from('gurus').update(u).eq('id', req.params.id).select().single()
    if (error) throw error
    res.json({ message: 'Guru diupdate', data })
  } catch (e) { next(e) }
}

export const deleteGuru = async (req, res, next) => {
  try {
    const { data: ex } = await supabase.from('gurus').select('id').eq('id', req.params.id).single()
    if (!ex) return res.status(404).json({ message: 'Tidak ditemukan' })
    await supabase.from('gurus').delete().eq('id', req.params.id)
    res.json({ message: 'Guru dihapus' })
  } catch (e) { next(e) }
}
