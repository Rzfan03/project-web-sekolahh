import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { verifyPassword } from './password'

const SESSION_KEY = 'admin_session'
const SESSION_TTL_MS = 12 * 60 * 60 * 1000

export interface LocalAdminSession {
  id: number
  email: string
  role: string
  exp: number
}

export type AuthUser = User | LocalAdminSession | null

function createLocalSession(admin: { id: number; username: string; role: string }) {
  const session: LocalAdminSession = {
    id: admin.id,
    email: admin.username,
    role: admin.role,
    exp: Date.now() + SESSION_TTL_MS,
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function getLocalSession(): LocalAdminSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const session = JSON.parse(raw) as LocalAdminSession
    if (!session?.id || !session?.exp || session.exp < Date.now()) {
      localStorage.removeItem(SESSION_KEY)
      return null
    }
    return session
  } catch {
    return null
  }
}

export async function login(email: string, password: string) {
  const normalized = email.trim().toLowerCase()

  const { data: admins } = await supabase.from('admins').select('id, username, role, password')
  const admin = admins?.find((a) => a.username?.toLowerCase() === normalized)

  if (admin && admin.password && !admin.password.startsWith('managed-by-supabase-auth')) {
    const ok = await verifyPassword(password, admin.password)
    if (ok) {
      createLocalSession(admin)
      return { error: null }
    }
    return { error: 'Email atau password salah!' }
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }
  return { error: null }
}

export async function logout() {
  localStorage.removeItem(SESSION_KEY)
  await supabase.auth.signOut()
}

export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser>(() => getLocalSession())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser((prev) => prev ?? (data.session?.user ?? null))
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? getLocalSession())
      setLoading(false)
    })

    return () => sub.subscription.unsubscribe()
  }, [])

  return { user, loading }
}
