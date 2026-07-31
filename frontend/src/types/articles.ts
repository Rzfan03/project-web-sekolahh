export interface Article {
  id: number
  judul: string
  slug: string
  ringkasan: string
  deskripsi: string
  image: string
  status: 'published' | 'draft'
  create_at: string
  updated_at: string
}