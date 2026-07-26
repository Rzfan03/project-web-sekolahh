import supabase from '../config/supabase.js'

export const getAllKelas = async (req, res, next) => {
  try {
    const { data: kelasList, error } = await supabase
      .from('kelas')
      .select('*, gurus(nama)')
      .order('nama', { ascending: true })

    if (error) throw error

    const kelasWithCount = await Promise.all(
      kelasList.map(async (k) => {
        const { count } = await supabase
          .from('siswas')
          .select('*', { count: 'exact', head: true })
          .eq('kelas_id', k.id)

        return {
          id: k.id,
          nama: k.nama,
          tingkat: k.tingkat,
          kapasitas: k.kapasitas,
          waliKelas: k.gurus,
          jumlahSiswa: count || 0
        }
      })
    )

    return res.status(200).json({ data: kelasWithCount })
  } catch (err) {
    next(err)
  }
}

export const getKelasById = async (req, res, next) => {
  try {
    const { data: kelas, error } = await supabase
      .from('kelas')
      .select('*, gurus(nama), siswas(id, nama_lengkap, nisn)')
      .eq('id', req.params.id)
      .single()

    if (error || !kelas) {
      return res.status(404).json({ message: 'Kelas tidak ditemukan' })
    }

    return res.status(200).json({ data: kelas })
  } catch (err) {
    next(err)
  }
}

export const createKelas = async (req, res, next) => {
  try {
    const { nama, tingkat, waliKelasId, kapasitas } = req.body

    if (!nama || !tingkat) {
      return res.status(400).json({ message: 'Nama dan tingkat kelas wajib diisi' })
    }

    const { data, error } = await supabase
      .from('kelas')
      .insert({ nama, tingkat, wali_kelas_id: waliKelasId, kapasitas })
      .select()
      .single()

    if (error) throw error
    return res.status(201).json({ message: 'Kelas berhasil dibuat', data })
  } catch (err) {
    next(err)
  }
}

export const updateKelas = async (req, res, next) => {
  try {
    const { data: existing } = await supabase
      .from('kelas')
      .select('id')
      .eq('id', req.params.id)
      .single()

    if (!existing) {
      return res.status(404).json({ message: 'Kelas tidak ditemukan' })
    }

    const { data, error } = await supabase
      .from('kelas')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) throw error
    return res.status(200).json({ message: 'Kelas berhasil diupdate', data })
  } catch (err) {
    next(err)
  }
}

export const deleteKelas = async (req, res, next) => {
  try {
    const { data: existing } = await supabase
      .from('kelas')
      .select('id')
      .eq('id', req.params.id)
      .single()

    if (!existing) {
      return res.status(404).json({ message: 'Kelas tidak ditemukan' })
    }

    const { count } = await supabase
      .from('siswas')
      .select('*', { count: 'exact', head: true })
      .eq('kelas_id', req.params.id)

    if (count > 0) {
      return res.status(400).json({ message: 'Tidak bisa menghapus kelas yang masih memiliki siswa' })
    }

    const { error } = await supabase.from('kelas').delete().eq('id', req.params.id)
    if (error) throw error

    return res.status(200).json({ message: 'Kelas berhasil dihapus' })
  } catch (err) {
    next(err)
  }
}
