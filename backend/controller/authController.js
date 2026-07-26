import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import supabase from '../config/supabase.js'

export const register = async (req, res, next) => {
  try {
    const { username, password } = req.body
    if (!username || !password) return res.status(400).json({ message: 'Username & password wajib' })
    const { data: ex } = await supabase.from('admins').select('id').eq('username', username).single()
    if (ex) return res.status(409).json({ message: 'Username sudah dipakai' })
    const hash = await bcrypt.hash(password, 10)
    const { data, error } = await supabase.from('admins').insert({ username, password: hash }).select('id,username,role').single()
    if (error) throw error
    res.status(201).json({ message: 'Register berhasil', data })
  } catch (e) { next(e) }
}

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body
    if (!username || !password) return res.status(400).json({ message: 'Username & password wajib' })
    const { data: admin } = await supabase.from('admins').select('*').eq('username', username).single()
    if (!admin || !(await bcrypt.compare(password, admin.password))) return res.status(401).json({ message: 'Username atau password salah' })
    const token = jwt.sign({ id: admin.id, username: admin.username, role: admin.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' })
    res.json({ message: 'Login berhasil', token, data: { id: admin.id, username: admin.username, role: admin.role } })
  } catch (e) { next(e) }
}

export const getMe = async (req, res) => {
  const { data } = await supabase.from('admins').select('id,username,role,created_at').eq('id', req.admin.id).single()
  res.json({ data })
}
