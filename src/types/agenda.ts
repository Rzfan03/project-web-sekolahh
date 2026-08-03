export interface Agenda {
  id: number
  judul: string
  tanggal: string
  jam: string
  lokasi: string
  keterangan: string
  status: 'published' | 'draft'
  created_at: string
  updated_at: string
}
