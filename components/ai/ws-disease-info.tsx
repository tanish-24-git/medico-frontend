"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useBackendUrl } from "@/lib/api"

export function DiseaseInfoWS() {
  const backend = useBackendUrl()
  const [q, setQ] = useState("")
  const [log, setLog] = useState<string[]>([])
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const ws = new WebSocket(`${backend.replace("http", "ws")}/ws/disease_info`)
    wsRef.current = ws
    ws.onmessage = (ev) => {
      setLog((l) => [...l, ev.data])
    }
    ws.onerror = () => setLog((l) => [...l, "Error occurred"])
    return () => {
      ws.close()
    }
  }, [backend])

  const send = () => {
    if (!q) return
    wsRef.current?.send(q)
    setQ("")
  }

  return (
    <div className="grid gap-2">
      <div className="flex gap-2">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask about disease…" />
        <Button onClick={send}>Send</Button>
      </div>
      <div className="rounded-md border p-2 max-h-48 overflow-auto text-xs font-mono">
        {log.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
    </div>
  )
}
