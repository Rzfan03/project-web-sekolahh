import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiBell, FiFileText, FiUserPlus, FiX } from 'react-icons/fi'
import { getPpdb, getArticle } from '../../../../lib/supabase'

interface Notif {
  id: string
  icon: typeof FiBell
  text: string
  desc: string
  time: string
  link: string
  color: string
}

export default function NotifButton() {
  const [open, setOpen] = useState(false)
  const [notifs, setNotifs] = useState<Notif[]>([])
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetch = async () => {
      const items: Notif[] = []

      const ppdb = await getPpdb()
      const pending = ppdb.filter((p: any) => p.status === 'pending')
      if (pending.length > 0) {
        items.push({
          id: 'ppdb',
          icon: FiUserPlus,
          text: `${pending.length} pendaftar PPDB baru`,
          desc: 'Menunggu verifikasi',
          time: '',
          link: '/admin/dashboard/ppdb',
          color: 'text-yellow-600 bg-yellow-100',
        })
      }

      const artikel = await getArticle()
      const recent = artikel.slice(0, 2)
      recent.forEach((a: any) => {
        items.push({
          id: `artikel-${a.id}`,
          icon: FiFileText,
          text: a.judul,
          desc: a.status === 'published' ? 'Telah diterbitkan' : 'Draft',
          time: a.created_at ? new Date(a.created_at).toLocaleDateString('id-ID') : '',
          link: '/admin/dashboard/artikel',
          color: 'text-blue-600 bg-blue-100',
        })
      })

      setNotifs(items)
    }
    fetch()
    const iv = setInterval(fetch, 30000)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-lg border border-gray-200 p-2 text-gray-400 transition-all hover:border-gray-300 hover:text-gray-600"
      >
        <FiBell className="size-5" />
        {notifs.length > 0 && (
          <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-orange-500 text-[9px] font-bold text-white">
            {notifs.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <p className="text-sm font-semibold text-gray-900">Notifikasi</p>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
              <FiX className="size-4" />
            </button>
          </div>

          <div className="max-h-72 overflow-y-auto">
            {notifs.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <FiBell className="mx-auto size-6 text-gray-300" />
                <p className="mt-2 text-sm text-gray-400">Tidak ada notifikasi</p>
              </div>
            ) : (
              notifs.map((n) => {
                const Icon = n.icon
                return (
                  <button
                    key={n.id}
                    onClick={() => { navigate(n.link); setOpen(false) }}
                    className="flex w-full items-start gap-3 border-b border-gray-50 px-4 py-3 text-left transition-colors hover:bg-gray-50"
                  >
                    <div className={`flex size-8 shrink-0 items-center justify-center rounded-full ${n.color}`}>
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{n.text}</p>
                      <p className="text-xs text-gray-500">{n.desc}</p>
                      {n.time && <p className="mt-0.5 text-[10px] text-gray-400">{n.time}</p>}
                    </div>
                  </button>
                )
              })
            )}
          </div>

          {notifs.length > 0 && (
            <button
              onClick={() => { navigate('/admin/dashboard/ppdb'); setOpen(false) }}
              className="w-full border-t border-gray-100 px-4 py-2.5 text-center text-xs font-medium text-orange-600 transition-colors hover:bg-orange-50"
            >
              Lihat Semua
            </button>
          )}
        </div>
      )}
    </div>
  )
}
