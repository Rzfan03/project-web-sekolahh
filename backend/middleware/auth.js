import jwt from 'jsonwebtoken'
import { JWT } from '../config/config.js'

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Akses ditolak, token tidak ditemukan' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT.secret)
    req.admin = decoded
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token sudah expired, silakan login kembali' })
    }
    return res.status(401).json({ message: 'Token tidak valid' })
  }
}

export default auth
