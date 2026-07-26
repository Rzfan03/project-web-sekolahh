import { Ppdb } from '../models/index.js'

export const submitPpdb = async (req, res, next) => {
  try {
    const { namaLengkap, nisn, tempatLahir, tanggalLahir, jenisKelamin, alamat, telepon, namaOrangTua, teleponOrangTua, asalSekolah, tahunLulus, jurusan } = req.body

    if (!namaLengkap || !jenisKelamin || !alamat || !namaOrangTua) {
      return res.status(400).json({ message: 'Nama, jenis kelamin, alamat, dan nama orang tua wajib diisi' })
    }

    const ppdb = await Ppdb.create({
      namaLengkap,
      nisn,
      tempatLahir,
      tanggalLahir,
      jenisKelamin,
      alamat,
      telepon,
      namaOrangTua,
      teleponOrangTua,
      asalSekolah,
      tahunLulus,
      jurusan,
      berkas: req.file ? req.file.filename : null
    })

    return res.status(201).json({
      message: 'Pendaftaran PPDB berhasil, data akan diverifikasi oleh admin',
      data: { id: ppdb.id, namaLengkap: ppdb.namaLengkap, status: ppdb.status }
    })
  } catch (err) {
    next(err)
  }
}

export const getAllPpdb = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const offset = (page - 1) * limit
    const status = req.query.status

    const where = {}
    if (status) where.status = status

    const { count, rows } = await Ppdb.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
      offset
    })

    return res.status(200).json({
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    })
  } catch (err) {
    next(err)
  }
}

export const updatePpdbStatus = async (req, res, next) => {
  try {
    const ppdb = await Ppdb.findByPk(req.params.id)
    if (!ppdb) {
      return res.status(404).json({ message: 'Data PPDB tidak ditemukan' })
    }

    const { status, catatan } = req.body
    if (!status) {
      return res.status(400).json({ message: 'Status wajib diisi' })
    }

    await ppdb.update({ status, catatan })

    return res.status(200).json({
      message: `Pendaftaran ${status}`,
      data: ppdb
    })
  } catch (err) {
    next(err)
  }
}

export const deletePpdb = async (req, res, next) => {
  try {
    const ppdb = await Ppdb.findByPk(req.params.id)
    if (!ppdb) {
      return res.status(404).json({ message: 'Data PPDB tidak ditemukan' })
    }

    await ppdb.destroy()

    return res.status(200).json({ message: 'Data PPDB berhasil dihapus' })
  } catch (err) {
    next(err)
  }
}
