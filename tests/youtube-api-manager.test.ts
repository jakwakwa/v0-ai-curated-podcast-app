import { describe, it, expect, beforeEach, vi } from 'vitest'

// Create a minimal test that doesn't require database setup
describe('YouTube API Security', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not contain hardcoded API keys in providers', async () => {
    // Test that the providers don't contain hardcoded keys
    const { YouTubeClientProvider } = await import('../lib/transcripts/providers/youtube-client')
    const { YouTubeAudioExtractorProvider } = await import('../lib/transcripts/providers/youtube-audio-extractor')
    
    // Check the source doesn't contain the hardcoded key
    const clientProviderSource = YouTubeClientProvider.toString()
    const audioExtractorSource = YouTubeAudioExtractorProvider.toString()
    
    expect(clientProviderSource).not.toContain('AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8')
    expect(audioExtractorSource).not.toContain('AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8')
  })

  it('should require environment variables for YouTube API', async () => {
    // Temporarily remove API key
    const originalKey = process.env.YOUTUBE_API_KEY
    process.env.YOUTUBE_API_KEY = undefined
    
    try {
      const { getYouTubeAPIManager } = await import('../lib/transcripts/youtube-api-manager')
      expect(() => getYouTubeAPIManager()).toThrow('YOUTUBE_API_KEY environment variable is required')
    } finally {
      // Restore original key
      if (originalKey) {
        process.env.YOUTUBE_API_KEY = originalKey
      }
    }
  })

  it('should validate YouTube URL patterns', () => {
    const testUrls = [
      { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', valid: true },
      { url: 'https://youtu.be/dQw4w9WgXcQ', valid: true },
      { url: 'https://youtube.com/embed/dQw4w9WgXcQ', valid: true },
      { url: 'https://example.com/video', valid: false },
      { url: 'not-a-url', valid: false }
    ]

    for (const { url, valid } of testUrls) {
      const isYouTube = /youtu(be\.be|be\.com)/i.test(url)
      expect(isYouTube).toBe(valid)
    }
  })
})