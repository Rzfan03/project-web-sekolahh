import supabase from '../config/supabase.js'

export const getProfil = async (_, res, next) => {
  try {
    const { data } = await supabase.from('profil_sekolahs').select('*').limit(1).single()
    data ? res.json({ data }) : res.status(404).json({ message: 'Profil belum diatur' })
  } catch (e) { next(e) }
}

export const updateProfil = async (req, res, next) => {
  try {
    const { data: ex } = await supabase.from('profil_sekolahs').select('id').limit(1).single()
    const u = { ...req.body }
    if (req.file) u.logo = req.file.filename
    if (!ex) {
      const { data, error } = await supabase.from('profil_sekolahs').insert(u).select().single()
      return res.status(201).json({ message: 'Profil dibuat', data })
    }
    const { data, error } = await supabase.from('profil_sekolahs').update(u).eq('id', ex.id).select().single()
    if (error) throw error
    res.json({ message: 'Profil diupdate', data })
  } catch (e) { next(e) }
}
