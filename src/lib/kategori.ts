export const KATEGORI_ARTIKEL = ['Kegiatan', 'Prestasi', 'Pengumuman', 'Akademik', 'Informasi']

const KATEGORI_BADGE: Record<string, string> = {
  Kegiatan: 'bg-orange-50 text-orange-700',
  Prestasi: 'bg-orange-50 text-orange-700',
  Pengumuman: 'bg-orange-50 text-orange-700',
  Akademik: 'bg-orange-50 text-orange-700',
  Informasi: 'bg-orange-50 text-orange-700',
}

export const kategoriBadge = (kategori?: string | null) =>
  kategori && KATEGORI_BADGE[kategori] ? KATEGORI_BADGE[kategori] : 'bg-orange-50 text-orange-700'
