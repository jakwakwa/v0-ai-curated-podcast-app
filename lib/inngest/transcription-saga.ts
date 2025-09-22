import { writeEpisodeDebugLog, writeEpisodeDebugReport } from "@/lib/debug-logger";
import emailService from "@/lib/email-service";
import { inngest } from "@/lib/inngest/client";
import { prisma } from "@/lib/prisma";
import { preflightProbe } from "./utils/preflight";
import { ProviderSucceededSchema, TranscriptionRequestedSchema } from "./utils/results";

const Events = {
	JobRequested: "transcription.job.requested",
	ProviderStart: {
		Gemini: "transcription.provider.gemini.start",
	},
	Succeeded: "transcription.succeeded",
	Failed: "transcription.failed",
	Finalized: "transcription.finalized",
} as const;

export const transcriptionCoordinator = inngest.createFunction(
	{ id: "transcription-coordinator", name: "Transcription Coordinator", retries: 0 },
	{ event: Events.JobRequested },
	async ({ event, step }) => {
		const input = TranscriptionRequestedSchema.parse(event.data);
		const { jobId, userEpisodeId, srcUrl, generationMode, voiceA, voiceB } = input;

		await step.run("mark-processing", async () => {
			await prisma.userEpisode.update({ where: { episode_id: userEpisodeId }, data: { status: "PROCESSING", youtube_url: srcUrl } });
			await writeEpisodeDebugLog(userEpisodeId, { step: "status", status: "start", message: "PROCESSING" });
		});

		const probe = await step.run("preflight-probe", async () => await preflightProbe(srcUrl));
		await writeEpisodeDebugLog(userEpisodeId, {
			step: "preflight",
			status: probe.ok ? "success" : "fail",
			meta: probe.ok ? probe.value : probe,
		});

		// Direct Gemini transcription - no fallbacks, no orchestrator complexity
		await step.sendEvent("start-gemini", {
			name: Events.ProviderStart.Gemini,
			data: { jobId, userEpisodeId, srcUrl, provider: "gemini" },
		});

		// Wait for Gemini to complete or timeout (either success or failure)
		const successEvent = await step.waitForEvent("wait-gemini-success", {
			event: Events.Succeeded,
			timeout: "600s",
			if: `event.data.jobId == "${jobId}"`,
		});
		if (!successEvent) {
			await step.waitForEvent("wait-gemini-failed", {
				event: Events.Failed,
				timeout: "1s",
				if: `event.data.jobId == "${jobId}"`,
			});
		}

		if (!successEvent) {
			// Gemini did not succeed within the window or explicitly failed; try orchestrator fallback
			const { getTranscriptOrchestrated } = await import("@/lib/transcripts");
			const fallback = await step.run("fallback-orchestrator", async () => {
				return await getTranscriptOrchestrated({ url: srcUrl, kind: "youtube" });
			});

			if (!fallback.success) {
				await step.run("mark-failed", async () => {
					await prisma.userEpisode.update({ where: { episode_id: userEpisodeId }, data: { status: "FAILED" } });
					await writeEpisodeDebugLog(userEpisodeId, {
						step: "transcription",
						status: "fail",
						message: "Gemini transcription failed or timed out; fallback also failed",
					});
				});

				await step.run("email-user-failed", async () => {
					try {
						const episode = await prisma.userEpisode.findUnique({
							where: { episode_id: userEpisodeId },
							select: { episode_title: true, user_id: true },
						});
						if (episode) {
							const user = await prisma.user.findUnique({
								where: { user_id: episode.user_id },
								select: { email: true, name: true },
							});
							if (user?.email) {
								const userFirstName = (user.name || "").trim().split(" ")[0] || "there";
								await emailService.sendEpisodeFailedEmail(episode.user_id, user.email, {
									userFirstName,
									episodeTitle: episode.episode_title,
								});
							}
						}
					} catch (err) {
						console.error("[EMAIL_FAIL_NOTIFY]", err);
					}
				});
				await step.sendEvent("finalize-failed", {
					name: Events.Finalized,
					data: { jobId, userEpisodeId, status: "failed" },
				});
				return { ok: false, jobId };
			}

			const transcriptText = (fallback as { transcript?: string; provider?: string }).transcript as string;
			const provider = (fallback as { provider?: string }).provider ?? "fallback-orchestrator";
			await step.run("store-transcript", async () => {
				await prisma.userEpisode.update({ where: { episode_id: userEpisodeId }, data: { transcript: transcriptText } });
			});
			await step.sendEvent("forward-generation", {
				name: generationMode === "multi" ? "user.episode.generate.multi.requested" : "user.episode.generate.requested",
				data: { userEpisodeId, voiceA, voiceB },
			});
			await step.run("write-final-report", async () => {
				const report = `# Transcription Saga Report\n- job: ${jobId}\n- provider: ${provider}\n- transcriptChars: ${transcriptText.length}\n`;
				await writeEpisodeDebugReport(userEpisodeId, report);
			});
			await step.sendEvent("finalize-success", {
				name: Events.Finalized,
				data: { jobId, userEpisodeId, status: "succeeded", provider },
			});
			return { ok: true, jobId };
		}

		// Gemini succeeded - process the result
		const successPayload = ProviderSucceededSchema.parse((successEvent as { data: unknown }).data);
		const transcriptText = successPayload.transcript;

		await step.run("store-transcript", async () => {
			await prisma.userEpisode.update({ where: { episode_id: userEpisodeId }, data: { transcript: transcriptText } });
		});

		await step.sendEvent("forward-generation", {
			name: generationMode === "multi" ? "user.episode.generate.multi.requested" : "user.episode.generate.requested",
			data: { userEpisodeId, voiceA, voiceB },
		});

		await step.run("write-final-report", async () => {
			const report = `# Transcription Saga Report\n- job: ${jobId}\n- provider: ${successPayload.provider}\n- transcriptChars: ${transcriptText.length}\n`;
			await writeEpisodeDebugReport(userEpisodeId, report);
		});

		await step.sendEvent("finalize-success", {
			name: Events.Finalized,
			data: { jobId, userEpisodeId, status: "succeeded", provider: successPayload.provider },
		});

		return { ok: true, jobId };
	}
);
