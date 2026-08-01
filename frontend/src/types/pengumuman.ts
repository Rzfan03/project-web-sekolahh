export interface Pengumuman {
  id: number
  judul: string
  isi: string
  tanggal: string
  prioritas: string
  status: 'published' | 'draft'
  created_at: string
  updated_at: string
}
