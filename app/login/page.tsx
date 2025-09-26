"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { signInWithGoogle, signOutFirebase, onAuthUser } from "@/lib/firebase"
import { useAppStore } from "@/stores/app-store"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { user, role, setRole } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [selectingRole, setSelectingRole] = useState(false)

  useEffect(() => {
    const unsub = onAuthUser((u) => {
      if (u && !role) setSelectingRole(true)
      if (u && role) redirectByRole(role)
    })
    return () => unsub()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role])

  const redirectByRole = (r: string) => {
    const map: Record<string, string> = {
      patient: "/dashboard/patient",
      doctor: "/dashboard/doctor",
      hospital: "/dashboard/hospital",
      admin: "/dashboard/admin",
    }
    router.replace(map[r] ?? "/")
  }

  const handleLogin = async () => {
    try {
      setLoading(true)
      await signInWithGoogle()
      toast().toast({ title: "Logged in", description: "Welcome to ShivaAI Medico!" })
      setSelectingRole(true)
    } catch (e: any) {
      toast().toast({ title: "Login failed", description: e?.message ?? "Please try again", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    if (!role) {
      toast().toast({ title: "Select a role", description: "Please choose your role to continue." })
      return
    }
    redirectByRole(role)
  }

  return (
    <main className="min-h-dvh flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to ShivaAI Medico</CardTitle>
          <CardDescription>Login with Google and choose your role</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!user && (
            <Button onClick={handleLogin} disabled={loading} className="w-full">
              {loading ? "Signing in…" : "Continue with Google"}
            </Button>
          )}
          {user && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Choose Role</Label>
                <Select value={role ?? ""} onValueChange={(v) => setRole(v as any)}>
                  <SelectTrigger id="role" aria-label="User role">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patient">Patient</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="hospital">Hospital Employee</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={handleContinue}>
                  Continue
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => signOutFirebase()}>
                  Sign out
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
