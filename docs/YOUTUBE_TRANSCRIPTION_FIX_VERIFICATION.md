# YouTube Transcription Fix - Verification Guide

## Overview
This document explains how to verify that the YouTube transcription failure fix is working correctly.

## What Was Fixed

### 1. Hard-coded YouTube API Key
**Before**: Used hardcoded API key `AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8`
**After**: Uses environment variable `YOUTUBE_API_KEY`

### 2. Provider URL Detection
**Before**: YouTube URLs were incorrectly processed as non-audio, causing unnecessary uploads
**After**: Google Video URLs (`googlevideo.com`) are properly detected as audio streams

### 3. Saga Audio Extraction
**Before**: Saga passed original YouTube URLs directly to providers
**After**: Saga extracts audio URLs from YouTube before dispatching to providers

## Environment Setup

Ensure the following environment variable is set:
```bash
YOUTUBE_API_KEY=your-youtube-api-key-here
```

## Testing the Fix

### 1. Monitor Debug Logs
Look for these log entries in episode debug logs:

```
✅ SUCCESS: youtube-extract: "Extracted audio URL from YouTube"
✅ SUCCESS: assemblyai: URL audio detection: looks like audio  
✅ SUCCESS: assemblyai: Would submit directly to AssemblyAI
```

### 2. Check Provider Processing
- **AssemblyAI**: Should receive `googlevideo.com` URLs and process them directly
- **Rev.ai**: Should receive `googlevideo.com` URLs as backup
- **Gemini**: Should receive `googlevideo.com` URLs as final fallback

### 3. Expected Flow
1. User submits YouTube URL (`https://youtube.com/watch?v=...`)
2. Saga extracts audio URL (`https://googlevideo.com/videoplayback?...`)
3. Providers receive direct audio stream URL
4. Transcription succeeds, unblocking TTS generation

## Debugging Failed Transcriptions

### Check Environment Variables
```bash
# Verify YouTube API key is set
echo $YOUTUBE_API_KEY

# Should not be empty or "undefined"
```

### Monitor Episode Debug Logs
Look for these failure patterns:

❌ **Missing API Key**:
```
youtube-extract: fail - "YouTube API key not available for audio extraction"
```

❌ **Invalid Video ID**:
```
youtube-extract: fail - "Failed to extract audio URL from YouTube"
```

❌ **Provider Upload Issues**:
```
assemblyai: info - "URL doesn't look like audio, uploading to AssemblyAI"
assemblyai: fail - "AssemblyAI upload failed: ..."
```

### Validation Checklist

- [ ] `YOUTUBE_API_KEY` environment variable is set
- [ ] YouTube URL extraction returns `googlevideo.com` URLs
- [ ] AssemblyAI worker detects URLs as audio (`looksLikeAudio: true`)
- [ ] Provider workers receive processed URLs, not original YouTube URLs
- [ ] Debug logs show successful audio extraction
- [ ] Transcription completes successfully
- [ ] TTS generation is triggered downstream

## Common Issues

### 1. YouTube API Quota Exceeded
**Symptoms**: All YouTube extractions fail
**Solution**: Check YouTube API quotas in Google Cloud Console

### 2. Invalid YouTube URLs
**Symptoms**: Video ID extraction fails
**Solution**: Ensure URLs match supported patterns:
- `https://youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://youtube.com/embed/VIDEO_ID`

### 3. Network Issues
**Symptoms**: API calls timeout or fail
**Solution**: Check network connectivity and firewall rules

## Success Metrics

After the fix, you should see:
- ↑ Increase in successful transcriptions from YouTube URLs
- ↓ Decrease in "All providers failed" errors
- ↑ Increase in TTS audio generation (downstream workflow)
- ↓ Decrease in provider upload operations for YouTube content

## Rollback Plan

If issues occur, the changes can be reverted by:
1. Reverting the hardcoded API key in `youtube-audio-extractor.ts`
2. Removing the audio extraction logic from `transcription-saga.ts`
3. Reverting the `looksLikeAudio` logic in `assemblyai-worker.ts`

The changes are surgical and isolated, making rollback safe and straightforward.