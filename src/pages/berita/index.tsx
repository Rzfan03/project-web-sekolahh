import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiSearch, FiCalendar, FiClock, FiFileText, FiArrowRight } from 'react-icons/fi'
import { getArticle } from '../../lib/supabase'
import { PLACEHOLDER_IMAGE } from '../../lib/placeholder'
import { useSEO } from '../../hooks/useSEO'
import Reveal from '../../components/Reveal'
import type { Article } from '../../types/articles'

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

const readTime = (text: string) => Math.max(1, Math.round((text || '').split(/\s+/).filter(Boolean).length / 200))

const Berita = () => {
  const [data, setData] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')

  useSEO({ title: 'Berita - SMKN 1 Sumbawa Besar', description: 'Informasi dan kabar terbaru seputar kegiatan SMKN 1 Sumbawa Besar.' })

  useEffect(() => {
    getArticle().then((res) => {
      setData(
        (res as Article[])
          .filter((a) => a.status === 'published')
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      )
      setLoading(false)
    })
  }, [])

  const filtered = q.trim() ? data.filter((a) => a.judul.toLowerCase().includes(q.trim().toLowerCase())) : data
  const featured = !q.trim() && data[0]
  const rest = featured ? data.slice(1) : filtered

  const ArticleCard = ({ a }: { a: Article }) => (
    <Link
      to={`/berita/${a.slug}`}
      className="group flex flex-col overflow-hidden rounded-md border border-slate-200 dark:border-stone-700 bg-white dark:bg-stone-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-stone-800">
        <img
          src={a.image || PLACEHOLDER_IMAGE}
          alt={a.judul}
          loading="lazy"
          onError={(e) => { const img = e.currentTarget; if (img.dataset.fbk !== '1') { img.dataset.fbk = '1'; img.src = PLACEHOLDER_IMAGE } }}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3 text-xs font-medium text-slate-400 dark:text-stone-400">
          <span className="inline-flex items-center gap-1.5"><FiCalendar size={13} /> {formatDate(a.created_at)}</span>
          <span className="inline-flex items-center gap-1.5"><FiClock size={13} /> {readTime(a.deskripsi)} menit</span>
        </div>
        <h3 className="mt-2 line-clamp-2 text-lg font-bold leading-snug text-slate-900 dark:text-stone-100 transition-colors duration-200 group-hover:text-orange-500">{a.judul}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-stone-300 dark:text-stone-400">{a.ringkasan}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-500">
          Baca Selengkapnya <FiArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )

  return (
    <main className="min-h-screen bg-white dark:bg-stone-800 text-slate-800 dark:text-stone-100">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-stone-100">Berita</h1>
            <p className="mt-3 text-sm text-slate-500 dark:text-stone-300 dark:text-stone-400">
              {q.trim() ? `Hasil pencarian "${q}"` : 'Informasi terbaru seputar kegiatan sekolah'} · {filtered.length} berita
            </p>
          </div>
          <div className="relative sm:w-80">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-stone-400" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari berita..."
              aria-label="Cari berita"
              className="w-full rounded-md border border-slate-200 dark:border-stone-700 bg-white dark:bg-stone-800 py-2.5 pl-11 pr-4 text-sm outline-none transition-colors focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="overflow-hidden rounded-md border border-slate-200 dark:border-stone-700 bg-white dark:bg-stone-800">
                <div className="aspect-[16/10] animate-pulse bg-slate-100 dark:bg-stone-800" />
                <div className="space-y-3 p-5">
                  <div className="h-3 w-28 animate-pulse rounded bg-slate-100 dark:bg-stone-800" />
                  <div className="h-4 w-full animate-pulse rounded bg-slate-100 dark:bg-stone-800" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100 dark:bg-stone-800" />
                  <div className="h-3 w-full animate-pulse rounded bg-slate-100 dark:bg-stone-800" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <FiFileText className="size-12 text-slate-300" />
            <p className="mt-4 text-sm text-slate-500 dark:text-stone-300 dark:text-stone-400">
              {q.trim() ? 'Berita tidak ditemukan. Coba kata kunci lain.' : 'Belum ada berita.'}
            </p>
          </div>
        ) : (
          <>
            {featured && (
              <Reveal>
                <Link
                  to={`/berita/${featured.slug}`}
                  className="group mt-8 grid overflow-hidden rounded-md border border-slate-200 dark:border-stone-700 bg-white dark:bg-stone-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg md:grid-cols-2"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-stone-800 md:aspect-auto md:h-full">
                    <img
                      src={featured.image || PLACEHOLDER_IMAGE}
                      alt={featured.judul}
                      onError={(e) => { const img = e.currentTarget; if (img.dataset.fbk !== '1') { img.dataset.fbk = '1'; img.src = PLACEHOLDER_IMAGE } }}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-8">
                    <div className="mt-4 flex items-center gap-3 text-xs font-medium text-slate-400 dark:text-stone-400">
                      <span className="inline-flex items-center gap-1.5"><FiCalendar size={13} /> {formatDate(featured.created_at)}</span>
                      <span className="inline-flex items-center gap-1.5"><FiClock size={13} /> {readTime(featured.deskripsi)} menit</span>
                    </div>
                    <h2 className="mt-3 text-2xl font-bold leading-tight text-slate-900 dark:text-stone-100 transition-colors duration-200 group-hover:text-orange-500">{featured.judul}</h2>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-stone-300 dark:text-stone-400">{featured.ringkasan}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-500">
                      Baca Selengkapnya <FiArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            )}

            {rest.length > 0 && (
              <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((a, i) => (
                  <Reveal key={a.id} delay={(i % 3) * 70}>
                    <ArticleCard a={a} />
                  </Reveal>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}

export default Berita
