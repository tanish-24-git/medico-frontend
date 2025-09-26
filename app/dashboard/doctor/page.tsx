"use client"

import { Protected } from "@/components/protected"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function DoctorDashboard() {
  return (
    <Protected allowedRoles={["doctor"]}>
      <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Doctor Dashboard</h1>
          <Link href="/login">
            <Button variant="outline">Switch Account</Button>
          </Link>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Manage calls, issue prescriptions, and view patient reports.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Tools</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Link href="/dashboard/doctor/prescriptions">
                <Button className="w-full">Add Prescription</Button>
              </Link>
              <Link href="/dashboard/doctor/sessions">
                <Button variant="outline" className="w-full bg-transparent">
                  Schedule Call
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </main>
    </Protected>
  )
}
