import { Link, useLocation } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
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
  '/admin/dashboard/ppdb': 'PPDB',
  '/admin/dashboard/profil': 'Profil Sekolah',
  '/admin/dashboard/siswa': 'Siswa',
  '/admin/dashboard/account': 'Manajemen Akun',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const title = pageTitles[location.pathname] || 'Dashboard'

  return (
    <div className="min-h-screen bg-gray-50/80">
      <Sidebar />
      <div className="ml-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/90 px-8 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Admin /</span>
            <h1 className="text-lg font-bold text-gray-900">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <NotifButton />
            <div className="mx-1 h-6 w-px bg-gray-200" />
            <Link
              to="/"
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition-all hover:border-orange-300 hover:text-orange-600"
            >
              <FiArrowLeft className="size-4" />
              Website
            </Link>
          </div>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}
