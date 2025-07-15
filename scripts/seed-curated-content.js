import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// 25 curated podcasts
const curatedPodcasts = [
	// Technology (8 shows)
	{
		name: "Lex Fridman Podcast",
		category: "Technology",
		url: "https://www.youtube.com/@lexfridman",
		description:
			"Conversations about science, technology, history, philosophy and the nature of intelligence, consciousness, love, and power.",
	},
	{
		name: "The Vergecast",
		category: "Technology",
		url: "https://www.youtube.com/@verge",
		description: "The flagship podcast of The Verge... and the internet.",
	},
	{
		name: "Reply All",
		category: "Technology",
		url: "https://gimletmedia.com/shows/reply-all",
		description: "A podcast about modern life and the internet.",
	},
	{
		name: "Planet Money",
		category: "Technology",
		url: "https://www.npr.org/sections/money/",
		description:
			"The economy explained. Imagine you could call up a friend and say, 'Meet me at the bar and tell me what's going on with the economy.'",
	},
	{
		name: "The Indicator",
		category: "Technology",
		url: "https://www.npr.org/podcasts/510325/the-indicator-from-planet-money",
		description: "A little show about big ideas. From the people who make Planet Money.",
	},
	{
		name: "How I Built This",
		category: "Technology",
		url: "https://www.npr.org/podcasts/510313/how-i-built-this",
		description: "Stories behind some of the world's best known companies.",
	},
	{
		name: "Masters of Scale",
		category: "Technology",
		url: "https://mastersofscale.com/",
		description:
			"LinkedIn co-founder and Greylock partner Reid Hoffman shares startup stories and entrepreneurial insights.",
	},
	{
		name: "The Tim Ferriss Show",
		category: "Technology",
		url: "https://tim.blog/podcast/",
		description: "Interviews with world-class performers to extract tools and tactics you can use.",
	},

	// Business (8 shows)
	{
		name: "Freakonomics",
		category: "Business",
		url: "https://freakonomics.com/",
		description: "Discover the hidden side of everything with Stephen J. Dubner.",
	},
	{
		name: "Hidden Brain",
		category: "Business",
		url: "https://www.npr.org/series/423302056/hidden-brain",
		description:
			"Shankar Vedantam uses science and storytelling to reveal the unconscious patterns that drive human behavior.",
	},
	{
		name: "Invisibilia",
		category: "Business",
		url: "https://www.npr.org/podcasts/510307/invisibilia",
		description: "Unseeable forces control human behavior and shape our ideas, beliefs, and assumptions.",
	},
	{
		name: "99% Invisible",
		category: "Business",
		url: "https://99percentinvisible.org/",
		description: "All about the thought that goes into the things we don't think about.",
	},
	{
		name: "Radiolab",
		category: "Business",
		url: "https://www.wnycstudios.org/podcasts/radiolab",
		description: "Investigating a strange world.",
	},
	{
		name: "Science Friday",
		category: "Business",
		url: "https://www.sciencefriday.com/",
		description: "Covering the outer reaches of space to the tiniest microbes in our bodies.",
	},
	{
		name: "This American Life",
		category: "Business",
		url: "https://www.thisamericanlife.org/",
		description: "Each week we choose a theme and put together different kinds of stories on that theme.",
	},
	{
		name: "Serial",
		category: "Business",
		url: "https://serialpodcast.org/",
		description: "Investigative journalism that tells one story—a true story—over the course of a season.",
	},

	// Science (5 shows)
	{
		name: "Star Talk Radio",
		category: "Science",
		url: "https://www.startalkradio.net/",
		description: "Science, pop culture and comedy collide on StarTalk Radio.",
	},
	{
		name: "The Infinite Monkey Cage",
		category: "Science",
		url: "https://www.bbc.co.uk/programmes/b00snr0w",
		description: "Witty, irreverent look at the world through scientists' eyes.",
	},
	{
		name: "Quirks and Quarks",
		category: "Science",
		url: "https://www.cbc.ca/radio/quirks",
		description: "Canada's most popular science radio program.",
	},
	{
		name: "Science Vs",
		category: "Science",
		url: "https://gimletmedia.com/shows/science-vs",
		description:
			"Science Vs takes on fads, trends, and the opinionated mob to find out what's fact, what's not, and what's somewhere in between.",
	},
	{
		name: "The Skeptics' Guide to the Universe",
		category: "Science",
		url: "https://www.theskepticsguide.org/",
		description: "A weekly science podcast discussing the latest science news with scientific skepticism.",
	},

	// News (4 shows)
	{
		name: "The Daily",
		category: "News",
		url: "https://www.nytimes.com/column/the-daily",
		description: "The biggest stories of our time, told by the best journalists in the world.",
	},
	{
		name: "Up First",
		category: "News",
		url: "https://www.npr.org/podcasts/510318/up-first",
		description: "The news you need to start your day.",
	},
	{
		name: "Today, Explained",
		category: "News",
		url: "https://www.vox.com/today-explained-podcast",
		description: "Vox's daily explainer podcast.",
	},
	{
		name: "The Intelligence",
		category: "News",
		url: "https://www.economist.com/podcasts/the-intelligence",
		description: "The Economist's daily podcast on the news that matters.",
	},
]

// 3 pre-curated bundles
const curatedBundles = [
	{
		name: "Tech Weekly",
		description: "Latest in technology and innovation",
		podcasts: ["Lex Fridman Podcast", "The Vergecast", "Reply All", "Planet Money", "The Indicator"],
	},
	{
		name: "Business Insights",
		description: "Deep dives into business and economics",
		podcasts: ["How I Built This", "Masters of Scale", "The Tim Ferriss Show", "Freakonomics", "Planet Money"],
	},
	{
		name: "Science & Discovery",
		description: "Exploring the wonders of science",
		podcasts: ["Radiolab", "Science Friday", "Hidden Brain", "Invisibilia", "99% Invisible"],
	},
]

// Update the subscription tiers for South African market
export const SUBSCRIPTION_TIERS = {
	TRIAL: {
		id: "trial",
		name: "Free Trial",
		price: 0,
		linkPriceId: null,
		features: ["1 week trial", "1 collection", "Weekly generation"],
	},
	PREMIUM: {
		id: "premium",
		name: "Premium",
		price: 99, // R99/month in ZAR
		linkPriceId: process.env.LINK_PREMIUM_PRICE_ID,
		features: ["Unlimited collections", "Weekly generation", "Priority support"],
	},
} as const

async function seedCuratedContent() {
	// biome-ignore lint/suspicious/noConsole: <explanation>
	// biome-ignore lint/suspicious/noConsoleLog: <explanation>
	console.log("🌱 Starting curated content seed...")

	try {
		// Clean up existing curated content
		// Clean up existing curated content in the correct order to avoid foreign key constraint errors
		await prisma.curatedBundlePodcast.deleteMany({})
		await prisma.curatedBundle.deleteMany({})
		await prisma.curatedPodcast.deleteMany({})

		console.log("✅ Cleaned up existing curated content")

		// Seed podcasts
		console.log("📻 Creating curated podcasts...")
		const createdPodcasts = await Promise.all(
			curatedPodcasts.map(podcast => prisma.curatedPodcast.create({ data: podcast }))
		)
		console.log(`✅ Created ${createdPodcasts.length} podcasts`)

		// Seed bundles
		// biome-ignore lint/suspicious/noConsole: <explanation>
		console.log("📦 Creating curated bundles...")
		const createdBundles = await Promise.all(
			curatedBundles.map(async bundle => {
				const createdBundle = await prisma.curatedBundle.create({
					data: {
						name: bundle.name,
						description: bundle.description,
					},
				})

				// Find podcasts for this bundle
				const bundlePodcasts = await Promise.all(
					bundle.podcasts.map(name =>
						prisma.curatedPodcast.findFirst({
							where: { name },
							select: { id: true },
						})
					)
				)

				// Connect podcasts to bundle
				await Promise.all(
					bundlePodcasts.map(podcast =>
						prisma.curatedBundlePodcast.create({
							data: {
								bundleId: createdBundle.id,
								podcastId: podcast!.id,
							},
						})
					)
				)

				return createdBundle
			})
		)

		console.log(`✅ Created ${createdBundles.length} bundles with podcast connections`)

		// Verify the data
		const podcastCount = await prisma.curatedPodcast.count()
		const bundleCount = await prisma.curatedBundle.count()
		const bundlePodcastCount = await prisma.curatedBundlePodcast.count()

		console.log("\n📊 Seed Summary:")
		console.log(`   Podcasts: ${podcastCount}`)
		console.log(`   Bundles: ${bundleCount}`)
		console.log(`   Bundle-Podcast connections: ${bundlePodcastCount}`)

		console.log("\n🎉 Curated content seeding completed successfully!")
	} catch (error) {
		console.error("❌ Error seeding curated content:", error)
		throw error
	}
}

// Run the seed function
seedCuratedContent()
	.catch(e => {
		console.error("❌ Seed failed:", e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
