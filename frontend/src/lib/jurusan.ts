import type { ComponentType } from 'react'
import {
  FaHotel,
  FaUtensils,
  FaMapMarkedAlt,
  FaCut,
  FaTshirt,
  FaCode,
  FaNetworkWired,
} from 'react-icons/fa'

export type Jurusan = {
  slug: string
  nama: string
  singkatan: string
  icon: ComponentType<{ className?: string }>
  deskripsi: string
  kompetensi: string[]
}

export const JURUSAN_LIST: Jurusan[] = [
  {
    slug: 'perhotelan',
    nama: 'Perhotelan',
    singkatan: 'PH',
    icon: FaHotel,
    deskripsi:
      'Program keahlian yang mempelajari ilmu perhotelan, mulai dari perencanaan, produksi, hingga pengelolaan jasa penginapan (akomodasi) serta food and beverage.',
    kompetensi: ['Front office & layanan kamar', 'Housekeeping', 'Food and beverage service', 'Pengelolaan akomodasi hotel'],
  },
  {
    slug: 'kuliner',
    nama: 'Kuliner',
    singkatan: 'KUL',
    icon: FaUtensils,
    deskripsi:
      'Siswa dibekali keterampilan pengolahan dan penyajian makanan, manajemen dapur, hingga praktik langsung di unit produksi kuliner sekolah.',
    kompetensi: ['Pengolahan makanan khas & internasional', 'Pembuatan roti dan pastry', 'Manajemen dapur (kitchen)', 'Penyajian dan dekorasi makanan'],
  },
  {
    slug: 'usaha-layanan-wisata',
    nama: 'Usaha Layanan Wisata',
    singkatan: 'ULW',
    icon: FaMapMarkedAlt,
    deskripsi:
      'Membekali siswa dengan kemampuan pemesanan dan tarif perjalanan, perencanaan tur, pemanduan wisata, hingga pengelolaan acara (MICE) di industri pariwisata.',
    kompetensi: ['Pemesanan dan tarif perjalanan', 'Perencanaan dan pemanduan tur', 'Penanganan MICE', 'Layanan informasi pariwisata'],
  },
  {
    slug: 'tata-kecantikan',
    nama: 'Tata Kecantikan Kulit & Rambut',
    singkatan: 'TKKR',
    icon: FaCut,
    deskripsi:
      'Membekali siswa pengetahuan, keterampilan, dan sikap agar kompeten di bidang kecantikan kulit dan rambut, termasuk praktik langsung di salon unit produksi sekolah.',
    kompetensi: ['Perawatan kulit wajah dan badan', 'Rias wajah & penataan rambut', 'Pencabutan dan penataan alis', 'Manajemen salon kecantikan'],
  },
  {
    slug: 'desain-produksi-busana',
    nama: 'Desain Produksi Busana',
    singkatan: 'DPB',
    icon: FaTshirt,
    deskripsi:
      'Siswa mempelajari desain, pola, dan teknik menjahit, mulai dari rancangan busana hingga proses produksi pakaian siap pakai.',
    kompetensi: ['Desain dan ilustrasi busana', 'Pembuatan pola dan menjahit', 'Teknologi produksi busana', 'Merancang busana siap pakai'],
  },
  {
    slug: 'rekayasa-perangkat-lunak',
    nama: 'Rekayasa Perangkat Lunak',
    singkatan: 'RPL',
    icon: FaCode,
    deskripsi:
      'Program keahlian yang membekali siswa dasar pemrograman dan pengembangan aplikasi untuk menyiapkan lulusan yang siap kerja di bidang perangkat lunak.',
    kompetensi: ['Pemrograman dasar hingga lanjutan', 'Pengembangan aplikasi web & mobile', 'Basis data dan perancangan sistem', 'Pengujian dan pemeliharaan aplikasi'],
  },
  {
    slug: 'teknik-komputer-jaringan',
    nama: 'Teknik Komputer & Jaringan',
    singkatan: 'TKJ',
    icon: FaNetworkWired,
    deskripsi:
      'Siswa dilatih instalasi, administrasi, dan troubleshooting jaringan komputer, mulai dari jaringan dasar hingga teknologi jaringan berbasis luas (WAN).',
    kompetensi: ['Perakitan dan perawatan komputer', 'Instalasi sistem operasi', 'Administrasi jaringan LAN & WAN', 'Troubleshooting dan keamanan jaringan'],
  },
]
