import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { FiGrid, FiFileText, FiImage, FiUsers, FiCalendar, FiBookOpen, FiBell, FiClipboard, FiHome, FiUserCheck, FiUser, FiLogOut } from 'react-icons/fi'
import { getProfil } from '../../../../lib/supabase'
import { SCHOOL_LOGO } from '../../../../lib/logo'
import { logout, useAuth } from '../../../../lib/auth'
import type { ProfilSekolah } from '../../../../types/profil'

const menu = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: FiGrid, end: true },
  { to: '/admin/dashboard/artikel', label: 'Artikel', icon: FiFileText },
  { to: '/admin/dashboard/galeri', label: 'Galeri', icon: FiImage },
  { to: '/admin/dashboard/guru', label: 'Guru', icon: FiUsers },
  { to: '/admin/dashboard/jadwal', label: 'Jadwal', icon: FiCalendar },
  { to: '/admin/dashboard/kelas', label: 'Kelas', icon: FiBookOpen },
  { to: '/admin/dashboard/pengumuman', label: 'Pengumuman', icon: FiBell },
  { to: '/admin/dashboard/ppdb', label: 'PPDB', icon: FiClipboard },
  { to: '/admin/dashboard/profil', label: 'Profil Sekolah', icon: FiHome },
  { to: '/admin/dashboard/siswa', label: 'Siswa', icon: FiUserCheck },
  { to: '/admin/dashboard/account', label: 'Manajemen Akun', icon: FiUser },
]

function NavItem({ to, end, icon: Icon, label }: { to: string; end?: boolean; icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <NavLink to={to} end={end} className={({ isActive }) =>
      `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
        isActive
          ? 'bg-orange-50 text-orange-600'
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
      }`
    }>
      {({ isActive }) => (
        <>
          <Icon className={`size-5 shrink-0 transition-colors ${isActive ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-600'}`} />
          <span className="flex-1">{label}</span>
          {/*<div className={`size-1.5 rounded-full transition-all ${isActive ? 'bg-orange-500' : 'bg-transparent'}`} />*/}
        </>
      )}
    </NavLink>
  )
}

export default function Sidebar() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [profil, setProfil] = useState<ProfilSekolah | null>(null)

  useEffect(() => {
    getProfil().then((res) => {
      if (res.length > 0) setProfil(res[0])
    })
  }, [])

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center gap-3 px-6">
        <div className="flex size-9 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-100">
          <img src={SCHOOL_LOGO} alt="" className="size-full object-contain" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="block truncate text-sm font-bold text-gray-900">
            {profil?.nama_sekolah || 'Dashboard'}
          </span>
          <p className="text-[11px] text-gray-400">Admin Panel</p>
        </div>
      </div>

      <div className="mx-4 border-t border-gray-100" />

      <nav className="flex flex-col gap-1 overflow-y-auto p-4" style={{ height: 'calc(100vh - 132px)' }}>
        {menu.map((item) => (
          <NavItem key={item.to} to={item.to} end={item.end} icon={item.icon} label={item.label} />
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100 p-4">
        <button
          onClick={() => { logout(); navigate('/login') }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 transition-all hover:bg-red-50 hover:text-red-600"
        >
          <div className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-white ring-2 ring-gray-100">
            <img src={SCHOOL_LOGO} alt="" className="size-full object-contain" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-xs font-medium text-gray-700">Keluar</p>
            <p className="truncate text-[10px] text-gray-400">{user?.email || 'Sesi berakhir'}</p>
          </div>
          <FiLogOut className="size-4" />
        </button>
      </div>
    </aside>
  )
}
