import supabase from '../config/supabase.js'

export const getAllGuruPublic = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('gurus')
      .select('*')
      .eq('status', 'aktif')
      .order('nama', { ascending: true })

    if (error) throw error
    return res.status(200).json({ data })
  } catch (err) {
    next(err)
  }
}

export const getGuruByIdPublic = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('gurus')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (error || !data) {
      return res.status(404).json({ message: 'Guru tidak ditemukan' })
    }

    return res.status(200).json({ data })
  } catch (err) {
    next(err)
  }
}

export const getAllGuru = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await supabase
      .from('gurus')
      .select('*', { count: 'exact' })
      .order('nama', { ascending: true })
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

export const createGuru = async (req, res, next) => {
  try {
    const { nama, nip, mataPelajaran, email, telepon, alamat, status } = req.body

    if (!nama || !mataPelajaran) {
      return res.status(400).json({ message: 'Nama dan mata pelajaran wajib diisi' })
    }

    const { data, error } = await supabase
      .from('gurus')
      .insert({
        nama, nip, mata_pelajaran: mataPelajaran,
        foto: req.file ? req.file.filename : null,
        email, telepon, alamat,
        status: status || 'aktif'
      })
      .select()
      .single()

    if (error) throw error
    return res.status(201).json({ message: 'Guru berhasil ditambahkan', data })
  } catch (err) {
    next(err)
  }
}

export const updateGuru = async (req, res, next) => {
  try {
    const { data: existing } = await supabase
      .from('gurus')
      .select('id')
      .eq('id', req.params.id)
      .single()

    if (!existing) {
      return res.status(404).json({ message: 'Guru tidak ditemukan' })
    }

    const updateData = { ...req.body }
    if (req.file) updateData.foto = req.file.filename

    const { data, error } = await supabase
      .from('gurus')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) throw error
    return res.status(200).json({ message: 'Guru berhasil diupdate', data })
  } catch (err) {
    next(err)
  }
}

export const deleteGuru = async (req, res, next) => {
  try {
    const { data: existing } = await supabase
      .from('gurus')
      .select('id')
      .eq('id', req.params.id)
      .single()

    if (!existing) {
      return res.status(404).json({ message: 'Guru tidak ditemukan' })
    }

    const { error } = await supabase.from('gurus').delete().eq('id', req.params.id)
    if (error) throw error

    return res.status(200).json({ message: 'Guru berhasil dihapus' })
  } catch (err) {
    next(err)
  }
}
