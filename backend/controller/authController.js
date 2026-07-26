import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import supabase from '../config/supabase.js'
import dotenv from 'dotenv'

dotenv.config()

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

    const { data: existing } = await supabase
      .from('admins')
      .select('id')
      .eq('username', username)
      .single()

    if (existing) {
      return res.status(409).json({ message: 'Username sudah digunakan' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const { data: admin, error } = await supabase
      .from('admins')
      .insert({ username, password: hashedPassword })
      .select('id, username, role')
      .single()

    if (error) throw error

    return res.status(201).json({
      message: 'Register berhasil',
      data: admin
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

    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('username', username)
      .single()

    if (error || !admin) {
      return res.status(401).json({ message: 'Username atau password salah' })
    }

    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Username atau password salah' })
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
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
    const { data: admin, error } = await supabase
      .from('admins')
      .select('id, username, role, created_at, updated_at')
      .eq('id', req.admin.id)
      .single()

    if (error || !admin) {
      return res.status(404).json({ message: 'Admin tidak ditemukan' })
    }

    return res.status(200).json({ data: admin })
  } catch (err) {
    next(err)
  }
}
