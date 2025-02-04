"use client" // Required for Next.js App Router

import { createContext, useContext, useEffect, useState } from "react"
import { User, onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "../app/firebase/firebaseConfig"

interface AuthContextProps {
  user: User | null
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextProps>({ user: null, logout: async () => {} })

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  const logout = async () => {
    await signOut(auth)
  }

  return <AuthContext.Provider value={{ user, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
