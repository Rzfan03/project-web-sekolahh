import { Kelas, Guru, Siswa } from '../models/index.js'

export const getAllKelas = async (req, res, next) => {
  try {
    const kelas = await Kelas.findAll({
      include: [
        { model: Guru, as: 'waliKelas', attributes: ['id', 'nama'] },
        { model: Siswa, attributes: ['id'] }
      ],
      order: [['nama', 'ASC']]
    })

    const result = kelas.map(k => ({
      id: k.id,
      nama: k.nama,
      tingkat: k.tingkat,
      kapasitas: k.kapasitas,
      waliKelas: k.waliKelas,
      jumlahSiswa: k.siswas.length
    }))

    return res.status(200).json({ data: result })
  } catch (err) {
    next(err)
  }
}

export const getKelasById = async (req, res, next) => {
  try {
    const kelas = await Kelas.findByPk(req.params.id, {
      include: [
        { model: Guru, as: 'waliKelas', attributes: ['id', 'nama'] },
        { model: Siswa, attributes: ['id', 'namaLengkap', 'nisn'] }
      ]
    })

    if (!kelas) {
      return res.status(404).json({ message: 'Kelas tidak ditemukan' })
    }

    return res.status(200).json({ data: kelas })
  } catch (err) {
    next(err)
  }
}

export const createKelas = async (req, res, next) => {
  try {
    const { nama, tingkat, waliKelasId, kapasitas } = req.body

    if (!nama || !tingkat) {
      return res.status(400).json({ message: 'Nama dan tingkat kelas wajib diisi' })
    }

    const kelas = await Kelas.create({
      nama,
      tingkat,
      waliKelasId,
      kapasitas
    })

    return res.status(201).json({
      message: 'Kelas berhasil dibuat',
      data: kelas
    })
  } catch (err) {
    next(err)
  }
}

export const updateKelas = async (req, res, next) => {
  try {
    const kelas = await Kelas.findByPk(req.params.id)
    if (!kelas) {
      return res.status(404).json({ message: 'Kelas tidak ditemukan' })
    }

    await kelas.update(req.body)

    return res.status(200).json({
      message: 'Kelas berhasil diupdate',
      data: kelas
    })
  } catch (err) {
    next(err)
  }
}

export const deleteKelas = async (req, res, next) => {
  try {
    const kelas = await Kelas.findByPk(req.params.id)
    if (!kelas) {
      return res.status(404).json({ message: 'Kelas tidak ditemukan' })
    }

    const jumlahSiswa = await Siswa.count({ where: { kelasId: kelas.id } })
    if (jumlahSiswa > 0) {
      return res.status(400).json({ message: 'Tidak bisa menghapus kelas yang masih memiliki siswa' })
    }

    await kelas.destroy()

    return res.status(200).json({ message: 'Kelas berhasil dihapus' })
  } catch (err) {
    next(err)
  }
}
