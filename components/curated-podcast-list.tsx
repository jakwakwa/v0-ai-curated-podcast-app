import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { CuratedPodcast } from "@/lib/types"
import { Check } from "lucide-react"
import { useState } from "react"
import styles from "./collection-creation-wizard.module.css"

interface CuratedPodcastListProps {
	onSelectPodcast: (podcast: CuratedPodcast) => void
	selectedPodcasts: CuratedPodcast[]
}

export function CuratedPodcastList({ onSelectPodcast, selectedPodcasts }: CuratedPodcastListProps) {
	// Dummy curated podcasts data
	const dummyCuratedPodcasts: CuratedPodcast[] = [
		// Technology (8 shows)
		{
			id: "pod1",
			name: "Lex Fridman Podcast",
			url: "https://www.youtube.com/@lexfridman",
			description: "Conversations about science, technology, history, philosophy and the nature of intelligence, consciousness, love, and power.",
			imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop",
			category: "Technology",
			isActive: true,
			createdAt: new Date(),
		},
		{
			id: "pod2",
			name: "The Vergecast",
			url: "https://www.youtube.com/@verge",
			description: "The flagship podcast of The Verge... and the internet.",
			imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=400&fit=crop",
			category: "Technology",
			isActive: true,
			createdAt: new Date(),
		},
		{
			id: "pod3",
			name: "Reply All",
			url: "https://gimletmedia.com/shows/reply-all",
			description: "A podcast about modern life and the internet.",
			imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
			category: "Technology",
			isActive: true,
			createdAt: new Date(),
		},
		{
			id: "pod4",
			name: "Planet Money",
			url: "https://www.npr.org/sections/money/",
			description: "The economy explained. Imagine you could call up a friend and say, 'Meet me at the bar and tell me what's going on with the economy.'",
			imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=400&fit=crop",
			category: "Technology",
			isActive: true,
			createdAt: new Date(),
		},
		{
			id: "pod5",
			name: "The Indicator",
			url: "https://www.npr.org/podcasts/510325/the-indicator-from-planet-money",
			description: "A little show about big ideas. From the people who make Planet Money.",
			imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop",
			category: "Technology",
			isActive: true,
			createdAt: new Date(),
		},
		{
			id: "pod6",
			name: "How I Built This",
			url: "https://www.npr.org/podcasts/510313/how-i-built-this",
			description: "Stories behind some of the world's best known companies.",
			imageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=400&fit=crop",
			category: "Technology",
			isActive: true,
			createdAt: new Date(),
		},
		{
			id: "pod7",
			name: "Masters of Scale",
			url: "https://mastersofscale.com/",
			description: "LinkedIn co-founder and Greylock partner Reid Hoffman shares startup stories and entrepreneurial insights.",
			imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop",
			category: "Technology",
			isActive: true,
			createdAt: new Date(),
		},
		{
			id: "pod8",
			name: "The Tim Ferriss Show",
			url: "https://tim.blog/podcast/",
			description: "Interviews with world-class performers to extract tools and tactics you can use.",
			imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
			category: "Technology",
			isActive: true,
			createdAt: new Date(),
		},

		// Business (8 shows)
		{
			id: "pod9",
			name: "Freakonomics",
			url: "https://freakonomics.com/",
			description: "Discover the hidden side of everything with Stephen J. Dubner.",
			imageUrl: "https://images.unsplash.com/photo-1556761175-4acf4c6d6c96?w=400&h=400&fit=crop",
			category: "Business",
			isActive: true,
			createdAt: new Date(),
		},
		{
			id: "pod10",
			name: "Hidden Brain",
			url: "https://www.npr.org/series/423302056/hidden-brain",
			description: "Shankar Vedantam uses science and storytelling to reveal the unconscious patterns that drive human behavior.",
			imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop",
			category: "Business",
			isActive: true,
			createdAt: new Date(),
		},
		{
			id: "pod11",
			name: "Invisibilia",
			url: "https://www.npr.org/podcasts/510307/invisibilia",
			description: "Unseeable forces control human behavior and shape our ideas, beliefs, and assumptions.",
			imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop",
			category: "Business",
			isActive: true,
			createdAt: new Date(),
		},
		{
			id: "pod12",
			name: "99% Invisible",
			url: "https://99percentinvisible.org/",
			description: "All about the thought that goes into the things we don't think about.",
			imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop",
			category: "Business",
			isActive: true,
			createdAt: new Date(),
		},
		{
			id: "pod13",
			name: "Radiolab",
			url: "https://www.wnycstudios.org/podcasts/radiolab",
			description: "Investigating a strange world.",
			imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop",
			category: "Business",
			isActive: true,
			createdAt: new Date(),
		},
		{
			id: "pod14",
			name: "Science Friday",
			url: "https://www.sciencefriday.com/",
			description: "Covering the outer reaches of space to the tiniest microbes in our bodies.",
			imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop",
			category: "Business",
			isActive: true,
			createdAt: new Date(),
		},
		{
			id: "pod15",
			name: "This American Life",
			url: "https://www.thisamericanlife.org/",
			description: "Each week we choose a theme and put together different kinds of stories on that theme.",
			imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop",
			category: "Business",
			isActive: true,
			createdAt: new Date(),
		},
		{
			id: "pod16",
			name: "Serial",
			url: "https://serialpodcast.org/",
			description: "Investigative journalism that tells one story—a true story—over the course of a season.",
			imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop",
			category: "Business",
			isActive: true,
			createdAt: new Date(),
		},

		// Science (5 shows)
		{
			id: "pod17",
			name: "Star Talk Radio",
			url: "https://www.startalkradio.net/",
			description: "Science, pop culture and comedy collide on StarTalk Radio.",
			imageUrl: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop",
			category: "Science",
			isActive: true,
			createdAt: new Date(),
		},
		{
			id: "pod18",
			name: "The Infinite Monkey Cage",
			url: "https://www.bbc.co.uk/programmes/b00snr0w",
			description: "Witty, irreverent look at the world through scientists' eyes.",
			imageUrl: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop",
			category: "Science",
			isActive: true,
			createdAt: new Date(),
		},
		{
			id: "pod19",
			name: "Quirks and Quarks",
			url: "https://www.cbc.ca/radio/quirks",
			description: "Canada's most popular science radio program.",
			imageUrl: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop",
			category: "Science",
			isActive: true,
			createdAt: new Date(),
		},
		{
			id: "pod20",
			name: "Science Vs",
			url: "https://gimletmedia.com/shows/science-vs",
			description: "Science Vs takes on fads, trends, and the opinionated mob to find out what's fact, what's not, and what's somewhere in between.",
			imageUrl: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop",
			category: "Science",
			isActive: true,
			createdAt: new Date(),
		},
		{
			id: "pod21",
			name: "The Skeptics' Guide to the Universe",
			url: "https://www.theskepticsguide.org/",
			description: "A weekly science podcast discussing the latest science news with scientific skepticism.",
			imageUrl: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop",
			category: "Science",
			isActive: true,
			createdAt: new Date(),
		},

		// News (4 shows)
		{
			id: "pod22",
			name: "The Daily",
			url: "https://www.nytimes.com/column/the-daily",
			description: "The biggest stories of our time, told by the best journalists in the world.",
			imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=400&fit=crop",
			category: "News",
			isActive: true,
			createdAt: new Date(),
		},
		{
			id: "pod23",
			name: "Up First",
			url: "https://www.npr.org/podcasts/510318/up-first",
			description: "The news you need to start your day.",
			imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=400&fit=crop",
			category: "News",
			isActive: true,
			createdAt: new Date(),
		},
		{
			id: "pod24",
			name: "Today, Explained",
			url: "https://www.vox.com/today-explained-podcast",
			description: "Vox's daily explainer podcast.",
			imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=400&fit=crop",
			category: "News",
			isActive: true,
			createdAt: new Date(),
		},
		{
			id: "pod25",
			name: "The Intelligence",
			url: "https://www.economist.com/podcasts/the-intelligence",
			description: "The Economist's daily podcast on the news that matters.",
			imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=400&fit=crop",
			category: "News",
			isActive: true,
			createdAt: new Date(),
		},
	]

	const categories = [...new Set(dummyCuratedPodcasts.map(p => p.category))]

	return (
		<div className={styles.customSelection}>
			<div className={styles.selectionHeader}>
				<p>Select up to 5 podcasts for your custom user curation profile</p>
				<Badge variant="outline">{selectedPodcasts.length}/5 selected</Badge>
			</div>

			<Tabs defaultValue={categories[0]} className={styles.categoryTabs}>
				<TabsList className={styles.tabsList}>
					{categories.map(category => (
						<TabsTrigger key={category} value={category}>
							{category}
						</TabsTrigger>
					))}
				</TabsList>

				{categories.map(category => (
					<TabsContent key={category} value={category} className={styles.tabContent}>
						<div className={styles.podcastGrid}>
							{dummyCuratedPodcasts
								.filter(podcast => podcast.category === category)
								.map(podcast => {
									const isSelected = selectedPodcasts.some(p => p.id === podcast.id)
									const canSelect = selectedPodcasts.length < 5 || isSelected

									return (
										<Card
											key={podcast.id}
											className={`${styles.podcastCard} ${isSelected ? styles.selected : ""} ${!canSelect ? styles.disabled : ""}`}
											onClick={() => canSelect && onSelectPodcast(podcast)}
										>
											{podcast.imageUrl && (
												<img src={podcast.imageUrl} alt={podcast.name} className={styles.podcastImage} />
											)}
											<div className={styles.podcastContent}>
												<h4>{podcast.name}</h4>
												<p>{podcast.description}</p>
												{isSelected && (
													<div className={styles.selectedIndicator}>
														<Check size={16} />
													</div>
												)}
											</div>
										</Card>
									)
								})}
						</div>
					</TabsContent>
				))}
			</Tabs>
		</div>
	)
}
