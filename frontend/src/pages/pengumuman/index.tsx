import { useEffect, useState } from 'react'
import { FiChevronDown, FiBell } from 'react-icons/fi'
import { getPengumuman } from '../../lib/supabase'
import { useSEO } from '../../hooks/useSEO'
import type { Pengumuman } from '../../types/pengumuman'

const formatDate = (date: string) =>
  new Date(date + (date.length === 10 ? 'T00:00:00' : '')).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

const prioritasColors: Record<string, string> = {
  tinggi: 'bg-red-50 text-red-700',
  sedang: 'bg-amber-50 text-amber-700',
  normal: 'bg-blue-50 text-blue-700',
}

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
    <main className="min-h-screen bg-white text-slate-800">
      <div className="mx-auto max-w-6xl px-6 pt-14">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Pengumuman</h1>
        <p className="mt-3 text-sm text-slate-500">Informasi resmi sekolah · {data.length} pengumuman</p>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        {loading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-md border border-slate-200 bg-white p-6">
                <div className="h-4 w-40 animate-pulse rounded bg-slate-100" />
                <div className="mt-3 h-5 w-2/3 animate-pulse rounded bg-slate-100" />
                <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <FiBell className="size-12 text-slate-300" />
            <p className="mt-4 text-sm text-slate-500">Belum ada pengumuman.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((p) => {
              const expanded = open === p.id
              return (
                <article key={p.id} className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
                  <button
                    onClick={() => setOpen(expanded ? null : p.id)}
                    aria-expanded={expanded}
                    className="flex w-full cursor-pointer items-start justify-between gap-4 p-6 text-left"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${prioritasColors[p.prioritas] || 'bg-gray-100 text-gray-600'}`}>
                          {p.prioritas}
                        </span>
                        <span className="text-xs font-medium text-slate-400">{formatDate(p.tanggal)}</span>
                      </div>
                      <h2 className="mt-2 text-lg font-bold leading-snug text-slate-900">{p.judul}</h2>
                    </div>
                    <FiChevronDown size={20} className={`mt-1 flex-none text-slate-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
                  </button>
                  {expanded && (
                    <div className="border-t border-slate-100 px-6 pb-6 pt-4">
                      <p className="whitespace-pre-line text-[15px] leading-relaxed text-slate-600">{p.isi}</p>
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
