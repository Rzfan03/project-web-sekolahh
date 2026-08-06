import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiCalendar, FiClock, FiMapPin, FiChevronRight, FiFolder } from 'react-icons/fi'
import { getAgenda, getArticle } from '../../lib/supabase'
import { useSEO } from '../../hooks/useSEO'
import type { Agenda } from '../../types/agenda'
import type { Article } from '../../types/articles'

const formatLong = (d: string) =>
  new Date(d + (d.length === 10 ? 'T00:00:00' : '')).toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

const formatShort = (iso: string) =>
  new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

const AgendaPage = () => {
  const [data, setData] = useState<Agenda[]>([])
  const [berita, setBerita] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useSEO({ title: 'Agenda - SMKN 1 Sumbawa Besar', description: 'Agenda dan kalender kegiatan SMKN 1 Sumbawa Besar.' })

  useEffect(() => {
    Promise.all([getAgenda(), getArticle()]).then(([ag, ar]) => {
      setData(
        (ag as Agenda[])
          .filter((a) => a.status === 'published')
          .sort((a, b) => a.tanggal.localeCompare(b.tanggal))
      )
      setBerita(
        (ar as Article[])
          .filter((a) => a.status === 'published')
          .sort((a, b) => b.created_at.localeCompare(a.created_at))
          .slice(0, 4)
      )
      setLoading(false)
    })
  }, [])

  return (
    <main className="min-h-screen bg-white dark:bg-stone-800 text-slate-800 dark:text-stone-100">
      <div className="mx-auto max-w-6xl px-6 pt-12 sm:pt-16">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 dark:text-stone-400">
          <Link to="/" className="transition-colors hover:text-orange-600">Beranda</Link>
          <FiChevronRight className="size-3" />
          <span className="text-orange-600">Agenda</span>
        </div>
        <h1 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 sm:text-4xl">
          Arsip Agenda
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-500 dark:text-stone-300 dark:text-stone-400">
          Rangkaian kegiatan dan agenda resmi {new Date().getFullYear()} SMKN 1 Sumbawa Besar.
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-16 pt-8 sm:pt-10">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {loading ? (
              <div className="space-y-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex gap-5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 p-6">
                    <div className="h-20 w-16 flex-none animate-pulse rounded-xl bg-stone-100 dark:bg-stone-800" />
                    <div className="flex-1">
                      <div className="h-5 w-2/3 animate-pulse rounded bg-stone-100 dark:bg-stone-800" />
                      <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-stone-100 dark:bg-stone-800" />
                      <div className="mt-3 h-4 w-full animate-pulse rounded bg-stone-100 dark:bg-stone-800" />
                    </div>
                  </div>
                ))}
              </div>
            ) : data.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-200 dark:border-stone-700 py-24 text-center">
                <FiCalendar className="size-12 text-stone-300" />
                <p className="mt-4 text-sm text-stone-500 dark:text-stone-300 dark:text-stone-400">Belum ada agenda.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.map((a) => {
                  const d = new Date(a.tanggal + 'T00:00:00')
                  return (
                    <article
                      key={a.id}
                      className="flex items-start gap-5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 p-6 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="flex w-16 flex-none flex-col items-center rounded-xl bg-orange-400 py-3 text-white">
                        <span className="font-display text-2xl font-extrabold leading-none">{d.getDate()}</span>
                        <span className="mt-1 text-[11px] font-medium uppercase">
                          {d.toLocaleDateString('id-ID', { month: 'short' })}
                        </span>
                        <span className="text-[10px] opacity-80">{d.getFullYear()}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="font-display text-lg font-extrabold leading-snug text-stone-900 dark:text-stone-100">{a.judul}</h2>
                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-stone-500 dark:text-stone-300 dark:text-stone-400">
                          <span className="inline-flex items-center gap-1.5"><FiCalendar size={14} /> {formatLong(a.tanggal)}</span>
                          {a.jam && <span className="inline-flex items-center gap-1.5"><FiClock size={14} /> {a.jam}</span>}
                          {a.lokasi && <span className="inline-flex items-center gap-1.5"><FiMapPin size={14} /> {a.lokasi}</span>}
                        </div>
                        {a.keterangan && (
                          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-stone-600 dark:text-stone-300 dark:text-stone-400">{a.keterangan}</p>
                        )}
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-500/15 text-orange-500">
                  <FiFolder className="size-5" />
                </span>
                <h2 className="font-display text-lg font-extrabold text-stone-900 dark:text-stone-100">Rilis Berita</h2>
              </div>
              <div className="mt-5 divide-y divide-stone-100">
                {berita.map((b) => (
                  <Link key={b.id} to={`/berita/${b.slug}`} className="group block py-3 first:pt-0 last:pb-0">
                    <p className="line-clamp-2 text-sm font-semibold leading-snug text-stone-700 dark:text-stone-200 transition-colors group-hover:text-orange-600">
                      {b.judul}
                    </p>
                    <p className="mt-1 text-xs text-stone-400 dark:text-stone-400">{formatShort(b.created_at)}</p>
                  </Link>
                ))}
                {berita.length === 0 && (
                  <p className="py-4 text-sm text-stone-400 dark:text-stone-400">Belum ada berita.</p>
                )}
              </div>
              <Link
                to="/berita"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 transition-colors hover:text-orange-700"
              >
                Lihat semua berita <FiChevronRight className="size-4" />
              </Link>
            </section>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default AgendaPage
