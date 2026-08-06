import { useEffect, useState } from 'react'
import { FiSearch, FiFileText, FiCheck, FiPhone, FiArrowRight, FiClipboard, FiList, FiUpload, FiX } from 'react-icons/fi'
import { getProfil, insertPpdb, getPpdbByNisn, type PpdbRegistration } from '../../lib/supabase'
import { useSEO } from '../../hooks/useSEO'
import { JURUSAN_LIST } from '../../lib/jurusan'
import { cn } from '../../lib/utils'
import { BERKAS_FIELDS, BERKAS_LABEL, type BerkasMap } from '../../types/ppdb'
import type { PPDB } from '../../types/ppdb'

const MAX_BERKAS_SIZE = 0.5 * 1024 * 1024
const BERKAS_TYPES = ['image/jpeg', 'image/png', 'application/pdf']

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

const GroupHeader = ({ children }: { children: string }) => (
  <div className="mb-5 border-b border-stone-100 pb-3">
    <h3 className="font-display text-sm font-bold uppercase tracking-wider text-orange-600">{children}</h3>
  </div>
)

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
  const [berkas, setBerkas] = useState<BerkasMap>({})
  const [berkasError, setBerkasError] = useState('')
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

  const handleFile = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setBerkasError('')
    const file = e.target.files?.[0]
    if (!file) return
    if (!BERKAS_TYPES.includes(file.type)) {
      setBerkasError(`${BERKAS_LABEL[key]}: file harus JPG/PNG/PDF.`)
      return
    }
    if (file.size > MAX_BERKAS_SIZE) {
      setBerkasError(`${BERKAS_LABEL[key]}: ukuran file maksimal 0.5MB.`)
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setBerkas((b) => ({
        ...b,
        [key]: { nama: file.name, tipe: file.type, data: String(reader.result) },
      }))
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const removeBerkas = (key: string) =>
    setBerkas((b) => {
      const next = { ...b }
      delete next[key]
      return next
    })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    setBerkasError('')
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
    const wajibBerkas = BERKAS_FIELDS.filter((b) => b.wajib).map((b) => b.key)
    if (wajibBerkas.some((k) => !berkas[k])) {
      setBerkasError('Unggah semua dokumen wajib (Pas Foto, Kartu Keluarga, Akta Kelahiran, SKL/Ijazah).')
      return
    }
    setSubmitting(true)
    const res = await insertPpdb({
      ...form,
      nisn: form.nisn.trim(),
      berkas: JSON.stringify(berkas),
    } as PpdbRegistration)
    if (res) {
      setForm(emptyForm)
      setBerkas({})
    }
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
      <div className="mx-auto max-w-4xl px-6 pt-12 sm:pt-16">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
          Sistem Penerimaan Peserta Didik Baru
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-stone-500 sm:text-base">
          Kami mengumumkan pembukaan penerimaan peserta didik baru {new Date().getFullYear()}/
          {new Date().getFullYear() + 1}. Isi formulir di bawah ini dengan data yang benar, lalu
          pantau hasil seleksi Anda melalui nomor NISN.
        </p>
        <a href={telHref} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-600 transition-colors hover:text-orange-700">
          <FiPhone className="size-4" /> Butuh bantuan? Hubungi Panitia PPDB · {telepon}
        </a>
      </div>

      <div className="mx-auto max-w-4xl px-6 pb-16 pt-8 sm:pt-10">
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
        >
          <div className="border-b border-stone-100 bg-stone-50/60 px-6 py-5 sm:px-8">
            <h2 className="font-display text-lg font-extrabold text-stone-900">Formulir Pendaftaran Online</h2>
            <p className="mt-1 text-xs text-stone-500">
              Tanda <span className="font-semibold text-red-500">*</span> wajib diisi.
            </p>
          </div>

          <div className="space-y-8 px-6 py-8 sm:px-8">
            <div>
              <GroupHeader>Data Calon Siswa</GroupHeader>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="nama_lengkap" className={labelCls}>Nama Lengkap <span className="text-red-500">*</span></label>
                  <input id="nama_lengkap" value={form.nama_lengkap} onChange={set('nama_lengkap')} placeholder="Nama lengkap sesuai ijazah" className={inputCls} />
                </div>
                <div>
                  <label htmlFor="nisn" className={labelCls}>NISN <span className="text-red-500">*</span></label>
                  <input id="nisn" value={form.nisn} onChange={set('nisn')} maxLength={10} placeholder="10 digit" className={inputCls} />
                </div>
                <div>
                  <label htmlFor="jenis_kelamin" className={labelCls}>Jenis Kelamin <span className="text-red-500">*</span></label>
                  <select id="jenis_kelamin" value={form.jenis_kelamin} onChange={set('jenis_kelamin')} className={inputCls}>
                    <option value="">Pilih...</option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="tempat_lahir" className={labelCls}>Tempat Lahir <span className="text-red-500">*</span></label>
                  <input id="tempat_lahir" value={form.tempat_lahir} onChange={set('tempat_lahir')} placeholder="Kota/kabupaten" className={inputCls} />
                </div>
                <div>
                  <label htmlFor="tanggal_lahir" className={labelCls}>Tanggal Lahir <span className="text-red-500">*</span></label>
                  <input id="tanggal_lahir" type="date" value={form.tanggal_lahir} onChange={set('tanggal_lahir')} className={inputCls} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="asal_sekolah" className={labelCls}>Nama Sekolah Asal <span className="text-red-500">*</span></label>
                  <input id="asal_sekolah" value={form.asal_sekolah} onChange={set('asal_sekolah')} placeholder="Nama SMP/MTs" className={inputCls} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="alamat" className={labelCls}>Alamat Tempat Tinggal <span className="text-red-500">*</span></label>
                  <textarea id="alamat" value={form.alamat} onChange={set('alamat')} rows={2} className={`${inputCls} resize-none`} placeholder="Alamat lengkap sesuai KK" />
                </div>
              </div>
            </div>

            <div>
              <GroupHeader>Pilihan Kompetensi Keahlian</GroupHeader>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="jurusan" className={labelCls}>Jurusan / Kompetensi Keahlian <span className="text-red-500">*</span></label>
                  <select id="jurusan" value={form.jurusan} onChange={set('jurusan')} className={inputCls}>
                    <option value="">Pilih jurusan...</option>
                    {JURUSAN_LIST.map((j) => (
                      <option key={j.slug} value={j.nama}>{j.nama}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <GroupHeader>Data Orang Tua / Wali</GroupHeader>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="nama_orang_tua" className={labelCls}>Nama Orang Tua / Wali <span className="text-red-500">*</span></label>
                  <input id="nama_orang_tua" value={form.nama_orang_tua} onChange={set('nama_orang_tua')} placeholder="Nama ayah/wali" className={inputCls} />
                </div>
              </div>
            </div>

            <div>
              <GroupHeader>Kontak</GroupHeader>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="telepon" className={labelCls}>No. HP / WA <span className="text-red-500">*</span></label>
                  <input id="telepon" value={form.telepon} onChange={set('telepon')} placeholder="08xxxxxxxxxx" className={inputCls} />
                </div>
              </div>
            </div>

            <div>
              <GroupHeader>Unggah Dokumen</GroupHeader>
              <p className="mb-4 text-xs text-stone-500">
                File harus JPG/JPEG/PNG/PDF dan ukuran maksimal 0.5MB per berkas.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {BERKAS_FIELDS.map((b) => (
                  <div key={b.key}>
                    <label className={labelCls}>
                      {b.label} {b.wajib ? <span className="text-red-500">*</span> : null}
                    </label>
                    {berkas[b.key] ? (
                      <div className="flex w-full items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5">
                        <div className="flex min-w-0 items-center gap-2">
                          <FiFileText className="size-4 flex-none text-emerald-600" />
                          <span className="truncate text-sm text-emerald-700">{berkas[b.key].nama}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeBerkas(b.key)}
                          aria-label={`Hapus ${b.label}`}
                          className="flex size-6 flex-none items-center justify-center rounded-full text-emerald-600 transition-colors hover:bg-emerald-100"
                        >
                          <FiX className="size-4" />
                        </button>
                      </div>
                    ) : (
                      <label
                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-500 transition-colors hover:border-orange-400 hover:text-orange-600"
                      >
                        <FiUpload className="size-4" />
                        Pilih file...
                        <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={handleFile(b.key)} className="hidden" />
                      </label>
                    )}
                  </div>
                ))}
              </div>
              {berkasError && (
                <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{berkasError}</p>
              )}
            </div>

            {formError && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{formError}</p>
            )}

            <div>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-400 px-8 py-4 text-sm font-bold text-white shadow-sm transition-colors hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Mengirim...' : 'Daftar Sekarang'} <FiArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </form>

        <section className="mt-10 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-orange-100 text-orange-500">
              <FiSearch className="size-5" />
            </span>
            <div>
              <h3 className="font-display text-lg font-extrabold text-stone-900">Cek Hasil Seleksi</h3>
              <p className="text-xs text-stone-500">Masukkan NISN untuk melihat hasil seleksi Anda.</p>
            </div>
          </div>

          <form onSubmit={handleCheck} className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
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
              className="rounded-xl bg-stone-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {checking ? 'Memeriksa...' : 'Cek Hasil'}
            </button>
          </form>

          {result && (
            <div className="mt-5 rounded-xl border border-stone-100 bg-stone-50 p-4">
              <p className="font-semibold text-stone-900">{result.nama_lengkap}</p>
              <p className="mt-0.5 text-xs text-stone-500">{result.jurusan}</p>
              <p className={cn('mt-2 inline-flex items-center gap-1.5 text-sm font-bold capitalize', statusText[result.status] || 'text-stone-600')}>
                <span className={cn('size-2 rounded-full', result.status === 'diterima' ? 'bg-emerald-500' : result.status === 'ditolak' ? 'bg-red-500' : 'bg-amber-500')} />
                {result.status}
              </p>
            </div>
          )}
          {notFound && (
            <p className="mt-5 rounded-xl bg-stone-50 p-4 text-center text-sm text-stone-500">
              <FiFileText className="mx-auto mb-1 size-5 text-stone-300" />
              Data tidak ditemukan. Pastikan NISN benar.
            </p>
          )}
        </section>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-orange-100 text-orange-500">
                <FiClipboard className="size-5" />
              </span>
              <h3 className="font-display text-lg font-extrabold text-stone-900">Syarat Pendaftaran</h3>
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
              <h3 className="font-display text-lg font-extrabold text-stone-900">Alur Pendaftaran</h3>
            </div>
            <ol className="mt-6">
              {ALUR.map((a, i) => (
                <li key={i} className="relative flex gap-4 pb-6 last:pb-0">
                  {i < ALUR.length - 1 && (
                    <span className="absolute left-4 top-8 h-[calc(100%-2rem)] w-px bg-orange-200" aria-hidden="true" />
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
      </div>
    </main>
  )
}

export default PpdbPage
