import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Galeri = db.define('galeri', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  judul: {
    type: DataTypes.STRING,
    allowNull: false
  },
  deskripsi: {
    type: DataTypes.TEXT
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  kategori: {
    type: DataTypes.STRING,
    defaultValue: 'umum'
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  freezeTableName: true,
  timestamps: true
})

export default Galeri
