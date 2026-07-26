import supabase from '../config/supabase.js'

export const getJadwalByKelas = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('jadwals')
      .select('*, gurus(id, nama, mata_pelajaran), kelas(nama)')
      .eq('kelas_id', req.params.kelasId)
      .order('hari', { ascending: true })
      .order('jam_mulai', { ascending: true })

    if (error) throw error
    return res.status(200).json({ data })
  } catch (err) {
    next(err)
  }
}

export const getJadwalAll = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('jadwals')
      .select('*, gurus(id, nama), kelas(nama)')
      .order('hari', { ascending: true })
      .order('jam_mulai', { ascending: true })

    if (error) throw error
    return res.status(200).json({ data })
  } catch (err) {
    next(err)
  }
}

export const createJadwal = async (req, res, next) => {
  try {
    const { hari, jamMulai, jamSelesai, mataPelajaran, guruId, kelasId, ruangan } = req.body

    if (!hari || !jamMulai || !jamSelesai || !mataPelajaran || !kelasId) {
      return res.status(400).json({ message: 'Hari, jam, mata pelajaran, dan kelas wajib diisi' })
    }

    const { data, error } = await supabase
      .from('jadwals')
      .insert({
        hari, jam_mulai: jamMulai, jam_selesai: jamSelesai,
        mata_pelajaran: mataPelajaran, guru_id: guruId,
        kelas_id: kelasId, ruangan
      })
      .select()
      .single()

    if (error) throw error
    return res.status(201).json({ message: 'Jadwal berhasil dibuat', data })
  } catch (err) {
    next(err)
  }
}

export const updateJadwal = async (req, res, next) => {
  try {
    const { data: existing } = await supabase
      .from('jadwals')
      .select('id')
      .eq('id', req.params.id)
      .single()

    if (!existing) {
      return res.status(404).json({ message: 'Jadwal tidak ditemukan' })
    }

    const { data, error } = await supabase
      .from('jadwals')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) throw error
    return res.status(200).json({ message: 'Jadwal berhasil diupdate', data })
  } catch (err) {
    next(err)
  }
}

export const deleteJadwal = async (req, res, next) => {
  try {
    const { data: existing } = await supabase
      .from('jadwals')
      .select('id')
      .eq('id', req.params.id)
      .single()

    if (!existing) {
      return res.status(404).json({ message: 'Jadwal tidak ditemukan' })
    }

    const { error } = await supabase.from('jadwals').delete().eq('id', req.params.id)
    if (error) throw error

    return res.status(200).json({ message: 'Jadwal berhasil dihapus' })
  } catch (err) {
    next(err)
  }
}
