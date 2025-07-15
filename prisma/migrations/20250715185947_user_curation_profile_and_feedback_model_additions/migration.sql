/*
  Warnings:

  - You are about to drop the column `collection_id` on the `episodes` table. All the data in the column will be lost.
  - You are about to drop the column `collection_id` on the `sources` table. All the data in the column will be lost.
  - You are about to drop the `collections` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `user_curation_profile_id` to the `episodes` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FeedbackRating" AS ENUM ('THUMBS_UP', 'THUMBS_DOWN', 'NEUTRAL');

-- DropForeignKey
ALTER TABLE "collections" DROP CONSTRAINT "collections_selected_bundle_id_fkey";

-- DropForeignKey
ALTER TABLE "collections" DROP CONSTRAINT "collections_user_id_fkey";

-- DropForeignKey
ALTER TABLE "episodes" DROP CONSTRAINT "episodes_collection_id_fkey";

-- DropForeignKey
ALTER TABLE "sources" DROP CONSTRAINT "sources_collection_id_fkey";

-- AlterTable
ALTER TABLE "episodes" DROP COLUMN "collection_id",
ADD COLUMN     "user_curation_profile_id" TEXT NOT NULL,
ADD COLUMN     "week_nr" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "sources" DROP COLUMN "collection_id",
ADD COLUMN     "user_curation_profile_id" TEXT;

-- DropTable
DROP TABLE "collections";

-- CreateTable
CREATE TABLE "user_curation_profiles" (
    "id" TEXT NOT NULL,
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

    CONSTRAINT "user_curation_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "episode_feedback" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "episode_id" TEXT NOT NULL,
    "rating" "FeedbackRating" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "episode_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_curation_profiles_user_id_key" ON "user_curation_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "episode_feedback_user_id_episode_id_key" ON "episode_feedback"("user_id", "episode_id");

-- AddForeignKey
ALTER TABLE "user_curation_profiles" ADD CONSTRAINT "user_curation_profiles_selected_bundle_id_fkey" FOREIGN KEY ("selected_bundle_id") REFERENCES "curated_bundles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_curation_profiles" ADD CONSTRAINT "user_curation_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sources" ADD CONSTRAINT "sources_user_curation_profile_id_fkey" FOREIGN KEY ("user_curation_profile_id") REFERENCES "user_curation_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "episodes" ADD CONSTRAINT "episodes_user_curation_profile_id_fkey" FOREIGN KEY ("user_curation_profile_id") REFERENCES "user_curation_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "episode_feedback" ADD CONSTRAINT "episode_feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "episode_feedback" ADD CONSTRAINT "episode_feedback_episode_id_fkey" FOREIGN KEY ("episode_id") REFERENCES "episodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
