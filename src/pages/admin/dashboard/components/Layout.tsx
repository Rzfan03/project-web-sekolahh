import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiArrowLeft, FiMenu } from 'react-icons/fi'
import Sidebar from './Sidebar'
import NotifButton from './NotifButton'
const pageTitles: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/dashboard/artikel': 'Artikel',
  '/admin/dashboard/galeri': 'Galeri',
  '/admin/dashboard/guru': 'Guru',
  '/admin/dashboard/jadwal': 'Jadwal',
  '/admin/dashboard/kelas': 'Kelas',
  '/admin/dashboard/pengumuman': 'Pengumuman',
  '/admin/dashboard/agenda': 'Agenda',
  '/admin/dashboard/ppdb': 'PPDB',
  '/admin/dashboard/profil': 'Profil Sekolah',
  '/admin/dashboard/siswa': 'Siswa',
  '/admin/dashboard/account': 'Manajemen Akun',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const title = pageTitles[location.pathname] || 'Dashboard'

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const root = document.documentElement
    const hadDark = root.classList.contains('dark')
    root.classList.remove('dark')
    return () => {
      if (hadDark) root.classList.add('dark')
    }
  }, [])

  return (
    <div className="dashboard min-h-screen bg-stone-50/80">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-stone-200 bg-white/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex size-10 flex-none items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:border-orange-300 hover:text-orange-600 lg:hidden"
              aria-label="Buka menu"
            >
              <FiMenu className="size-5" />
            </button>
            <span className="hidden text-sm text-gray-400 sm:inline">Admin /</span>
            <h1 className="font-display truncate text-base font-bold text-gray-900 sm:text-lg">{title}</h1>
          </div>
          <div className="flex flex-none items-center gap-3">
            <NotifButton />
            <div className="mx-1 hidden h-6 w-px bg-gray-200 sm:block" />
            <Link
              to="/"
              className="hidden items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition-all hover:border-orange-300 hover:text-orange-600 sm:flex"
            >
              <FiArrowLeft className="size-4" />
              Website
            </Link>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
