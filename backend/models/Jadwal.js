import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Jadwal = db.define('jadwal', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  hari: {
    type: DataTypes.ENUM('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'),
    allowNull: false
  },
  jamMulai: {
    type: DataTypes.TIME,
    allowNull: false
  },
  jamSelesai: {
    type: DataTypes.TIME,
    allowNull: false
  },
  mataPelajaran: {
    type: DataTypes.STRING,
    allowNull: false
  },
  guruId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  kelasId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ruangan: {
    type: DataTypes.STRING
  }
}, {
  freezeTableName: true,
  timestamps: true
})

export default Jadwal
