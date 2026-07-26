import supabase from '../config/supabase.js'

export const getJadwalByKelas = async (req, res, next) => {
  try {
    const { data } = await supabase.from('jadwals').select('*, gurus(id,nama,mata_pelajaran), kelas(nama)').eq('kelas_id', req.params.kelasId).order('hari').order('jam_mulai')
    res.json({ data })
  } catch (e) { next(e) }
}

export const getJadwalAll = async (_, res, next) => {
  try {
    const { data } = await supabase.from('jadwals').select('*, gurus(id,nama), kelas(nama)').order('hari').order('jam_mulai')
    res.json({ data })
  } catch (e) { next(e) }
}

export const createJadwal = async (req, res, next) => {
  try {
    const { hari, jamMulai, jamSelesai, mataPelajaran, kelasId } = req.body
    if (!hari || !jamMulai || !jamSelesai || !mataPelajaran || !kelasId) return res.status(400).json({ message: 'Data wajib tidak lengkap' })
    const { data, error } = await supabase.from('jadwals').insert({ hari, jam_mulai: jamMulai, jam_selesai: jamSelesai, mata_pelajaran: mataPelajaran, guru_id: req.body.guruId, kelas_id: kelasId, ruangan: req.body.ruangan }).select().single()
    if (error) throw error
    res.status(201).json({ message: 'Jadwal dibuat', data })
  } catch (e) { next(e) }
}

export const updateJadwal = async (req, res, next) => {
  try {
    const { data: ex } = await supabase.from('jadwals').select('id').eq('id', req.params.id).single()
    if (!ex) return res.status(404).json({ message: 'Tidak ditemukan' })
    const { data, error } = await supabase.from('jadwals').update(req.body).eq('id', req.params.id).select().single()
    if (error) throw error
    res.json({ message: 'Jadwal diupdate', data })
  } catch (e) { next(e) }
}

export const deleteJadwal = async (req, res, next) => {
  try {
    const { data: ex } = await supabase.from('jadwals').select('id').eq('id', req.params.id).single()
    if (!ex) return res.status(404).json({ message: 'Tidak ditemukan' })
    await supabase.from('jadwals').delete().eq('id', req.params.id)
    res.json({ message: 'Jadwal dihapus' })
  } catch (e) { next(e) }
}
