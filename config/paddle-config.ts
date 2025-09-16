import type { PlanTier } from '@/lib/types';

const PRICING_TIER: PlanTier[] = [
	{
		priceId: 'pri_01k2q1zyfjje86nzvx2ze2gy6k',
		planId: 'FREE_SLICE',
		productTitle: 'Free Slice (30 day trial)',
		icon: '/assets/icons/price-tiers/free-icon.svg',
		description: 'Starting out',
		features: ['Basic Weekly Recommendations'],
		featured: false,
		episodeLimit: 0,
	},
	{
		priceId: 'pri_01k1dzhm5ccevk59y626z80mmf',
		productTitle: 'Casual Listener',
		planId: 'CASUAL_LISTENER',
		icon: '/assets/icons/price-tiers/free-icon.svg',
		features: [
			'Access to more Podcasts Bundles',
			'Basic Weekly Recommendations',
		],
		description: 'For more variety',
		episodeLimit: 0,
		featured: true,
	},
	{
		priceId: 'pri_01k23mdwkrr8g9cp7bdbp8xqm8',
		productTitle: 'Curate Control',
		planId: 'CURATE_CONTROL',
		icon: '/assets/icons/price-tiers/free-icon.svg',
		features: [
			'Advanced Profile Features',
			'Generate 30 Ai Podcasts per month',
			'Access to more Podcasts Bundles',
		],
		description: 'Ideal for the power user.',
		episodeLimit: 10,
		featured: false,
	},
];

export { PRICING_TIER };
