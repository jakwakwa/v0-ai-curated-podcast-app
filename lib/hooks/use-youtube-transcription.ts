"use client"

import { useState, useCallback } from "react"
import { extractYouTubeTranscript, extractYouTubeTranscriptWithFallback } from "@/lib/client-youtube-transcript"

export interface TranscriptionState {
	isLoading: boolean
	isSuccess: boolean
	isError: boolean
	transcript?: string
	segments?: Array<{ text: string; start: number; duration: number }>
	error?: string
	videoId?: string
}

export interface TranscriptionOptions {
	useFallback?: boolean
	onSuccess?: (result: TranscriptionState) => void
	onError?: (error: string) => void
}

export function useYouTubeTranscription(options: TranscriptionOptions = {}) {
	const [state, setState] = useState<TranscriptionState>({
		isLoading: false,
		isSuccess: false,
		isError: false,
	})

	const extractTranscript = useCallback(async (url: string) => {
		setState({
			isLoading: true,
			isSuccess: false,
			isError: false,
		})

		try {
			const result = options.useFallback
				? await extractYouTubeTranscriptWithFallback(url)
				: await extractYouTubeTranscript(url)

			if (result.success) {
				const newState: TranscriptionState = {
					isLoading: false,
					isSuccess: true,
					isError: false,
					transcript: result.transcript,
					segments: result.segments,
					videoId: result.videoId,
				}

				setState(newState)
				options.onSuccess?.(newState)
				return newState
			} else {
				const newState: TranscriptionState = {
					isLoading: false,
					isSuccess: false,
					isError: true,
					error: result.error,
					videoId: result.videoId,
				}

				setState(newState)
				options.onError?.(result.error || "Transcription failed")
				return newState
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
			const newState: TranscriptionState = {
				isLoading: false,
				isSuccess: false,
				isError: true,
				error: errorMessage,
			}

			setState(newState)
			options.onError?.(errorMessage)
			return newState
		}
	}, [options])

	const reset = useCallback(() => {
		setState({
			isLoading: false,
			isSuccess: false,
			isError: false,
		})
	}, [])

	return {
		...state,
		extractTranscript,
		reset,
	}
}

export default useYouTubeTranscription