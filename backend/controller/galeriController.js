import { Galeri, Admin } from '../models/index.js'

export const getGaleriPublic = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 12
    const offset = (page - 1) * limit
    const kategori = req.query.kategori

    const where = {}
    if (kategori) where.kategori = kategori

    const { count, rows } = await Galeri.findAndCountAll({
      where,
      include: [{ model: Admin, attributes: ['username'] }],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    })

    const kategoriList = await Galeri.findAll({
      attributes: ['kategori'],
      group: ['kategori']
    })

    return res.status(200).json({
      data: rows,
      kategori: kategoriList.map(k => k.kategori),
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

export const getAllGaleri = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 12
    const offset = (page - 1) * limit

    const { count, rows } = await Galeri.findAndCountAll({
      include: [{ model: Admin, attributes: ['username'] }],
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

export const createGaleri = async (req, res, next) => {
  try {
    const { judul, deskripsi, kategori } = req.body

    if (!judul) {
      return res.status(400).json({ message: 'Judul wajib diisi' })
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Gambar wajib diupload' })
    }

    const galeri = await Galeri.create({
      judul,
      deskripsi,
      image: req.file.filename,
      kategori: kategori || 'umum',
      adminId: req.admin.id
    })

    return res.status(201).json({
      message: 'Foto galeri berhasil ditambahkan',
      data: galeri
    })
  } catch (err) {
    next(err)
  }
}

export const updateGaleri = async (req, res, next) => {
  try {
    const galeri = await Galeri.findByPk(req.params.id)
    if (!galeri) {
      return res.status(404).json({ message: 'Foto galeri tidak ditemukan' })
    }

    const updateData = { ...req.body }
    if (req.file) updateData.image = req.file.filename

    await galeri.update(updateData)

    return res.status(200).json({
      message: 'Foto galeri berhasil diupdate',
      data: galeri
    })
  } catch (err) {
    next(err)
  }
}

export const deleteGaleri = async (req, res, next) => {
  try {
    const galeri = await Galeri.findByPk(req.params.id)
    if (!galeri) {
      return res.status(404).json({ message: 'Foto galeri tidak ditemukan' })
    }

    await galeri.destroy()

    return res.status(200).json({ message: 'Foto galeri berhasil dihapus' })
  } catch (err) {
    next(err)
  }
}
