import { Sequelize } from "sequelize";
import db from "../config/db.js";

const { DataTypes } = Sequelize;

const Admin = db.define('admin', {
  username: DataTypes.STRING,
  password: DataTypes.STRING
}, {
  freezeTableName: true
})

const Article = db.define('article', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  judul: DataTypes.STRING,
  deskripsi: DataTypes.STRING,
  image: DataTypes.STRING
}, {
  freezeTableName: true,
  timestamps: true
})

  export { Admin, Article }

  (async () => {
    await db.sync();
  });