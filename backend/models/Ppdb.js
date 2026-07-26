import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Ppdb = db.define('ppdb', {
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
    type: DataTypes.STRING
  },
  tempatLahir: {
    type: DataTypes.STRING
  },
  tanggalLahir: {
    type: DataTypes.DATEONLY
  },
  jenisKelamin: {
    type: DataTypes.ENUM('L', 'P'),
    allowNull: false
  },
  alamat: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  telepon: {
    type: DataTypes.STRING
  },
  namaOrangTua: {
    type: DataTypes.STRING,
    allowNull: false
  },
  teleponOrangTua: {
    type: DataTypes.STRING
  },
  asalSekolah: {
    type: DataTypes.STRING
  },
  tahunLulus: {
    type: DataTypes.INTEGER
  },
  jurusan: {
    type: DataTypes.STRING
  },
  berkas: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.ENUM('pending', 'diterima', 'ditolak'),
    defaultValue: 'pending'
  },
  catatan: {
    type: DataTypes.TEXT
  }
}, {
  freezeTableName: true,
  timestamps: true
})

export default Ppdb
