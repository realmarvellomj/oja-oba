import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { AccountStatus, UserRole } from '../types'

export type Profile = {
  id: string
  full_name: string
  phone: string | null
  role: UserRole
  status: AccountStatus
}

type AuthContextValue = {
  session: Session | null
  user: User | null
  profile: Profile | null
  loading: boolean
  signUp: (
    email: string,
    password: string,
    fullName: string,
    phone: string,
  ) => Promise<{ error: Error | null }>
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: Error | null }>
  signOut: () => Promise<{ error: Error | null }>
  refreshProfile: () => Promise<Profile | null>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

async function loadProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, phone, role, status')
    .eq('id', userId)
    .single()

  if (error) {
    throw error
  }

  return data as Profile
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  async function syncSession(nextSession: Session | null) {
    setSession(nextSession)
    setUser(nextSession?.user ?? null)

    if (!nextSession?.user) {
      setProfile(null)
      return
    }

    try {
      const nextProfile = await loadProfile(nextSession.user.id)
      setProfile(nextProfile)
    } catch {
      setProfile(null)
    }
  }

  async function refreshProfile(): Promise<Profile | null> {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser()

    setUser(currentUser)

    if (!currentUser) {
      setProfile(null)
      return null
    }

    try {
      const nextProfile = await loadProfile(currentUser.id)
      setProfile(nextProfile)
      return nextProfile
    } catch {
      setProfile(null)
      return null
    }
  }

  useEffect(() => {
    let mounted = true

    async function initializeAuth() {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession()

      if (!mounted) return

      await syncSession(currentSession)

      if (mounted) {
        setLoading(false)
      }
    }

    initializeAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void syncSession(nextSession).finally(() => {
        if (mounted) {
          setLoading(false)
        }
      })
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  async function signUp(
    email: string,
    password: string,
    fullName: string,
    phone: string,
  ) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          full_name: fullName,
          phone,
        },
      },
    })

    return {
      error: error ? new Error(error.message) : null,
    }
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    return {
      error: error ? new Error(error.message) : null,
    }
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()

    return {
      error: error ? new Error(error.message) : null,
    }
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider')
  }

  return context
}