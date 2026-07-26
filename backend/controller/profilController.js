import supabase from '../config/supabase.js'

export const getProfil = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('profil_sekolahs')
      .select('*')
      .limit(1)
      .single()

    if (error || !data) {
      return res.status(404).json({ message: 'Profil sekolah belum diatur' })
    }

    return res.status(200).json({ data })
  } catch (err) {
    next(err)
  }
}

export const updateProfil = async (req, res, next) => {
  try {
    const { data: existing } = await supabase
      .from('profil_sekolahs')
      .select('id')
      .limit(1)
      .single()

    const updateData = { ...req.body }
    if (req.file) updateData.logo = req.file.filename

    if (!existing) {
      const { data, error } = await supabase
        .from('profil_sekolahs')
        .insert(updateData)
        .select()
        .single()

      if (error) throw error
      return res.status(201).json({ message: 'Profil sekolah berhasil dibuat', data })
    }

    const { data, error } = await supabase
      .from('profil_sekolahs')
      .update(updateData)
      .eq('id', existing.id)
      .select()
      .single()

    if (error) throw error
    return res.status(200).json({ message: 'Profil sekolah berhasil diupdate', data })
  } catch (err) {
    next(err)
  }
}
