import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'

import authRoutes from './routes/authRoutes.js'
import publicRoutes from './routes/publicRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import auth from './middleware/auth.js'
import errorHandler from './middleware/errorHandler.js'

dotenv.config()

const app = express()

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (_, res) => res.json({ status: 'ok' }))

app.use('/api/auth', authRoutes)
app.use('/api', publicRoutes)
app.use('/api/admin', auth, adminRoutes)

app.use(errorHandler)

if (!process.env.VERCEL) app.listen(process.env.PORT || 3000, () => console.log('Running on port ' + (process.env.PORT || 3000)))

export default app
