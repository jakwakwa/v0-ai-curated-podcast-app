'use server';

import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import type { Podcast, CuratedCollection } from '@/lib/types';

export async function getPodcasts(): Promise<Podcast[]> {
  // For demonstration, return dummy data
  return [
    {
      id: '1',
      title: 'The AI Revolution in Healthcare',
      date: '2023-10-26',
      status: 'Completed',
      duration: '25:30',
      audioUrl: '/podcast1.mp3',
    },
    {
      id: '2',
      title: 'Sustainable Living in the 21st Century',
      date: '2023-10-25',
      status: 'Processing',
      duration: '28:15',
      audioUrl: null,
    },
    {
      id: '3',
      title: 'The Future of Remote Work',
      date: '2023-10-24',
      status: 'Failed',
      duration: '00:00',
      audioUrl: null,
    },
  ];
}

export async function getCuratedCollections(): Promise<CuratedCollection[]> {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }

  const collections = await prisma.collection.findMany({
    where: { userId: userId },
    include: { sources: true },
  });

  return collections.map((collection) => ({
    ...collection,
    status: collection.status as 'Draft' | 'Saved',
    sources: collection.sources.map((source) => ({
      ...source,
      imageUrl: source.imageUrl || '',
    })),
  }));
}

export async function getEpisodes() {
  const { userId } = await auth();
  if (!userId) return [];
  // Fetch episodes for collections owned by the user
  const episodes = await prisma.episode.findMany({
    orderBy: { publishedAt: 'desc' },
    include: {
      collection: {
        include: { sources: true },
      },
      source: true,
    },
    where: {
      collection: {
        userId: userId,
      },
    },
  });
  return episodes;
}
