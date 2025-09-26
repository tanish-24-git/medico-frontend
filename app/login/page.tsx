"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { signInWithGoogle, signOutFirebase, onAuthUser, signUpWithEmail, signInWithEmail } from "@/lib/firebase" // Updated imports
import { useAppStore } from "@/stores/app-store"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { user, role, setRole } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [selectingRole, setSelectingRole] = useState(false)
  const [authMode, setAuthMode] = useState<"google" | "email">("google") // New: Toggle auth mode
  const [isSignUp, setIsSignUp] = useState(false) // New: Toggle sign-up/login for email
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")

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

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      await signInWithGoogle()
      toast({ title: "Logged in", description: "Welcome to ShivaAI Medico!" })
      setSelectingRole(true)
    } catch (e: any) {
      toast({ title: "Login failed", description: e?.message ?? "Please try again", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleEmailAuth = async () => {
    try {
      setLoading(true)
      let u;
      if (isSignUp) {
        u = await signUpWithEmail(name, email, password, phone)
      } else {
        u = await signInWithEmail(email, password)
      }
      toast({ title: `${isSignUp ? "Signed up" : "Logged in"}`, description: "Welcome!" })
      setSelectingRole(true)
    } catch (e: any) {
      toast({ title: "Error", description: e?.message ?? "Try again", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    if (!role) {
      toast({ title: "Select a role", description: "Please choose your role to continue." })
      return
    }
    redirectByRole(role)
  }

  return (
    <main className="min-h-dvh flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to ShivaAI Medico</CardTitle>
          <CardDescription>Login or register with Google or Email</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Auth Mode Toggle */}
          <div className="flex gap-2">
            <Button 
              variant={authMode === "google" ? "default" : "outline"} 
              onClick={() => setAuthMode("google")}
              className="flex-1"
            >
              Google
            </Button>
            <Button 
              variant={authMode === "email" ? "default" : "outline"} 
              onClick={() => setAuthMode("email")}
              className="flex-1"
            >
              Email/Password
            </Button>
          </div>

          {authMode === "google" && !user && (
            <Button onClick={handleGoogleLogin} disabled={loading} className="w-full">
              {loading ? "Signing in…" : "Continue with Google"}
            </Button>
          )}

          {authMode === "email" && !user && (
            <div className="space-y-4">
              {/* Sign Up / Login Toggle */}
              <div className="flex gap-2">
                <Button 
                  variant={!isSignUp ? "default" : "outline"} 
                  onClick={() => setIsSignUp(false)}
                  className="flex-1"
                >
                  Login
                </Button>
                <Button 
                  variant={isSignUp ? "default" : "outline"} 
                  onClick={() => setIsSignUp(true)}
                  className="flex-1"
                >
                  Sign Up
                </Button>
              </div>

              {/* Form Fields */}
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
              </div>
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" />
                </div>
              )}
              <Button onClick={handleEmailAuth} disabled={loading} className="w-full">
                {loading ? "Processing…" : isSignUp ? "Sign Up" : "Login"}
              </Button>
            </div>
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