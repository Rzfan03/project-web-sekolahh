import { useEffect, useState } from 'react'
import { FiSearch, FiFileText, FiCheckCircle, FiXCircle, FiClock, FiCalendar, FiPhone } from 'react-icons/fi'
import { getPpdb, getProfil } from '../../lib/supabase'
import { useSEO } from '../../hooks/useSEO'
import type { PPDB } from '../../types/ppdb'

const SYARAT = [
  'Siswa lulusan SMP/MTs sederajat',
  'Mengisi formulir pendaftaran dengan data yang benar',
  'Menyerahkan fotokopi ijazah/SKL dan KK',
  'Melampirkan pas foto 3x4',
]

const ALUR = [
  'Mengisi formulir pendaftaran online atau datang ke sekolah',
  'Verifikasi berkas oleh panitia',
  'Mengikuti tahapan seleksi',
  'Pengumuman hasil seleksi',
  'Daftar ulang bagi yang diterima',
]

const statusColors: Record<string, string> = {
  diterima: 'bg-emerald-50 text-emerald-700',
  ditolak: 'bg-red-50 text-red-700',
  pending: 'bg-yellow-50 text-yellow-700',
}

const PpdbPage = () => {
  const [data, setData] = useState<PPDB[]>([])
  const [q, setQ] = useState('')
  const [telepon, setTelepon] = useState('(0371) 26100')

  useSEO({ title: 'PPDB - SMKN 1 Sumbawa Besar', description: 'Penerimaan Peserta Didik Baru SMKN 1 Sumbawa Besar.' })

  useEffect(() => {
    Promise.all([getPpdb(), getProfil()]).then(([p, prof]) => {
      setData(p as PPDB[])
      if (prof && prof.length > 0) setTelepon(prof[0].telepon || telepon)
    })
  }, [])

  const query = q.trim().toLowerCase()
  const results = query
    ? data.filter((d) =>
        (d.nama_lengkap || '').toLowerCase().includes(query) ||
        (d.nisn || '').toLowerCase().includes(query)
      )
    : []

  return (
    <main className="min-h-screen bg-white text-slate-800">
      <div className="mx-auto max-w-6xl px-6 pt-14">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">PPDB</h1>
        <div className="mt-2 h-1 w-16 rounded-full bg-orange-400" />
        <p className="mt-3 text-sm text-slate-500">Penerimaan Peserta Didik Baru SMKN 1 Sumbawa Besar.</p>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-slate-900">Syarat Pendaftaran</h2>
            <div className="mt-2 h-1 w-16 rounded-full bg-orange-400" />
            <ul className="mt-6 space-y-3">
              {SYARAT.map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-slate-700">
                  <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-500">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ul>

            <h2 className="mt-12 text-2xl font-bold text-slate-900">Alur Pendaftaran</h2>
            <div className="mt-2 h-1 w-16 rounded-full bg-orange-400" />
            <ol className="mt-6 space-y-3">
              {ALUR.map((a, i) => (
                <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-slate-700">
                  <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-orange-400 text-xs font-bold text-white">{i + 1}</span>
                  {a}
                </li>
              ))}
            </ol>
          </div>

          <aside className="space-y-6">
            <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <FiClock className="text-orange-500" /> Status Pendaftaran
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Pendaftaran PPDB SMKN 1 Sumbawa Besar <span className="font-semibold text-orange-500">dibuka</span>. Hubungi panitia untuk informasi lebih lanjut.
              </p>
              <div className="mt-4 flex items-center gap-3 rounded-md bg-orange-50 p-4 text-sm">
                <FiPhone className="flex-none text-orange-500" size={18} />
                <span className="font-semibold text-slate-700">Panitia PPDB: {telepon}</span>
              </div>
            </div>

            <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">Cek Hasil Seleksi</h3>
              <div className="mt-4">
                <div className="relative">
                  <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Cari nama / NISN..."
                    aria-label="Cari hasil seleksi"
                    className="w-full rounded-md border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm outline-none transition-colors focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
                {q.trim() ? (
                  <div className="mt-4 space-y-3">
                    {results.length === 0 ? (
                      <p className="rounded-md bg-slate-50 p-4 text-center text-sm text-slate-500">
                        <FiFileText className="mx-auto mb-1 size-5 text-slate-300" />
                        Tidak ditemukan. Periksa kembali nama/NISN.
                      </p>
                    ) : (
                      results.map((d) => (
                        <div key={d.id} className="rounded-md border border-slate-100 p-4">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold text-slate-900">{d.nama_lengkap}</p>
                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusColors[d.status] || 'bg-gray-100 text-gray-600'}`}>
                              {d.status === 'diterima' ? <FiCheckCircle size={12} /> : d.status === 'ditolak' ? <FiXCircle size={12} /> : <FiClock size={12} />}
                              {d.status}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-slate-500">{d.jurusan}</p>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <p className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                    <FiCalendar size={13} /> Masukkan nama lengkap atau NISN untuk melihat hasil seleksi.
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default PpdbPage
