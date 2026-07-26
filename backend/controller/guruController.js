import { Guru } from '../models/index.js'

export const getAllGuruPublic = async (req, res, next) => {
  try {
    const guru = await Guru.findAll({
      where: { status: 'aktif' },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [['nama', 'ASC']]
    })

    return res.status(200).json({ data: guru })
  } catch (err) {
    next(err)
  }
}

export const getGuruByIdPublic = async (req, res, next) => {
  try {
    const guru = await Guru.findByPk(req.params.id)

    if (!guru) {
      return res.status(404).json({ message: 'Guru tidak ditemukan' })
    }

    return res.status(200).json({ data: guru })
  } catch (err) {
    next(err)
  }
}

export const getAllGuru = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const offset = (page - 1) * limit

    const { count, rows } = await Guru.findAndCountAll({
      order: [['nama', 'ASC']],
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

export const createGuru = async (req, res, next) => {
  try {
    const { nama, nip, mataPelajaran, email, telepon, alamat, status } = req.body

    if (!nama || !mataPelajaran) {
      return res.status(400).json({ message: 'Nama dan mata pelajaran wajib diisi' })
    }

    const guru = await Guru.create({
      nama,
      nip,
      mataPelajaran,
      foto: req.file ? req.file.filename : null,
      email,
      telepon,
      alamat,
      status: status || 'aktif'
    })

    return res.status(201).json({
      message: 'Guru berhasil ditambahkan',
      data: guru
    })
  } catch (err) {
    next(err)
  }
}

export const updateGuru = async (req, res, next) => {
  try {
    const guru = await Guru.findByPk(req.params.id)
    if (!guru) {
      return res.status(404).json({ message: 'Guru tidak ditemukan' })
    }

    const updateData = { ...req.body }
    if (req.file) updateData.foto = req.file.filename

    await guru.update(updateData)

    return res.status(200).json({
      message: 'Guru berhasil diupdate',
      data: guru
    })
  } catch (err) {
    next(err)
  }
}

export const deleteGuru = async (req, res, next) => {
  try {
    const guru = await Guru.findByPk(req.params.id)
    if (!guru) {
      return res.status(404).json({ message: 'Guru tidak ditemukan' })
    }

    await guru.destroy()

    return res.status(200).json({ message: 'Guru berhasil dihapus' })
  } catch (err) {
    next(err)
  }
}
