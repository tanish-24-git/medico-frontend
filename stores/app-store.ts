"use client"

import { create } from "zustand"
import type { User } from "firebase/auth"

type Role = "patient" | "doctor" | "hospital" | "admin" | null

type State = {
  user: User | null
  role: Role
  initialized: boolean
  sessionId: string | null
  setRole: (r: NonNullable<Role>) => void
  setSessionId: (id: string | null) => void
}

export const useAppStore = create<State>((set) => ({
  user: null,
  role: (typeof window !== "undefined" ? (localStorage.getItem("role") as any) : null) ?? null,
  initialized: false,
  sessionId: null,
  setRole: (r) => {
    localStorage.setItem("role", r)
    set({ role: r })
  },
  setSessionId: (id) => set({ sessionId: id }),
}))
