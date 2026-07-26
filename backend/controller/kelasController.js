import supabase from '../config/supabase.js'

export const getAllKelas = async (_, res, next) => {
  try {
    const { data: kelasList } = await supabase.from('kelas').select('*, gurus(nama)').order('nama')
    const result = await Promise.all(kelasList.map(async (k) => {
      const { count } = await supabase.from('siswas').select('*', { count: 'exact', head: true }).eq('kelas_id', k.id)
      return { ...k, waliKelas: k.gurus, jumlahSiswa: count || 0 }
    }))
    res.json({ data: result })
  } catch (e) { next(e) }
}

export const getKelasById = async (req, res, next) => {
  try {
    const { data } = await supabase.from('kelas').select('*, gurus(nama), siswas(id,nama_lengkap,nisn)').eq('id', req.params.id).single()
    data ? res.json({ data }) : res.status(404).json({ message: 'Tidak ditemukan' })
  } catch (e) { next(e) }
}

export const createKelas = async (req, res, next) => {
  try {
    const { nama, tingkat } = req.body
    if (!nama || !tingkat) return res.status(400).json({ message: 'Nama & tingkat wajib' })
    const { data, error } = await supabase.from('kelas').insert({ nama, tingkat, wali_kelas_id: req.body.waliKelasId, kapasitas: req.body.kapasitas }).select().single()
    if (error) throw error
    res.status(201).json({ message: 'Kelas dibuat', data })
  } catch (e) { next(e) }
}

export const updateKelas = async (req, res, next) => {
  try {
    const { data: ex } = await supabase.from('kelas').select('id').eq('id', req.params.id).single()
    if (!ex) return res.status(404).json({ message: 'Tidak ditemukan' })
    const { data, error } = await supabase.from('kelas').update(req.body).eq('id', req.params.id).select().single()
    if (error) throw error
    res.json({ message: 'Kelas diupdate', data })
  } catch (e) { next(e) }
}

export const deleteKelas = async (req, res, next) => {
  try {
    const { data: ex } = await supabase.from('kelas').select('id').eq('id', req.params.id).single()
    if (!ex) return res.status(404).json({ message: 'Tidak ditemukan' })
    await supabase.from('kelas').delete().eq('id', req.params.id)
    res.json({ message: 'Kelas dihapus' })
  } catch (e) { next(e) }
}
