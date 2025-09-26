"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"

export function AskAI() {
  const [q, setQ] = useState("")
  const [a, setA] = useState("")

  const ask = async () => {
    if (!q.trim()) return
    try {
      const res = await api.post("/ask-question/", { question: q })
      setA(res?.response ?? "")
    } catch (e: any) {
      toast().toast({ title: "Error", description: e?.message ?? "Try again", variant: "destructive" })
    }
  }

  return (
    <Card>
      <CardContent className="p-4 grid gap-2">
        <div className="flex gap-2">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ask AI a health question"
            aria-label="AI question"
          />
          <Button onClick={ask}>Ask</Button>
        </div>
        {a && <div className="text-sm text-pretty whitespace-pre-wrap">{a}</div>}
      </CardContent>
    </Card>
  )
}
