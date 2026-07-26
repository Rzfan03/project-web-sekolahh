import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Kelas = db.define('kelas', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  tingkat: {
    type: DataTypes.STRING,
    allowNull: false
  },
  waliKelasId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  kapasitas: {
    type: DataTypes.INTEGER,
    defaultValue: 30
  }
}, {
  freezeTableName: true,
  timestamps: true
})

export default Kelas
