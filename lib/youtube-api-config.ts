/**
 * YouTube API configuration and feature flags
 * Controls the usage of undocumented YouTube APIs and fallback behavior
 */

export const YOUTUBE_API_CONFIG = {
  // Feature flag to enable/disable undocumented innertube API
  ENABLE_INNERTUBE_API: process.env.ENABLE_YOUTUBE_INNERTUBE !== 'false',
  
  // Official YouTube Data API v3 key (for future migration)
  YOUTUBE_DATA_API_KEY: process.env.YOUTUBE_DATA_API_V3_KEY,
  
  // Enhanced error monitoring
  ENABLE_ENHANCED_LOGGING: process.env.NODE_ENV !== 'production' || process.env.ENABLE_YOUTUBE_API_LOGGING === 'true',
  
  // Error webhook for monitoring (optional)
  ERROR_WEBHOOK_URL: process.env.YOUTUBE_API_ERROR_WEBHOOK,
}

/**
 * Log YouTube API errors with enhanced details for monitoring
 */
export function logYouTubeAPIError(context: {
  operation: string
  endpoint: string
  error: string | Error
  videoId?: string
  statusCode?: number
  metadata?: Record<string, unknown>
}) {
  if (!YOUTUBE_API_CONFIG.ENABLE_ENHANCED_LOGGING) return

  const logData = {
    timestamp: new Date().toISOString(),
    operation: context.operation,
    endpoint: context.endpoint,
    error: context.error instanceof Error ? context.error.message : context.error,
    videoId: context.videoId,
    statusCode: context.statusCode,
    metadata: context.metadata,
  }

  console.error(`[YOUTUBE_API_ERROR] ${context.operation}:`, logData)

  // Send to webhook if configured
  if (YOUTUBE_API_CONFIG.ERROR_WEBHOOK_URL) {
    fetch(YOUTUBE_API_CONFIG.ERROR_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logData),
    }).catch(err => {
      console.error('Failed to send YouTube API error to webhook:', err)
    })
  }
}

/**
 * Check if innertube API usage is enabled
 */
export function isInnertubeApiEnabled(): boolean {
  return YOUTUBE_API_CONFIG.ENABLE_INNERTUBE_API
}

/**
 * Get the appropriate YouTube API key for innertube requests
 */
export function getYouTubeAPIKey(): string | null {
  return process.env.YOUTUBE_PLAYER_API_KEY || process.env.YOUTUBE_API_KEY || null
}