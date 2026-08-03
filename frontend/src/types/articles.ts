export interface Article {
  id: number
  judul: string
  slug: string
  kategori: string | null
  ringkasan: string
  deskripsi: string
  image: string
  status: 'published' | 'draft'
  created_at: string
  updated_at: string
}