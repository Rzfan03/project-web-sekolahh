import express from 'express'
import cors from 'cors'
import mysql from 'mysql2'
import adminRoutes from './routes/adminRoutes.js'


const app = express()
app.use(cors())
app.use(express.json())
app.use(adminRoutes)

app.listen(3000, () => {
  console.log('Backend Jalan di Port 3000')
})