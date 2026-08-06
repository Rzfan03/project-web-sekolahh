import { useEffect, useState } from 'react'
import { FiSearch, FiFileText, FiCheck, FiPhone, FiArrowRight, FiUser, FiClipboard, FiList } from 'react-icons/fi'
import { getProfil, insertPpdb, getPpdbByNisn, type PpdbRegistration } from '../../lib/supabase'
import { useSEO } from '../../hooks/useSEO'
import { JURUSAN_LIST } from '../../lib/jurusan'
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

const inputCls =
  'w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-orange-400 focus:ring-2 focus:ring-orange-100'

const labelCls = 'mb-1.5 block text-xs font-semibold text-stone-600'

const emptyForm = {
  nama_lengkap: '',
  nisn: '',
  jenis_kelamin: '',
  tempat_lahir: '',
  tanggal_lahir: '',
  asal_sekolah: '',
  jurusan: '',
  nama_orang_tua: '',
  telepon: '',
  alamat: '',
}

const statusText: Record<string, string> = {
  pending: 'text-amber-600',
  diterima: 'text-emerald-600',
  ditolak: 'text-red-600',
}

const PpdbPage = () => {
  const [telepon, setTelepon] = useState('(0371) 26100')
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [nisn, setNisn] = useState('')
  const [result, setResult] = useState<PPDB | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [checking, setChecking] = useState(false)

  useSEO({ title: 'PPDB - SMKN 1 Sumbawa Besar', description: 'Penerimaan Peserta Didik Baru SMKN 1 Sumbawa Besar.' })

  useEffect(() => {
    getProfil().then((prof) => {
      if (prof && prof.length > 0) setTelepon(prof[0].telepon || telepon)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const set = (key: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    const required: (keyof typeof emptyForm)[] = [
      'nama_lengkap', 'nisn', 'jenis_kelamin', 'tempat_lahir', 'tanggal_lahir',
      'asal_sekolah', 'jurusan', 'nama_orang_tua', 'telepon', 'alamat',
    ]
    for (const key of required) {
      if (!form[key].trim()) {
        setFormError('Mohon lengkapi semua kolom pendaftaran.')
        return
      }
    }
    if (!/^\d{10}$/.test(form.nisn.trim())) {
      setFormError('NISN harus berupa 10 digit angka.')
      return
    }
    setSubmitting(true)
    const res = await insertPpdb({ ...form, nisn: form.nisn.trim() } as PpdbRegistration)
    if (res) setForm(emptyForm)
    setSubmitting(false)
  }

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^\d{10}$/.test(nisn.trim())) return
    setChecking(true)
    setResult(null)
    setNotFound(false)
    const res = await getPpdbByNisn(nisn)
    if (res) setResult(res as PPDB)
    else setNotFound(true)
    setChecking(false)
  }

  const telHref = `tel:${telepon.replace(/[^0-9+]/g, '')}`

  return (
    <main className="min-h-screen bg-white text-slate-800">
      <div className="mx-auto max-w-6xl px-6 pt-14">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
          Penerimaan Peserta Didik Baru
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-500">
          Pendaftaran siswa baru SMKN 1 Sumbawa Besar. Isi formulir di bawah ini, lalu pantau hasil seleksi Anda dengan NISN.
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-6 pt-10">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-8 text-white shadow-lg shadow-orange-500/20 sm:px-12 sm:py-10">
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

      <div className="mx-auto max-w-6xl px-6 pb-16 pt-10">
        <div className="grid items-start gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-orange-100 text-orange-500">
                  <FiUser className="size-5" />
                </span>
                <div>
                  <h2 className="font-display text-xl font-extrabold text-stone-900">Formulir Pendaftaran</h2>
                  <p className="text-xs text-stone-500">Data Anda akan berstatus Pending dan diverifikasi panitia.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="nama_lengkap" className={labelCls}>Nama Lengkap</label>
                  <input id="nama_lengkap" value={form.nama_lengkap} onChange={set('nama_lengkap')} placeholder="Nama lengkap sesuai ijazah" className={inputCls} />
                </div>
                <div>
                  <label htmlFor="nisn" className={labelCls}>NISN</label>
                  <input id="nisn" value={form.nisn} onChange={set('nisn')} maxLength={10} placeholder="10 digit" className={inputCls} />
                </div>
                <div>
                  <label htmlFor="jenis_kelamin" className={labelCls}>Jenis Kelamin</label>
                  <select id="jenis_kelamin" value={form.jenis_kelamin} onChange={set('jenis_kelamin')} className={inputCls}>
                    <option value="">Pilih...</option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="tempat_lahir" className={labelCls}>Tempat Lahir</label>
                  <input id="tempat_lahir" value={form.tempat_lahir} onChange={set('tempat_lahir')} placeholder="Kota/kabupaten" className={inputCls} />
                </div>
                <div>
                  <label htmlFor="tanggal_lahir" className={labelCls}>Tanggal Lahir</label>
                  <input id="tanggal_lahir" type="date" value={form.tanggal_lahir} onChange={set('tanggal_lahir')} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="asal_sekolah" className={labelCls}>Asal Sekolah</label>
                  <input id="asal_sekolah" value={form.asal_sekolah} onChange={set('asal_sekolah')} placeholder="Nama SMP/MTs" className={inputCls} />
                </div>
                <div>
                  <label htmlFor="jurusan" className={labelCls}>Jurusan / Kompetensi Keahlian</label>
                  <select id="jurusan" value={form.jurusan} onChange={set('jurusan')} className={inputCls}>
                    <option value="">Pilih...</option>
                    {JURUSAN_LIST.map((j) => (
                      <option key={j.slug} value={j.nama}>{j.nama}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="nama_orang_tua" className={labelCls}>Nama Orang Tua / Wali</label>
                  <input id="nama_orang_tua" value={form.nama_orang_tua} onChange={set('nama_orang_tua')} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="telepon" className={labelCls}>No. HP / WA</label>
                  <input id="telepon" value={form.telepon} onChange={set('telepon')} placeholder="08xxxxxxxxxx" className={inputCls} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="alamat" className={labelCls}>Alamat</label>
                  <textarea id="alamat" value={form.alamat} onChange={set('alamat')} rows={2} className={`${inputCls} resize-none`} />
                </div>

                {formError && (
                  <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 sm:col-span-2">{formError}</p>
                )}

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-400 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {submitting ? 'Mengirim...' : 'Daftar Sekarang'} <FiArrowRight className="size-4" />
                  </button>
                </div>
              </form>
            </section>

            <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-orange-100 text-orange-500">
                  <FiClipboard className="size-5" />
                </span>
                <h2 className="font-display text-xl font-extrabold text-stone-900">Syarat Pendaftaran</h2>
              </div>
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
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-orange-100 text-orange-500">
                  <FiList className="size-5" />
                </span>
                <h2 className="font-display text-xl font-extrabold text-stone-900">Alur Pendaftaran</h2>
              </div>
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
            <div className="lg:sticky lg:top-24">
              <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <h3 className="font-display text-lg font-extrabold text-stone-900">Cek Hasil Seleksi</h3>
              <p className="mt-1 text-xs text-stone-500">Masukkan NISN untuk melihat hasil seleksi Anda.</p>
              <form onSubmit={handleCheck} className="mt-4">
                <div className="relative">
                  <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="search"
                    inputMode="numeric"
                    value={nisn}
                    onChange={(e) => setNisn(e.target.value)}
                    maxLength={10}
                    placeholder="NISN (10 digit)..."
                    aria-label="Cek hasil seleksi"
                    className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-11 pr-4 text-sm outline-none transition-colors focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
                <button
                  type="submit"
                  disabled={checking || !/^\d{10}$/.test(nisn.trim())}
                  className="mt-3 w-full rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {checking ? 'Memeriksa...' : 'Cek Hasil'}
                </button>
              </form>

              {result && (
                <div className="mt-4 rounded-xl border border-stone-100 bg-stone-50 p-4">
                  <p className="font-semibold text-stone-900">{result.nama_lengkap}</p>
                  <p className="mt-0.5 text-xs text-stone-500">{result.jurusan}</p>
                  <p className={`mt-2 inline-flex items-center gap-1.5 text-sm font-bold capitalize ${statusText[result.status] || 'text-stone-600'}`}>
                    <span className={`size-2 rounded-full ${result.status === 'diterima' ? 'bg-emerald-500' : result.status === 'ditolak' ? 'bg-red-500' : 'bg-amber-500'}`} />
                    {result.status}
                  </p>
                </div>
              )}
              {notFound && (
                <p className="mt-4 rounded-xl bg-stone-50 p-4 text-center text-sm text-stone-500">
                  <FiFileText className="mx-auto mb-1 size-5 text-stone-300" />
                  Data tidak ditemukan. Pastikan NISN benar.
                </p>
              )}
            </section>
            </div>

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
