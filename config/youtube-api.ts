/**
 * YouTube API Configuration
 * 
 * ⚠️ CRITICAL RISK WARNING ⚠️
 * This file configures access to YouTube's internal/undocumented APIs.
 * These APIs are NOT officially supported and may break without notice.
 * 
 * See docs/YOUTUBE_API_RISKS.md for comprehensive risk analysis and mitigation strategies.
 */

/**
 * YouTube API endpoints and configuration
 */
export const YOUTUBE_API_CONFIG = {
  // ⚠️ INTERNAL/UNDOCUMENTED API - HIGH RISK
  // This endpoint provides access to video streaming data and captions
  // but is not officially supported and may break at any time
  INTERNAL_PLAYER_API: "https://www.youtube.com/youtubei/v1/player",
  
  // Official YouTube Data API v3 (recommended for metadata)
  // Requires API key and has quota limitations but is officially supported
  DATA_API_V3: "https://www.googleapis.com/youtube/v3",
  
  // Official oEmbed endpoint (recommended for basic metadata)
  // No API key required, rate limited, but officially supported
  OEMBED_API: "https://www.youtube.com/oembed",
  
  // Default client configuration for internal API calls
  DEFAULT_CLIENT: {
    clientName: "WEB",
    clientVersion: "2.20240101.00.00"
  },
  
  // Default headers for internal API calls
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Referer": "https://www.youtube.com/",
    "Origin": "https://www.youtube.com"
  }
} as const;

/**
 * Feature flags for API usage
 * These can be used to gradually migrate away from internal APIs
 */
export const YOUTUBE_API_FEATURES = {
  // Whether to use internal API for streaming data (high risk)
  USE_INTERNAL_STREAMING_API: true,
  
  // Whether to use internal API for captions (high risk)
  USE_INTERNAL_CAPTIONS_API: true,
  
  // Whether to prefer official APIs when available (recommended)
  PREFER_OFFICIAL_APIS: true,
  
  // Whether to enable fallback mechanisms
  ENABLE_FALLBACKS: true,
  
  // Whether to enable aggressive caching to reduce API calls
  ENABLE_AGGRESSIVE_CACHING: true
} as const;

/**
 * API Error handling configuration
 */
export const YOUTUBE_API_ERROR_CONFIG = {
  // Maximum retry attempts for failed API calls
  MAX_RETRIES: 3,
  
  // Base delay for exponential backoff (ms)
  BASE_DELAY: 1000,
  
  // Maximum delay for exponential backoff (ms)
  MAX_DELAY: 10000,
  
  // Timeout for API requests (ms)
  REQUEST_TIMEOUT: 30000
} as const;

/**
 * Environment variable names for API keys
 */
export const YOUTUBE_API_ENV_VARS = {
  // YouTube Data API v3 key (official)
  DATA_API_KEY: "YOUTUBE_API_KEY",
  
  // Player API key (for internal API)
  PLAYER_API_KEY: "YOUTUBE_PLAYER_API_KEY"
} as const;

/**
 * Utility function to get API key from environment
 */
export function getYouTubeApiKey(preferPlayer = false): string | null {
  if (preferPlayer) {
    return process.env[YOUTUBE_API_ENV_VARS.PLAYER_API_KEY] || 
           process.env[YOUTUBE_API_ENV_VARS.DATA_API_KEY] || 
           null;
  }
  
  return process.env[YOUTUBE_API_ENV_VARS.DATA_API_KEY] || 
         process.env[YOUTUBE_API_ENV_VARS.PLAYER_API_KEY] || 
         null;
}

/**
 * Build URL for internal YouTube player API
 * ⚠️ WARNING: This uses an undocumented API that may break
 */
export function buildYouTubePlayerApiUrl(apiKey?: string): string {
  const baseUrl = YOUTUBE_API_CONFIG.INTERNAL_PLAYER_API;
  if (apiKey) {
    return `${baseUrl}?key=${apiKey}`;
  }
  return baseUrl;
}

/**
 * Build request body for YouTube player API
 */
export function buildYouTubePlayerRequestBody(videoId: string, context?: any) {
  return {
    context: context || {
      client: YOUTUBE_API_CONFIG.DEFAULT_CLIENT
    },
    videoId
  };
}

/**
 * Health check for YouTube APIs
 * Returns true if the API is responding, false otherwise
 */
export async function checkYouTubeApiHealth(): Promise<boolean> {
  try {
    const testVideoId = "dQw4w9WgXcQ"; // Rick Roll - should always exist
    const response = await fetch(YOUTUBE_API_CONFIG.INTERNAL_PLAYER_API, {
      method: "POST",
      headers: YOUTUBE_API_CONFIG.DEFAULT_HEADERS,
      body: JSON.stringify(buildYouTubePlayerRequestBody(testVideoId)),
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    
    return response.ok;
  } catch (error) {
    console.warn("[YouTube API Health Check] Failed:", error);
    return false;
  }
}

/**
 * Risk levels for different YouTube API operations
 */
export const YOUTUBE_API_RISK_LEVELS = {
  METADATA_OFFICIAL: "LOW",      // Using official APIs for metadata
  METADATA_INTERNAL: "MEDIUM",   // Using internal APIs for metadata
  STREAMING_DATA: "HIGH",        // Using internal APIs for streaming data
  CAPTIONS_INTERNAL: "HIGH"      // Using internal APIs for captions
} as const;