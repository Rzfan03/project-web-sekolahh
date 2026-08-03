import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiMapPin, FiMail, FiPhone } from 'react-icons/fi'
import { getProfil } from '../lib/supabase'
import { SCHOOL_LOGO } from '../lib/logo'

type ProfilSekolah = {
  id: number
  nama_sekolah: string
  alamat: string
  telepon: string
  email: string
  logo: string
}

const Footer = () => {
  const [profil, setProfil] = useState<ProfilSekolah | null>(null)

  useEffect(() => {
    getProfil().then((rows) => {
      if (rows && rows.length > 0) setProfil(rows[0])
    })
  }, [])

  const nama = profil?.nama_sekolah || 'SMKN 1 Sumbawa Besar'

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-500">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <img src={profil?.logo || SCHOOL_LOGO} alt={nama} className="h-12 w-12 object-contain" />
              <h3 className="text-lg font-bold leading-snug text-slate-900">{nama}</h3>
            </div>
            <p className="mt-4 text-sm leading-relaxed">
              Sekolah Menengah Kejuruan yang mencetak lulusan berprestasi, berakhlak mulia, siap kerja, siap wirausaha, dan siap melanjutkan studi.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-slate-900">Menu</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/" className="transition-colors hover:text-orange-500">Beranda</Link></li>
              <li><Link to="/profil" className="transition-colors hover:text-orange-500">Profil</Link></li>
              <li><Link to="/berita" className="transition-colors hover:text-orange-500">Berita</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-slate-900">Kontak</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <FiMapPin className="mt-0.5 flex-none text-orange-400" size={16} />
                <span>{profil?.alamat || 'Jl. Garuda, Sumbawa Besar, Nusa Tenggara Barat'}</span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="flex-none text-orange-400" size={16} />
                <span>{profil?.email || 'info@smkn1sumbawa.sch.id'}</span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="flex-none text-orange-400" size={16} />
                <span>{profil?.telepon || '(0371) 26100'}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-100">
        <div className="mx-auto max-w-6xl px-6 py-4 text-center text-xs">
          Copyright &copy; {new Date().getFullYear()} {nama}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer
