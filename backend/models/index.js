import db from '../config/db.js'
import Admin from './Admin.js'
import Article from './Article.js'
import Guru from './Guru.js'
import Kelas from './Kelas.js'
import Siswa from './Siswa.js'
import Jadwal from './Jadwal.js'
import Pengumuman from './Pengumuman.js'
import Galeri from './Galeri.js'
import ProfilSekolah from './ProfilSekolah.js'
import Ppdb from './Ppdb.js'

Admin.hasMany(Article, { foreignKey: 'adminId' })
Article.belongsTo(Admin, { foreignKey: 'adminId' })

Admin.hasMany(Pengumuman, { foreignKey: 'adminId' })
Pengumuman.belongsTo(Admin, { foreignKey: 'adminId' })

Admin.hasMany(Galeri, { foreignKey: 'adminId' })
Galeri.belongsTo(Admin, { foreignKey: 'adminId' })

Guru.hasMany(Jadwal, { foreignKey: 'guruId' })
Jadwal.belongsTo(Guru, { foreignKey: 'guruId' })

Kelas.hasMany(Jadwal, { foreignKey: 'kelasId' })
Jadwal.belongsTo(Kelas, { foreignKey: 'kelasId' })

Kelas.hasMany(Siswa, { foreignKey: 'kelasId' })
Siswa.belongsTo(Kelas, { foreignKey: 'kelasId' })

Guru.hasOne(Kelas, { foreignKey: 'waliKelasId', as: 'waliKelas' })
Kelas.belongsTo(Guru, { foreignKey: 'waliKelasId', as: 'waliKelas' })

;(async () => {
  try {
    await db.sync({ alter: true })
    console.log('Database tersync')
  } catch (err) {
    console.error('Sync database gagal:', err)
  }
})()

export {
  Admin,
  Article,
  Guru,
  Kelas,
  Siswa,
  Jadwal,
  Pengumuman,
  Galeri,
  ProfilSekolah,
  Ppdb
}
