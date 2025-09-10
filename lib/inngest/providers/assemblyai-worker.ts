// lib/inngest/providers/assemblyai-worker.ts

import { writeEpisodeDebugLog } from "@/lib/debug-logger";
import { inngest } from "@/lib/inngest/client";
import { classifyError, ProviderStartedSchema } from "../utils/results";

const ASSEMBLY_BASE_URL = "https://api.assemblyai.com/v2";

async function uploadToAssembly(srcUrl: string, apiKey: string): Promise<string> {
	const source = await fetch(srcUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
	if (!(source.ok && source.body)) {
		let bodySnippet = "";
		try {
			bodySnippet = (await source.text()).slice(0, 500);
		} catch {}
		throw new Error(`Failed to download source audio. status=${source.status} body=${bodySnippet}`);
	}
	const bodyStream = source.body;
	if (!bodyStream) throw new Error("Missing response body stream");
	const uploaded = await fetch(`${ASSEMBLY_BASE_URL}/upload`, {
		method: "POST",
		headers: { Authorization: apiKey, "Content-Type": "application/octet-stream" },
		// @ts-expect-error Node.js fetch streaming request bodies require duplex property
		duplex: "half",
		body: bodyStream,
	});
	if (!uploaded.ok) {
		let bodySnippet = "";
		try {
			bodySnippet = (await uploaded.text()).slice(0, 500);
		} catch {}
		throw new Error(`AssemblyAI upload failed. status=${uploaded.status} body=${bodySnippet}`);
	}
	const json = (await uploaded.json()) as { upload_url?: string };
	if (!json.upload_url) throw new Error("AssemblyAI upload ok but missing upload_url");
	return json.upload_url;
}

async function startJob(audioUrl: string, apiKey: string, languageCode?: string): Promise<string> {
	const res = await fetch(`${ASSEMBLY_BASE_URL}/transcript`, {
		method: "POST",
		headers: { Authorization: apiKey, "Content-Type": "application/json" },
		body: JSON.stringify({ audio_url: audioUrl, language_code: languageCode ?? undefined, speaker_labels: false, punctuate: true, format_text: true }),
	});
	if (!res.ok) throw new Error(`AssemblyAI job start failed: ${await res.text()}`);
	const data = (await res.json()) as { id: string };
	return data.id;
}

async function pollJob(id: string, apiKey: string): Promise<{ status: string; text?: string; error?: string }> {
	const res = await fetch(`${ASSEMBLY_BASE_URL}/transcript/${id}`, { headers: { Authorization: apiKey } });
	if (!res.ok) throw new Error(`AssemblyAI job fetch failed: ${await res.text()}`);
	const data = (await res.json()) as { status: string; text?: string; error?: string };
	return data;
}

export const assemblyAiWorker = inngest.createFunction(
	{ id: "provider-assemblyai", name: "Provider: AssemblyAI", retries: 0 },
	{ event: "transcription.provider.assemblyai.start" },
	async ({ event, step }) => {
		const { jobId, userEpisodeId, srcUrl, lang } = ProviderStartedSchema.parse(event.data);
		const apiKey = process.env.ASSEMBLYAI_API_KEY;
		if (!apiKey) return;

		await step.run("log-start", async () => {
			await writeEpisodeDebugLog(userEpisodeId, { step: "assemblyai", status: "start", meta: { jobId } });
		});

		try {
			// Always proxy-upload to avoid ephemeral/geo/IP-bound URLs
			const submitUrl = await step.run("upload", async () => await uploadToAssembly(srcUrl, apiKey));
			const job = await step.run("start", async () => await startJob(submitUrl, apiKey, lang));
			// Short poll with budget; we only need first completion
			const maxPolls = 8;
			for (let i = 0; i < maxPolls; i++) {
				const res = await step.run("poll", async () => await pollJob(job, apiKey));
				if (res.status === "completed" && res.text) {
					await step.sendEvent("succeeded", {
						name: "transcription.succeeded",
						data: { jobId, userEpisodeId, provider: "assemblyai", transcript: res.text, meta: { job } },
					});
					return;
				}
				if (res.status === "error") throw new Error(res.error || "AssemblyAI job failed");
				// @ts-expect-error Inngest step.sleep is provided at runtime
				await step.sleep("15s");
			}
			await step.sendEvent("failed", {
				name: "transcription.failed",
				data: { jobId, userEpisodeId, provider: "assemblyai", errorType: "timeout", errorMessage: "AssemblyAI job in progress; retry later" },
			});
		} catch (e) {
			const { errorType, errorMessage } = classifyError(e);
			await step.sendEvent("failed", {
				name: "transcription.failed",
				data: { jobId, userEpisodeId, provider: "assemblyai", errorType, errorMessage },
			});
		}
	}
);
