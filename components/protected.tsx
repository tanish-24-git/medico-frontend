"use client"

import { type ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/stores/app-store"

export function Protected({
  children,
  allowedRoles,
}: {
  children: ReactNode
  allowedRoles: Array<"patient" | "doctor" | "hospital" | "admin">
}) {
  const router = useRouter()
  const { user, role, initialized } = useAppStore()

  useEffect(() => {
    if (!initialized) return
    if (!user) {
      router.replace("/login")
      return
    }
    if (role && !allowedRoles.includes(role)) {
      router.replace("/login")
    }
  }, [user, role, initialized, allowedRoles, router])

  if (!user) return null
  if (role && !allowedRoles.includes(role)) return null
  return <>{children}</>
}
