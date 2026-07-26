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
    port: DB.port,
    dialect: DB.dialect,
    logging: false,
    dialectOptions: {
      ssl: DB.ssl ? { require: true, rejectUnauthorized: false } : false
    }
  })
}

export default db
