import { useEffect, useState } from 'react'
import { FiCalendar, FiClock, FiMapPin } from 'react-icons/fi'
import { getAgenda } from '../../lib/supabase'
import { useSEO } from '../../hooks/useSEO'
import type { Agenda } from '../../types/agenda'

const formatLong = (d: string) =>
  new Date(d + (d.length === 10 ? 'T00:00:00' : '')).toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

const AgendaPage = () => {
  const [data, setData] = useState<Agenda[]>([])
  const [loading, setLoading] = useState(true)

  useSEO({ title: 'Agenda - SMKN 1 Sumbawa Besar', description: 'Agenda dan kalender kegiatan SMKN 1 Sumbawa Besar.' })

  useEffect(() => {
    getAgenda().then((res) => {
      setData(
        (res as Agenda[])
          .filter((a) => a.status === 'published')
          .sort((a, b) => a.tanggal.localeCompare(b.tanggal))
      )
      setLoading(false)
    })
  }, [])

  return (
    <main className="min-h-screen bg-white text-slate-800">
      <div className="mx-auto max-w-6xl px-6 pt-14">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Agenda Kegiatan</h1>
        <p className="mt-3 text-sm text-slate-500">Rangkaian kegiatan dan agenda resmi sekolah · {data.length} agenda</p>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        {loading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex gap-5 rounded-md border border-slate-200 bg-white p-6">
                <div className="h-16 w-16 flex-none animate-pulse rounded-lg bg-slate-100" />
                <div className="flex-1">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-slate-100" />
                  <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-slate-100" />
                  <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <FiCalendar className="size-12 text-slate-300" />
            <p className="mt-4 text-sm text-slate-500">Belum ada agenda.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((a) => {
              const d = new Date(a.tanggal + 'T00:00:00')
              return (
                <article key={a.id} className="flex items-start gap-5 rounded-md border border-slate-200 bg-white p-6 shadow-sm sm:items-center">
                  <div className="flex w-16 flex-none flex-col items-center rounded-lg bg-orange-400 py-2.5 text-white">
                    <span className="font-display text-2xl font-extrabold leading-none">{d.getDate()}</span>
                    <span className="mt-0.5 text-[11px] font-medium uppercase">
                      {d.toLocaleDateString('id-ID', { month: 'short' })}
                    </span>
                    <span className="text-[10px] opacity-80">{d.getFullYear()}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-lg font-bold leading-snug text-slate-900">{a.judul}</h2>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-1.5"><FiCalendar size={14} /> {formatLong(a.tanggal)}</span>
                      {a.jam && <span className="inline-flex items-center gap-1.5"><FiClock size={14} /> {a.jam}</span>}
                      {a.lokasi && <span className="inline-flex items-center gap-1.5"><FiMapPin size={14} /> {a.lokasi}</span>}
                    </div>
                    {a.keterangan && <p className="mt-2 text-sm leading-relaxed text-slate-600">{a.keterangan}</p>}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

export default AgendaPage
