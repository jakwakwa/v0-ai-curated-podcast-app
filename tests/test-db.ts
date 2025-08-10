import { prisma } from "@/lib/prisma"

export async function resetDb() {
	// Use TRUNCATE for speed and cascade to clear FKs
	await prisma.$executeRawUnsafe(`
    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'episode_feedback') THEN
        TRUNCATE TABLE "episode_feedback" RESTART IDENTITY CASCADE;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'episode') THEN
        TRUNCATE TABLE "episode" RESTART IDENTITY CASCADE;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'bundle_podcast') THEN
        TRUNCATE TABLE "bundle_podcast" RESTART IDENTITY CASCADE;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profile_podcast') THEN
        TRUNCATE TABLE "profile_podcast" RESTART IDENTITY CASCADE;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_curation_profile') THEN
        TRUNCATE TABLE "user_curation_profile" RESTART IDENTITY CASCADE;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'bundle') THEN
        TRUNCATE TABLE "bundle" RESTART IDENTITY CASCADE;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'podcast') THEN
        TRUNCATE TABLE "podcast" RESTART IDENTITY CASCADE;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'subscription') THEN
        TRUNCATE TABLE "subscription" RESTART IDENTITY CASCADE;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notification') THEN
        TRUNCATE TABLE "notification" RESTART IDENTITY CASCADE;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user') THEN
        TRUNCATE TABLE "user" RESTART IDENTITY CASCADE;
      END IF;
    END $$;
  `)
}

export async function closeDb() {
	await prisma.$disconnect()
}
