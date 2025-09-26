"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { useBackendUrl } from "@/lib/api"
import { useAppStore } from "@/stores/app-store"
import { toast } from "@/hooks/use-toast"

type Props = { sessionId: string }

export function VideoCall({ sessionId }: Props) {
  const backend = useBackendUrl()
  const pcRef = useRef<RTCPeerConnection | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const localVideoRef = useRef<HTMLVideoElement | null>(null)
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null)
  const [started, setStarted] = useState(false)
  const { user } = useAppStore()

  useEffect(() => {
    const ws = new WebSocket(`${backend.replace("http", "ws")}/ws/signaling/${sessionId}`)
    wsRef.current = ws
    ws.onmessage = async (event) => {
      const msg = JSON.parse(event.data)
      if (msg?.type !== "signal") return
      const data = msg.data
      const pc = pcRef.current
      if (!pc) return
      if (data.type === "offer") {
        await pc.setRemoteDescription(new RTCSessionDescription(data))
        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        ws.send(JSON.stringify(answer))
      } else if (data.type === "answer") {
        await pc.setRemoteDescription(new RTCSessionDescription(data))
      } else if (data.candidate) {
        try {
          await pc.addIceCandidate(data)
        } catch {
          // ignore
        }
      }
    }
    return () => ws.close()
  }, [backend, sessionId])

  const startCall = async () => {
    if (started) return
    try {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      })
      pcRef.current = pc
      pc.onicecandidate = (e) => {
        if (e.candidate) wsRef.current?.send(JSON.stringify({ candidate: e.candidate }))
      }
      pc.ontrack = (e) => {
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = e.streams[0]
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      if (localVideoRef.current) localVideoRef.current.srcObject = stream
      stream.getTracks().forEach((t) => pc.addTrack(t, stream))
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      wsRef.current?.send(JSON.stringify(offer))
      setStarted(true)
    } catch (e: any) {
      toast().toast({
        title: "Camera/Mic error",
        description: e?.message ?? "Check permissions",
        variant: "destructive",
      })
    }
  }

  const stopCall = () => {
    pcRef.current?.getSenders().forEach((s) => s.track?.stop())
    pcRef.current?.close()
    pcRef.current = null
    setStarted(false)
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-2 md:grid-cols-2">
        <video
          ref={localVideoRef}
          className="w-full rounded-md bg-muted"
          autoPlay
          playsInline
          muted
          aria-label="Your video"
        />
        <video
          ref={remoteVideoRef}
          className="w-full rounded-md bg-muted"
          autoPlay
          playsInline
          aria-label="Remote video"
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={startCall} disabled={started}>
          Start Call
        </Button>
        <Button variant="outline" onClick={stopCall} disabled={!started}>
          End Call
        </Button>
      </div>
    </div>
  )
}
