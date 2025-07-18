import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// 25 curated podcasts with images
const curatedPodcasts = [
	// Technology (8 shows)
	{
		name: "Lex Fridman Podcast",
		category: "Technology",
		url: "https://www.youtube.com/@lexfridman",
		description:
			"Conversations about science, technology, history, philosophy and the nature of intelligence, consciousness, love, and power.",
		imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop"
	},
	{
		name: "The Vergecast",
		category: "Technology",
		url: "https://www.youtube.com/@verge",
		description: "The flagship podcast of The Verge... and the internet.",
		imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=400&fit=crop"
	},
	{
		name: "Reply All",
		category: "Technology",
		url: "https://gimletmedia.com/shows/reply-all",
		description: "A podcast about modern life and the internet.",
		imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"
	},
	{
		name: "Planet Money",
		category: "Technology",
		url: "https://www.npr.org/sections/money/",
		description:
			"The economy explained. Imagine you could call up a friend and say, 'Meet me at the bar and tell me what's going on with the economy.'",
		imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=400&fit=crop"
	},
	{
		name: "The Indicator",
		category: "Technology",
		url: "https://www.npr.org/podcasts/510325/the-indicator-from-planet-money",
		description: "A little show about big ideas. From the people who make Planet Money.",
		imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop"
	},
	{
		name: "How I Built This",
		category: "Technology",
		url: "https://www.npr.org/podcasts/510313/how-i-built-this",
		description: "Stories behind some of the world's best known companies.",
		imageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=400&fit=crop"
	},
	{
		name: "Masters of Scale",
		category: "Technology",
		url: "https://mastersofscale.com/",
		description:
			"LinkedIn co-founder and Greylock partner Reid Hoffman shares startup stories and entrepreneurial insights.",
		imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop"
	},
	{
		name: "The Tim Ferriss Show",
		category: "Technology",
		url: "https://tim.blog/podcast/",
		description: "Interviews with world-class performers to extract tools and tactics you can use.",
		imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
	},

	// Business (8 shows)
	{
		name: "Freakonomics",
		category: "Business",
		url: "https://freakonomics.com/",
		description: "Discover the hidden side of everything with Stephen J. Dubner.",
		imageUrl: "https://images.unsplash.com/photo-1556761175-4acf4c6d6c96?w=400&h=400&fit=crop"
	},
	{
		name: "Hidden Brain",
		category: "Business",
		url: "https://www.npr.org/series/423302056/hidden-brain",
		description: "Shankar Vedantam uses science and storytelling to reveal the unconscious patterns that drive human behavior.",
		imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop"
	},
	{
		name: "Invisibilia",
		category: "Business",
		url: "https://www.npr.org/podcasts/510307/invisibilia",
		description: "Unseeable forces control human behavior and shape our ideas, beliefs, and assumptions.",
		imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop"
	},
	{
		name: "99% Invisible",
		category: "Business",
		url: "https://99percentinvisible.org/",
		description: "All about the thought that goes into the things we don't think about.",
		imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop"
	},
	{
		name: "Radiolab",
		category: "Business",
		url: "https://www.wnycstudios.org/podcasts/radiolab",
		description: "Investigating a strange world.",
		imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop"
	},
	{
		name: "Science Friday",
		category: "Business",
		url: "https://www.sciencefriday.com/",
		description: "Covering the outer reaches of space to the tiniest microbes in our bodies.",
		imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop"
	},
	{
		name: "This American Life",
		category: "Business",
		url: "https://www.thisamericanlife.org/",
		description: "Each week we choose a theme and put together different kinds of stories on that theme.",
		imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop"
	},
	{
		name: "Serial",
		category: "Business",
		url: "https://serialpodcast.org/",
		description: "Investigative journalism that tells one story—a true story—over the course of a season.",
		imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop"
	},

	// Science (5 shows)
	{
		name: "Star Talk Radio",
		category: "Science",
		url: "https://www.startalkradio.net/",
		description: "Science, pop culture and comedy collide on StarTalk Radio.",
		imageUrl: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop"
	},
	{
		name: "The Infinite Monkey Cage",
		category: "Science",
		url: "https://www.bbc.co.uk/programmes/b00snr0w",
		description: "Witty, irreverent look at the world through scientists' eyes.",
		imageUrl: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop"
	},
	{
		name: "Quirks and Quarks",
		category: "Science",
		url: "https://www.cbc.ca/radio/quirks",
		description: "Canada's most popular science radio program.",
		imageUrl: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop"
	},
	{
		name: "Science Vs",
		category: "Science",
		url: "https://gimletmedia.com/shows/science-vs",
		description:
			"Science Vs takes on fads, trends, and the opinionated mob to find out what's fact, what's not, and what's somewhere in between.",
		imageUrl: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop"
	},
	{
		name: "The Skeptics' Guide to the Universe",
		category: "Science",
		url: "https://www.theskepticsguide.org/",
		description: "A weekly science podcast discussing the latest science news with scientific skepticism.",
		imageUrl: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop"
	},

	// News (4 shows)
	{
		name: "The Daily",
		category: "News",
		url: "https://www.nytimes.com/column/the-daily",
		description: "The biggest stories of our time, told by the best journalists in the world.",
		imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=400&fit=crop"
	},
	{
		name: "Up First",
		category: "News",
		url: "https://www.npr.org/podcasts/510318/up-first",
		description: "The news you need to start your day.",
		imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=400&fit=crop"
	},
	{
		name: "Today, Explained",
		category: "News",
		url: "https://www.vox.com/today-explained-podcast",
		description: "Vox's daily explainer podcast.",
		imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=400&fit=crop"
	},
	{
		name: "The Intelligence",
		category: "News",
		url: "https://www.economist.com/podcasts/the-intelligence",
		description: "The Economist's daily podcast on the news that matters.",
		imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=400&fit=crop"
	},
]

// 3 pre-curated bundles with images
const curatedBundles = [
	{
		name: "Tech Weekly",
		description: "Latest in technology and innovation",
		imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop",
		podcasts: ["Lex Fridman Podcast", "The Vergecast", "Reply All", "Planet Money", "The Indicator"],
		episodes: [
			{
				title: "The Future of AI and Machine Learning",
				description: "This week we explore the latest developments in artificial intelligence, from GPT-4 to autonomous vehicles, and discuss the implications for society.",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
				imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=400&fit=crop",
				weekNr: new Date("2024-07-15"),
				publishedAt: new Date("2024-07-15")
			},
			{
				title: "Startup Culture and Innovation",
				description: "Dive into the world of startups, venture capital, and the innovative ideas shaping the future of technology and business.",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
				imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=400&fit=crop",
				weekNr: new Date("2024-07-08"),
				publishedAt: new Date("2024-07-08")
			}
		]
	},
	{
		name: "Business Insights",
		description: "Deep dives into business and economics",
		imageUrl: "https://images.unsplash.com/photo-1556761175-4acf4c6d6c96?w=400&h=400&fit=crop",
		podcasts: ["How I Built This", "Masters of Scale", "The Tim Ferriss Show", "Freakonomics", "Planet Money"],
		episodes: [
			{
				title: "Economic Trends and Market Analysis",
				description: "This week we analyze current economic trends, market movements, and what they mean for businesses and investors.",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
				imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=400&fit=crop",
				weekNr: new Date("2024-07-15"),
				publishedAt: new Date("2024-07-15")
			},
			{
				title: "Leadership and Entrepreneurship",
				description: "Stories from successful entrepreneurs and insights into what makes great leaders in today's business world.",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
				imageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=400&fit=crop",
				weekNr: new Date("2024-07-08"),
				publishedAt: new Date("2024-07-08")
			}
		]
	},
	{
		name: "Science & Discovery",
		description: "Exploring the wonders of science",
		imageUrl: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop",
		podcasts: ["Radiolab", "Science Friday", "Hidden Brain", "Invisibilia", "99% Invisible"],
		episodes: [
			{
				title: "Space Exploration and Astronomy",
				description: "Journey through the cosmos as we explore the latest discoveries in astronomy, space missions, and our understanding of the universe.",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
				imageUrl: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop",
				weekNr: new Date("2024-07-15"),
				publishedAt: new Date("2024-07-15")
			},
			{
				title: "Psychology and Human Behavior",
				description: "Explore the fascinating world of psychology, cognitive science, and what makes us human through the lens of scientific research.",
				audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
				imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop",
				weekNr: new Date("2024-07-08"),
				publishedAt: new Date("2024-07-08")
			}
		]
	},
]

// Update the subscription tiers for South African market
const SUBSCRIPTION_TIERS = {
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
}

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
						imageUrl: bundle.imageUrl,
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
								podcastId: podcast.id,
							},
						})
					)
				)

				// Seed episodes for the bundle
				if (bundle.episodes && bundle.episodes.length > 0) {
					await Promise.all(
						bundle.episodes.map(async episode => {
							const createdEpisode = await prisma.curatedBundleEpisode.create({
								data: {
									title: episode.title,
									description: episode.description,
									audioUrl: episode.audioUrl,
									imageUrl: episode.imageUrl,
									weekNr: episode.weekNr,
									publishedAt: episode.publishedAt,
									bundleId: createdBundle.id,
								},
							})
							return createdEpisode
						})
					)
				}

				return createdBundle
			})
		)

		console.log(`✅ Created ${createdBundles.length} bundles with podcast connections`)

		// Verify the data
		const podcastCount = await prisma.curatedPodcast.count()
		const bundleCount = await prisma.curatedBundle.count()
		const bundlePodcastCount = await prisma.curatedBundlePodcast.count()
		const episodeCount = await prisma.curatedBundleEpisode.count()

		console.log("\n📊 Seed Summary:")
		console.log(`   Podcasts: ${podcastCount}`)
		console.log(`   Bundles: ${bundleCount}`)
		console.log(`   Bundle-Podcast connections: ${bundlePodcastCount}`)
		console.log(`   Episodes: ${episodeCount}`)

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
