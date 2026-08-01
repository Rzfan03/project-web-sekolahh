import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiFileText, FiImage, FiUsers, FiCalendar, FiBookOpen, FiBell, FiClipboard, FiUserCheck, FiArrowRight, FiLoader, FiClock, FiUser, FiMapPin } from 'react-icons/fi'
import { getArticle, getGaleri, getGuru, getJadwal, getKelas, getPengumuman, getPpdb, getSiswa } from '../../../lib/supabase'
import { ChartCard } from '../../../lib/ui/ChartCard'
import { Card, CardContent, CardHeader, CardTitle } from '../../../lib/ui/Card'
import type { Jadwal } from '../../../types/jadwal'
import type { Guru } from '../../../types/guru'
import type { Kelas } from '../../../types/kelas'
import DashboardLayout from './components/Layout'

const cards = [
  { key: 'artikel', label: 'Artikel', icon: FiFileText, bg: 'bg-orange-100', color: 'text-orange-500', link: '/admin/dashboard/artikel', fetcher: getArticle },
  { key: 'galeri', label: 'Galeri', icon: FiImage, bg: 'bg-blue-100', color: 'text-blue-500', link: '/admin/dashboard/galeri', fetcher: getGaleri },
  { key: 'guru', label: 'Guru', icon: FiUsers, bg: 'bg-emerald-100', color: 'text-emerald-500', link: '/admin/dashboard/guru', fetcher: getGuru },
  { key: 'jadwal', label: 'Jadwal', icon: FiCalendar, bg: 'bg-violet-100', color: 'text-violet-500', link: '/admin/dashboard/jadwal', fetcher: getJadwal },
  { key: 'kelas', label: 'Kelas', icon: FiBookOpen, bg: 'bg-rose-100', color: 'text-rose-500', link: '/admin/dashboard/kelas', fetcher: getKelas },
  { key: 'pengumuman', label: 'Pengumuman', icon: FiBell, bg: 'bg-amber-100', color: 'text-amber-500', link: '/admin/dashboard/pengumuman', fetcher: getPengumuman },
  { key: 'ppdb', label: 'PPDB', icon: FiClipboard, bg: 'bg-cyan-100', color: 'text-cyan-500', link: '/admin/dashboard/ppdb', fetcher: getPpdb },
  { key: 'siswa', label: 'Siswa', icon: FiUserCheck, bg: 'bg-indigo-100', color: 'text-indigo-500', link: '/admin/dashboard/siswa', fetcher: getSiswa },
]

export default function DashboardPage() {
  const [stats, setStats] = useState<Record<string, number>>({})
  const [todayJadwal, setTodayJadwal] = useState<Jadwal[]>([])
  const [guruById, setGuruById] = useState<Map<number, string>>(new Map())
  const [kelasById, setKelasById] = useState<Map<number, string>>(new Map())
  const [loading, setLoading] = useState(true)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  const todayDay = now.toLocaleDateString('id-ID', { weekday: 'long' })

  useEffect(() => {
    setLoading(true)
    Promise.all([
      ...cards.map(async (c) => {
        const data = await c.fetcher()
        return { key: c.key, count: data?.length || 0 }
      }),
      getJadwal(),
      getGuru(),
      getKelas(),
    ]).then((results) => {
      const statsResults = results.slice(0, cards.length) as { key: string; count: number }[]
      const jadwalList = (results[cards.length] ?? []) as Jadwal[]
      const guruList = (results[cards.length + 1] ?? []) as Guru[]
      const kelasList = (results[cards.length + 2] ?? []) as Kelas[]
      const obj: Record<string, number> = {}
      statsResults.forEach((r) => { obj[r.key] = r.count })
      setStats(obj)
      setTodayJadwal(jadwalList.filter((j) => j.hari === todayDay).sort((a, b) => a.jam_mulai.localeCompare(b.jam_mulai)))
      setGuruById(new Map(guruList.map((g) => [g.id, g.nama])))
      setKelasById(new Map(kelasList.map((k) => [k.id, k.nama])))
      setLoading(false)
    })
  }, [todayDay])

  const chartLabels = ['Artikel', 'Galeri', 'Guru', 'Jadwal', 'Kelas', 'Pengumuman', 'PPDB', 'Siswa']
  const chartData = chartLabels.map((_, i) => Object.values(stats)[i] || 0)
  const colors = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#f43f5e', '#f59e0b', '#06b6d4', '#6366f1']

  const total = Object.values(stats).reduce((a, b) => a + b, 0)

  const formatTime = (t?: string) => (t ? t.slice(0, 5) : '--:--')

  return (
    <DashboardLayout>
      <div className="mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white shadow-lg shadow-orange-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Selamat Datang, Admin 👋</h2>
            <p className="mt-1 text-sm text-orange-100">Kelola seluruh data website sekolah dari panel ini</p>
          </div>
          <div className="hidden items-center gap-2 rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm sm:flex">
            <span className="text-2xl font-bold">{total}</span>
            <span className="text-sm text-orange-100">Total Data</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <FiLoader className="size-8 animate-spin text-orange-500" />
          <p className="mt-3 text-sm text-gray-400">Memuat data...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => {
              const Icon = card.icon
              const count = stats[card.key] ?? 0
              return (
                <Link
                  key={card.key}
                  to={card.link}
                  className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/5"
                >
                  <div className="flex items-start justify-between">
                    <div className={`flex size-11 items-center justify-center rounded-lg ${card.bg} ${card.color}`}>
                      <Icon className="size-5" />
                    </div>
                    <FiArrowRight className="size-4 text-gray-300 transition-all group-hover:translate-x-0.5 group-hover:text-orange-500" />
                  </div>
                  <p className="mt-4 text-sm font-medium text-gray-500">{card.label}</p>
                  <p className="mt-0.5 text-2xl font-bold text-gray-900">{count}</p>
                </Link>
              )
            })}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ChartCard
              title="Statistik Data"
              type="bar"
              labels={chartLabels}
              datasets={[{
                label: 'Jumlah Data',
                data: chartData,
                backgroundColor: colors,
                borderRadius: 6,
              } as any]}
            />
            <ChartCard
              title="Komposisi Data"
              type="doughnut"
              labels={chartLabels}
              datasets={[{
                label: 'Total',
                data: chartData,
                backgroundColor: colors,
                borderColor: '#fff',
                borderWidth: 2,
              } as any]}
              height={280}
            />
          </div>

          <Card className="mt-8">
            <CardHeader>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FiClock className="size-4 text-orange-500" />
                  Jadwal Hari Ini
                </CardTitle>
                <p className="mt-0.5 text-xs text-gray-400">{todayDay}, {now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <span className="flex items-center gap-1.5 rounded-md bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600 tabular-nums">
                {now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WITA
              </span>
            </CardHeader>
            <CardContent>
              {todayJadwal.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-400">Tidak ada jadwal untuk hari ini</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {todayJadwal.map((j) => (
                    <div key={j.id} className="flex items-center gap-4 py-3">
                      <span className="shrink-0 rounded-md bg-orange-50 px-2.5 py-1.5 text-xs font-semibold text-orange-600 tabular-nums">
                        {formatTime(j.jam_mulai)} – {formatTime(j.jam_selesai)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">{j.mata_pelajaran}</p>
                        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gray-500">
                          {j.guru_id ? (
                            <span className="flex items-center gap-1">
                              <FiUser className="size-3" /> {guruById.get(j.guru_id) || `Guru #${j.guru_id}`}
                            </span>
                          ) : null}
                          {j.kelas_id ? (
                            <span className="flex items-center gap-1">
                              <FiBookOpen className="size-3" /> {kelasById.get(j.kelas_id) || `Kelas #${j.kelas_id}`}
                            </span>
                          ) : null}
                        </div>
                      </div>
                      {j.ruangan ? (
                        <span className="hidden shrink-0 items-center gap-1 rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-500 sm:flex">
                          <FiMapPin className="size-3" /> {j.ruangan}
                        </span>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </DashboardLayout>
  )
}
