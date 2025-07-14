import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"
import cuid from "cuid"
import "dotenv/config"

const sql = neon(process.env.DATABASE_URL)

const seedUser = {
  email: "test.user@example.com",
  password: "password123",
  name: "Test User",
}

async function createTables() {
  console.log("Dropping existing tables...")
  await sql`DROP TABLE IF EXISTS "sources";`
  await sql`DROP TABLE IF EXISTS "collections";`
  await sql`DROP TABLE IF EXISTS "users";`

  console.log("Creating tables...")
  await sql`
    CREATE TABLE "users" (
      "id" TEXT PRIMARY KEY,
      "name" TEXT,
      "email" TEXT NOT NULL UNIQUE,
      "password" TEXT NOT NULL,
      "image" TEXT,
      "emailVerified" TIMESTAMPTZ
    );
  `

  await sql`
    CREATE TABLE "collections" (
      "id" UUID PRIMARY KEY,
      "user_id" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
      "name" TEXT NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'Draft',
      "created_at" TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `

  await sql`
    CREATE TABLE "sources" (
      "id" UUID PRIMARY KEY,
      "collection_id" UUID NOT NULL REFERENCES "collections"("id") ON DELETE CASCADE,
      "name" TEXT NOT NULL,
      "url" TEXT NOT NULL,
      "image_url" TEXT,
      "created_at" TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `
  console.log("Tables created successfully.")
}

async function seedData() {
  console.log("Seeding data...")
  // 1. Create a test user
  const userId = cuid()
  const hashedPassword = await bcrypt.hash(seedUser.password, 10)
  await sql`
    INSERT INTO "users" (id, email, password, name)
    VALUES (${userId}, ${seedUser.email}, ${hashedPassword}, ${seedUser.name});
  `
  console.log(`Test user created with ID: ${userId}`)

  // 2. Create a 'Saved' collection
  const savedCollectionId = uuidv4()
  await sql`
    INSERT INTO "collections" (id, user_id, name, status)
    VALUES (${savedCollectionId}, ${userId}, 'Week of July 5th, 2025', 'Saved');
  `
  await sql`
    INSERT INTO "sources" (id, collection_id, name, url, image_url) VALUES
    (${uuidv4()}, ${savedCollectionId}, 'Acquired', 'https://open.spotify.com/show/1TzB4nK8f4T3pUa6C3lT9t', '/placeholder.svg?width=40&height=40'),
    (${uuidv4()}, ${savedCollectionId}, 'All-In Podcast', 'https://open.spotify.com/show/2I3r1wZnNKh6C44i3tE0D2', '/placeholder.svg?width=40&height=40'),
    (${uuidv4()}, ${savedCollectionId}, 'Darknet Diaries', 'https://open.spotify.com/show/4XPl3uEEL9hvqMkoZrzbx5', '/placeholder.svg?width=40&height=40');
  `
  console.log("Created a 'Saved' collection with sources.")

  // 3. Create a 'Draft' collection
  const draftCollectionId = uuidv4()
  await sql`
    INSERT INTO "collections" (id, user_id, name, status)
    VALUES (${draftCollectionId}, ${userId}, 'New Weekly Curation', 'Draft');
  `
  await sql`
    INSERT INTO "sources" (id, collection_id, name, url, image_url) VALUES
    (${uuidv4()}, ${draftCollectionId}, 'The Daily', 'https://open.spotify.com/show/3IM0lmZxpFAY72Q_...', '/placeholder.svg?width=40&height=40'),
    (${uuidv4()}, ${draftCollectionId}, 'Lex Fridman Podcast', 'https://open.spotify.com/show/2MAi0BvDc6GTFvKFPXnkCL', '/placeholder.svg?width=40&height=40');
  `
  console.log("Created a 'Draft' collection with sources.")
}

async function main() {
  await createTables()
  await seedData()
  console.log("\nSeed process completed successfully!")
  console.log(`\nYou can log in with the test user:`)
  console.log(`Email: ${seedUser.email}`)
  console.log(`Password: ${seedUser.password}`)
}

main().catch((e) => {
  console.error("An error occurred during the seed process:", e)
  process.exit(1)
})
