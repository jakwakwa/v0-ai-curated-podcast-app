// Centralized helpers for episode/user episode markdown & takeaway extraction.
// Keeps rendering consistent between detail pages and the audio player sheet.

export function extractKeyTakeaways(markdown?: string | null, max: number = 5): string[] {
	if (!markdown) return [];
	const lines = markdown.split(/\r?\n/);
	const bullets: string[] = [];
	for (const raw of lines) {
		if (bullets.length >= max) break;
		const trimmed = raw.trim();
		if (!trimmed) continue;
		let item: string | null = null;
		if (trimmed.startsWith("-") || trimmed.startsWith("*") || /^\d+\./.test(trimmed)) {
			item = trimmed.replace(/^(-|\*|\d+\.)\s*/, "");
		} else {
			const boldMatch = trimmed.match(/^\*\*(.+?)\*\*:?\s*(.*)$/);
			if (boldMatch) {
				const title = boldMatch[1].trim();
				const rest = (boldMatch[2] || "").trim();
				item = rest ? `${title}: ${rest}` : title;
			}
		}
		if (item) {
			const clean = item.replace(/\*/g, "").trim();
			if (clean) bullets.push(clean);
		}
	}
	return bullets;
}

export function normalizeSummaryMarkdown(input: string | null | undefined): string {
	if (!input) return "";
	const lines = input.split(/\r?\n/).map(line => {
		let trimmed = line.trim();
		if (/^\*+\s*Key\s+(Highlights|Takeaways):?\*+\s*$/i.test(trimmed)) {
			return `### Key ${trimmed.match(/Highlights/i) ? "Highlights" : "Takeaways"}`;
		}
		if (/^Key\s+Highlights:?$/i.test(trimmed)) return "### Key Highlights";
		if (/^Key\s+Takeaways:?$/i.test(trimmed)) return "### Key Takeaways";
		if (/^Here'?s a summary of the content:?\s*$/i.test(trimmed)) return "### Summary";
		if (trimmed.startsWith("*") && !trimmed.startsWith("* ")) {
			trimmed = trimmed.replace(/^\*/, "* ");
		}
		if (trimmed.startsWith("(") && trimmed.endsWith(")")) {
			return trimmed.replace(/\*/g, "");
		}
		if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
			const core = trimmed.slice(2, -2);
			if (!core.includes("*")) return core;
		}
		if ((trimmed.match(/\*\*/g) || []).length % 2 === 1 && trimmed.endsWith("**")) {
			return trimmed.slice(0, -2).trimEnd();
		}
		return trimmed;
	});
	return lines
		.join("\n")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}
