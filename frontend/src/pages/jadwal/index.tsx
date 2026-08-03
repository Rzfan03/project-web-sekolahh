import { useEffect, useState } from 'react'
import { FiClock, FiCalendar } from 'react-icons/fi'
import { getJadwal, getGuru, getKelas } from '../../lib/supabase'
import { useSEO } from '../../hooks/useSEO'
import type { Jadwal } from '../../types/jadwal'
import type { Guru } from '../../types/guru'
import type { Kelas } from '../../types/kelas'

const HARI_LIST = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

const JadwalPage = () => {
  const [jadwal, setJadwal] = useState<Jadwal[]>([])
  const [guruList, setGuruList] = useState<Guru[]>([])
  const [kelasList, setKelasList] = useState<Kelas[]>([])
  const [loading, setLoading] = useState(true)
  const [kelas, setKelas] = useState('Semua')
  const [hari, setHari] = useState(HARI_LIST[0])

  useSEO({ title: 'Jadwal Pelajaran - SMKN 1 Sumbawa Besar', description: 'Jadwal pelajaran SMKN 1 Sumbawa Besar.' })

  useEffect(() => {
    Promise.all([getJadwal(), getGuru(), getKelas()]).then(([j, g, k]) => {
      setJadwal(j as Jadwal[])
      setGuruList(g as Guru[])
      setKelasList(k as Kelas[])
      setLoading(false)
    })
  }, [])

  const guruById = new Map(guruList.map((g) => [g.id, g.nama]))
  const kelasById = new Map(kelasList.map((k) => [k.id, k.nama]))

  const filtered = jadwal
    .filter((j) => j.hari === hari)
    .filter((j) => kelas === 'Semua' || String(j.kelas_id) === kelas)
    .sort((a, b) => (a.jam_mulai || '').localeCompare(b.jam_mulai || ''))

  return (
    <main className="min-h-screen bg-white text-slate-800">
      <div className="mx-auto max-w-6xl px-6 pt-14">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Jadwal Pelajaran</h1>
        <div className="mt-2 h-1 w-16 rounded-full bg-orange-400" />
        <p className="mt-3 text-sm text-slate-500">Jadwal pelajaran kelas dan guru SMKN 1 Sumbawa Besar.</p>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {HARI_LIST.map((h) => (
              <button
                key={h}
                onClick={() => setHari(h)}
                aria-pressed={hari === h}
                className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  hari === h
                    ? 'bg-orange-400 text-white'
                    : 'border border-slate-200 bg-white text-slate-500 hover:border-orange-300 hover:text-orange-500'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
          <select
            value={kelas}
            onChange={(e) => setKelas(e.target.value)}
            className="cursor-pointer rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          >
            <option value="Semua">Semua Kelas</option>
            {kelasList.map((k) => (
              <option key={k.id} value={k.id}>{k.nama}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="mt-8 space-y-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-md bg-slate-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <FiCalendar className="size-12 text-slate-300" />
            <p className="mt-4 text-sm text-slate-500">Tidak ada jadwal untuk hari {hari}.</p>
          </div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-md border border-slate-200 shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-orange-50 text-xs font-semibold uppercase tracking-widest text-orange-600">
                  <th className="px-5 py-3">Jam</th>
                  <th className="px-5 py-3">Mata Pelajaran</th>
                  <th className="px-5 py-3">Kelas</th>
                  <th className="px-5 py-3">Guru</th>
                  <th className="px-5 py-3">Ruangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filtered.map((j) => (
                  <tr key={j.id} className="transition-colors hover:bg-orange-50/50">
                    <td className="whitespace-nowrap px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                        <FiClock size={13} className="text-orange-400" /> {j.jam_mulai} - {j.jam_selesai}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-900">{j.mata_pelajaran}</td>
                    <td className="px-5 py-4 text-slate-600">{j.kelas_id ? kelasById.get(j.kelas_id) || `Kelas #${j.kelas_id}` : '-'}</td>
                    <td className="px-5 py-4 text-slate-600">{j.guru_id ? guruById.get(j.guru_id) || `Guru #${j.guru_id}` : '-'}</td>
                    <td className="px-5 py-4 text-slate-600">{j.ruangan || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}

export default JadwalPage
