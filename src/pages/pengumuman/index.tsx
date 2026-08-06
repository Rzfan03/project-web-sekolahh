import { useEffect, useState } from 'react'
import { FiChevronDown, FiBell } from 'react-icons/fi'
import { getPengumuman } from '../../lib/supabase'
import { useSEO } from '../../hooks/useSEO'
import type { Pengumuman } from '../../types/pengumuman'

const formatDate = (date: string) =>
  new Date(date + (date.length === 10 ? 'T00:00:00' : '')).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

const PengumumanPage = () => {
  const [data, setData] = useState<Pengumuman[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState<number | null>(null)

  useSEO({ title: 'Pengumuman - SMKN 1 Sumbawa Besar', description: 'Informasi resmi dan pengumuman SMKN 1 Sumbawa Besar.' })

  useEffect(() => {
    getPengumuman().then((res) => {
      setData(
        (res as Pengumuman[])
          .filter((p) => p.status === 'published')
          .sort((a, b) => (b.tanggal || '').localeCompare(a.tanggal || ''))
      )
      setLoading(false)
    })
  }, [])

  return (
    <main className="min-h-screen bg-white dark:bg-stone-800 text-slate-800 dark:text-stone-100">
      <div className="mx-auto max-w-6xl px-6 pt-14">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-stone-100">Pengumuman</h1>
        <p className="mt-3 text-sm text-slate-500 dark:text-stone-300 dark:text-stone-400">Informasi resmi sekolah · {data.length} pengumuman</p>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        {loading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-md border border-slate-200 dark:border-stone-700 bg-white dark:bg-stone-800 p-6">
                <div className="h-4 w-40 animate-pulse rounded bg-slate-100 dark:bg-stone-800" />
                <div className="mt-3 h-5 w-2/3 animate-pulse rounded bg-slate-100 dark:bg-stone-800" />
                <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-100 dark:bg-stone-800" />
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <FiBell className="size-12 text-slate-300" />
            <p className="mt-4 text-sm text-slate-500 dark:text-stone-300 dark:text-stone-400">Belum ada pengumuman.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((p) => {
              const expanded = open === p.id
              return (
                <article key={p.id} className="overflow-hidden rounded-md border border-slate-200 dark:border-stone-700 bg-white dark:bg-stone-800 shadow-sm">
                  <button
                    onClick={() => setOpen(expanded ? null : p.id)}
                    aria-expanded={expanded}
                    className="flex w-full cursor-pointer items-start justify-between gap-4 p-6 text-left"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-medium text-slate-400 dark:text-stone-400">{formatDate(p.tanggal)}</span>
                      </div>
                      <h2 className="mt-2 text-lg font-bold leading-snug text-slate-900 dark:text-stone-100">{p.judul}</h2>
                    </div>
                    <FiChevronDown size={20} className={`mt-1 flex-none text-slate-400 dark:text-stone-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
                  </button>
                  {expanded && (
                    <div className="border-t border-slate-100 dark:border-stone-700 px-6 pb-6 pt-4">
                      <p className="whitespace-pre-line text-[15px] leading-relaxed text-slate-600 dark:text-stone-300 dark:text-stone-400">{p.isi}</p>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

export default PengumumanPage
