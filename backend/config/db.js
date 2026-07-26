import { Sequelize } from "sequelize";
import { DB } from "./config.js";

let db;

if (DB.dialect === 'sqlite') {
  db = new Sequelize({
    dialect: 'sqlite',
    storage: DB.storage,
    logging: false
  })
} else {
  db = new Sequelize(DB.dbName, DB.dbUsername, DB.dbPassword, {
    host: DB.host,
    dialect: DB.dialect,
    logging: false
  })
}

export default db
