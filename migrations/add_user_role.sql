-- Add UserRole enum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- Add role column to User table with default USER
ALTER TABLE "user" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'USER';

-- Migrate existing is_admin=true users to ADMIN role
UPDATE "user" SET "role" = 'ADMIN' WHERE "is_admin" = true;

-- Note: We're keeping the is_admin column for now to maintain backward compatibility
-- It can be safely removed in a future migration once all systems are updated