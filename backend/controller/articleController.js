import slugify from 'slugify'
import { Article, Admin } from '../models/index.js'

export const getPublishedArticles = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const offset = (page - 1) * limit

    const { count, rows } = await Article.findAndCountAll({
      where: { status: 'published' },
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

export const getPublishedArticleBySlug = async (req, res, next) => {
  try {
    const article = await Article.findOne({
      where: { slug: req.params.slug, status: 'published' },
      include: [{ model: Admin, attributes: ['username'] }]
    })

    if (!article) {
      return res.status(404).json({ message: 'Artikel tidak ditemukan' })
    }

    return res.status(200).json({ data: article })
  } catch (err) {
    next(err)
  }
}

export const getAllArticles = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const offset = (page - 1) * limit
    const status = req.query.status

    const where = {}
    if (status) where.status = status

    const { count, rows } = await Article.findAndCountAll({
      where,
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

export const getArticleById = async (req, res, next) => {
  try {
    const article = await Article.findByPk(req.params.id, {
      include: [{ model: Admin, attributes: ['username'] }]
    })

    if (!article) {
      return res.status(404).json({ message: 'Artikel tidak ditemukan' })
    }

    return res.status(200).json({ data: article })
  } catch (err) {
    next(err)
  }
}

export const createArticle = async (req, res, next) => {
  try {
    const { judul, ringkasan, deskripsi, status } = req.body

    if (!judul || !deskripsi) {
      return res.status(400).json({ message: 'Judul dan deskripsi wajib diisi' })
    }

    let slug = slugify(judul, { lower: true, strict: true })
    const existingSlug = await Article.findOne({ where: { slug } })
    if (existingSlug) {
      slug = slug + '-' + Date.now()
    }

    const article = await Article.create({
      judul,
      slug,
      ringkasan,
      deskripsi,
      image: req.file ? req.file.filename : null,
      status: status || 'draft',
      adminId: req.admin.id
    })

    return res.status(201).json({
      message: 'Artikel berhasil dibuat',
      data: article
    })
  } catch (err) {
    next(err)
  }
}

export const updateArticle = async (req, res, next) => {
  try {
    const article = await Article.findByPk(req.params.id)
    if (!article) {
      return res.status(404).json({ message: 'Artikel tidak ditemukan' })
    }

    const { judul, ringkasan, deskripsi, status } = req.body
    const updateData = {}

    if (judul) {
      updateData.judul = judul
      let slug = slugify(judul, { lower: true, strict: true })
      const existingSlug = await Article.findOne({ where: { slug, id: { $ne: article.id } } })
      if (existingSlug) slug = slug + '-' + Date.now()
      updateData.slug = slug
    }
    if (ringkasan !== undefined) updateData.ringkasan = ringkasan
    if (deskripsi) updateData.deskripsi = deskripsi
    if (status) updateData.status = status
    if (req.file) updateData.image = req.file.filename

    await article.update(updateData)

    return res.status(200).json({
      message: 'Artikel berhasil diupdate',
      data: article
    })
  } catch (err) {
    next(err)
  }
}

export const deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findByPk(req.params.id)
    if (!article) {
      return res.status(404).json({ message: 'Artikel tidak ditemukan' })
    }

    await article.destroy()

    return res.status(200).json({ message: 'Artikel berhasil dihapus' })
  } catch (err) {
    next(err)
  }
}
