import dotenv from 'dotenv'
dotenv.config()

export const DB = {
  dialect: process.env.DB_DIALECT || 'sqlite',
  dbName: process.env.DB_NAME || 'db_sekolah',
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  host: process.env.DB_HOST || 'localhost',
  storage: process.env.DB_STORAGE || './database.sqlite'
}

export const JWT = {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN || '1d'
}
