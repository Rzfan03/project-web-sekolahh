import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { Admin } from '../models/index.js'
import { JWT } from '../config/config.js'

export const register = async (req, res, next) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password wajib diisi' })
    }

    if (username.length < 3) {
      return res.status(400).json({ message: 'Username minimal 3 karakter' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password minimal 6 karakter' })
    }

    const existingAdmin = await Admin.findOne({ where: { username } })
    if (existingAdmin) {
      return res.status(409).json({ message: 'Username sudah digunakan' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const admin = await Admin.create({
      username,
      password: hashedPassword
    })

    return res.status(201).json({
      message: 'Register berhasil',
      data: { id: admin.id, username: admin.username, role: admin.role }
    })
  } catch (err) {
    next(err)
  }
}

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password wajib diisi' })
    }

    const admin = await Admin.findOne({ where: { username } })
    if (!admin) {
      return res.status(401).json({ message: 'Username atau password salah' })
    }

    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Username atau password salah' })
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      JWT.secret,
      { expiresIn: JWT.expiresIn }
    )

    return res.status(200).json({
      message: 'Login berhasil',
      token,
      data: { id: admin.id, username: admin.username, role: admin.role }
    })
  } catch (err) {
    next(err)
  }
}

export const getMe = async (req, res, next) => {
  try {
    const admin = await Admin.findByPk(req.admin.id, {
      attributes: { exclude: ['password'] }
    })

    if (!admin) {
      return res.status(404).json({ message: 'Admin tidak ditemukan' })
    }

    return res.status(200).json({ data: admin })
  } catch (err) {
    next(err)
  }
}
