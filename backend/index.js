import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

import authRoutes from './routes/authRoutes.js'
import publicRoutes from './routes/publicRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import auth from './middleware/auth.js'
import errorHandler from './middleware/errorHandler.js'

import './models/index.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')))

app.use('/api/auth', authRoutes)
app.use('/api', publicRoutes)
app.use('/api/admin', auth, adminRoutes)

app.use(errorHandler)

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`Backend berjalan di port ${PORT}`)
  })
}

export default app
