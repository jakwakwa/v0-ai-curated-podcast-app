import { Storage } from "@google-cloud/storage"

let _gcsUploader: Storage | undefined
let _gcsReader: Storage | undefined

function looksLikeJson(value: string | undefined): boolean {
	if (!value) return false
	const trimmed = value.trim()
	return trimmed.startsWith("{") || trimmed.startsWith("[") || trimmed.includes('"type"')
}

function decodeMaybeBase64(raw: string | undefined): string | undefined {
	if (!raw) return undefined
	try {
		const maybe = Buffer.from(raw, "base64").toString("utf8")
		if (looksLikeJson(maybe)) return maybe
		return raw
	} catch {
		return raw
	}
}

function normalizePrivateKey(jsonString: string): string {
	try {
		const obj = JSON.parse(jsonString)
		if (typeof obj.private_key === "string") {
			obj.private_key = obj.private_key.replace(/\\n/g, "\n")
		}
		return JSON.stringify(obj)
	} catch {
		return jsonString
	}
}

export function getGcsUploader(): Storage {
	if (_gcsUploader) return _gcsUploader
	const raw = decodeMaybeBase64(
		process.env.GCS_UPLOADER_KEY_JSON || process.env.GCS_UPLOADER_KEY || process.env.GCS_UPLOADER_KEY_PATH
	)
	if (!raw) throw new Error("Google Cloud credentials for uploader are not configured")
	try {
		if (looksLikeJson(raw)) {
			const normalized = normalizePrivateKey(raw)
			_gcsUploader = new Storage({ credentials: JSON.parse(normalized) })
		} else {
			_gcsUploader = new Storage({ keyFilename: raw })
		}
		return _gcsUploader
	} catch {
		throw new Error("Failed to initialize Google Cloud Storage uploader")
	}
}

export function getGcsReader(): Storage {
	if (_gcsReader) return _gcsReader
	const raw = decodeMaybeBase64(
		process.env.GCS_READER_KEY_JSON || process.env.GCS_READER_KEY || process.env.GCS_READER_KEY_PATH
	)
	if (!raw) throw new Error("Google Cloud credentials for reader are not configured")
	try {
		if (looksLikeJson(raw)) {
			const normalized = normalizePrivateKey(raw)
			_gcsReader = new Storage({ credentials: JSON.parse(normalized) })
		} else {
			_gcsReader = new Storage({ keyFilename: raw })
		}
		return _gcsReader
	} catch {
		throw new Error("Failed to initialize Google Cloud Storage reader")
	}
}

export function getGcsBucketName(): string {
	const name = process.env.GOOGLE_CLOUD_STORAGE_BUCKET_NAME
	if (!name) throw new Error("GOOGLE_CLOUD_STORAGE_BUCKET_NAME is not set")
	return name
}