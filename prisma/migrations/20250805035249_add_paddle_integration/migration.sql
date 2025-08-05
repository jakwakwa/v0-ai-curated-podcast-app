/*
  Warnings:

  - A unique constraint covering the columns `[paddle_subscription_id]` on the table `subscription` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[paddle_customer_id]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "subscription" ADD COLUMN     "cancel_at_period_end" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paddle_price_id" TEXT,
ADD COLUMN     "paddle_subscription_id" TEXT,
ADD COLUMN     "plan_type" TEXT NOT NULL DEFAULT 'casual_listener';

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "paddle_customer_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "subscription_paddle_subscription_id_key" ON "subscription"("paddle_subscription_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_paddle_customer_id_key" ON "user"("paddle_customer_id");
