/*
  Warnings:

  - Added the required column `collection_id` to the `episodes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "episodes" ADD COLUMN     "collection_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "episodes" ADD CONSTRAINT "episodes_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
