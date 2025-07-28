/*
  Warnings:

  - The primary key for the `episode_feedback` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `episode_feedback` table. All the data in the column will be lost.
  - You are about to drop the `curated_bundle_episode_feedback` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `curated_bundle_episodes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `curated_bundle_podcasts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `curated_bundles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `curated_podcasts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `episodes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sources` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subscriptions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_curation_profiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - The required column `feedback_id` was added to the `episode_feedback` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "curated_bundle_episode_feedback" DROP CONSTRAINT "curated_bundle_episode_feedback_episode_id_fkey";

-- DropForeignKey
ALTER TABLE "curated_bundle_episode_feedback" DROP CONSTRAINT "curated_bundle_episode_feedback_user_id_fkey";

-- DropForeignKey
ALTER TABLE "curated_bundle_episodes" DROP CONSTRAINT "curated_bundle_episodes_bundle_id_fkey";

-- DropForeignKey
ALTER TABLE "curated_bundle_podcasts" DROP CONSTRAINT "curated_bundle_podcasts_bundle_id_fkey";

-- DropForeignKey
ALTER TABLE "curated_bundle_podcasts" DROP CONSTRAINT "curated_bundle_podcasts_podcast_id_fkey";

-- DropForeignKey
ALTER TABLE "episode_feedback" DROP CONSTRAINT "episode_feedback_episode_id_fkey";

-- DropForeignKey
ALTER TABLE "episode_feedback" DROP CONSTRAINT "episode_feedback_user_id_fkey";

-- DropForeignKey
ALTER TABLE "episodes" DROP CONSTRAINT "episodes_source_id_fkey";

-- DropForeignKey
ALTER TABLE "episodes" DROP CONSTRAINT "episodes_user_curation_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_user_id_fkey";

-- DropForeignKey
ALTER TABLE "sources" DROP CONSTRAINT "sources_user_curation_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_curation_profiles" DROP CONSTRAINT "user_curation_profiles_selected_bundle_id_fkey";

-- DropForeignKey
ALTER TABLE "user_curation_profiles" DROP CONSTRAINT "user_curation_profiles_user_id_fkey";

-- AlterTable
ALTER TABLE "episode_feedback" DROP CONSTRAINT "episode_feedback_pkey",
DROP COLUMN "id",
ADD COLUMN     "feedback_id" TEXT NOT NULL,
ADD CONSTRAINT "episode_feedback_pkey" PRIMARY KEY ("feedback_id");

-- DropTable
DROP TABLE "curated_bundle_episode_feedback";

-- DropTable
DROP TABLE "curated_bundle_episodes";

-- DropTable
DROP TABLE "curated_bundle_podcasts";

-- DropTable
DROP TABLE "curated_bundles";

-- DropTable
DROP TABLE "curated_podcasts";

-- DropTable
DROP TABLE "episodes";

-- DropTable
DROP TABLE "notifications";

-- DropTable
DROP TABLE "sources";

-- DropTable
DROP TABLE "subscriptions";

-- DropTable
DROP TABLE "user_curation_profiles";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "user" (
    "user_id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "image" TEXT,
    "email_verified" TIMESTAMP(3),
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "email_notifications" BOOLEAN NOT NULL DEFAULT true,
    "in_app_notifications" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "paystack_customer_id" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "podcast" (
    "podcast_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "image_url" TEXT,
    "category" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "owner_user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "podcast_pkey" PRIMARY KEY ("podcast_id")
);

-- CreateTable
CREATE TABLE "episode" (
    "episode_id" TEXT NOT NULL,
    "podcast_id" TEXT NOT NULL,
    "profile_id" TEXT,
    "bundle_id" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "audio_url" TEXT NOT NULL,
    "image_url" TEXT,
    "published_at" TIMESTAMP(3),
    "week_nr" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "episode_pkey" PRIMARY KEY ("episode_id")
);

-- CreateTable
CREATE TABLE "bundle" (
    "bundle_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "is_static" BOOLEAN NOT NULL DEFAULT true,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "owner_user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bundle_pkey" PRIMARY KEY ("bundle_id")
);

-- CreateTable
CREATE TABLE "bundle_podcast" (
    "bundle_id" TEXT NOT NULL,
    "podcast_id" TEXT NOT NULL,

    CONSTRAINT "bundle_podcast_pkey" PRIMARY KEY ("bundle_id","podcast_id")
);

-- CreateTable
CREATE TABLE "user_curation_profile" (
    "profile_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "audio_url" TEXT,
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "generated_at" TIMESTAMP(3),
    "last_generation_date" TIMESTAMP(3),
    "next_generation_date" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_bundle_selection" BOOLEAN NOT NULL DEFAULT false,
    "selected_bundle_id" TEXT,

    CONSTRAINT "user_curation_profile_pkey" PRIMARY KEY ("profile_id")
);

-- CreateTable
CREATE TABLE "profile_podcast" (
    "profile_id" TEXT NOT NULL,
    "podcast_id" TEXT NOT NULL,

    CONSTRAINT "profile_podcast_pkey" PRIMARY KEY ("profile_id","podcast_id")
);

-- CreateTable
CREATE TABLE "notification" (
    "notification_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "subscription" (
    "subscription_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "paystack_subscription_code" TEXT,
    "paystack_plan_code" TEXT,
    "status" TEXT NOT NULL DEFAULT 'trialing',
    "current_period_start" TIMESTAMP(3),
    "current_period_end" TIMESTAMP(3),
    "trial_start" TIMESTAMP(3),
    "trial_end" TIMESTAMP(3),
    "canceled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_pkey" PRIMARY KEY ("subscription_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_paystack_customer_id_key" ON "user"("paystack_customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "podcast_url_key" ON "podcast"("url");

-- CreateIndex
CREATE INDEX "podcast_owner_user_id_idx" ON "podcast"("owner_user_id");

-- CreateIndex
CREATE INDEX "podcast_is_active_idx" ON "podcast"("is_active");

-- CreateIndex
CREATE INDEX "episode_podcast_week_idx" ON "episode"("podcast_id", "week_nr");

-- CreateIndex
CREATE INDEX "episode_published_at_idx" ON "episode"("published_at");

-- CreateIndex
CREATE INDEX "episode_profile_idx" ON "episode"("profile_id");

-- CreateIndex
CREATE INDEX "episode_bundle_idx" ON "episode"("bundle_id");

-- CreateIndex
CREATE INDEX "bundle_static_active_idx" ON "bundle"("is_static", "is_active");

-- CreateIndex
CREATE INDEX "bundle_owner_idx" ON "bundle"("owner_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_curation_profile_user_id_key" ON "user_curation_profile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_paystack_subscription_code_key" ON "subscription"("paystack_subscription_code");

-- AddForeignKey
ALTER TABLE "podcast" ADD CONSTRAINT "podcast_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "episode" ADD CONSTRAINT "episode_bundle_id_fkey" FOREIGN KEY ("bundle_id") REFERENCES "bundle"("bundle_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "episode" ADD CONSTRAINT "episode_podcast_id_fkey" FOREIGN KEY ("podcast_id") REFERENCES "podcast"("podcast_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "episode" ADD CONSTRAINT "episode_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "user_curation_profile"("profile_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle" ADD CONSTRAINT "bundle_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_podcast" ADD CONSTRAINT "bundle_podcast_bundle_id_fkey" FOREIGN KEY ("bundle_id") REFERENCES "bundle"("bundle_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_podcast" ADD CONSTRAINT "bundle_podcast_podcast_id_fkey" FOREIGN KEY ("podcast_id") REFERENCES "podcast"("podcast_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_curation_profile" ADD CONSTRAINT "user_curation_profile_selected_bundle_id_fkey" FOREIGN KEY ("selected_bundle_id") REFERENCES "bundle"("bundle_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_curation_profile" ADD CONSTRAINT "user_curation_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_podcast" ADD CONSTRAINT "profile_podcast_podcast_id_fkey" FOREIGN KEY ("podcast_id") REFERENCES "podcast"("podcast_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_podcast" ADD CONSTRAINT "profile_podcast_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "user_curation_profile"("profile_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "episode_feedback" ADD CONSTRAINT "episode_feedback_episode_id_fkey" FOREIGN KEY ("episode_id") REFERENCES "episode"("episode_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "episode_feedback" ADD CONSTRAINT "episode_feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
