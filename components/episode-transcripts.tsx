"use client"

import { useState } from "react"

export function EpisodeTranscript({ transcript }: { transcript: string }) {
  const [show, setShow] = useState(false)
  return (
    <div className="mt-4">
      {!show ? (
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          onClick={() => setShow(true)}
        >
          Show transcript
        </button>
      ) : (
        <div className="max-h-[400px] overflow-y-auto border rounded p-2 bg-background mt-2 whitespace-pre-line">
          {transcript}
        </div>
      )}
    </div>
  )
}
