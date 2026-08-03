import { useEffect, useState } from 'react'
import { FiImage, FiX, FiChevronLeft, FiChevronRight, FiCalendar } from 'react-icons/fi'
import { getGaleri } from '../../lib/supabase'
import { useSEO } from '../../hooks/useSEO'
import Photo from '../../components/Photo'
import Reveal from '../../components/Reveal'
import type { Galeri } from '../../types/galeri'

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

const GaleriPage = () => {
  const [data, setData] = useState<Galeri[]>([])
  const [loading, setLoading] = useState(true)
  const [kategori, setKategori] = useState('Semua')
  const [active, setActive] = useState<number | null>(null)

  useSEO({ title: 'Galeri - SMKN 1 Sumbawa Besar', description: 'Dokumentasi kegiatan SMKN 1 Sumbawa Besar.' })

  useEffect(() => {
    getGaleri().then((res) => {
      setData(res as Galeri[])
      setLoading(false)
    })
  }, [])

  const kategoriList = ['Semua', ...Array.from(new Set(data.map((g) => g.kategori).filter(Boolean)))]
  const filtered = kategori === 'Semua' ? data : data.filter((g) => g.kategori === kategori)

  const prev = () => setActive((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length))
  const next = () => setActive((i) => (i === null ? null : (i + 1) % filtered.length))

  return (
    <main className="min-h-screen bg-white text-slate-800">
      <div className="mx-auto max-w-6xl px-6 pt-14">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Galeri</h1>
        <div className="mt-2 h-1 w-16 rounded-full bg-orange-400" />
        <p className="mt-3 text-sm text-slate-500">Dokumentasi kegiatan SMKN 1 Sumbawa Besar · {filtered.length} foto</p>
      </div>

      {kategoriList.length > 1 && (
        <div className="mx-auto mt-8 flex max-w-6xl flex-wrap gap-2 px-6">
          {kategoriList.map((k) => (
            <button
              key={k}
              onClick={() => setKategori(k)}
              aria-pressed={kategori === k}
              className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                kategori === k
                  ? 'bg-orange-400 text-white'
                  : 'border border-slate-200 bg-white text-slate-500 hover:border-orange-300 hover:text-orange-500'
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      )}

      <div className="mx-auto max-w-6xl px-6 py-12">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="aspect-[4/3] animate-pulse rounded-md bg-slate-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <FiImage className="size-12 text-slate-300" />
            <p className="mt-4 text-sm text-slate-500">Belum ada foto galeri.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((g, i) => (
              <Reveal key={g.id} delay={(i % 3) * 70}>
                <button
                  onClick={() => setActive(i)}
                  className="group relative aspect-[4/3] w-full overflow-hidden rounded-md border border-slate-200 bg-slate-100 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <Photo src={g.image} alt={g.judul} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent p-5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <span className="text-xs font-semibold text-orange-300">{g.kategori}</span>
                    <h3 className="mt-1 text-lg font-bold text-white">{g.judul}</h3>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-slate-300">
                      <FiCalendar size={12} /> {formatDate(g.created_at)}
                    </p>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      {active !== null && filtered[active] && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-6" onClick={() => setActive(null)}>
          <button
            className="absolute right-5 top-5 cursor-pointer rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            onClick={(e) => { e.stopPropagation(); setActive(null) }}
            aria-label="Tutup"
          >
            <FiX size={20} />
          </button>
          <button
            className="absolute left-4 cursor-pointer rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            onClick={(e) => { e.stopPropagation(); prev() }}
            aria-label="Sebelumnya"
          >
            <FiChevronLeft size={24} />
          </button>
          <button
            className="absolute right-4 cursor-pointer rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            onClick={(e) => { e.stopPropagation(); next() }}
            aria-label="Berikutnya"
          >
            <FiChevronRight size={24} />
          </button>
          <div className="max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <div className="max-h-[75vh] overflow-hidden rounded-md border border-slate-700">
              <Photo src={filtered[active].image} alt={filtered[active].judul} className="max-h-[75vh] w-full object-contain" />
            </div>
            <div className="mt-4 text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-orange-300">{filtered[active].kategori}</span>
              <h3 className="mt-1 text-lg font-bold text-white">{filtered[active].judul}</h3>
              <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-slate-400">
                <FiCalendar size={12} /> {formatDate(filtered[active].created_at)}
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default GaleriPage
