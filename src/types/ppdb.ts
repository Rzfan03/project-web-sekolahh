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
  created_at: string
  updated_at: string
}
