import slugify from 'slugify'
import supabase from '../config/supabase.js'

const paginate = (req) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  return { page, limit, from: (page - 1) * limit, to: (page - 1) * limit + limit - 1 }
}

export const getPublishedArticles = async (req, res, next) => {
  try {
    const p = paginate(req)
    const { data, error, count } = await supabase.from('articles').select('*, admins(username)', { count: 'exact' }).eq('status', 'published').order('created_at', { ascending: false }).range(p.from, p.to)
    if (error) throw error
    res.json({ data, pagination: { total: count, page: p.page, limit: p.limit, totalPages: Math.ceil(count / p.limit) } })
  } catch (e) { next(e) }
}

export const getPublishedArticleBySlug = async (req, res, next) => {
  try {
    const { data } = await supabase.from('articles').select('*, admins(username)').eq('slug', req.params.slug).eq('status', 'published').single()
    data ? res.json({ data }) : res.status(404).json({ message: 'Artikel tidak ditemukan' })
  } catch (e) { next(e) }
}

export const getAllArticles = async (req, res, next) => {
  try {
    const p = paginate(req)
    let q = supabase.from('articles').select('*, admins(username)', { count: 'exact' }).order('created_at', { ascending: false }).range(p.from, p.to)
    if (req.query.status) q = q.eq('status', req.query.status)
    const { data, error, count } = await q
    if (error) throw error
    res.json({ data, pagination: { total: count, page: p.page, limit: p.limit, totalPages: Math.ceil(count / p.limit) } })
  } catch (e) { next(e) }
}

export const getArticleById = async (req, res, next) => {
  try {
    const { data } = await supabase.from('articles').select('*').eq('id', req.params.id).single()
    data ? res.json({ data }) : res.status(404).json({ message: 'Artikel tidak ditemukan' })
  } catch (e) { next(e) }
}

export const createArticle = async (req, res, next) => {
  try {
    const { judul, ringkasan, deskripsi, status } = req.body
    if (!judul || !deskripsi) return res.status(400).json({ message: 'Judul & deskripsi wajib' })
    let slug = slugify(judul, { lower: true, strict: true })
    const { data: ex } = await supabase.from('articles').select('id').eq('slug', slug).single()
    if (ex) slug += '-' + Date.now()
    const { data, error } = await supabase.from('articles').insert({ judul, slug, ringkasan, deskripsi, image: req.file?.filename, status: status || 'draft', admin_id: req.admin.id }).select().single()
    if (error) throw error
    res.status(201).json({ message: 'Artikel dibuat', data })
  } catch (e) { next(e) }
}

export const updateArticle = async (req, res, next) => {
  try {
    const { data: ex } = await supabase.from('articles').select('*').eq('id', req.params.id).single()
    if (!ex) return res.status(404).json({ message: 'Tidak ditemukan' })
    const u = {}
    if (req.body.judul) { u.judul = req.body.judul; let s = slugify(req.body.judul, { lower: true, strict: true }); const { data: d } = await supabase.from('articles').select('id').eq('slug', s).neq('id', ex.id).single(); if (d) s += '-' + Date.now(); u.slug = s }
    if (req.body.ringkasan !== undefined) u.ringkasan = req.body.ringkasan
    if (req.body.deskripsi) u.deskripsi = req.body.deskripsi
    if (req.body.status) u.status = req.body.status
    if (req.file) u.image = req.file.filename
    const { data, error } = await supabase.from('articles').update(u).eq('id', req.params.id).select().single()
    if (error) throw error
    res.json({ message: 'Artikel diupdate', data })
  } catch (e) { next(e) }
}

export const deleteArticle = async (req, res, next) => {
  try {
    const { data: ex } = await supabase.from('articles').select('id').eq('id', req.params.id).single()
    if (!ex) return res.status(404).json({ message: 'Tidak ditemukan' })
    await supabase.from('articles').delete().eq('id', req.params.id)
    res.json({ message: 'Artikel dihapus' })
  } catch (e) { next(e) }
}
