-- CreateEnum
CREATE TYPE "PlanGate" AS ENUM ('NONE', 'CASUAL_LISTENER', 'CURATE_CONTROL');

-- AlterTable
ALTER TABLE "bundle" ADD COLUMN     "min_plan" "PlanGate" NOT NULL DEFAULT 'NONE';
