import supabase from '../config/supabase.js'

const paginate = (req) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 12
  return { page, limit, from: (page - 1) * limit, to: (page - 1) * limit + limit - 1 }
}

export const getGaleriPublic = async (req, res, next) => {
  try {
    const p = paginate(req)
    let q = supabase.from('galeris').select('*, admins(username)', { count: 'exact' }).order('created_at', { ascending: false }).range(p.from, p.to)
    if (req.query.kategori) q = q.eq('kategori', req.query.kategori)
    const { data, error, count } = await q
    if (error) throw error
    res.json({ data, pagination: { total: count, page: p.page, limit: p.limit, totalPages: Math.ceil(count / p.limit) } })
  } catch (e) { next(e) }
}

export const getAllGaleri = async (req, res, next) => {
  try {
    const p = paginate(req)
    const { data, error, count } = await supabase.from('galeris').select('*, admins(username)', { count: 'exact' }).order('created_at', { ascending: false }).range(p.from, p.to)
    if (error) throw error
    res.json({ data, pagination: { total: count, page: p.page, limit: p.limit, totalPages: Math.ceil(count / p.limit) } })
  } catch (e) { next(e) }
}

export const createGaleri = async (req, res, next) => {
  try {
    if (!req.body.judul) return res.status(400).json({ message: 'Judul wajib' })
    if (!req.file) return res.status(400).json({ message: 'Gambar wajib' })
    const { data, error } = await supabase.from('galeris').insert({ judul: req.body.judul, deskripsi: req.body.deskripsi, image: req.file.filename, kategori: req.body.kategori || 'umum', admin_id: req.admin.id }).select().single()
    if (error) throw error
    res.status(201).json({ message: 'Galeri ditambahkan', data })
  } catch (e) { next(e) }
}

export const updateGaleri = async (req, res, next) => {
  try {
    const { data: ex } = await supabase.from('galeris').select('id').eq('id', req.params.id).single()
    if (!ex) return res.status(404).json({ message: 'Tidak ditemukan' })
    const u = { ...req.body }
    if (req.file) u.image = req.file.filename
    const { data, error } = await supabase.from('galeris').update(u).eq('id', req.params.id).select().single()
    if (error) throw error
    res.json({ message: 'Galeri diupdate', data })
  } catch (e) { next(e) }
}

export const deleteGaleri = async (req, res, next) => {
  try {
    const { data: ex } = await supabase.from('galeris').select('id').eq('id', req.params.id).single()
    if (!ex) return res.status(404).json({ message: 'Tidak ditemukan' })
    await supabase.from('galeris').delete().eq('id', req.params.id)
    res.json({ message: 'Galeri dihapus' })
  } catch (e) { next(e) }
}
