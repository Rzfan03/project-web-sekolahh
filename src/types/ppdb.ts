export interface PPDB {
  id: number
  nama_lengkap: string
  nisn: string
  tempat_lahir: string
  tanggal_lahir: string
  asal_sekolah: string
  jenis_kelamin: string
  alamat: string
  jurusan: string
  nama_orang_tua: string
  telepon: string
  status: 'pending' | 'diterima' | 'ditolak'
  berkas?: string | null
  created_at: string
  updated_at: string
}

export interface BerkasItem {
  nama: string
  tipe: string
  data: string
}

export type BerkasMap = Record<string, BerkasItem>

export const parseBerkas = (raw?: string | null): BerkasMap => {
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw)
    return typeof parsed === 'object' && parsed !== null ? (parsed as BerkasMap) : {}
  } catch {
    return {}
  }
}

export const BERKAS_LABEL: Record<string, string> = {
  pas_foto: 'Pas Foto',
  kartu_keluarga: 'Kartu Keluarga',
  akta_lahir: 'Akta Kelahiran',
  skl: 'SKL / Ijazah',
  kip: 'KIP / KKS',
}

export const BERKAS_FIELDS = [
  { key: 'pas_foto', label: 'Pas Foto', wajib: true },
  { key: 'kartu_keluarga', label: 'Kartu Keluarga', wajib: true },
  { key: 'akta_lahir', label: 'Akta Kelahiran', wajib: true },
  { key: 'skl', label: 'SKL / Ijazah', wajib: true },
  { key: 'kip', label: 'KIP / KKS (opsional)', wajib: false },
] as const

