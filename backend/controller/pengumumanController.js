import supabase from '../config/supabase.js'

const paginate = (req) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  return { page, limit, from: (page - 1) * limit, to: (page - 1) * limit + limit - 1 }
}

export const getPublishedPengumuman = async (req, res, next) => {
  try {
    const p = paginate(req)
    const { data, error, count } = await supabase.from('pengumumans').select('*, admins(username)', { count: 'exact' }).eq('status', 'published').order('tanggal', { ascending: false }).range(p.from, p.to)
    if (error) throw error
    res.json({ data, pagination: { total: count, page: p.page, limit: p.limit, totalPages: Math.ceil(count / p.limit) } })
  } catch (e) { next(e) }
}

export const getAllPengumuman = async (req, res, next) => {
  try {
    const p = paginate(req)
    const { data, error, count } = await supabase.from('pengumumans').select('*, admins(username)', { count: 'exact' }).order('created_at', { ascending: false }).range(p.from, p.to)
    if (error) throw error
    res.json({ data, pagination: { total: count, page: p.page, limit: p.limit, totalPages: Math.ceil(count / p.limit) } })
  } catch (e) { next(e) }
}

export const createPengumuman = async (req, res, next) => {
  try {
    const { judul, isi, tanggal } = req.body
    if (!judul || !isi || !tanggal) return res.status(400).json({ message: 'Judul, isi & tanggal wajib' })
    const { data, error } = await supabase.from('pengumumans').insert({ judul, isi, tanggal, prioritas: req.body.prioritas || 'sedang', status: req.body.status || 'draft', admin_id: req.admin.id }).select().single()
    if (error) throw error
    res.status(201).json({ message: 'Pengumuman dibuat', data })
  } catch (e) { next(e) }
}

export const updatePengumuman = async (req, res, next) => {
  try {
    const { data: ex } = await supabase.from('pengumumans').select('id').eq('id', req.params.id).single()
    if (!ex) return res.status(404).json({ message: 'Tidak ditemukan' })
    const { data, error } = await supabase.from('pengumumans').update(req.body).eq('id', req.params.id).select().single()
    if (error) throw error
    res.json({ message: 'Pengumuman diupdate', data })
  } catch (e) { next(e) }
}

export const deletePengumuman = async (req, res, next) => {
  try {
    const { data: ex } = await supabase.from('pengumumans').select('id').eq('id', req.params.id).single()
    if (!ex) return res.status(404).json({ message: 'Tidak ditemukan' })
    await supabase.from('pengumumans').delete().eq('id', req.params.id)
    res.json({ message: 'Pengumuman dihapus' })
  } catch (e) { next(e) }
}
