import { Pengumuman, Admin } from '../models/index.js'

export const getPublishedPengumuman = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const offset = (page - 1) * limit

    const { count, rows } = await Pengumuman.findAndCountAll({
      where: { status: 'published' },
      include: [{ model: Admin, attributes: ['username'] }],
      order: [
        ['prioritas', 'ASC'],
        ['tanggal', 'DESC']
      ],
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

export const getAllPengumuman = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const offset = (page - 1) * limit

    const { count, rows } = await Pengumuman.findAndCountAll({
      include: [{ model: Admin, attributes: ['username'] }],
      order: [['tanggal', 'DESC']],
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

export const createPengumuman = async (req, res, next) => {
  try {
    const { judul, isi, tanggal, prioritas, status } = req.body

    if (!judul || !isi || !tanggal) {
      return res.status(400).json({ message: 'Judul, isi, dan tanggal wajib diisi' })
    }

    const pengumuman = await Pengumuman.create({
      judul,
      isi,
      tanggal,
      prioritas: prioritas || 'sedang',
      status: status || 'draft',
      adminId: req.admin.id
    })

    return res.status(201).json({
      message: 'Pengumuman berhasil dibuat',
      data: pengumuman
    })
  } catch (err) {
    next(err)
  }
}

export const updatePengumuman = async (req, res, next) => {
  try {
    const pengumuman = await Pengumuman.findByPk(req.params.id)
    if (!pengumuman) {
      return res.status(404).json({ message: 'Pengumuman tidak ditemukan' })
    }

    await pengumuman.update(req.body)

    return res.status(200).json({
      message: 'Pengumuman berhasil diupdate',
      data: pengumuman
    })
  } catch (err) {
    next(err)
  }
}

export const deletePengumuman = async (req, res, next) => {
  try {
    const pengumuman = await Pengumuman.findByPk(req.params.id)
    if (!pengumuman) {
      return res.status(404).json({ message: 'Pengumuman tidak ditemukan' })
    }

    await pengumuman.destroy()

    return res.status(200).json({ message: 'Pengumuman berhasil dihapus' })
  } catch (err) {
    next(err)
  }
}
