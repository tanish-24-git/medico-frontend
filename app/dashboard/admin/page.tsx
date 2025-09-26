"use client"

import { Protected } from "@/components/protected"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDashboard() {
  return (
    <Protected allowedRoles={["admin"]}>
      <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <Card>
          <CardHeader>
            <CardTitle>Search & Manage</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-2">
              <Input placeholder="Search users, hospitals…" />
              <Button>Search</Button>
            </div>
            <Button variant="outline">Delete Selected</Button>
            <Button variant="outline">Export CSV</Button>
          </CardContent>
        </Card>
      </main>
    </Protected>
  )
}
