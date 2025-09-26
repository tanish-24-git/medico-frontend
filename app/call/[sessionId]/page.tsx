"use client"

import { useParams } from "next/navigation"
import { Protected } from "@/components/protected"
import { VideoCall } from "@/components/video/video-call"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CallPage() {
  const { sessionId } = useParams<{ sessionId: string }>()

  return (
    <Protected allowedRoles={["patient", "doctor"]}>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Video Call — Session {sessionId}</CardTitle>
          </CardHeader>
          <CardContent>
            <VideoCall sessionId={sessionId} />
          </CardContent>
        </Card>
      </main>
    </Protected>
  )
}
