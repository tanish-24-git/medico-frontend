"use client"

export function OfflineBanner() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full bg-destructive text-destructive-foreground text-center py-2"
    >
      You are offline. Some features may not work.
    </div>
  )
}
