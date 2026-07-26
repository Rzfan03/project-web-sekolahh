import supabase from '../config/supabase.js'

export const getGaleriPublic = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 12
    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase
      .from('galeris')
      .select('*, admins(username)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (req.query.kategori) {
      query = query.eq('kategori', req.query.kategori)
    }

    const { data, error, count } = await query
    if (error) throw error

    const { data: kategoriData } = await supabase
      .from('galeris')
      .select('kategori')

    const kategoriList = [...new Set(kategoriData?.map(k => k.kategori) || [])]

    return res.status(200).json({
      data,
      kategori: kategoriList,
      pagination: { total: count, page, limit, totalPages: Math.ceil(count / limit) }
    })
  } catch (err) {
    next(err)
  }
}

export const getAllGaleri = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 12
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await supabase
      .from('galeris')
      .select('*, admins(username)', { count: 'exact' })
      .order('created_at', { ascending: false })
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

export const createGaleri = async (req, res, next) => {
  try {
    const { judul, deskripsi, kategori } = req.body

    if (!judul) {
      return res.status(400).json({ message: 'Judul wajib diisi' })
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Gambar wajib diupload' })
    }

    const { data, error } = await supabase
      .from('galeris')
      .insert({
        judul, deskripsi,
        image: req.file.filename,
        kategori: kategori || 'umum',
        admin_id: req.admin.id
      })
      .select()
      .single()

    if (error) throw error
    return res.status(201).json({ message: 'Foto galeri berhasil ditambahkan', data })
  } catch (err) {
    next(err)
  }
}

export const updateGaleri = async (req, res, next) => {
  try {
    const { data: existing } = await supabase
      .from('galeris')
      .select('id')
      .eq('id', req.params.id)
      .single()

    if (!existing) {
      return res.status(404).json({ message: 'Foto galeri tidak ditemukan' })
    }

    const updateData = { ...req.body }
    if (req.file) updateData.image = req.file.filename

    const { data, error } = await supabase
      .from('galeris')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) throw error
    return res.status(200).json({ message: 'Foto galeri berhasil diupdate', data })
  } catch (err) {
    next(err)
  }
}

export const deleteGaleri = async (req, res, next) => {
  try {
    const { data: existing } = await supabase
      .from('galeris')
      .select('id')
      .eq('id', req.params.id)
      .single()

    if (!existing) {
      return res.status(404).json({ message: 'Foto galeri tidak ditemukan' })
    }

    const { error } = await supabase.from('galeris').delete().eq('id', req.params.id)
    if (error) throw error

    return res.status(200).json({ message: 'Foto galeri berhasil dihapus' })
  } catch (err) {
    next(err)
  }
}
