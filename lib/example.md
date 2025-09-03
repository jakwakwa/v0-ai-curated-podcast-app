GOAL: Simplify
the
logic
for checking GCS environment variables

I
identified
a
very
effective
strategy
to
handle
environment - specific
credential
loading, we
should
be
explicitly
checking
process.env.NODE_ENV (or VERCEL_ENV )
to
avoid
issues
with looksLikeJson failing
on
Vercel
environment
variables.Here
's a revised code structure that implements this logic, separating credential loading based on the environment:

```typescript

import { Storage } from "@google-cloud/storage"

let _storageUploader: Storage | undefined
let _storageReader: Storage | undefined

// --- Helper functions for credential loading ---
// These functions will now be more specific to the environment type.

// Function to get credentials for the PRODUCTION/Vercel scenario (JSON string)
function getProdUploaderCredentialsJson(): string | undefined {
	return process.env.GCS_UPLOADER_KEY_JSON
}

function getProdReaderCredentialsJson(): string | undefined {
	return process.env.GCS_READER_KEY_JSON
}

// Function to get credentials for the DEVELOPMENT scenario (file path)
function getDevUploaderCredentialsPath(): string | undefined {
	// Prioritize GCS_UPLOADER_KEY_PATH, then GCS_UPLOADER_KEY
	return process.env.GCS_UPLOADER_KEY_PATH || process.env.GCS_UPLOADER_KEY
}

function getDevReaderCredentialsPath(): string | undefined {
	// Prioritize GCS_READER_KEY_PATH, then GCS_READER_KEY
	return process.env.GCS_READER_KEY_PATH || process.env.GCS_READER_KEY
}

// --- Main initialization logic ---

function initStorageClients(): { storageUploader: Storage; storageReader: Storage } {
	if (_storageUploader && _storageReader) {
		return { storageUploader: _storageUploader, storageReader: _storageReader }
	}

	// Determine the environment
	const isDevelopment = process.env.NODE_ENV === "development" // Or process.env.VERCEL_ENV === "development" for Vercel

	let uploaderCreds: object | string | undefined // Can be JSON object or file path string
	let readerCreds: object | string | undefined

	try {
		if (isDevelopment) {
			// Development environment: expect file paths
			console.log("Initializing GCS clients for DEVELOPMENT environment.")
			const uploaderPath = getDevUploaderCredentialsPath()
			const readerPath = getDevReaderCredentialsPath()

			if (!(uploaderPath && readerPath)) {
				throw new Error("Missing GCS file path credentials for Development environment.")
			}
			uploaderCreds = uploaderPath
			readerCreds = readerPath

			// Optional: Also allow GOOGLE_APPLICATION_CREDENTIALS for local development convenience
			if (!uploaderPath && process.env.GOOGLE_APPLICATION_CREDENTIALS) {
				console.log("Using GOOGLE_APPLICATION_CREDENTIALS for uploader in development.")
				// The Storage constructor without 'credentials' or 'keyFilename' will pick this up
			}
			if (!readerPath && process.env.GOOGLE_APPLICATION_CREDENTIALS) {
				console.log("Using GOOGLE_APPLICATION_CREDENTIALS for reader in development.")
			}
		} else {
			// Production/Vercel environment: expect JSON strings
			console.log("Initializing GCS clients for PRODUCTION environment (expecting JSON strings).")
			const uploaderJson = getProdUploaderCredentialsJson()
			const readerJson = getProdReaderCredentialsJson()

			if (!(uploaderJson && readerJson)) {
				throw new Error("Missing GCS JSON string credentials for Production environment.")
			}

			// Parse the JSON strings. No need for looksLikeJson or maybeDecodeBase64
			// if we strictly expect JSON strings in these specific variables.
			uploaderCreds = JSON.parse(uploaderJson)
			readerCreds = JSON.parse(readerJson)
		}

		// --- Initialize Storage clients ---
		// The Storage constructor can take either a 'credentials' object or a 'keyFilename' string.
		// We handle that based on what uploaderCreds/readerCreds ended up as.

		if (typeof uploaderCreds === "string") {
			_storageUploader = new Storage({ keyFilename: uploaderCreds })
		} else if (typeof uploaderCreds === "object") {
			_storageUploader = new Storage({ credentials: uploaderCreds })
		} else {
			// Fallback for ADC if neither custom path nor custom JSON was provided
			_storageUploader = new Storage()
		}

		if (typeof readerCreds === "string") {
			_storageReader = new Storage({ keyFilename: readerCreds })
		} else if (typeof readerCreds === "object") {
			_storageReader = new Storage({ credentials: readerCreds })
		} else {
			_storageReader = new Storage()
		}
	} catch (error: any) {
		console.error("GCS Client Initialization Error:", error.message, error)
		throw new Error(`Failed to initialize Google Cloud Storage clients: ${error.message}`)
	}

	return { storageUploader: _storageUploader!, storageReader: _storageReader! }
}

// Your existing getStorageUploader, getStorageReader, parseGcsUri, etc., remain the same.
export function getStorageUploader(): Storage {
	return initStorageClients().storageUploader
}

export function getStorageReader(): Storage {
	return initStorageClients().storageReader
}
// ... (rest of your functions like uploadContentToBucket, etc.)
```
