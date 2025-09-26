"use client"

import { Protected } from "@/components/protected"
import { DoctorList } from "@/components/booking/doctor-list"
import { UploadReport } from "@/components/reports/upload-report"
import { AskAI } from "@/components/ai/ask-ai"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PatientDashboard() {
  return (
    <Protected allowedRoles={["patient"]}>
      <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Patient Dashboard</h1>
          <Link href="/login">
            <Button variant="outline">Switch Account</Button>
          </Link>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              No upcoming sessions. Book a doctor to get started.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <UploadReport />
              <AskAI />
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Find a Doctor</h2>
          <DoctorList />
        </section>
      </main>
    </Protected>
  )
}
