"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User } from "./types"
import { mockUsers } from "./mock-data"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  changePassword: (currentPassword: string, newPassword: string) => boolean
  isAuthenticated: boolean
  isAdmin: boolean
  isTechnician: boolean
  isClient: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  // Simular persistência de sessão
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulação de login - em produção, isso seria uma chamada à API
    const foundUser = mockUsers.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      // Remove a senha antes de salvar no localStorage por segurança
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(foundUser)
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))
      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
  }

  const changePassword = (currentPassword: string, newPassword: string): boolean => {
    if (!user) return false

    // Verify current password
    const foundUser = mockUsers.find((u) => u.id === user.id && u.password === currentPassword)

    if (!foundUser) {
      return false
    }

    // Update password in mockUsers (in production, this would be an API call)
    const userIndex = mockUsers.findIndex((u) => u.id === user.id)
    if (userIndex !== -1) {
      mockUsers[userIndex].password = newPassword
    }

    // Update user in state and localStorage
    const updatedUser = { ...user, password: newPassword }
    setUser(updatedUser)
    const { password: _, ...userWithoutPassword } = updatedUser
    localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))

    return true
  }

  const isAuthenticated = !!user
  const isAdmin = user?.role === "admin"
  const isTechnician = user?.role === "tecnico" || user?.role === "admin"
  const isClient = user?.role === "cliente"

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        changePassword,
        isAuthenticated,
        isAdmin,
        isTechnician,
        isClient,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
