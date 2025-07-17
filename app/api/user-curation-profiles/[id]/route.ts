import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(
	_request: Request, // Marked as unused
	{ params }: { params: Promise<{ id: string }> }
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

		const userCurationProfile = await prisma.userCurationProfile.findUnique({
			where: { id: id, userId: userId },
			include: { sources: true, selectedBundle: true },
		})

		if (!userCurationProfile) {
			return NextResponse.json({ error: "User Curation Profile not found" }, { status: 404 })
		}

		return NextResponse.json(userCurationProfile)
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error)
		// biome-ignore lint/suspicious/noConsole: <explanation>
		console.error("[USER_CURATION_PROFILE_GET_BY_ID]", message)
		return NextResponse.json({ error: "Internal Error" }, { status: 500 })
	}
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

		// biome-ignore lint/complexity/useSimplifiedLogicExpression: <explanation>
		if (!name && !isBundleSelection && !selectedBundleId && !sourceUrls) {
			return NextResponse.json({ error: "No update data provided" }, { status: 400 })
		}

		// Fetch the existing user curation profile to check ownership
		const existingUserCurationProfile = await prisma.userCurationProfile.findUnique({
			where: { id: id },
		})

		if (!existingUserCurationProfile) {
			return NextResponse.json({ error: "User Curation Profile not found" }, { status: 404 })
		}

		if (existingUserCurationProfile.userId !== userId) {
			// biome-ignore lint/suspicious/noConsole: Debug logging
			// biome-ignore lint/suspicious/noConsoleLog: <explanation>
			console.log("User ID mismatch:", {
				requestUserId: userId,
				profileUserId: existingUserCurationProfile.userId,
				profileId: id,
			})
			return NextResponse.json({ error: "Unauthorized - User ID mismatch" }, { status: 403 })
		}

		// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
		let updatedUserCurationProfile

		if (isBundleSelection !== undefined) {
			// If changing to bundle selection
			if (isBundleSelection && selectedBundleId) {
				updatedUserCurationProfile = await prisma.userCurationProfile.update({
					where: { id: id },
					data: {
						name: name || existingUserCurationProfile.name,
						isBundleSelection: true,
						selectedBundleId,
						sources: { deleteMany: {} }, // Clear existing sources
					},
				})
			} else if (!isBundleSelection) {
				// If changing to custom selection
				updatedUserCurationProfile = await prisma.userCurationProfile.update({
					where: { id: id },
					data: {
						name: name || existingUserCurationProfile.name,
						isBundleSelection: false,
						selectedBundleId: null,
					},
				})
			}
		} else if (sourceUrls) {
			// Update sources for a custom user curation profile
			// First, delete all existing sources for this user curation profile
			await prisma.source.deleteMany({
				where: { userCurationProfileId: id },
			})

			// Then, create new sources
			updatedUserCurationProfile = await prisma.userCurationProfile.update({
				where: { id: id },
				data: {
					name: name || existingUserCurationProfile.name,
					sources: {
						create: sourceUrls.map((url: { name: string; url: string; imageUrl?: string }) => ({
							name: url.name,
							url: url.url,
							imageUrl: url.imageUrl,
						})),
					},
				},
			})
		} else if (name) {
			updatedUserCurationProfile = await prisma.userCurationProfile.update({
				where: { id: id },
				data: { name: name },
			})
		}

		return NextResponse.json(updatedUserCurationProfile)
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error)
		// biome-ignore lint/suspicious/noConsole: <explanation>
		console.error("[USER_CURATION_PROFILE_PATCH]", message)
		return NextResponse.json({ error: "Internal Error" }, { status: 500 })
	}
}

export async function DELETE(
	_request: Request, // Marked as unused
	{ params }: { params: Promise<{ id: string }> }
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
		const deactivatedUserCurationProfile = await prisma.userCurationProfile.update({
			where: { id: id, userId: userId },
			data: { isActive: false },
		})

		if (!deactivatedUserCurationProfile) {
			return NextResponse.json({ error: "User Curation Profile not found or unauthorized" }, { status: 404 })
		}

		return NextResponse.json({ message: "User Curation Profile deactivated successfully" })
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error)
		// biome-ignore lint/suspicious/noConsole: <explanation>
		console.error("[USER_CURATION_PROFILE_DELETE]", message)
		return NextResponse.json({ error: "Internal Error" }, { status: 500 })
	}
}
