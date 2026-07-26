import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Admin = db.define('admin', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { len: [3, 30], notEmpty: true }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [6, 100], notEmpty: true }
  },
  role: {
    type: DataTypes.ENUM('admin', 'superadmin'),
    defaultValue: 'admin'
  }
}, {
  freezeTableName: true,
  timestamps: true
})

export default Admin
