export interface Jadwal {
  id: number
  hari: string
  jam_mulai: string
  jam_selesai: string
  mata_pelajaran: string
  guru_id: number | null
  kelas_id: number | null
  ruangan: string
  created_at: string
  updated_at: string
}
