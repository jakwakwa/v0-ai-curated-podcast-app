import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
	console.log("🌱 Seeding core data (podcasts, bundles, relationships)...")

	// --- Podcasts ---
	const podcasts = [
		{
			name: "AI Daily",
			description: "Daily news and analysis on AI advancements.",
			url: "https://podslice.example/ai-daily",
			image_url: null,
			category: "Technology",
		},
		{
			name: "Product Builders",
			description: "Stories and tactics from product teams.",
			url: "https://podslice.example/product-builders",
			image_url: null,
			category: "Business",
		},
		{
			name: "Web Dev Weekly",
			description: "Web development news and best practices.",
			url: "https://podslice.example/web-dev-weekly",
			image_url: null,
			category: "Technology",
		},
		{
			name: "Creative Minds",
			description: "Interviews with creators and innovators.",
			url: "https://podslice.example/creative-minds",
			image_url: null,
			category: "Culture",
		},
		{
			name: "Startup Signals",
			description: "Signals from the startup ecosystem.",
			url: "https://podslice.example/startup-signals",
			image_url: null,
			category: "Business",
		},
	]

	for (const p of podcasts) {
		await prisma.podcast.upsert({
			where: { url: p.url },
			update: {
				name: p.name,
				description: p.description,
				image_url: p.image_url,
				category: p.category,
				is_active: true,
			},
			create: {
				name: p.name,
				description: p.description,
				url: p.url,
				image_url: p.image_url,
				category: p.category,
			},
		})
	}

	console.log("✓ Podcasts upserted")

	// --- Bundles ---
	let freeBundle = await prisma.bundle.findFirst({ where: { name: "Free Slice Weekly" } })
	if (!freeBundle) {
		freeBundle = await prisma.bundle.create({
			data: {
				name: "Free Slice Weekly",
				description: "A weekly selection of our favorite free podcasts.",
				// Keep this open to all by default to align with current gating logic
				min_plan: "NONE",
			},
		})
	}

	let premiumBundle = await prisma.bundle.findFirst({ where: { name: "Curator's Choice" } })
	if (!premiumBundle) {
		premiumBundle = await prisma.bundle.create({
			data: {
				name: "Curator's Choice",
				description: "Exclusive, hand-picked content for our premium subscribers.",
				min_plan: "CURATE_CONTROL",
			},
		})
	}

	console.log("✓ Bundles upserted")

	// --- Bundle ↔ Podcast relationships ---
	const freeSliceUrls = [
		"https://podslice.example/ai-daily",
		"https://podslice.example/web-dev-weekly",
	]
	const premiumUrls = [
		"https://podslice.example/product-builders",
		"https://podslice.example/creative-minds",
		"https://podslice.example/startup-signals",
	]

	const freeSlicePods = await prisma.podcast.findMany({ where: { url: { in: freeSliceUrls } }, select: { podcast_id: true } })
	const premiumPods = await prisma.podcast.findMany({ where: { url: { in: premiumUrls } }, select: { podcast_id: true } })

	if (freeSlicePods.length) {
		await prisma.bundlePodcast.createMany({
			data: freeSlicePods.map(p => ({ bundle_id: freeBundle.bundle_id, podcast_id: p.podcast_id })),
			skipDuplicates: true,
		})
	}

	if (premiumPods.length) {
		await prisma.bundlePodcast.createMany({
			data: premiumPods.map(p => ({ bundle_id: premiumBundle.bundle_id, podcast_id: p.podcast_id })),
			skipDuplicates: true,
		})
	}

	console.log("✓ Bundle to Podcast links created")

	console.log("🌱 Core seed completed successfully!")
}

main()
	.catch(err => {
		console.error(err)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})


