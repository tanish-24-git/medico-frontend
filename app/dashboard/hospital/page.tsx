"use client"

import { Protected } from "@/components/protected"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HospitalDashboard() {
  return (
    <Protected allowedRoles={["hospital"]}>
      <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        <h1 className="text-2xl font-semibold">Hospital Dashboard</h1>
        <section className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Patients, Doctors, Sessions, Prescriptions metrics
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Management</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">Manage doctors, employees, and patients</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Export</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">Export data to CSV</CardContent>
          </Card>
        </section>
      </main>
    </Protected>
  )
}
