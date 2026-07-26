import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Siswa = db.define('siswa', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  namaLengkap: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nisn: {
    type: DataTypes.STRING,
    unique: true
  },
  tanggalLahir: {
    type: DataTypes.DATEONLY
  },
  jenisKelamin: {
    type: DataTypes.ENUM('L', 'P')
  },
  alamat: {
    type: DataTypes.TEXT
  },
  telepon: {
    type: DataTypes.STRING
  },
  namaOrangTua: {
    type: DataTypes.STRING
  },
  tahunMasuk: {
    type: DataTypes.INTEGER
  },
  status: {
    type: DataTypes.ENUM('aktif', 'lulus', 'keluar'),
    defaultValue: 'aktif'
  },
  kelasId: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  freezeTableName: true,
  timestamps: true
})

export default Siswa
