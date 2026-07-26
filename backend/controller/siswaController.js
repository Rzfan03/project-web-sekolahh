import { Siswa, Kelas } from '../models/index.js'

export const getAllSiswa = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const offset = (page - 1) * limit
    const kelasId = req.query.kelasId

    const where = {}
    if (kelasId) where.kelasId = kelasId

    const { count, rows } = await Siswa.findAndCountAll({
      where,
      include: [{ model: Kelas, attributes: ['id', 'nama'] }],
      order: [['namaLengkap', 'ASC']],
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

export const getSiswaById = async (req, res, next) => {
  try {
    const siswa = await Siswa.findByPk(req.params.id, {
      include: [{ model: Kelas, attributes: ['id', 'nama'] }]
    })

    if (!siswa) {
      return res.status(404).json({ message: 'Siswa tidak ditemukan' })
    }

    return res.status(200).json({ data: siswa })
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

    const siswa = await Siswa.create({
      namaLengkap,
      nisn,
      tanggalLahir,
      jenisKelamin,
      alamat,
      telepon,
      namaOrangTua,
      tahunMasuk,
      kelasId
    })

    return res.status(201).json({
      message: 'Siswa berhasil ditambahkan',
      data: siswa
    })
  } catch (err) {
    next(err)
  }
}

export const updateSiswa = async (req, res, next) => {
  try {
    const siswa = await Siswa.findByPk(req.params.id)
    if (!siswa) {
      return res.status(404).json({ message: 'Siswa tidak ditemukan' })
    }

    await siswa.update(req.body)

    return res.status(200).json({
      message: 'Siswa berhasil diupdate',
      data: siswa
    })
  } catch (err) {
    next(err)
  }
}

export const deleteSiswa = async (req, res, next) => {
  try {
    const siswa = await Siswa.findByPk(req.params.id)
    if (!siswa) {
      return res.status(404).json({ message: 'Siswa tidak ditemukan' })
    }

    await siswa.destroy()

    return res.status(200).json({ message: 'Siswa berhasil dihapus' })
  } catch (err) {
    next(err)
  }
}
