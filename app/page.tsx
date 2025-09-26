"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { useOnline } from "@/hooks/use-online"
import { OfflineBanner } from "@/components/offline-banner"
import { HeartPulseIcon, StethoscopeIcon, FileTextIcon, CalendarIcon, VideoIcon } from "lucide-react"

export default function HomePage() {
  const online = useOnline()

  return (
    <main className="min-h-dvh">
      {!online && <OfflineBanner />}

      <header className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <StethoscopeIcon className="h-6 w-6 text-primary" aria-hidden="true" />
            <span className="font-semibold">ShivaAI Medico</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/login">
              <Button>Register</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-2 items-center">
        <div className="space-y-6">
          <h1 className="text-3xl md:text-5xl font-semibold text-balance">
            Telemedicine made simple, secure, and intelligent
          </h1>
          <p className="text-muted-foreground text-pretty">
            ShivaAI Medico connects patients, doctors, and hospitals for seamless video consultations, AI-assisted
            health insights, prescription management, and secure report uploads — with real-time guidance.
          </p>
          <div className="flex gap-3">
            <Link href="/login">
              <Button size="lg">Get Started</Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </a>
          </div>
          <ul className="grid gap-3 md:grid-cols-2 pt-4">
            <li className="flex items-center gap-3">
              <VideoIcon className="h-5 w-5 text-primary" aria-hidden="true" />
              <span>Video consultations</span>
            </li>
            <li className="flex items-center gap-3">
              <HeartPulseIcon className="h-5 w-5 text-primary" aria-hidden="true" />
              <span>AI health insights</span>
            </li>
            <li className="flex items-center gap-3">
              <FileTextIcon className="h-5 w-5 text-primary" aria-hidden="true" />
              <span>Reports & prescriptions</span>
            </li>
            <li className="flex items-center gap-3">
              <CalendarIcon className="h-5 w-5 text-primary" aria-hidden="true" />
              <span>Doctor booking</span>
            </li>
          </ul>
        </div>
        <Card aria-label="Platform preview" className="overflow-hidden">
          <CardContent className="p-0">
            <img src="/medical-dashboard-preview.jpg" alt="ShivaAI Medico dashboard preview" className="w-full h-auto" />
          </CardContent>
        </Card>
      </section>

      <section id="features" className="bg-secondary/50 border-y">
        <div className="mx-auto max-w-6xl px-4 py-12 grid gap-6 md:grid-cols-3">
          <Feature
            title="Easy access to doctors"
            description="Book and meet verified doctors in minutes, from anywhere."
          />
          <Feature
            title="Secure health records"
            description="Your reports and prescriptions stay private and encrypted."
          />
          <Feature title="Real-time guidance" description="AI-assisted insights and live support during sessions." />
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground">
        © {new Date().getFullYear()} ShivaAI Medico. All rights reserved.
      </footer>
    </main>
  )
}

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 rounded-lg border bg-card">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
