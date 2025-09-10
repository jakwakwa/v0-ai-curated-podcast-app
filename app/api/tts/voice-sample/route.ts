import { GoogleGenAI } from "@google/genai"
import mime from "mime"
import { NextResponse } from "next/server"
import { VOICE_NAMES, VOICE_OPTIONS } from "@/lib/constants/voices"

interface WavConversionOptions {
	numChannels: number
	sampleRate: number
	bitsPerSample: number
}

function parseMimeType(mimeType: string) {
	const [fileType, ...params] = mimeType.split(";").map(s => s.trim())
	const [, format] = fileType.split("/")
	const options: Partial<WavConversionOptions> = { numChannels: 1 }
	if (format?.startsWith("L")) {
		const bits = parseInt(format.slice(1), 10)
		if (!Number.isNaN(bits)) options.bitsPerSample = bits
	}
	for (const param of params) {
		const [key, value] = param.split("=").map(s => s.trim())
		if (key === "rate") options.sampleRate = parseInt(value, 10)
	}
	return options as WavConversionOptions
}

function createWavHeader(dataLength: number, options: WavConversionOptions) {
	const { numChannels, sampleRate, bitsPerSample } = options
	const byteRate = (sampleRate * numChannels * bitsPerSample) / 8
	const blockAlign = (numChannels * bitsPerSample) / 8
	const buffer = Buffer.alloc(44)
	buffer.write("RIFF", 0)
	buffer.writeUInt32LE(36 + dataLength, 4)
	buffer.write("WAVE", 8)
	buffer.write("fmt ", 12)
	buffer.writeUInt32LE(16, 16)
	buffer.writeUInt16LE(1, 20)
	buffer.writeUInt16LE(numChannels, 22)
	buffer.writeUInt32LE(sampleRate, 24)
	buffer.writeUInt32LE(byteRate, 28)
	buffer.writeUInt16LE(blockAlign, 32)
	buffer.writeUInt16LE(bitsPerSample, 34)
	buffer.write("data", 36)
	buffer.writeUInt32LE(dataLength, 40)
	return buffer
}

function convertToWav(rawBase64: string, mimeType: string) {
	const options = parseMimeType(mimeType)
	const pcm = Buffer.from(rawBase64, "base64")
	const header = createWavHeader(pcm.length, options)
	return Buffer.concat([header, pcm])
}

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)
		const voice = searchParams.get("voice") || ""
		if (!VOICE_NAMES.includes(voice)) {
			return new NextResponse("Invalid voice", { status: 400 })
		}

		const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY
		if (!apiKey) return new NextResponse("Missing API key", { status: 500 })

		const sampleText = VOICE_OPTIONS.find(v => v.name === voice)?.sample || "This is a quick voice sample for your episode."

		const ai = new GoogleGenAI({ apiKey })
		const response = await ai.models.generateContentStream({
			model: "gemini-2.5-flash-preview-tts",
			config: { responseModalities: ["audio"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } } },
			contents: [{ role: "user", parts: [{ text: sampleText }] }],
		})

		for await (const chunk of response) {
			const inlineData = chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData as { data?: string; mimeType?: string } | undefined
			if (!inlineData) continue
			const ext = mime.getExtension(inlineData.mimeType || "")
			let buf = Buffer.from(inlineData.data || "", "base64")
			if (!ext || ext !== "wav") {
				buf = convertToWav(inlineData.data || "", inlineData.mimeType || "audio/L16;rate=24000")
			}
			return new NextResponse(buf, {
				headers: {
					"Content-Type": "audio/wav",
					"Cache-Control": "public, max-age=86400",
				},
			})
		}

		return new NextResponse("No audio data", { status: 502 })
	} catch (error) {
		console.error("[VOICE_SAMPLE_API]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}
