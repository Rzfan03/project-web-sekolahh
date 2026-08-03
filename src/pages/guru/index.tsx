import { useEffect, useState } from 'react'
import { FiSearch, FiUsers, FiMail, FiPhone } from 'react-icons/fi'
import { getGuru } from '../../lib/supabase'
import { useSEO } from '../../hooks/useSEO'
import Photo from '../../components/Photo'
import Reveal from '../../components/Reveal'
import type { Guru } from '../../types/guru'

const GuruPage = () => {
  const [data, setData] = useState<Guru[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')

  useSEO({ title: 'Staff Guru - SMKN 1 Sumbawa Besar', description: 'Daftar guru dan tenaga pendidik SMKN 1 Sumbawa Besar.' })

  useEffect(() => {
    getGuru().then((res) => {
      setData((res as Guru[]).filter((g) => g.status === 'aktif'))
      setLoading(false)
    })
  }, [])

  const query = q.trim().toLowerCase()
  const filtered = query ? data.filter((g) =>
    (g.nama || '').toLowerCase().includes(query) ||
    (g.mata_pelajaran || '').toLowerCase().includes(query) ||
    (g.nip || '').toLowerCase().includes(query)
  ) : data

  const GuruCard = ({ g }: { g: Guru }) => (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="aspect-[4/3] w-full overflow-hidden bg-stone-100">
        {g.foto ? (
          <Photo
            src={g.foto}
            alt={g.nama}
            className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-orange-50 text-5xl font-bold text-orange-400">
            {g.nama.charAt(0)}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h2 className="font-display line-clamp-1 text-sm font-bold text-stone-900 group-hover:text-orange-600">
          {g.nama}
        </h2>
        <p className="mt-0.5 text-xs font-medium text-stone-500">{g.mata_pelajaran || 'Guru'}</p>
        {g.nip && <p className="mt-2 text-xs text-stone-400">NIP. {g.nip}</p>}
        {(g.email || g.telepon) && (
          <div className="mt-3 space-y-1 border-t border-stone-100 pt-3 text-xs text-stone-500">
            {g.email && (
              <p className="flex items-center gap-1.5">
                <FiMail size={12} className="flex-none text-orange-400" />
                <span className="truncate">{g.email}</span>
              </p>
            )}
            {g.telepon && (
              <p className="flex items-center gap-1.5">
                <FiPhone size={12} className="flex-none text-orange-400" /> {g.telepon}
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  )

  return (
    <main className="min-h-screen bg-white text-slate-800">
      <div className="mx-auto max-w-6xl px-6 pt-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Staff Guru</h1>
            <p className="mt-3 text-sm text-slate-500">Guru dan tenaga pendidik SMKN 1 Sumbawa Besar · {filtered.length} orang</p>
          </div>
          <div className="relative sm:w-80">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari nama / mapel..."
              aria-label="Cari guru"
              className="w-full rounded-md border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm outline-none transition-colors focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
                <div className="aspect-[4/3] w-full animate-pulse bg-stone-100" />
                <div className="p-4">
                  <div className="h-4 w-24 animate-pulse rounded bg-stone-100" />
                  <div className="mt-2 h-3 w-16 animate-pulse rounded bg-stone-100" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <FiUsers className="size-12 text-slate-300" />
            <p className="mt-4 text-sm text-slate-500">
              {q.trim() ? 'Guru tidak ditemukan. Coba kata kunci lain.' : 'Belum ada data guru.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((g, i) => (
              <Reveal key={g.id} delay={(i % 4) * 70}>
                <GuruCard g={g} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default GuruPage
