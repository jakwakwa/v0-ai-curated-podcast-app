/*
  Warnings:

  - Added the required column `updated_at` to the `collections` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "collections" ADD COLUMN     "generated_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- Update existing rows to set updated_at to the same value as created_at
UPDATE "collections" SET "updated_at" = "created_at" WHERE "updated_at" IS NULL;

-- Make updated_at NOT NULL after setting values
ALTER TABLE "collections" ALTER COLUMN "updated_at" SET NOT NULL;
