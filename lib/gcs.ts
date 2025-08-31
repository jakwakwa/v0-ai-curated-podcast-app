import { Storage } from "@google-cloud/storage"
import { ExternalAccountClient } from "google-auth-library"
import { getVercelOidcToken } from "@vercel/functions/oidc"
import { getEnv } from "@/utils/helpers"

let storageUploader: Storage | undefined
let storageReader: Storage | undefined

function createOidcAuthClient(): ExternalAccountClient | null {
  const projectNumber = process.env.GCP_PROJECT_NUMBER
  const poolId = process.env.GCP_WORKLOAD_IDENTITY_POOL_ID
  const providerId = process.env.GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID
  const serviceAccountEmail = process.env.GCP_SERVICE_ACCOUNT_EMAIL
  // Vercel provides an OIDC token only inside serverless/edge runtimes
  const isVercel = Boolean(process.env.VERCEL)

  if (!(projectNumber && poolId && providerId && serviceAccountEmail && isVercel)) {
    return null
  }

  try {
    const authClient = ExternalAccountClient.fromJSON({
      type: "external_account",
      audience: `//iam.googleapis.com/projects/${projectNumber}/locations/global/workloadIdentityPools/${poolId}/providers/${providerId}`,
      subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
      token_url: "https://sts.googleapis.com/v1/token",
      service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${serviceAccountEmail}:generateAccessToken`,
      subject_token_supplier: {
        getSubjectToken: getVercelOidcToken,
      },
    })

    return authClient
  } catch {
    // If modules aren't available or runtime doesn't support OIDC, fall back to legacy credentials
    return null
  }
}

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
	const name = process.env.GCS_USER_EPISODES_BUCKET_NAME
	if (!name) {
		throw new Error("GCS_USER_EPISODES_BUCKET_NAME is not set")
	}
	return name
}

function initStorageClients(): { storageUploader: Storage; storageReader: Storage } {
	if (storageUploader && storageReader) {
		return { storageUploader, storageReader }
	}

	// 1) Try OIDC (Workload Identity Federation) if configured
	const authClient = createOidcAuthClient()
	if (authClient) {
		const projectId = process.env.GCP_PROJECT_ID
		storageUploader = new Storage({ authClient: authClient as any, projectId })
		storageReader = new Storage({ authClient: authClient as any, projectId })
		return { storageUploader: storageUploader!, storageReader: storageReader! }
	}

	// 2) Fallback to legacy key JSON / path envs
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
			storageUploader = new Storage({ credentials: JSON.parse(uploaderRaw!) })
			storageReader = new Storage({ credentials: JSON.parse(readerRaw!) })
		} else {
			storageUploader = new Storage({ keyFilename: uploaderRaw! })
			storageReader = new Storage({ keyFilename: readerRaw! })
		}
	} catch {
		throw new Error("Failed to initialize Google Cloud Storage clients")
	}

	return { storageUploader: storageUploader!, storageReader: storageReader! }
}

export function getStorageUploader(): Storage {
	if (!(storageUploader && storageReader)) initStorageClients()
	return storageUploader as Storage
}

export function getStorageReader(): Storage {
	if (!(storageUploader && storageReader)) initStorageClients()
	return storageReader as Storage
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
