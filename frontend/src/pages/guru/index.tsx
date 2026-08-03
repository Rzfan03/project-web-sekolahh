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
    <article className="flex flex-col items-center rounded-md border border-slate-200 bg-white p-6 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative">
        {g.foto ? (
          <Photo src={g.foto} alt={g.nama} className="h-28 w-28 rounded-full border-4 border-orange-100 object-cover" />
        ) : (
          <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-orange-100 bg-orange-50 text-3xl font-bold text-orange-500">
            {g.nama.charAt(0)}
          </div>
        )}
        <span className="absolute -bottom-1 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-orange-400 text-white ring-2 ring-white">
          <FiUsers size={14} />
        </span>
      </div>
      <h2 className="mt-4 text-lg font-bold leading-snug text-slate-900">{g.nama}</h2>
      <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-orange-500">{g.mata_pelajaran}</p>
      {g.nip && <p className="mt-2 text-xs text-slate-400">NIP. {g.nip}</p>}
      {(g.email || g.telepon) && (
        <div className="mt-4 flex flex-col items-center gap-1 text-xs text-slate-500">
          {g.email && <span className="inline-flex items-center gap-1.5"><FiMail size={12} className="text-orange-400" /> {g.email}</span>}
          {g.telepon && <span className="inline-flex items-center gap-1.5"><FiPhone size={12} className="text-orange-400" /> {g.telepon}</span>}
        </div>
      )}
    </article>
  )

  return (
    <main className="min-h-screen bg-white text-slate-800">
      <div className="mx-auto max-w-6xl px-6 pt-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Staff Guru</h1>
            <div className="mt-2 h-1 w-16 rounded-full bg-orange-400" />
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
              <div key={i} className="flex flex-col items-center rounded-md border border-slate-200 p-6">
                <div className="h-28 w-28 animate-pulse rounded-full bg-slate-100" />
                <div className="mt-4 h-4 w-28 animate-pulse rounded bg-slate-100" />
                <div className="mt-2 h-3 w-20 animate-pulse rounded bg-slate-100" />
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
