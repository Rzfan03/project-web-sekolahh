import supabase from '../config/supabase.js'

export const getPublishedPengumuman = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await supabase
      .from('pengumumans')
      .select('*, admins(username)', { count: 'exact' })
      .eq('status', 'published')
      .order('prioritas', { ascending: true })
      .order('tanggal', { ascending: false })
      .range(from, to)

    if (error) throw error

    return res.status(200).json({
      data,
      pagination: { total: count, page, limit, totalPages: Math.ceil(count / limit) }
    })
  } catch (err) {
    next(err)
  }
}

export const getAllPengumuman = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await supabase
      .from('pengumumans')
      .select('*, admins(username)', { count: 'exact' })
      .order('tanggal', { ascending: false })
      .range(from, to)

    if (error) throw error

    return res.status(200).json({
      data,
      pagination: { total: count, page, limit, totalPages: Math.ceil(count / limit) }
    })
  } catch (err) {
    next(err)
  }
}

export const createPengumuman = async (req, res, next) => {
  try {
    const { judul, isi, tanggal, prioritas, status } = req.body

    if (!judul || !isi || !tanggal) {
      return res.status(400).json({ message: 'Judul, isi, dan tanggal wajib diisi' })
    }

    const { data, error } = await supabase
      .from('pengumumans')
      .insert({
        judul, isi, tanggal,
        prioritas: prioritas || 'sedang',
        status: status || 'draft',
        admin_id: req.admin.id
      })
      .select()
      .single()

    if (error) throw error
    return res.status(201).json({ message: 'Pengumuman berhasil dibuat', data })
  } catch (err) {
    next(err)
  }
}

export const updatePengumuman = async (req, res, next) => {
  try {
    const { data: existing } = await supabase
      .from('pengumumans')
      .select('id')
      .eq('id', req.params.id)
      .single()

    if (!existing) {
      return res.status(404).json({ message: 'Pengumuman tidak ditemukan' })
    }

    const { data, error } = await supabase
      .from('pengumumans')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) throw error
    return res.status(200).json({ message: 'Pengumuman berhasil diupdate', data })
  } catch (err) {
    next(err)
  }
}

export const deletePengumuman = async (req, res, next) => {
  try {
    const { data: existing } = await supabase
      .from('pengumumans')
      .select('id')
      .eq('id', req.params.id)
      .single()

    if (!existing) {
      return res.status(404).json({ message: 'Pengumuman tidak ditemukan' })
    }

    const { error } = await supabase.from('pengumumans').delete().eq('id', req.params.id)
    if (error) throw error

    return res.status(200).json({ message: 'Pengumuman berhasil dihapus' })
  } catch (err) {
    next(err)
  }
}
