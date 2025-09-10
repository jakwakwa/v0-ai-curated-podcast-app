// YouTube API utilities and rate limiting
interface YouTubeAPIConfig {
  apiKey: string
  maxRequestsPerHour: number
  maxRetries: number
}

interface RateLimitState {
  requests: number[]
  lastReset: number
}

class YouTubeAPIManager {
  private config: YouTubeAPIConfig
  private rateLimitState: RateLimitState

  constructor() {
    const apiKey = process.env.YOUTUBE_API_KEY
    if (!apiKey) {
      throw new Error("YOUTUBE_API_KEY environment variable is required")
    }

    this.config = {
      apiKey,
      maxRequestsPerHour: parseInt(process.env.YOUTUBE_MAX_REQUESTS_PER_HOUR || "1000"),
      maxRetries: parseInt(process.env.YOUTUBE_MAX_RETRIES || "3")
    }

    this.rateLimitState = {
      requests: [],
      lastReset: Date.now()
    }
  }

  private cleanupOldRequests(): void {
    const oneHourAgo = Date.now() - 3600000 // 1 hour in milliseconds
    this.rateLimitState.requests = this.rateLimitState.requests.filter(time => time > oneHourAgo)
  }

  canMakeRequest(): boolean {
    this.cleanupOldRequests()
    return this.rateLimitState.requests.length < this.config.maxRequestsPerHour
  }

  recordRequest(): void {
    this.rateLimitState.requests.push(Date.now())
  }

  async makeAPIRequest(url: string, options: RequestInit): Promise<Response> {
    if (!this.canMakeRequest()) {
      const resetTime = Math.min(...this.rateLimitState.requests) + 3600000
      const waitTime = Math.max(0, resetTime - Date.now())
      throw new Error(`YouTube API rate limit exceeded. Try again in ${Math.ceil(waitTime / 60000)} minutes.`)
    }

    let lastError: Error | null = null
    
    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        this.recordRequest()
        const response = await fetch(url, options)
        
        if (response.ok) {
          return response
        }

        // Handle specific YouTube API errors
        if (response.status === 403) {
          const errorText = await response.text().catch(() => "Unknown error")
          if (errorText.includes("Sign in to confirm you're not a bot")) {
            throw new Error("YouTube bot detection triggered - API access blocked from this IP. Consider using client-side extraction or different API endpoints.")
          }
          throw new Error("YouTube API access forbidden - check API key and quotas")
        }
        if (response.status === 429) {
          throw new Error("YouTube API rate limit exceeded")
        }
        if (response.status === 404) {
          throw new Error("YouTube video not found or unavailable")
        }
        if (response.status === 400) {
          throw new Error("YouTube API bad request - check video ID format")
        }

        throw new Error(`YouTube API error: ${response.status} ${response.statusText}`)
        
      } catch (error) {
        lastError = error as Error
        
        // Don't retry on certain errors
        if (error instanceof Error && (
          error.message.includes("bot detection") ||
          error.message.includes("not found") ||
          error.message.includes("bad request")
        )) {
          throw error
        }
        
        if (attempt < this.config.maxRetries) {
          // Exponential backoff: 1s, 2s, 4s
          const delay = 2 ** (attempt - 1) * 1000
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }

    throw lastError || new Error("YouTube API request failed after all retries")
  }

  getPlayerURL(_videoId: string): string {
    return `https://www.youtube.com/youtubei/v1/player?key=${this.config.apiKey}`
  }

  getPlayerRequestBody(videoId: string): string {
    return JSON.stringify({
      context: {
        client: {
          clientName: "WEB",
          clientVersion: "2.20240101.00.00",
        },
      },
      videoId: videoId,
    })
  }

  getRequestHeaders(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Origin": "https://www.youtube.com",
      "Referer": "https://www.youtube.com/",
    }
  }

  getRemainingRequests(): number {
    this.cleanupOldRequests()
    return Math.max(0, this.config.maxRequestsPerHour - this.rateLimitState.requests.length)
  }

  getResetTime(): Date {
    if (this.rateLimitState.requests.length === 0) {
      return new Date()
    }
    const oldestRequest = Math.min(...this.rateLimitState.requests)
    return new Date(oldestRequest + 3600000)
  }
}

// Singleton instance
let apiManager: YouTubeAPIManager | null = null

export function getYouTubeAPIManager(): YouTubeAPIManager {
  if (!apiManager) {
    apiManager = new YouTubeAPIManager()
  }
  return apiManager
}

export type { YouTubeAPIConfig, RateLimitState }