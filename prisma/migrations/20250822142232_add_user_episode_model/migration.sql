-- CreateEnum
CREATE TYPE "UserEpisodeStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "subscription" ADD COLUMN     "episode_creation_count" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "user_episode" (
    "episode_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "episode_title" TEXT NOT NULL,
    "youtube_url" TEXT NOT NULL,
    "transcript" TEXT,
    "summary" TEXT,
    "gcs_audio_url" TEXT,
    "status" "UserEpisodeStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_episode_pkey" PRIMARY KEY ("episode_id")
);

-- CreateIndex
CREATE INDEX "user_episode_user_id_idx" ON "user_episode"("user_id");

-- AddForeignKey
ALTER TABLE "user_episode" ADD CONSTRAINT "user_episode_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
