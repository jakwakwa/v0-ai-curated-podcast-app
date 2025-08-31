import { Storage } from "@google-cloud/storage"
import { getEnv } from "@/utils/helpers"

let storageUploader: Storage | undefined
let storageReader: Storage | undefined

function looksLikeJson(value: string | undefined): boolean {
	if (!value) return false
	const trimmed = value.trim()
	return trimmed.startsWith("{") || trimmed.startsWith("[") || trimmed.includes('"type"')
}

function maybeDecodeBase64(value: string | undefined): string | undefined {
	if (!value) return value
	try {
		// Heuristic: base64 strings are long and valid base64 chars; try decoding
		if (/^[A-Za-z0-9+/=\n\r]+$/.test(value) && value.length > 200) {
			const decoded = Buffer.from(value, "base64").toString("utf8")
			return decoded
		}
	} catch {}
	return value
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

	const uploaderRaw0 = getEnv("GCS_UPLOADER_KEY_JSON") ?? getEnv("GCS_UPLOADER_KEY") ?? getEnv("GCS_UPLOADER_KEY_PATH")
	const readerRaw0 = getEnv("GCS_READER_KEY_JSON") ?? getEnv("GCS_READER_KEY") ?? getEnv("GCS_READER_KEY_PATH")

	if (!(uploaderRaw0 && readerRaw0)) {
		const missing: string[] = []
		if (!uploaderRaw0) missing.push("GCS_UPLOADER_KEY_JSON|GCS_UPLOADER_KEY|GCS_UPLOADER_KEY_PATH")
		if (!readerRaw0) missing.push("GCS_READER_KEY_JSON|GCS_READER_KEY|GCS_READER_KEY_PATH")
		throw new Error(`Missing Google Cloud credentials: ${missing.join(", ")}`)
	}

	// Support base64-encoded JSON blobs from Vercel env
	const uploaderRaw = maybeDecodeBase64(uploaderRaw0)
	const readerRaw = maybeDecodeBase64(readerRaw0)

	try {
		if (looksLikeJson(uploaderRaw) && looksLikeJson(readerRaw)) {
			// Do not log secrets or absolute paths
			storageUploader = new Storage({ credentials: JSON.parse(uploaderRaw!) })
			storageReader = new Storage({ credentials: JSON.parse(readerRaw!) })
		} else {
			// Treat as key file paths
			storageUploader = new Storage({ keyFilename: uploaderRaw! })
			storageReader = new Storage({ keyFilename: readerRaw! })
		}
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

export function parseGcsUri(uri: string): { bucket: string; object: string } | null {
	if (!uri.startsWith("gs://")) return null
	const withoutScheme = uri.slice(5)
	const slash = withoutScheme.indexOf("/")
	if (slash === -1) return null
	const bucket = withoutScheme.slice(0, slash)
	const object = withoutScheme.slice(slash + 1)
	return { bucket, object }
}
