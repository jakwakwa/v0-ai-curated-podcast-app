import type { TranscriptProvider, TranscriptRequest, TranscriptResponse } from "../types"

function isDirectAudioUrl(url: string): boolean {
  return /(\.mp3|\.m4a|\.wav|\.aac|\.flac)(\b|$)/i.test(url)
}

function isYouTube(url: string): boolean {
  return /youtu(be\.be|be\.com)/i.test(url)
}

export const ListenNotesProvider: TranscriptProvider = {
  name: "listen-notes",
  canHandle(request) {
    // Placeholder disabled until quotas wired
    return false
  },
  async getTranscript(_request: TranscriptRequest): Promise<TranscriptResponse> {
    return { success: false, error: "Listen Notes disabled", provider: this.name }
  },
}

