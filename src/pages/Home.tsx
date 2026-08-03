import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiCalendar, FiClock, FiMapPin, FiBookOpen, FiAward, FiUsers, FiTool, FiStar, FiThumbsUp, FiUser } from 'react-icons/fi'
import { FaChevronRight } from 'react-icons/fa'
import KompetensiKeahlian from "../components/KompetensiKeahlian"
import Reveal from "../components/Reveal"
import Photo from "../components/Photo"
import Hero from "../components/Hero"
import { getArticle, getGaleri, getPengumuman, getAgenda, getGuru, getSiswa, getProfil } from "../lib/supabase"
import { PLACEHOLDER_IMAGE } from "../lib/placeholder"
import { kategoriBadge } from "../lib/kategori"
import type { Article } from "../types/articles"
import type { Galeri } from "../types/galeri"
import type { Pengumuman } from "../types/pengumuman"
import type { Agenda } from "../types/agenda"
import type { Guru } from "../types/guru"

const SectionHeading = ({
  title,
  subtitle,
  action,
  center = false,
}: {
  title: string
  subtitle?: string
  action?: { label: string; to: string }
  center?: boolean
}) => (
  <Reveal>
    <div className={center ? 'mx-auto max-w-2xl text-center' : 'flex flex-wrap items-end justify-between gap-6'}>
      <div className={center ? '' : 'max-w-2xl'}>
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">{title}</h2>
        {subtitle && <p className="mt-3 leading-relaxed text-stone-600">{subtitle}</p>}
      </div>
      {!center && action && (
        <Link
          to={action.to}
          className="inline-flex flex-none items-center gap-2 rounded-lg bg-orange-400 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-500"
        >
          {action.label} <FaChevronRight className="size-3.5" />
        </Link>
      )}
    </div>
  </Reveal>
)

const KEUNGGULAN = [
  {
    icon: FiBookOpen,
    title: 'Kurikulum Merdeka + Industri',
    description: 'Perpaduan kurikulum nasional terbaru dengan praktik langsung yang selaras dengan kebutuhan dunia usaha dan industri.',
  },
  {
    icon: FiUsers,
    title: 'Guru Kompeten',
    description: 'Tenaga pendidik lulusan universitas terkemuka, bersertifikasi profesional, dan berpengalaman di bidangnya.',
  },
  {
    icon: FiTool,
    title: 'Fasilitas Praktik Lengkap',
    description: 'Laboratorium, dapur produksi, salon unit produksi, dan ruang praktik yang mendukung pembelajaran nyata.',
  },
  {
    icon: FiAward,
    title: 'Unit Produksi Sekolah',
    description: 'Siswa praktik langsung melayani pelanggan sungguhan di unit produksi, membangun pengalaman dan jiwa wirausaha.',
  },
  {
    icon: FiThumbsUp,
    title: 'Kemitraan Dunia Kerja',
    description: 'Kemitraan luas dengan hotel, restoran, industri, dan instansi untuk PKL serta penyaluran lulusan.',
  },
  {
    icon: FiStar,
    title: 'Berprestasi & Berkarakter',
    description: 'Pembiasaan kedisiplinan, karakter, dan budaya kerja yang melahirkan prestasi di tingkat daerah hingga nasional.',
  },
]

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

const Home = () => {
  const [berita, setBerita] = useState<Article[]>([])
  const [galeri, setGaleri] = useState<Galeri[]>([])
  const [pengumuman, setPengumuman] = useState<Pengumuman[]>([])
  const [agenda, setAgenda] = useState<Agenda[]>([])
  const [guru, setGuru] = useState<Guru[]>([])
  const [namaSekolah, setNamaSekolah] = useState('SMKN 1 Sumbawa Besar')

  useEffect(() => {
    Promise.all([getArticle(), getGaleri(), getPengumuman(), getAgenda(), getGuru(), getSiswa(), getProfil()]).then(
      ([a, g, p, ag, gr, , pr]) => {
        const published = (a as Article[]).filter((x) => x.status === 'published')
        setBerita(published
          .sort((x, y) => new Date(y.created_at).getTime() - new Date(x.created_at).getTime())
          .slice(0, 3))
        setGaleri((g as Galeri[]).slice(0, 6))
        setPengumuman((p as Pengumuman[])
          .filter((x) => x.status === 'published')
          .sort((x, y) => new Date(y.tanggal).getTime() - new Date(x.tanggal).getTime())
          .slice(0, 3))
        setAgenda((ag as Agenda[])
          .filter((x) => x.status === 'published')
          .sort((x, y) => new Date(x.tanggal).getTime() - new Date(y.tanggal).getTime())
          .slice(0, 3))
        setGuru((gr as Guru[]).slice(0, 8))
        const rows = pr as { nama_sekolah?: string }[]
        if (rows && rows.length > 0 && rows[0].nama_sekolah) setNamaSekolah(rows[0].nama_sekolah)
      }
    )
  }, [])

  const sambutanImage = galeri[0]?.image || PLACEHOLDER_IMAGE

  return (
    <main className="flex flex-col">
      <Hero slides={galeri.map((g) => g.image)} />

      <section className="border-b border-stone-200 bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <Reveal>
              <div className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
                <Photo
                  src={sambutanImage}
                  alt={`Kegiatan ${namaSekolah}`}
                  className="aspect-[4/5] h-full w-full object-cover"
                />
              </div>
            </Reveal>

            <Reveal>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
                Sambutan Kepala Sekolah
              </h2>
              <div className="mt-6 space-y-4 leading-relaxed text-stone-600">
                <p>
                  Selamat datang di website resmi <strong className="font-semibold text-stone-900">{namaSekolah}</strong>.
                  Website ini kami hadirkan sebagai media informasi, komunikasi, dan pelayanan bagi
                  peserta didik, orang tua, alumni, dunia usaha dan industri, serta masyarakat luas.
                </p>
                <p>
                  Kami berkomitmen menyelenggarakan pendidikan vokasi yang berkualitas untuk
                  membentuk lulusan yang kompeten, berkarakter, dan siap menghadapi tantangan dunia
                  kerja, melanjutkan pendidikan, maupun membangun usaha sendiri.
                </p>
                <p>
                  Semoga website ini memberikan informasi yang bermanfaat, mempererat kerja sama
                  dengan seluruh pemangku kepentingan, serta menjadi sarana untuk memperkenalkan
                  berbagai program dan prestasi sekolah.
                </p>
              </div>
              <div className="mt-8 border-l-4 border-orange-400 pl-4">
                <h3 className="font-display text-lg font-bold text-stone-900">Kepala Sekolah</h3>
                <p className="text-sm font-medium text-orange-600">{namaSekolah}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {guru.length > 0 && (
        <section className="bg-stone-50 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <SectionHeading
              title="Guru & Staf"
              subtitle="Guru dan staf sekolah terdiri dari tenaga profesional yang berpengalaman dan berkomitmen dalam mendukung pendidikan yang berkualitas."
              action={{ label: 'Lihat Semua', to: '/guru' }}
            />
            <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {guru.map((g, i) => (
                <Reveal key={g.id} delay={(i % 4) * 60}>
                  <Link to="/guru" className="group block overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                    <div className="aspect-[4/5] overflow-hidden bg-stone-100">
                      <Photo
                        src={g.foto}
                        alt={g.nama}
                        className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-display line-clamp-1 text-sm font-bold text-stone-900 group-hover:text-orange-600">
                        {g.nama}
                      </h3>
                      <p className="mt-0.5 line-clamp-1 text-xs font-medium text-stone-500">
                        {g.mata_pelajaran || 'Guru'}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            title="Informasi Sekolah"
            subtitle="Pengumuman, agenda, dan berita terbaru seputar kegiatan sekolah."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <Reveal>
              <div className="flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
                <h3 className="font-display text-xl font-extrabold text-stone-900">Pengumuman</h3>
                <div className="mt-5 flex-1 space-y-5">
                  {pengumuman.length === 0 && (
                    <p className="text-sm text-stone-500">Belum ada pengumuman.</p>
                  )}
                  {pengumuman.map((p) => (
                    <div key={p.id} className="border-b border-stone-100 pb-5 last:border-0 last:pb-0">
                      <Link to="/pengumuman" className="group">
                        <h4 className="font-display line-clamp-2 font-bold leading-snug text-stone-900 group-hover:text-orange-600">
                          {p.judul}
                        </h4>
                        <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-stone-400">
                          <FiCalendar size={12} /> {formatDate(p.tanggal)}
                        </p>
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-stone-600">{p.isi}</p>
                        <span className="mt-2 inline-block text-sm font-semibold text-orange-600">
                          Selengkapnya &raquo;
                        </span>
                      </Link>
                    </div>
                  ))}
                </div>
                <Link to="/pengumuman" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700">
                  &raquo; Lihat Semua Pengumuman
                </Link>
              </div>
            </Reveal>

            <Reveal>
              <div className="flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
                <h3 className="font-display text-xl font-extrabold text-stone-900">Agenda</h3>
                <div className="mt-5 flex-1 space-y-5">
                  {agenda.length === 0 && (
                    <p className="text-sm text-stone-500">Belum ada agenda.</p>
                  )}
                  {agenda.map((a) => {
                    const d = new Date(a.tanggal + 'T00:00:00')
                    return (
                      <div key={a.id} className="flex items-start gap-4 border-b border-stone-100 pb-5 last:border-0 last:pb-0">
                        <div className="flex w-12 flex-none flex-col items-center rounded-lg bg-orange-400 py-1.5 text-white">
                          <span className="font-display text-lg font-extrabold leading-none">{d.getDate()}</span>
                          <span className="text-[10px] font-medium uppercase">
                            {d.toLocaleDateString('id-ID', { month: 'short' })}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-display line-clamp-2 font-bold leading-snug text-stone-900 group-hover:text-orange-600">
                            {a.judul}
                          </h4>
                          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-stone-400">
                            {a.jam && (
                              <span className="inline-flex items-center gap-1"><FiClock size={12} /> {a.jam}</span>
                            )}
                            {a.lokasi && (
                              <span className="inline-flex items-center gap-1"><FiMapPin size={12} /> {a.lokasi}</span>
                            )}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <Link to="/agenda" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700">
                  &raquo; Lihat Semua Agenda
                </Link>
              </div>
            </Reveal>

            <Reveal>
              <div className="flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
                <h3 className="font-display text-xl font-extrabold text-stone-900">Berita</h3>
                <div className="mt-5 flex-1 space-y-5">
                  {berita.length === 0 && (
                    <p className="text-sm text-stone-500">Belum ada berita.</p>
                  )}
                  {berita.map((b) => (
                    <Link
                      key={b.id}
                      to={`/berita/${b.slug}`}
                      className="group flex items-start gap-4 border-b border-stone-100 pb-5 last:border-0 last:pb-0"
                    >
                      <div className="w-28 flex-none overflow-hidden rounded-lg bg-stone-100">
                        <img
                          src={b.image || PLACEHOLDER_IMAGE}
                          alt={b.judul}
                          loading="lazy"
                          onError={(e) => {
                            const img = e.currentTarget
                            if (img.dataset.fbk !== '1') {
                              img.dataset.fbk = '1'
                              img.src = PLACEHOLDER_IMAGE
                            }
                          }}
                          className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="min-w-0">
                        {b.kategori && (
                          <span className={`mb-1.5 inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${kategoriBadge(b.kategori)}`}>
                            {b.kategori}
                          </span>
                        )}
                        <h4 className="font-display line-clamp-2 text-sm font-bold leading-snug text-stone-900 group-hover:text-orange-600">
                          {b.judul}
                        </h4>
                        <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-stone-400">
                          <FiCalendar size={12} /> {formatDate(b.created_at)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link to="/berita" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700">
                  &raquo; Lihat Semua Berita
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-stone-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            center
            title="Keunggulan Kami"
            subtitle="Lingkungan belajar yang dirancang untuk membentuk lulusan siap kerja, berkarakter, dan berdaya saing."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {KEUNGGULAN.map(({ icon: Icon, title, description }, i) => (
              <Reveal key={title} delay={(i % 3) * 60}>
                <div className="flex h-full flex-col items-center rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-md">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-400 text-white">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="font-display mt-5 font-bold text-stone-900">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">{description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <KompetensiKeahlian />

      <section className="bg-stone-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            title="Foto & Video"
            subtitle="Dokumentasi kegiatan dan momen kebersamaan warga sekolah."
            action={{ label: 'Lihat Semua', to: '/galeri' }}
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {galeri.map((g, i) => (
              <Reveal key={g.id} delay={(i % 3) * 70}>
                <Link to="/galeri" className="group block overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                  <div className="aspect-[4/3] overflow-hidden bg-stone-100">
                    <Photo
                      src={g.image}
                      alt={g.judul}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display line-clamp-1 text-sm font-bold text-stone-900 group-hover:text-orange-600">
                      {g.judul}
                    </h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-8 rounded-3xl bg-orange-400 px-8 py-12 sm:px-12 lg:flex-row lg:items-center">
              <div className="max-w-xl">
                <h2 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  Ayo bergabung di {namaSekolah}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-orange-50 sm:text-base">
                  Wujudkan masa depanmu melalui pendidikan vokasi yang siap kerja. Pendaftaran PPDB
                  tahun ajaran 2026/2027 sudah dibuka.
                </p>
              </div>
              <Link
                to="/ppdb"
                className="inline-flex flex-none items-center gap-2 rounded-lg bg-white px-8 py-3.5 text-sm font-bold text-orange-600 shadow-sm transition-transform hover:-translate-y-0.5"
              >
                <FiUser className="size-4" /> Daftar Sekarang <FiArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}

export default Home
