import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Guru = db.define('guru', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nip: {
    type: DataTypes.STRING,
    unique: true
  },
  mataPelajaran: {
    type: DataTypes.STRING,
    allowNull: false
  },
  foto: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING,
    validate: { isEmail: true }
  },
  telepon: {
    type: DataTypes.STRING
  },
  alamat: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.ENUM('aktif', 'nonaktif'),
    defaultValue: 'aktif'
  }
}, {
  freezeTableName: true,
  timestamps: true
})

export default Guru
