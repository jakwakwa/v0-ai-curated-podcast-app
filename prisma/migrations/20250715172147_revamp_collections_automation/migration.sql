/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `episodes` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `collections` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "collections" DROP CONSTRAINT "collections_user_id_fkey";

-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_user_id_fkey";

-- AlterTable
ALTER TABLE "collections" ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_bundle_selection" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_generation_date" TIMESTAMP(3),
ADD COLUMN     "next_generation_date" TIMESTAMP(3),
ADD COLUMN     "selected_bundle_id" TEXT;

-- AlterTable
ALTER TABLE "episodes" DROP COLUMN "imageUrl",
ADD COLUMN     "image_url" TEXT;

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "image" TEXT,
    "emailVerified" TIMESTAMP(3),
    "email_notifications" BOOLEAN NOT NULL DEFAULT true,
    "in_app_notifications" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "curated_podcasts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "category" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "curated_podcasts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "curated_bundles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "curated_bundles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "curated_bundle_podcasts" (
    "id" TEXT NOT NULL,
    "bundle_id" TEXT NOT NULL,
    "podcast_id" TEXT NOT NULL,

    CONSTRAINT "curated_bundle_podcasts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "curated_bundle_podcasts_bundle_id_podcast_id_key" ON "curated_bundle_podcasts"("bundle_id", "podcast_id");

-- CreateIndex
CREATE UNIQUE INDEX "collections_user_id_key" ON "collections"("user_id");

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_selected_bundle_id_fkey" FOREIGN KEY ("selected_bundle_id") REFERENCES "curated_bundles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curated_bundle_podcasts" ADD CONSTRAINT "curated_bundle_podcasts_bundle_id_fkey" FOREIGN KEY ("bundle_id") REFERENCES "curated_bundles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curated_bundle_podcasts" ADD CONSTRAINT "curated_bundle_podcasts_podcast_id_fkey" FOREIGN KEY ("podcast_id") REFERENCES "curated_podcasts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
