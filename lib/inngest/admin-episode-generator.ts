import { generateText as genText } from "@/lib/genai";
import { combineAndUploadWavChunks, generateSingleSpeakerTts, splitScriptIntoChunks, uploadBufferToPrimaryBucket } from "@/lib/inngest/episode-shared";
import { prisma } from "@/lib/prisma";
import { generateObjectiveSummary } from "@/lib/summary";
import { inngest } from "./client";

// (Notification/email logic intentionally omitted for now)

// Admin-triggered generation for curated catalog episodes (Episode + Podcast tables)
// This mirrors the user workflow but targets unified Episode storage. Audio saved under /podcasts

interface AdminEpisodeEventData {
	sourceEpisodeId: string; // existing Episode or UserEpisode reference for transcript
	podcastId: string; // target podcast to attach the generated episode to
	adminUserId: string; // admin initiating (for auditing / optional notifications)
	title?: string; // optional override title
}

export const generateAdminEpisode = inngest.createFunction(
	{ id: "generate-admin-episode-workflow", name: "Generate Admin Episode Workflow", retries: 2 },
	{ event: "admin.episode.generate.requested" },
	async ({ event, step }) => {
		const { sourceEpisodeId, podcastId, title } = event.data as AdminEpisodeEventData;

		// 1. Resolve source transcript (can be from Episode or UserEpisode)
		const transcript = await step.run("fetch-transcript", async () => {
			// Try unified Episode first
			const ep = await prisma.episode.findUnique({ where: { episode_id: sourceEpisodeId } });
			if (ep?.description) {
				return ep.description; // treat description as fallback textual source if transcript not stored separately
			}
			// Fallback: user episode transcript
			const userEp = await prisma.userEpisode.findUnique({ where: { episode_id: sourceEpisodeId } });
			if (userEp?.transcript) return userEp.transcript;
			throw new Error(`No transcript/description found for sourceEpisodeId=${sourceEpisodeId}`);
		});

		// 2. Neutral summary
		const summary = await step.run("generate-summary", async () => {
			const modelName = process.env.GEMINI_GENAI_MODEL || "gemini-2.0-flash-lite";
			return generateObjectiveSummary(transcript, { modelName });
		});

		// 3. Script (admin curated tone)
		const script = await step.run("generate-script", async () => {
			const modelName2 = process.env.GEMINI_GENAI_MODEL || "gemini-2.0-flash-lite";
			const targetMinutes = Math.max(3, Number(process.env.EPISODE_TARGET_MINUTES || 3));
			const minWords = Math.floor(targetMinutes * 140);
			const maxWords = Math.floor(targetMinutes * 180);
			return genText(
				modelName2,
				`Task: Based on the SOURCE SUMMARY below, write a ${minWords}-${maxWords} word (about ${targetMinutes} minutes) single-narrator podcast segment for the Podslice curated catalog.

Identity & framing:
- This is a Podslice editorial recap derived from public source material.
- Do NOT impersonate original speakers; provide curated insight.

Brand opener (must be the first line, exactly):
"Feeling lost in the noise? This summary is brought to you by Podslice. We filter out the fluff, the filler, and the drawn-out discussions, leaving you with pure, actionable knowledge. In a world full of chatter, we help you find the insight."

Constraints:
- Spoken words only (no stage directions, no timestamps).
- No claims of ownership of original material.
- Natural, engaging, neutral informative tone.

Structure:
- Hook
- Key thematic clusters with smooth transitions
- Concise wrap-up with forward-looking context

SOURCE SUMMARY:
${summary}`
			);
		});

		// 4. TTS in chunks
		const scriptParts = splitScriptIntoChunks(script, Number(process.env.TTS_CHUNK_WORDS || 120));
		const audioChunkBase64: string[] = [];
		for (let i = 0; i < scriptParts.length; i++) {
			const base64 = await step.run(`tts-chunk-${i + 1}`, async () => {
				const buf = await generateSingleSpeakerTts(scriptParts[i]);
				return buf.toString("base64");
			});
			audioChunkBase64.push(base64 as string);
		}

		// 5. Combine + upload (podcasts path)
		const { gcsAudioUrl, durationSeconds } = await step.run("combine-upload", async () => {
			const fileName = `podcasts/${podcastId}/admin-${Date.now()}.wav`;
			const { finalBuffer, durationSeconds } = combineAndUploadWavChunks(audioChunkBase64, fileName);
			const gcsUrl = await uploadBufferToPrimaryBucket(finalBuffer, fileName);
			return { gcsAudioUrl: gcsUrl, durationSeconds };
		});

		// 6. Persist new curated Episode record
		const createdEpisode = await step.run("create-episode", async () => {
			return prisma.episode.create({
				data: {
					podcast_id: podcastId,
					title: title || `Curated Recap ${new Date().toISOString().slice(0, 10)}`,
					description: summary,
					audio_url: gcsAudioUrl,
					duration_seconds: durationSeconds,
					published_at: new Date(),
				},
			});
		});

		// (Optional) Step 7: Admin notification (in-app). Skipped to keep scope minimal.
		// Extend here if needed using Notification model.

		return { message: "Admin curated episode generated", episodeId: createdEpisode.episode_id, podcastId };
	}
);
