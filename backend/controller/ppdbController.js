import supabase from '../config/supabase.js'

const paginate = (req) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 20
  return { page, limit, from: (page - 1) * limit, to: (page - 1) * limit + limit - 1 }
}

export const submitPpdb = async (req, res, next) => {
  try {
    const { namaLengkap, jenisKelamin, alamat, namaOrangTua } = req.body
    if (!namaLengkap || !jenisKelamin || !alamat || !namaOrangTua) return res.status(400).json({ message: 'Data wajib tidak lengkap' })
    const { data, error } = await supabase.from('ppdbs').insert({
      nama_lengkap: namaLengkap, nisn: req.body.nisn, tempat_lahir: req.body.tempatLahir,
      tanggal_lahir: req.body.tanggalLahir, jenis_kelamin: jenisKelamin, alamat, telepon: req.body.telepon,
      nama_orang_tua: namaOrangTua, telepon_orang_tua: req.body.teleponOrangTua,
      asal_sekolah: req.body.asalSekolah, tahun_lulus: req.body.tahunLulus, jurusan: req.body.jurusan,
      berkas: req.file ? req.file.filename : null
    }).select('id,nama_lengkap,status').single()
    if (error) throw error
    res.status(201).json({ message: 'Pendaftaran berhasil', data })
  } catch (e) { next(e) }
}

export const getAllPpdb = async (req, res, next) => {
  try {
    const p = paginate(req)
    let q = supabase.from('ppdbs').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(p.from, p.to)
    if (req.query.status) q = q.eq('status', req.query.status)
    const { data, error, count } = await q
    if (error) throw error
    res.json({ data, pagination: { total: count, page: p.page, limit: p.limit, totalPages: Math.ceil(count / p.limit) } })
  } catch (e) { next(e) }
}

export const updatePpdbStatus = async (req, res, next) => {
  try {
    const { data: ex } = await supabase.from('ppdbs').select('id').eq('id', req.params.id).single()
    if (!ex) return res.status(404).json({ message: 'Tidak ditemukan' })
    if (!req.body.status) return res.status(400).json({ message: 'Status wajib' })
    const { data, error } = await supabase.from('ppdbs').update({ status: req.body.status, catatan: req.body.catatan }).eq('id', req.params.id).select().single()
    if (error) throw error
    res.json({ message: `PPDB ${req.body.status}`, data })
  } catch (e) { next(e) }
}

export const deletePpdb = async (req, res, next) => {
  try {
    const { data: ex } = await supabase.from('ppdbs').select('id').eq('id', req.params.id).single()
    if (!ex) return res.status(404).json({ message: 'Tidak ditemukan' })
    await supabase.from('ppdbs').delete().eq('id', req.params.id)
    res.json({ message: 'PPDB dihapus' })
  } catch (e) { next(e) }
}
