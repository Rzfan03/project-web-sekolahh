import { ProfilSekolah } from '../models/index.js'

export const getProfil = async (req, res, next) => {
  try {
    const profil = await ProfilSekolah.findOne()

    if (!profil) {
      return res.status(404).json({ message: 'Profil sekolah belum diatur' })
    }

    return res.status(200).json({ data: profil })
  } catch (err) {
    next(err)
  }
}

export const updateProfil = async (req, res, next) => {
  try {
    let profil = await ProfilSekolah.findOne()

    const updateData = { ...req.body }
    if (req.file) updateData.logo = req.file.filename

    if (!profil) {
      profil = await ProfilSekolah.create(updateData)
      return res.status(201).json({
        message: 'Profil sekolah berhasil dibuat',
        data: profil
      })
    }

    await profil.update(updateData)

    return res.status(200).json({
      message: 'Profil sekolah berhasil diupdate',
      data: profil
    })
  } catch (err) {
    next(err)
  }
}
