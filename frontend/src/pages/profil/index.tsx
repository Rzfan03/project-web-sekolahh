import { useEffect, useState } from 'react'
import { FiMapPin, FiMail, FiPhone, FiGlobe } from 'react-icons/fi'
import { getProfil } from '../../lib/supabase'
import SchoolLogo from '../../components/SchoolLogo'
import Reveal from '../../components/Reveal'
import { PLACEHOLDER_IMAGE } from '../../lib/placeholder'

const SAMBUTAN = [
  'Assalamualaikum Warahmatullahi Wabarakatuh.',
  'Selamat datang di website resmi SMKN 1 Sumbawa Besar. Website ini hadir sebagai media informasi, komunikasi, dan publikasi seluruh aktivitas sekolah kepada siswa, orang tua, alumni, dan masyarakat luas.',
  'Kami berkomitmen untuk terus meningkatkan kualitas pendidikan vokasi agar menghasilkan lulusan yang berprestasi, berakhlak mulia, dan siap menghadapi tantangan dunia kerja serta dunia industri.',
  'Mari kita bersama-sama membangun SMKN 1 Sumbawa Besar yang lebih baik. Terima kasih atas kunjungan dan dukungan Anda.',
  'Wassalamualaikum Warahmatullahi Wabarakatuh.',
]

type ProfilSekolah = {
  id: number
  nama_sekolah: string
  alamat: string
  telepon: string
  email: string
  website: string
  logo: string
  visi: string
  misi: string
}

const Profil = () => {
  const [profil, setProfil] = useState<ProfilSekolah | null>(null)

  useEffect(() => {
    getProfil().then((rows) => {
      if (rows && rows.length > 0) setProfil(rows[0])
    })
  }, [])

  const logo = profil?.logo || null
  const nama = profil?.nama_sekolah || 'SMKN 1 Sumbawa Besar'
  const misi = profil?.misi
    ? profil.misi.split('\n').map((s) => s.trim()).filter(Boolean)
    : ['Menyelenggarakan pendidikan vokasi yang unggul dan berkarakter.']

  const contacts = [
    { icon: <FiMapPin size={18} />, label: 'Alamat', value: profil?.alamat || 'Jl. Garuda, Sumbawa Besar, Nusa Tenggara Barat' },
    { icon: <FiMail size={18} />, label: 'Email', value: profil?.email || 'info@smkn1sumbawa.sch.id' },
    { icon: <FiPhone size={18} />, label: 'Telepon', value: profil?.telepon || '(0371) 26100' },
    { icon: <FiGlobe size={18} />, label: 'Website', value: profil?.website || 'smkn1sumbawa.sch.id' },
  ]

  const mapSrc = profil?.alamat
    ? `https://www.google.com/maps?q=${encodeURIComponent(profil.alamat)}&output=embed`
    : 'https://www.google.com/maps?q=Sumbawa%20Besar&output=embed'

  return (
    <main className="min-h-screen bg-white text-slate-800">
      <div className="mx-auto max-w-6xl px-6 pt-14">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Profil Sekolah</h1>
        <div className="mt-2 h-1 w-16 rounded-full bg-orange-400" />
      </div>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Reveal>
            <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-slate-900">Sambutan Kepala Sekolah</h2>
              <div className="mt-2 h-1 w-16 rounded-full bg-orange-400" />
              <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-slate-700">
                {SAMBUTAN.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>
            <div className="text-center">
              <div className="relative mx-auto w-fit">
                <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-orange-100 to-amber-50 blur-xl" aria-hidden="true" />
                <div className="relative mx-auto h-44 w-44 overflow-hidden rounded-full border-4 border-orange-400 bg-white p-2 shadow-lg">
                  <img src={PLACEHOLDER_IMAGE} alt="Kepala Sekolah" className="h-full w-full rounded-full object-cover" />
                </div>
              </div>
              <div className="mx-auto mt-6 h-px w-12 bg-orange-300" />
              <h3 className="mt-4 text-xl font-bold text-slate-900">Kepala Sekolah</h3>
              <p className="mt-1 text-sm font-semibold uppercase tracking-widest text-orange-500">{nama}</p>
            </div>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-16">
        <Reveal>
          <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-slate-900">Visi &amp; Misi</h2>
            <div className="mt-2 h-1 w-16 rounded-full bg-orange-400" />
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-orange-500">Visi</h3>
                <p className="rounded-md border-l-4 border-orange-400 bg-orange-50 p-6 text-lg font-medium leading-relaxed text-slate-700">
                  {profil?.visi || 'Terwujudnya SMK yang unggul dalam prestasi, berakhlak mulia, dan berwawasan lingkungan.'}
                </p>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-orange-500">Misi</h3>
                <ol className="space-y-3">
                  {misi.map((m, i) => (
                    <li key={i} className="flex items-start gap-3 leading-relaxed text-slate-700">
                      <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-orange-400 text-xs font-bold text-white">{i + 1}</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="mx-auto h-40 w-40 overflow-hidden rounded-full border-4 border-orange-400 bg-white p-3 shadow-lg">
              <SchoolLogo src={logo} alt={nama} className="h-full w-full object-contain" />
            </div>
            <h3 className="mt-5 text-xl font-bold leading-snug text-slate-900">{nama}</h3>
            <p className="mt-1 text-sm font-semibold uppercase tracking-widest text-orange-500">SMK Negeri</p>
          </div>
          </div>
        </Reveal>
      </div>

      <section className="border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Reveal>
            <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-slate-900">Kontak</h2>
              <div className="mt-2 h-1 w-16 rounded-full bg-orange-400" />
              <ul className="mt-6 space-y-4">
                {contacts.map((c, i) => (
                  <li key={i} className="flex items-start gap-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-orange-100 text-orange-500">{c.icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{c.label}</p>
                      <p className="mt-1 break-words text-sm font-medium text-slate-700">{c.value}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">Lokasi</h2>
              <div className="mt-2 h-1 w-16 rounded-full bg-orange-400" />
              <div className="mt-6 overflow-hidden rounded-md border border-slate-200 shadow-sm">
                <iframe
                  title="Lokasi Sekolah"
                  src={mapSrc}
                  className="h-72 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}

export default Profil
