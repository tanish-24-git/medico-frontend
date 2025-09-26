"use client"

import useSWR from "swr"
import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useAppStore } from "@/stores/app-store"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

type Doctor = {
  uid: string
  name?: string
  specialty?: string
  hospital?: string
  availability?: string
  email?: string
}

export function DoctorList() {
  const { data, isLoading, error } = useSWR<Doctor[]>("/doctors", api.get)
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<Doctor | null>(null)

  const filtered = useMemo(() => {
    if (!data) return []
    const q = query.toLowerCase()
    return data.filter((d) => {
      const s = `${d.name ?? ""} ${d.specialty ?? ""} ${d.hospital ?? ""} ${d.email ?? ""}`.toLowerCase()
      return s.includes(q)
    })
  }, [data, query])

  if (isLoading) {
    return <div className="text-muted-foreground">Loading doctors…</div>
  }
  if (error) {
    return <div className="text-destructive">Failed to load doctors</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search by name, specialty, or hospital"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search doctors"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((doc) => (
          <Card key={doc.uid}>
            <CardHeader>
              <CardTitle className="text-base">{doc.name ?? "Doctor"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">Specialty: {doc.specialty ?? "—"}</p>
              <p className="text-sm text-muted-foreground">Hospital: {doc.hospital ?? "—"}</p>
              <p className="text-sm text-muted-foreground">Availability: {doc.availability ?? "—"}</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button onClick={() => setSelected(doc)}>Book</Button>
                </DialogTrigger>
                <BookDialog doctor={selected} />
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function BookDialog({ doctor }: { doctor: Doctor | null }) {
  const { user } = useAppStore()
  const router = useRouter()
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!user || !doctor) return
    try {
      setSubmitting(true)
      const idToken = await user.getIdToken()
      const res = await api.post("/create-video-session/", {
        patient_id: user.uid,
        doctor_id: doctor.uid,
        id_token: idToken,
      })
      const sessionId = res.session_id
      toast().toast({ title: "Session booked", description: "Redirecting to call page…" })
      router.push(`/call/${sessionId}`)
    } catch (e: any) {
      toast().toast({
        title: "Booking failed",
        description: e?.message ?? "Please try again",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Book Appointment</DialogTitle>
      </DialogHeader>
      <div className="grid gap-3">
        <div className="grid gap-2">
          <Label htmlFor="date">Date</Label>
          <input
            id="date"
            className="h-10 rounded-md border bg-background px-3"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="time">Time</Label>
          <input
            id="time"
            className="h-10 rounded-md border bg-background px-3"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="notes">Notes</Label>
          <textarea
            id="notes"
            className="min-h-[80px] rounded-md border bg-background px-3 py-2"
            placeholder="Describe your concern (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>
      <DialogFooter>
        <Button onClick={handleSubmit} disabled={submitting || !doctor}>
          {submitting ? "Booking…" : `Book ${doctor?.name ?? "Doctor"}`}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
