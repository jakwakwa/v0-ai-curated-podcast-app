import { Storage } from "@google-cloud/storage"
import { getEnv } from "@/utils/helpers"

let storageUploader: Storage | undefined
let storageReader: Storage | undefined

function getEnvironment(): "development" | "production" | "preview" {
	// Use VERCEL_ENV if present (production, preview, development), otherwise fall back to NODE_ENV
	const env = process.env.VERCEL_ENV || process.env.NODE_ENV || "development"
	if (env === "production" || env === "preview" || env === "development") {
		return env
	}
	// Default to development for unknown environments
	return "development"
}

export function ensureBucketName(): string {
	const name = process.env.GOOGLE_CLOUD_STORAGE_BUCKET_NAME
	if (!name) {
		throw new Error("GOOGLE_CLOUD_STORAGE_BUCKET_NAME is not set")
	}
	return name
}

export function ensureUserEpisodesBucketName(): string {
	// Deprecated: always return the primary bucket
	return ensureBucketName()
}

function initStorageClients(): { storageUploader: Storage; storageReader: Storage } {
	if (storageUploader && storageReader) {
		return { storageUploader, storageReader }
	}

	const environment = getEnvironment()

	let uploaderRaw: string | undefined
	let readerRaw: string | undefined
	const missing: string[] = []

	if (environment === "development") {
		// Development: only support PATH variables
		uploaderRaw = getEnv("GCS_UPLOADER_KEY_PATH")
		readerRaw = getEnv("GCS_READER_KEY_PATH")

		if (!uploaderRaw) missing.push("GCS_UPLOADER_KEY_PATH")
		if (!readerRaw) missing.push("GCS_READER_KEY_PATH")

		if (missing.length > 0) {
			throw new Error(`Missing Google Cloud credentials for development environment: ${missing.join(", ")}`)
		}

		try {
			if (process.env.NODE_ENV === "development") {
				console.log("Initializing Storage clients (development - key file paths)")
			}
			storageUploader = new Storage({ keyFilename: uploaderRaw })
			storageReader = new Storage({ keyFilename: readerRaw })
		} catch (_error) {
			throw new Error("Failed to initialize Google Cloud Storage clients with key file paths")
		}
	} else {
		// Production/Preview: only support JSON variables
		uploaderRaw = getEnv("GCS_UPLOADER_KEY_JSON")
		readerRaw = getEnv("GCS_READER_KEY_JSON")

		if (!uploaderRaw) missing.push("GCS_UPLOADER_KEY_JSON")
		if (!readerRaw) missing.push("GCS_READER_KEY_JSON")

		if (missing.length > 0) {
			throw new Error(`Missing Google Cloud credentials for ${environment} environment: ${missing.join(", ")}`)
		}

		try {
			storageUploader = new Storage({ credentials: JSON.parse(uploaderRaw!) })
			storageReader = new Storage({ credentials: JSON.parse(readerRaw!) })
		} catch (_error) {
			throw new Error("Failed to initialize Google Cloud Storage clients with JSON credentials")
		}
	}

	return { storageUploader: storageUploader!, storageReader: storageReader! }
}

export function getStorageUploader(): Storage {
	return initStorageClients().storageUploader
}

export function getStorageReader(): Storage {
	return initStorageClients().storageReader
}

export function parseGcsUri(uri: string): { bucket: string; object: string } | null {
	if (!uri.startsWith("gs://")) return null
	const withoutScheme = uri.slice(5)
	const slash = withoutScheme.indexOf("/")
	if (slash === -1) return null
	const bucket = withoutScheme.slice(0, slash)
	const object = withoutScheme.slice(slash + 1)
	return { bucket, object }
}
