import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// --- IMPORTANT ---
// This script creates users in your DATABASE, but not in your Clerk authentication system.
// After running this script, you must go to your Clerk dashboard and create users with the
// following exact email addresses to be able to log in as them.
//
// 1. admin@test.com
// 2. premium@test.com
// 3. casual@test.com
//
// You can set any password you like for them in the Clerk dashboard.

async function main() {
	console.log("🌱 Starting to seed the database with test users...")

	// --- Upsert Bundles (to ensure they exist for profiles) ---
	// Manually upserting because `name` is not a unique field on the Bundle model.
	let freeBundle = await prisma.bundle.findFirst({
		where: { name: "Free Slice Weekly" },
	})
	if (!freeBundle) {
		freeBundle = await prisma.bundle.create({
			data: {
				name: "Free Slice Weekly",
				description: "A weekly selection of our favorite free podcasts.",
				min_plan: "NONE",
			},
		})
	}

	let premiumBundle = await prisma.bundle.findFirst({
		where: { name: "Curator's Choice" },
	})
	if (!premiumBundle) {
		premiumBundle = await prisma.bundle.create({
			data: {
				name: "Curator's Choice",
				description: "Exclusive, hand-picked content for our premium subscribers.",
				min_plan: "CURATE_CONTROL",
			},
		})
	}

	// --- 1. Admin User ---
	const adminUser = await prisma.user.upsert({
		where: { email: "admin@test.com" },
		update: { is_admin: true },
		create: {
			email: "admin@test.com",
			name: "Admin User",
			is_admin: true,
			password: "password_placeholder", // Not used by Clerk, but required by schema
		},
	})
	console.log("✓ Created/updated admin user:", adminUser.email)

	// --- 2. Premium User (Curate & Control) ---
	const premiumUser = await prisma.user.upsert({
		where: { email: "premium@test.com" },
		update: {},
		create: {
			email: "premium@test.com",
			name: "Premium User",
			password: "password_placeholder",
		},
	})

	// Clean up existing subscriptions and create a fresh one to ensure a clean state
	await prisma.subscription.deleteMany({ where: { user_id: premiumUser.user_id } })
	await prisma.subscription.create({
		data: {
			user_id: premiumUser.user_id,
			plan_type: "curate_control",
			status: "active",
			current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
		},
	})

	await prisma.userCurationProfile.upsert({
		where: { user_id: premiumUser.user_id },
		update: {
			name: "Premium Feed",
			is_bundle_selection: true,
			selected_bundle_id: premiumBundle.bundle_id,
		},
		create: {
			user_id: premiumUser.user_id,
			name: "Premium Feed",
			is_bundle_selection: true,
			selected_bundle_id: premiumBundle.bundle_id,
		},
	})
	console.log("✓ Created/updated premium user and subscription:", premiumUser.email)

	// --- 3. Casual User (Casual Listener) ---
	const casualUser = await prisma.user.upsert({
		where: { email: "casual@test.com" },
		update: {},
		create: {
			email: "casual@test.com",
			name: "Casual User",
			password: "password_placeholder",
		},
	})

	// Clean up existing subscriptions and create a fresh one
	await prisma.subscription.deleteMany({ where: { user_id: casualUser.user_id } })
	await prisma.subscription.create({
		data: {
			user_id: casualUser.user_id,
			plan_type: "casual_listener",
			status: "active",
			current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
		},
	})

	await prisma.userCurationProfile.upsert({
		where: { user_id: casualUser.user_id },
		update: {
			name: "My Casual Feed",
			is_bundle_selection: false,
			selected_bundle_id: null,
		},
		create: {
			user_id: casualUser.user_id,
			name: "My Casual Feed",
			is_bundle_selection: false,
			selected_bundle_id: null,
		},
	})
	console.log("✓ Created/updated casual user and subscription:", casualUser.email)

	console.log("🌱 Database seeding completed successfully!")
}

main()
	.catch(e => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
