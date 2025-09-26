"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { toast } from "@/hooks/use-toast"

export function UploadReport() {
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [result, setResult] = useState<string>("")

  const onUpload = async () => {
    const f = fileRef.current?.files?.[0]
    if (!f) return
    const fd = new FormData()
    fd.append("file", f)
    try {
      const res = await api.postForm("/upload-report/", fd)
      const analysis = res?.analysis ?? "Uploaded successfully."
      setResult(analysis)
      toast().toast({ title: "Report uploaded", description: "Analysis generated." })
    } catch (e: any) {
      toast().toast({ title: "Upload failed", description: e?.message ?? "Please try again", variant: "destructive" })
    }
  }

  return (
    <div className="grid gap-2">
      <input
        ref={fileRef}
        id="report"
        type="file"
        accept=".pdf,image/*"
        className="rounded-md border bg-background p-2"
        aria-label="Upload medical report"
      />
      <Button onClick={onUpload}>Upload Report</Button>
      {result && (
        <div className="mt-2 max-h-48 overflow-auto rounded-md border p-2 text-sm whitespace-pre-wrap">{result}</div>
      )}
    </div>
  )
}
