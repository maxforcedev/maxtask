"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface User {
  id: number
  name: string
  email: string
  phone: string
  avatar?: string
  createdAt: string
}

interface UserContextType {
  user: User | null
  updateUser: (updates: Partial<User>) => void
  setUser: (user: User | null) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

// Usuário mock inicial
const initialUser: User = {
  id: 1,
  name: "João Silva",
  email: "joao@email.com",
  phone: "(11) 99999-9999",
  avatar: "",
  createdAt: "2024-01-01",
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(initialUser)

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUserState({ ...user, ...updates })
    }
  }

  const setUser = (newUser: User | null) => {
    setUserState(newUser)
  }

  return <UserContext.Provider value={{ user, updateUser, setUser }}>{children}</UserContext.Provider>
}

export function useUserContext() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider")
  }
  return context
}
