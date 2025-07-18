-- CreateTable
CREATE TABLE "curated_bundle_episodes" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "audioUrl" TEXT NOT NULL,
    "image_url" TEXT,
    "published_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "week_nr" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bundle_id" TEXT NOT NULL,

    CONSTRAINT "curated_bundle_episodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "curated_bundle_episode_feedback" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "episode_id" TEXT NOT NULL,
    "rating" "FeedbackRating" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "curated_bundle_episode_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "curated_bundle_episode_feedback_user_id_episode_id_key" ON "curated_bundle_episode_feedback"("user_id", "episode_id");

-- AddForeignKey
ALTER TABLE "curated_bundle_episodes" ADD CONSTRAINT "curated_bundle_episodes_bundle_id_fkey" FOREIGN KEY ("bundle_id") REFERENCES "curated_bundles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curated_bundle_episode_feedback" ADD CONSTRAINT "curated_bundle_episode_feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curated_bundle_episode_feedback" ADD CONSTRAINT "curated_bundle_episode_feedback_episode_id_fkey" FOREIGN KEY ("episode_id") REFERENCES "curated_bundle_episodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
