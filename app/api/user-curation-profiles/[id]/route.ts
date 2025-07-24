import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

interface RouteParams {
	params: Promise<{ id: string }>
}

export async function GET(
	_request: Request, // Marked as unused
	{ params }: RouteParams
) {
	try {
		const { userId } = await auth()

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const { id } = await params

		if (!id) {
			return NextResponse.json({ error: "User Curation Profile ID is required" }, { status: 400 })
		}

		const prismaClient = prisma()
		const userCurationProfile = await prismaClient.userCurationProfile.findUnique({
			where: { profile_id: id, user_id: userId },
			include: { bundle: true },
		})

		if (!userCurationProfile) {
			return NextResponse.json({ error: "User Curation Profile not found" }, { status: 404 })
		}

		return NextResponse.json(userCurationProfile)
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error)
		console.error("[USER_CURATION_PROFILE_GET_BY_ID]", message)
		return NextResponse.json({ error: "Internal Error" }, { status: 500 })
	}
}

export async function PATCH(request: Request, { params }: RouteParams) {
	try {
		const { userId } = await auth()

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const { id } = await params

		if (!id) {
			return NextResponse.json({ error: "User Curation Profile ID is required" }, { status: 400 })
		}

		const body = await request.json()
		const { name, isBundleSelection, selectedBundleId, sourceUrls } = body

		// biome-ignore lint/complexity/useSimplifiedLogicExpression: checking that at least one field is provided
		if (!name && !isBundleSelection && !selectedBundleId && !sourceUrls) {
			return NextResponse.json({ error: "No update data provided" }, { status: 400 })
		}

		// Fetch the existing user curation profile to check ownership
		const prismaClient = prisma()
		const existingUserCurationProfile = await prismaClient.userCurationProfile.findUnique({
			where: { profile_id: id },
		})

		if (!existingUserCurationProfile) {
			return NextResponse.json({ error: "User Curation Profile not found" }, { status: 404 })
		}

		if (existingUserCurationProfile.user_id !== userId) {
			return NextResponse.json({ error: "Unauthorized - User ID mismatch" }, { status: 403 })
		}
		// TODO: Fix no explicit any
		// biome-ignore lint/suspicious/noImplicitAnyLet: <FIX LATER>
		let updatedUserCurationProfile

		if (isBundleSelection !== undefined) {
			// If changing to bundle selection
			if (isBundleSelection && selectedBundleId) {
				updatedUserCurationProfile = await prismaClient.userCurationProfile.update({
					where: { profile_id: id },
					data: {
						name: name || existingUserCurationProfile.name,
						is_bundle_selection: true,
						selected_bundle_id: selectedBundleId,
					},
				})
			} else if (!isBundleSelection) {
				// If changing to custom selection
				updatedUserCurationProfile = await prismaClient.userCurationProfile.update({
					where: { profile_id: id },
					data: {
						name: name || existingUserCurationProfile.name,
						is_bundle_selection: false,
						selected_bundle_id: null,
					},
				})
			}
		} else if (sourceUrls) {
			// Update sources for a custom user curation profile
			// Note: Sources functionality has been temporarily disabled during migration
			updatedUserCurationProfile = await prismaClient.userCurationProfile.update({
				where: { profile_id: id },
				data: {
					name: name || existingUserCurationProfile.name,
				},
			})
		} else if (name) {
			updatedUserCurationProfile = await prismaClient.userCurationProfile.update({
				where: { profile_id: id },
				data: { name: name },
			})
		}

		return NextResponse.json(updatedUserCurationProfile)
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error)
		console.error("[USER_CURATION_PROFILE_PATCH]", message)
		return NextResponse.json({ error: "Internal Error" }, { status: 500 })
	}
}

export async function DELETE(
	_request: Request, // Marked as unused
	{ params }: RouteParams
) {
	try {
		const { userId } = await auth()

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const { id } = await params

		if (!id) {
			return NextResponse.json({ error: "User Curation Profile ID is required" }, { status: 400 })
		}

		// Deactivate the user curation profile instead of deleting it
		const prismaClient = prisma()
		const deactivatedUserCurationProfile = await prismaClient.userCurationProfile.update({
			where: { profile_id: id, user_id: userId },
			data: { is_active: false },
		})

		if (!deactivatedUserCurationProfile) {
			return NextResponse.json({ error: "User Curation Profile not found or unauthorized" }, { status: 404 })
		}

		return NextResponse.json({ message: "User Curation Profile deactivated successfully" })
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error)
		console.error("[USER_CURATION_PROFILE_DELETE]", message)
		return NextResponse.json({ error: "Internal Error" }, { status: 500 })
	}
}
