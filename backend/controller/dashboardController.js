import { Admin, Article, Guru, Siswa, Kelas, Pengumuman, Galeri, Ppdb } from '../models/index.js'

export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalArtikel,
      totalGuru,
      totalSiswa,
      totalKelas,
      totalPengumuman,
      totalGaleri,
      ppdbPending,
      siswaAktif,
      guruAktif
    ] = await Promise.all([
      Article.count(),
      Guru.count(),
      Siswa.count(),
      Kelas.count(),
      Pengumuman.count(),
      Galeri.count(),
      Ppdb.count({ where: { status: 'pending' } }),
      Siswa.count({ where: { status: 'aktif' } }),
      Guru.count({ where: { status: 'aktif' } })
    ])

    const recentArticles = await Article.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5,
      include: [{ model: Admin, attributes: ['username'] }]
    })

    const recentPpdb = await Ppdb.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5
    })

    return res.status(200).json({
      stats: {
        totalArtikel,
        totalGuru,
        totalSiswa,
        totalKelas,
        totalPengumuman,
        totalGaleri,
        ppdbPending,
        siswaAktif,
        guruAktif
      },
      recentArticles,
      recentPpdb
    })
  } catch (err) {
    next(err)
  }
}
