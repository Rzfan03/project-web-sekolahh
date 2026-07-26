import slugify from 'slugify'
import supabase from '../config/supabase.js'

export const getPublishedArticles = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const from = (page - 1) * limit
    const to = from + limit - 1

    const query = supabase
      .from('articles')
      .select('*, admins(username)', { count: 'exact' })
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .range(from, to)

    const { data, error, count } = await query
    if (error) throw error

    return res.status(200).json({
      data,
      pagination: { total: count, page, limit, totalPages: Math.ceil(count / limit) }
    })
  } catch (err) {
    next(err)
  }
}

export const getPublishedArticleBySlug = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*, admins(username)')
      .eq('slug', req.params.slug)
      .eq('status', 'published')
      .single()

    if (error || !data) {
      return res.status(404).json({ message: 'Artikel tidak ditemukan' })
    }

    return res.status(200).json({ data })
  } catch (err) {
    next(err)
  }
}

export const getAllArticles = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase
      .from('articles')
      .select('*, admins(username)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (req.query.status) {
      query = query.eq('status', req.query.status)
    }

    const { data, error, count } = await query
    if (error) throw error

    return res.status(200).json({
      data,
      pagination: { total: count, page, limit, totalPages: Math.ceil(count / limit) }
    })
  } catch (err) {
    next(err)
  }
}

export const getArticleById = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*, admins(username)')
      .eq('id', req.params.id)
      .single()

    if (error || !data) {
      return res.status(404).json({ message: 'Artikel tidak ditemukan' })
    }

    return res.status(200).json({ data })
  } catch (err) {
    next(err)
  }
}

export const createArticle = async (req, res, next) => {
  try {
    const { judul, ringkasan, deskripsi, status } = req.body

    if (!judul || !deskripsi) {
      return res.status(400).json({ message: 'Judul dan deskripsi wajib diisi' })
    }

    let slug = slugify(judul, { lower: true, strict: true })
    const { data: existingSlug } = await supabase
      .from('articles')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existingSlug) slug = slug + '-' + Date.now()

    const { data, error } = await supabase
      .from('articles')
      .insert({
        judul, slug, ringkasan, deskripsi,
        image: req.file ? req.file.filename : null,
        status: status || 'draft',
        admin_id: req.admin.id
      })
      .select()
      .single()

    if (error) throw error

    return res.status(201).json({ message: 'Artikel berhasil dibuat', data })
  } catch (err) {
    next(err)
  }
}

export const updateArticle = async (req, res, next) => {
  try {
    const { data: existing } = await supabase
      .from('articles')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (!existing) {
      return res.status(404).json({ message: 'Artikel tidak ditemukan' })
    }

    const { judul, ringkasan, deskripsi, status } = req.body
    const updateData = {}

    if (judul) {
      updateData.judul = judul
      let slug = slugify(judul, { lower: true, strict: true })
      const { data: dup } = await supabase
        .from('articles')
        .select('id')
        .eq('slug', slug)
        .neq('id', existing.id)
        .single()
      if (dup) slug = slug + '-' + Date.now()
      updateData.slug = slug
    }
    if (ringkasan !== undefined) updateData.ringkasan = ringkasan
    if (deskripsi) updateData.deskripsi = deskripsi
    if (status) updateData.status = status
    if (req.file) updateData.image = req.file.filename

    const { data, error } = await supabase
      .from('articles')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) throw error

    return res.status(200).json({ message: 'Artikel berhasil diupdate', data })
  } catch (err) {
    next(err)
  }
}

export const deleteArticle = async (req, res, next) => {
  try {
    const { data: existing } = await supabase
      .from('articles')
      .select('id')
      .eq('id', req.params.id)
      .single()

    if (!existing) {
      return res.status(404).json({ message: 'Artikel tidak ditemukan' })
    }

    const { error } = await supabase.from('articles').delete().eq('id', req.params.id)
    if (error) throw error

    return res.status(200).json({ message: 'Artikel berhasil dihapus' })
  } catch (err) {
    next(err)
  }
}
