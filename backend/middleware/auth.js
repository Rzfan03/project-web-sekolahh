import jwt from 'jsonwebtoken'

const auth = (req, res, next) => {
  const h = req.headers.authorization
  if (!h || !h.startsWith('Bearer ')) return res.status(401).json({ message: 'Token tidak ditemukan' })
  try {
    req.admin = jwt.verify(h.split(' ')[1], process.env.JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ message: 'Token tidak valid' })
  }
}

export default auth
