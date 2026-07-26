import { DataTypes } from "sequelize";
import db from "../config/db.js";

const ProfilSekolah = db.define('profil_sekolah', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  namaSekolah: {
    type: DataTypes.STRING,
    allowNull: false
  },
  npsn: {
    type: DataTypes.STRING,
    unique: true
  },
  alamat: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  telepon: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING,
    validate: { isEmail: true }
  },
  website: {
    type: DataTypes.STRING
  },
  visi: {
    type: DataTypes.TEXT
  },
  misi: {
    type: DataTypes.TEXT
  },
  sejarah: {
    type: DataTypes.TEXT
  },
  logo: {
    type: DataTypes.STRING
  },
  slogan: {
    type: DataTypes.STRING
  },
  tahunBerdiri: {
    type: DataTypes.INTEGER
  },
  namaKepalaSekolah: {
    type: DataTypes.STRING
  },
  fotoKepalaSekolah: {
    type: DataTypes.STRING
  }
}, {
  freezeTableName: true,
  timestamps: true
})

export default ProfilSekolah
