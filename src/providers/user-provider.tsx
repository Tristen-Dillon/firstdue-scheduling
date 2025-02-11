'use client'

import { createContext, useContext } from 'react'
import type { TypedUser } from 'payload'

interface UserContextType {
  user: TypedUser
}

const UserContext = createContext<UserContextType | undefined>(undefined)

interface UserProviderProps {
  children: React.ReactNode
  user: TypedUser
}

export function UserProvider({ children, user }: UserProviderProps) {
  return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
