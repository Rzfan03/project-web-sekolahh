import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiCalendar, FiBell, FiImage } from 'react-icons/fi'
import MarqueeModule from 'react-fast-marquee'
import KompetensiKeahlian from "../components/KompetensiKeahlian"
import Reveal from "../components/Reveal"
import Photo from "../components/Photo"
import { getArticle, getGaleri, getPengumuman } from "../lib/supabase"
import { PLACEHOLDER_IMAGE } from "../lib/placeholder"
import { kategoriBadge } from "../lib/kategori"
import { JURUSAN_LIST } from "../lib/jurusan"
import type { Article } from "../types/articles"
import type { Galeri } from "../types/galeri"
import type { Pengumuman } from "../types/pengumuman"

const Marquee = (MarqueeModule as unknown as { default?: typeof MarqueeModule }).default ?? MarqueeModule

const staffBubbles = [
  { name: 'Kepala Sekolah' },
  { name: 'Waka Kurikulum' },
  { name: 'Guru' },
]

const stats = [
  { value: `${JURUSAN_LIST.length}`, label: 'Kompetensi Keahlian' },
  { value: '100+', label: 'Tenaga Pendidik' },
  { value: '1500+', label: 'Siswa Aktif' },
]

const SectionHeader = ({ title }: { title: string }) => (
  <div className="text-center">
    <h2 className="text-3xl font-bold text-orange-500">{title}</h2>
    <div className="mx-auto mt-4 h-1 w-12 bg-orange-600" />
  </div>
)

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

const Home = () => {
  const [berita, setBerita] = useState<Article[]>([])
  const [galeri, setGaleri] = useState<Galeri[]>([])
  const [pengumuman, setPengumuman] = useState<Pengumuman[]>([])

  useEffect(() => {
    Promise.all([getArticle(), getGaleri(), getPengumuman()]).then(([a, g, p]) => {
      setBerita((a as Article[])
        .filter((x) => x.status === 'published')
        .sort((x, y) => new Date(y.created_at).getTime() - new Date(x.created_at).getTime())
        .slice(0, 3))
      setGaleri((g as Galeri[]).slice(0, 6))
      setPengumuman((p as Pengumuman[])
        .filter((x) => x.status === 'published')
        .sort((x, y) => new Date(y.tanggal).getTime() - new Date(x.tanggal).getTime())
        .slice(0, 3))
    })
  }, [])

  return (
    <main className="flex flex-col">
      <section className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-b from-orange-50 via-white to-white">
        <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-orange-100 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-32 -right-24 size-80 rounded-full bg-amber-100 blur-3xl" aria-hidden="true" />

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              SMKN 1 <span className="text-orange-500">Sumbawa Besar</span>
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-slate-600">
              Sekolah Menengah Kejuruan Negeri unggulan di Kabupaten Sumbawa yang mencetak lulusan siap kerja melalui
              praktik industri, pembinaan karakter, dan 7 kompetensi keahlian sesuai kebutuhan dunia usaha.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/ppdb"
                className="inline-flex items-center gap-2 rounded-md bg-orange-400 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-orange-200 transition-all hover:-translate-y-0.5 hover:bg-orange-500 hover:shadow-lg"
              >
                Pendaftaran PPDB 2026
              </Link>
              <Link
                to="/profil"
                className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-orange-300 hover:text-orange-500"
              >
                Profil Sekolah
              </Link>
            </div>

            <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-slate-100 pt-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <dd className="text-2xl font-extrabold text-orange-500 sm:text-3xl">{s.value}</dd>
                  <dt className="mt-1 text-xs font-medium text-slate-500">{s.label}</dt>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute inset-0 -rotate-3 rounded-[2rem] bg-gradient-to-br from-orange-400 to-amber-300" aria-hidden="true" />
            <img
              src={PLACEHOLDER_IMAGE}
              alt="Kepala Sekolah SMKN 1 Sumbawa Besar"
              className="relative aspect-[4/5] w-full rounded-[2rem] border-4 border-white object-cover shadow-2xl shadow-orange-200"
            />
            <div className="absolute -bottom-5 left-1/2 w-max -translate-x-1/2 rounded-md bg-white px-5 py-2.5 text-center shadow-lg shadow-slate-900/10">
              <p className="text-sm font-bold text-slate-900">Kepala Sekolah</p>
              <p className="text-xs font-semibold text-orange-500">SMKN 1 Sumbawa Besar</p>
            </div>

            <div className="animate-float absolute -top-6 -right-5 rounded-lg bg-white p-1.5 shadow-lg shadow-slate-900/10">
              <img src={PLACEHOLDER_IMAGE} alt={staffBubbles[0].name} className="size-16 rounded-md object-cover sm:size-20" />
              <p className="mt-1 text-center text-[10px] font-bold text-slate-700">{staffBubbles[0].name}</p>
            </div>
            <div className="animate-float-delay absolute -bottom-10 -left-8 rounded-lg bg-white p-1.5 shadow-lg shadow-slate-900/10">
              <img src={PLACEHOLDER_IMAGE} alt={staffBubbles[1].name} className="size-14 rounded-md object-cover sm:size-16" />
              <p className="mt-1 text-center text-[10px] font-bold text-slate-700">{staffBubbles[1].name}</p>
            </div>
            <div className="animate-float-delay-2 absolute -left-10 top-1/2 hidden -translate-y-1/2 rounded-lg bg-white p-1.5 shadow-lg shadow-slate-900/10 md:block">
              <img src={PLACEHOLDER_IMAGE} alt={staffBubbles[2].name} className="size-12 rounded-md object-cover sm:size-14" />
              <p className="mt-1 text-center text-[10px] font-bold text-slate-700">{staffBubbles[2].name}</p>
            </div>
          </div>
        </div>
      </section>

      <Marquee className="bg-orange-400 py-2.5">
        <p className="text-sm font-semibold uppercase tracking-wider text-white sm:text-lg">PENDAFTARAN SMKN 1 SUMBAWA 2026 SUDAH DIBUKA!</p>
      </Marquee>

      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHeader title="Berita Terbaru" />
          </Reveal>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {berita.map((a, i) => (
              <Reveal key={a.id} delay={i * 70}>
                <Link
                  to={`/berita/${a.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={a.image || PLACEHOLDER_IMAGE}
                      alt={a.judul}
                      loading="lazy"
                      onError={(e) => { const img = e.currentTarget; if (img.dataset.fbk !== '1') { img.dataset.fbk = '1'; img.src = PLACEHOLDER_IMAGE } }}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    {a.kategori && (
                      <span className={`mb-3 inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium ${kategoriBadge(a.kategori)}`}>{a.kategori}</span>
                    )}
                    <h3 className="line-clamp-2 text-lg font-bold leading-snug text-slate-900 transition-colors duration-200 group-hover:text-orange-500">{a.judul}</h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">{a.ringkasan}</p>
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
                        <FiCalendar size={13} /> {formatDate(a.created_at)}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-orange-500">
                        Baca <FiArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-10 text-center">
              <Link to="/berita" className="inline-flex items-center gap-2 rounded-md border border-orange-300 px-6 py-2.5 text-sm font-semibold text-orange-500 transition-colors hover:bg-orange-50">
                Lihat Semua Berita <FiArrowRight size={15} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <KompetensiKeahlian />

      <section className="bg-orange-50/50 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHeader title="Galeri Kegiatan" />
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {galeri.map((g, i) => (
              <Reveal key={g.id} delay={(i % 3) * 70}>
                <Link to="/galeri" className="group relative block aspect-[4/3] overflow-hidden rounded-md shadow-sm">
                  <Photo src={g.image} alt={g.judul} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-slate-950/70 to-transparent p-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <span className="text-sm font-semibold text-white">{g.judul}</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-10 text-center">
              <Link to="/galeri" className="inline-flex items-center gap-2 rounded-md border border-orange-300 px-6 py-2.5 text-sm font-semibold text-orange-500 transition-colors hover:bg-orange-50">
                Lihat Semua Galeri <FiArrowRight size={15} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHeader title="Pengumuman" />
          </Reveal>
          <div className="mx-auto mt-12 max-w-6xl space-y-4">
            {pengumuman.map((p, i) => (
              <Reveal key={p.id} delay={i * 70}>
                <Link to="/pengumuman" className="flex items-start gap-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md">
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-md bg-orange-100 text-orange-500">
                    <FiBell size={20} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="line-clamp-1 font-bold text-slate-900 transition-colors hover:text-orange-500">{p.judul}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-600">{p.isi}</p>
                    <p className="mt-2 text-xs font-medium text-slate-400">{formatDate(p.tanggal)}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-10 text-center">
              <Link to="/pengumuman" className="inline-flex items-center gap-2 rounded-md border border-orange-300 px-6 py-2.5 text-sm font-semibold text-orange-500 transition-colors hover:bg-orange-50">
                Lihat Semua Pengumuman <FiArrowRight size={15} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] px-8 py-16 text-center text-white shadow-xl shadow-orange-200 sm:px-16">
              <img
                src={PLACEHOLDER_IMAGE}
                alt="Siswa SMKN 1 Sumbawa Besar"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/90 to-amber-500/90" aria-hidden="true" />
              <div className="relative">
                <FiImage className="mx-auto size-10 text-white/80" />
                <h2 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">Ayo Bergabung di SMKN 1 Sumbawa Besar!</h2>
                <p className="mx-auto mt-3 max-w-xl text-sm text-orange-50 sm:text-base">
                  Wujudkan masa depanmu melalui pendidikan vokasi yang siap kerja. Pendaftaran PPDB tahun ajaran 2026 sudah dibuka.
                </p>
                <Link
                  to="/ppdb"
                  className="mt-8 inline-flex items-center gap-2 rounded-md bg-white px-8 py-3 text-sm font-bold text-orange-500 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Daftar Sekarang <FiArrowRight size={16} />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}

export default Home
