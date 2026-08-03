import { useEffect, useState } from 'react'
import { FiSearch, FiFileText, FiCheckCircle, FiXCircle, FiClock, FiCheck, FiPhone, FiArrowRight } from 'react-icons/fi'
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

  const telHref = `tel:${telepon.replace(/[^0-9+]/g, '')}`

  return (
    <main className="min-h-screen bg-white text-slate-800">
      <div className="mx-auto max-w-6xl px-6 pt-14">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
          Penerimaan Peserta Didik Baru
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-500">
          Pendaftaran siswa baru SMKN 1 Sumbawa Besar. Kenali syarat, alur pendaftaran, dan cek hasil seleksi di halaman ini.
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-6 pt-10">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-10 text-white shadow-lg shadow-orange-500/20 sm:px-12">
          <div className="absolute -right-10 -top-10 size-44 rounded-full bg-white/10" aria-hidden="true" />
          <div className="absolute -bottom-16 right-16 size-52 rounded-full bg-white/10" aria-hidden="true" />
          <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
                Wujudkan masa depanmu di SMKN 1 Sumbawa Besar
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-orange-50">
                Pendidikan vokasi siap kerja. Hubungi panitia PPDB untuk informasi lebih lanjut.
              </p>
            </div>
            <a
              href={telHref}
              className="inline-flex flex-none items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-orange-600 shadow-sm transition-transform hover:-translate-y-0.5"
            >
              <FiPhone className="size-4" /> Panitia PPDB · {telepon}
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="font-display text-xl font-extrabold text-stone-900">Syarat Pendaftaran</h2>
              <ul className="mt-6 space-y-3">
                {SYARAT.map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-stone-600">
                    <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-orange-100 text-orange-500">
                      <FiCheck className="size-3.5" />
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="font-display text-xl font-extrabold text-stone-900">Alur Pendaftaran</h2>
              <ol className="mt-8">
                {ALUR.map((a, i) => (
                  <li key={i} className="relative flex gap-4 pb-8 last:pb-0">
                    {i < ALUR.length - 1 && (
                      <span className="absolute left-4 top-9 h-[calc(100%-2.5rem)] w-px bg-orange-200" aria-hidden="true" />
                    )}
                    <span className="z-10 flex size-8 flex-none items-center justify-center rounded-full bg-orange-400 font-display text-sm font-bold text-white shadow-sm">
                      {i + 1}
                    </span>
                    <p className="pt-1.5 text-sm leading-relaxed text-stone-600">{a}</p>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <h3 className="font-display text-lg font-extrabold text-stone-900">Cek Hasil Seleksi</h3>
              <div className="mt-4">
                <div className="relative">
                  <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="search"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Cari nama / NISN..."
                    aria-label="Cari hasil seleksi"
                    className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-11 pr-4 text-sm outline-none transition-colors focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
                {q.trim() ? (
                  <div className="mt-4 space-y-3">
                    {results.length === 0 ? (
                      <p className="rounded-xl bg-stone-50 p-4 text-center text-sm text-stone-500">
                        <FiFileText className="mx-auto mb-1 size-5 text-stone-300" />
                        Tidak ditemukan. Periksa kembali nama/NISN.
                      </p>
                    ) : (
                      results.map((d) => (
                        <div key={d.id} className="rounded-xl border border-stone-100 p-4">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold text-stone-900">{d.nama_lengkap}</p>
                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusColors[d.status] || 'bg-gray-100 text-gray-600'}`}>
                              {d.status === 'diterima' ? <FiCheckCircle size={12} /> : d.status === 'ditolak' ? <FiXCircle size={12} /> : <FiClock size={12} />}
                              {d.status}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-stone-500">{d.jurusan}</p>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <p className="mt-4 text-xs text-stone-400">
                    Masukkan nama lengkap atau NISN untuk melihat hasil seleksi.
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-2xl bg-stone-50 p-6">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-stone-500">
                Butuh Bantuan?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                Hubungi panitia PPDB pada jam kerja untuk pertanyaan seputar pendaftaran.
              </p>
              <a href={telHref} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-600 transition-colors hover:text-orange-700">
                <FiPhone className="size-4" /> {telepon} <FiArrowRight className="size-3.5" />
              </a>
            </section>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default PpdbPage
