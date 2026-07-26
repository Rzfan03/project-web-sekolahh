import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Pengumuman = db.define('pengumuman', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  judul: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isi: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  tanggal: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  prioritas: {
    type: DataTypes.ENUM('tinggi', 'sedang', 'rendah'),
    defaultValue: 'sedang'
  },
  status: {
    type: DataTypes.ENUM('draft', 'published'),
    defaultValue: 'draft'
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  freezeTableName: true,
  timestamps: true
})

export default Pengumuman
