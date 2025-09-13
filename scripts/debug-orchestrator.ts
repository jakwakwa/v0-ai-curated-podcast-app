#!/usr/bin/env ts-node
// Standalone debug script — avoid requiring Next.js env bootstrap
import { preflightProbe } from "@/lib/inngest/utils/preflight";
import { getTranscriptOrchestrated } from "@/lib/transcripts";

async function main() {
	const url = process.argv[2] || "https://youtu.be/J6Fwu2_xtgo";
	console.log("Debug orchestrator run for:", url);

	try {
		const probe = await preflightProbe(url, 8000);
		console.log("preflightProbe:", JSON.stringify(probe, null, 2));
	} catch (e) {
		console.error("preflightProbe error:", e);
	}

	try {
		const res = await getTranscriptOrchestrated({ url, kind: "youtube", allowPaid: true });
		console.log("orchestrator result:", JSON.stringify(res, null, 2));
	} catch (e) {
		console.error("orchestrator error:", e instanceof Error ? e.message : e);
	}
}

main().catch(err => {
	console.error(err);
	process.exit(1);
});
