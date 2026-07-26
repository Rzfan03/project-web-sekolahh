import supabase from '../config/supabase.js'

export const submitPpdb = async (req, res, next) => {
  try {
    const { namaLengkap, nisn, tempatLahir, tanggalLahir, jenisKelamin, alamat, telepon, namaOrangTua, teleponOrangTua, asalSekolah, tahunLulus, jurusan } = req.body

    if (!namaLengkap || !jenisKelamin || !alamat || !namaOrangTua) {
      return res.status(400).json({ message: 'Nama, jenis kelamin, alamat, dan nama orang tua wajib diisi' })
    }

    const { data, error } = await supabase
      .from('ppdbs')
      .insert({
        nama_lengkap: namaLengkap, nisn,
        tempat_lahir: tempatLahir, tanggal_lahir: tanggalLahir,
        jenis_kelamin: jenisKelamin, alamat, telepon,
        nama_orang_tua: namaOrangTua, telepon_orang_tua: teleponOrangTua,
        asal_sekolah: asalSekolah, tahun_lulus: tahunLulus, jurusan,
        berkas: req.file ? req.file.filename : null
      })
      .select('id, nama_lengkap, status')
      .single()

    if (error) throw error

    return res.status(201).json({
      message: 'Pendaftaran PPDB berhasil, data akan diverifikasi oleh admin',
      data
    })
  } catch (err) {
    next(err)
  }
}

export const getAllPpdb = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase
      .from('ppdbs')
      .select('*', { count: 'exact' })
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

export const updatePpdbStatus = async (req, res, next) => {
  try {
    const { data: existing } = await supabase
      .from('ppdbs')
      .select('id')
      .eq('id', req.params.id)
      .single()

    if (!existing) {
      return res.status(404).json({ message: 'Data PPDB tidak ditemukan' })
    }

    const { status, catatan } = req.body
    if (!status) {
      return res.status(400).json({ message: 'Status wajib diisi' })
    }

    const { data, error } = await supabase
      .from('ppdbs')
      .update({ status, catatan })
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) throw error

    return res.status(200).json({
      message: `Pendaftaran ${status}`,
      data
    })
  } catch (err) {
    next(err)
  }
}

export const deletePpdb = async (req, res, next) => {
  try {
    const { data: existing } = await supabase
      .from('ppdbs')
      .select('id')
      .eq('id', req.params.id)
      .single()

    if (!existing) {
      return res.status(404).json({ message: 'Data PPDB tidak ditemukan' })
    }

    const { error } = await supabase.from('ppdbs').delete().eq('id', req.params.id)
    if (error) throw error

    return res.status(200).json({ message: 'Data PPDB berhasil dihapus' })
  } catch (err) {
    next(err)
  }
}
