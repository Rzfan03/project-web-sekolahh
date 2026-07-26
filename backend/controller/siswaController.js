import supabase from '../config/supabase.js'

export const getAllSiswa = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase
      .from('siswas')
      .select('*, kelas(nama)', { count: 'exact' })
      .order('nama_lengkap', { ascending: true })
      .range(from, to)

    if (req.query.kelasId) {
      query = query.eq('kelas_id', req.query.kelasId)
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

export const getSiswaById = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('siswas')
      .select('*, kelas(nama)')
      .eq('id', req.params.id)
      .single()

    if (error || !data) {
      return res.status(404).json({ message: 'Siswa tidak ditemukan' })
    }

    return res.status(200).json({ data })
  } catch (err) {
    next(err)
  }
}

export const createSiswa = async (req, res, next) => {
  try {
    const { namaLengkap, nisn, tanggalLahir, jenisKelamin, alamat, telepon, namaOrangTua, tahunMasuk, kelasId } = req.body

    if (!namaLengkap) {
      return res.status(400).json({ message: 'Nama lengkap wajib diisi' })
    }

    const { data, error } = await supabase
      .from('siswas')
      .insert({
        nama_lengkap: namaLengkap, nisn,
        tanggal_lahir: tanggalLahir, jenis_kelamin: jenisKelamin,
        alamat, telepon, nama_orang_tua: namaOrangTua,
        tahun_masuk: tahunMasuk, kelas_id: kelasId
      })
      .select()
      .single()

    if (error) throw error
    return res.status(201).json({ message: 'Siswa berhasil ditambahkan', data })
  } catch (err) {
    next(err)
  }
}

export const updateSiswa = async (req, res, next) => {
  try {
    const { data: existing } = await supabase
      .from('siswas')
      .select('id')
      .eq('id', req.params.id)
      .single()

    if (!existing) {
      return res.status(404).json({ message: 'Siswa tidak ditemukan' })
    }

    const { data, error } = await supabase
      .from('siswas')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) throw error
    return res.status(200).json({ message: 'Siswa berhasil diupdate', data })
  } catch (err) {
    next(err)
  }
}

export const deleteSiswa = async (req, res, next) => {
  try {
    const { data: existing } = await supabase
      .from('siswas')
      .select('id')
      .eq('id', req.params.id)
      .single()

    if (!existing) {
      return res.status(404).json({ message: 'Siswa tidak ditemukan' })
    }

    const { error } = await supabase.from('siswas').delete().eq('id', req.params.id)
    if (error) throw error

    return res.status(200).json({ message: 'Siswa berhasil dihapus' })
  } catch (err) {
    next(err)
  }
}
