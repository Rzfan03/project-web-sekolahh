import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY

// supabase config
const client = createClient(SUPABASE_URL, SUPABASE_KEY)

// GET
export const getArticle = async () => {
  const { data, error } = await client.from('articles').select()
  if(error) {
    alert('failed to get data from database!')
  } else {
    return data
  }
}

export const getGaleri = async () => {
  const { data, error } = await client.from('galeris').select()
  if(error) {
    alert('failed to get data from database!')
  } else {
    return data
  }
}

export const getGuru = async () => {
  const { data, error } = await client.from('gurus').select()
  if(error) {
    alert('failed to get data from database!')
  } else {
    return data
  }
}

export const getJadwal = async () => {
  const { data, error } = await client.from('jadwals').select()
  if(error) {
    alert('failed to get data from database!')
  } else {
    return data
  }
}

export const getKelas = async () => {
  const { data, error } = await client.from('kelas').select()
  if(error) {
    alert('failed to get data from database!')
  } else {
    return data
  }
}

export const getPengumuman = async () => {
  const { data, error } = await client.from('pengumumans').select()
  if(error) {
    alert('failed to get data from database!')
  } else {
    return data
  }
}

export const getPpdb = async () => {
  const { data, error } = await client.from('ppdbs').select()
  if(error) {
    alert('failed to get data from database!')
  } else {
    return data
  }
}

export const getProfil = async () => {
  const { data, error } = await client.from('profil_sekolah').select()
  if(error) {
    alert('failed to get data from database!')
  } else {
    return data
  }
}

export const getSiswa = async () => {
  const { data, error } = await client.from('siswas').select()
  if(error) {
    alert('failed to get data from database!')
  } else {
    return data
  }
}