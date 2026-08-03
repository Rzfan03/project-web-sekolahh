export const KATEGORI_ARTIKEL = ['Kegiatan', 'Prestasi', 'Pengumuman', 'Akademik', 'Informasi']

const KATEGORI_BADGE: Record<string, string> = {
  Kegiatan: 'bg-orange-50 text-orange-600',
  Prestasi: 'bg-amber-50 text-amber-700',
  Pengumuman: 'bg-sky-50 text-sky-700',
  Akademik: 'bg-emerald-50 text-emerald-700',
  Informasi: 'bg-violet-50 text-violet-700',
}

export const kategoriBadge = (kategori?: string | null) =>
  kategori && KATEGORI_BADGE[kategori] ? KATEGORI_BADGE[kategori] : 'bg-orange-50 text-orange-600'
