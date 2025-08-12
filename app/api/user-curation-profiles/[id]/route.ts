import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

interface RouteParams {
	params: Promise<{ id: string }>
}

export async function GET(_request: Request, { params }: RouteParams) {
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
			where: { profile_id: id, user_id: userId },
			include: { selectedBundle: true },
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
		const { name, status, selected_bundle_id } = body

		const hasUpdateData = name || status || selected_bundle_id
		if (!hasUpdateData) {
			return NextResponse.json({ error: "No update data provided" }, { status: 400 })
		}

		const existingProfile = await prisma.userCurationProfile.findUnique({
			where: { profile_id: id, user_id: userId },
		})

		if (!existingProfile) {
			return NextResponse.json({ error: "User Curation Profile not found or unauthorized" }, { status: 404 })
		}

		const dataToUpdate: {
			name?: string
			status?: string
			selected_bundle_id?: string
			is_bundle_selection?: boolean
		} = {}

		if (name) dataToUpdate.name = name
		if (status) dataToUpdate.status = status

		if (selected_bundle_id) {
			const [bundle, sub] = await Promise.all([
				prisma.bundle.findUnique({ where: { bundle_id: selected_bundle_id } }),
				prisma.subscription.findFirst({ where: { user_id: userId }, orderBy: { updated_at: "desc" } }),
			])
			if (!bundle) {
				return NextResponse.json({ error: "Bundle not found" }, { status: 404 })
			}
			const plan = sub?.plan_type ?? null
			const gate = bundle.min_plan
			const allowed = gate === "NONE" || (gate === "CASUAL_LISTENER" && (plan === "casual_listener" || plan === "curate_control")) || (gate === "CURATE_CONTROL" && plan === "curate_control")
			if (!allowed) {
				return NextResponse.json({ error: "Bundle requires a higher plan", requiredPlan: gate }, { status: 403 })
			}
			dataToUpdate.selected_bundle_id = selected_bundle_id
			dataToUpdate.is_bundle_selection = true
		}

		const updatedUserCurationProfile = await prisma.userCurationProfile.update({
			where: { profile_id: id },
			data: dataToUpdate,
		})

		return NextResponse.json(updatedUserCurationProfile)
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error)
		console.error("[USER_CURATION_PROFILE_PATCH]", message)
		return NextResponse.json({ error: "Internal Error" }, { status: 500 })
	}
}

export async function DELETE(_request: Request, { params }: RouteParams) {
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
