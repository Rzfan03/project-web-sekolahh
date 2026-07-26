import { Jadwal, Guru, Kelas } from '../models/index.js'

export const getJadwalByKelas = async (req, res, next) => {
  try {
    const { kelasId } = req.params

    const jadwal = await Jadwal.findAll({
      where: { kelasId },
      include: [
        { model: Guru, attributes: ['id', 'nama', 'mataPelajaran'] },
        { model: Kelas, attributes: ['id', 'nama'] }
      ],
      order: [
        ['hari', 'ASC'],
        ['jamMulai', 'ASC']
      ]
    })

    return res.status(200).json({ data: jadwal })
  } catch (err) {
    next(err)
  }
}

export const getJadwalAll = async (req, res, next) => {
  try {
    const jadwal = await Jadwal.findAll({
      include: [
        { model: Guru, attributes: ['id', 'nama'] },
        { model: Kelas, attributes: ['id', 'nama'] }
      ],
      order: [
        ['hari', 'ASC'],
        ['jamMulai', 'ASC']
      ]
    })

    return res.status(200).json({ data: jadwal })
  } catch (err) {
    next(err)
  }
}

export const createJadwal = async (req, res, next) => {
  try {
    const { hari, jamMulai, jamSelesai, mataPelajaran, guruId, kelasId, ruangan } = req.body

    if (!hari || !jamMulai || !jamSelesai || !mataPelajaran || !kelasId) {
      return res.status(400).json({ message: 'Hari, jam, mata pelajaran, dan kelas wajib diisi' })
    }

    const jadwal = await Jadwal.create({
      hari,
      jamMulai,
      jamSelesai,
      mataPelajaran,
      guruId,
      kelasId,
      ruangan
    })

    return res.status(201).json({
      message: 'Jadwal berhasil dibuat',
      data: jadwal
    })
  } catch (err) {
    next(err)
  }
}

export const updateJadwal = async (req, res, next) => {
  try {
    const jadwal = await Jadwal.findByPk(req.params.id)
    if (!jadwal) {
      return res.status(404).json({ message: 'Jadwal tidak ditemukan' })
    }

    await jadwal.update(req.body)

    return res.status(200).json({
      message: 'Jadwal berhasil diupdate',
      data: jadwal
    })
  } catch (err) {
    next(err)
  }
}

export const deleteJadwal = async (req, res, next) => {
  try {
    const jadwal = await Jadwal.findByPk(req.params.id)
    if (!jadwal) {
      return res.status(404).json({ message: 'Jadwal tidak ditemukan' })
    }

    await jadwal.destroy()

    return res.status(200).json({ message: 'Jadwal berhasil dihapus' })
  } catch (err) {
    next(err)
  }
}
