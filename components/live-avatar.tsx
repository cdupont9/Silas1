"use client"

import { useState } from "react"
import useSWR from "swr"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(json?.error || "Could not load the live avatar.")
  }
  return json as { url: string; embedId: string }
}

export function LiveAvatar() {
  // Only fetch the embed once the visitor opts in, so we never spend credits on load.
  const [started, setStarted] = useState(false)
  const { data, error, isLoading } = useSWR(started ? "/api/liveavatar-embed" : null, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  })

  return (
    <div className="mb-4 rounded-2xl overflow-hidden border border-amber-900/15 bg-[#fff3d6]">
      <div className="relative aspect-video w-full bg-[#fde6c4]">
        {/* Idle / call-to-action state */}
        {!started && (
          <button
            onClick={() => setStarted(true)}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center group"
            aria-label="Start a live conversation with Charity's avatar"
          >
            <span className="w-12 h-12 rounded-full bg-gradient-to-b from-[#f5a623] to-[#e8920c] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="text-[13px] font-semibold text-amber-950">Talk to Charity live</span>
            <span className="text-[11px] text-amber-900/60">Tap to start a real-time conversation</span>
          </button>
        )}

        {/* Loading state */}
        {started && isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <span className="w-7 h-7 rounded-full border-2 border-amber-500/40 border-t-amber-600 animate-spin" />
            <span className="text-[12px] text-amber-900/70">Connecting your avatar&hellip;</span>
          </div>
        )}

        {/* Error state */}
        {started && error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
            <span className="text-[12px] text-amber-900/80 font-medium">{(error as Error).message}</span>
            <button
              onClick={() => setStarted(false)}
              className="text-[11px] font-semibold text-[#b3700a] underline hover:text-amber-900"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Live avatar iframe */}
        {started && data?.url && (
          <iframe
            src={data.url}
            title="Charity's live avatar"
            allow="camera; microphone; autoplay; fullscreen"
            className="absolute inset-0 w-full h-full border-0"
          />
        )}
      </div>
    </div>
  )
}
