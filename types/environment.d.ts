// This file extends the NodeJS.ProcessEnv interface to include custom environment variables.
// This provides type safety when accessing process.env properties.

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
interface IProcessEnv {
	NODE_ENV: "development" | "production" | "staging"
	XAI_API_KEY: string
	NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string
	CLERK_SECRET_KEY: string
	NEXT_GOOGLE_GENERATIVE_AI_API_KEY: string
	GOOGLE_GENERATIVE_AI_API_KEY: string
	GOOGLE_CLOUD_PROJECT_ID: string
	GOOGLE_CLOUD_STORAGE_BUCKET_NAME: string
	INNGEST_EVENT_KEY?: string
	INNGEST_SIGNING_KEY?: string
	DATABASE_URL: string
	GCS_UPLOADER_KEY_PATH: Blob
	GCS_READER_KEY_PATH: Blob
}

declare global {
	interface IProcessEnv extends globalThis.IProcessEnv {}
}

export { global }
