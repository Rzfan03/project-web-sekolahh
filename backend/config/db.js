import { Sequelize } from "sequelize";
import { DB } from "./config.js";

const db = new Sequelize(DB.dbName, DB.dbUsername, DB.dbPassword, {
  host: 'localhost',
  dialect: 'mysql'
})

export default db