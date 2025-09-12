import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth'

import { useEffect, useState, type ReactNode } from 'react'

import { auth } from '../../lib/firebase'

import { AuthContext } from './AuthContext'

import type { AuthContextType } from './types'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const login = async (email: string, password: string) =>
    await signInWithEmailAndPassword(auth, email, password)

  const register = async (
    email: string,
    password: string,
    displayName?: string
  ) => {
    const createdUser = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )

    if (displayName && createdUser.user)
      await updateProfile(createdUser.user, { displayName })
  }

  const logout = async () => await signOut(auth)

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    googleLogin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}