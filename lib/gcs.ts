import { Storage } from "@google-cloud/storage"
import { getEnv } from "@/utils/helpers"

let storageUploader: Storage | undefined
let storageReader: Storage | undefined

function looksLikeJson(value: string | undefined): boolean {
	if (!value) return false
	const trimmed = value.trim()
	return trimmed.startsWith("{") || trimmed.startsWith("[") || trimmed.includes('"type"')
}

export function ensureBucketName(): string {
	const name = process.env.GOOGLE_CLOUD_STORAGE_BUCKET_NAME
	if (!name) {
		throw new Error("GOOGLE_CLOUD_STORAGE_BUCKET_NAME is not set")
	}
	return name
}

function initStorageClients(): { storageUploader: Storage; storageReader: Storage } {
	if (storageUploader && storageReader) {
		return { storageUploader, storageReader }
	}

	const isDevelopment = process.env.NODE_ENV === "development" || !process.env.NODE_ENV

	const uploaderRaw = getEnv("GCS_UPLOADER_KEY_JSON") ?? getEnv("GCS_UPLOADER_KEY") ?? getEnv("GCS_UPLOADER_KEY_PATH")
	const readerRaw = getEnv("GCS_READER_KEY_JSON") ?? getEnv("GCS_READER_KEY") ?? getEnv("GCS_READER_KEY_PATH")

	if (!(uploaderRaw && readerRaw)) {
		const missing: string[] = []
		if (!uploaderRaw) missing.push("GCS_UPLOADER_KEY_JSON|GCS_UPLOADER_KEY|GCS_UPLOADER_KEY_PATH")
		if (!readerRaw) missing.push("GCS_READER_KEY_JSON|GCS_READER_KEY|GCS_READER_KEY_PATH")
		throw new Error(`Missing Google Cloud credentials: ${missing.join(", ")}`)
	}

	try {
		if (isDevelopment && looksLikeJson(uploaderRaw) && looksLikeJson(readerRaw)) {
			console.log("Initializing Storage clients (JSON credentials)")
			storageUploader = new Storage({ credentials: JSON.parse(uploaderRaw) })
			storageReader = new Storage({ credentials: JSON.parse(readerRaw) })
		} else {
			console.log("Initializing Storage clients (key file paths)")
			storageUploader = new Storage({ keyFilename: uploaderRaw })
			storageReader = new Storage({ keyFilename: readerRaw })
		}
		console.log("Storage clients initialized")
	} catch {
		throw new Error("Failed to initialize Google Cloud Storage clients")
	}

	return { storageUploader: storageUploader!, storageReader: storageReader! }
}

export function getStorageUploader(): Storage {
	return initStorageClients().storageUploader
}

export function getStorageReader(): Storage {
	return initStorageClients().storageReader
}
