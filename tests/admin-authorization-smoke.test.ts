import { beforeEach, describe, expect, it, vi } from "vitest"
import { GET as AdminBundlesGET } from "../app/api/admin/bundles/route"
import { GET as AdminCheckGET } from "../app/api/admin/check/route"
import { GET as AdminPodcastsGET } from "../app/api/admin/podcasts/route"

import { createUser } from "./factories"
import { resetDb } from "./test-db"

vi.mock("@clerk/nextjs/server", () => ({ auth: vi.fn(async () => ({ userId: globalThis.__mockUserId })) }))

declare global {
	// eslint-disable-next-line no-var
	var __mockUserId: string | null | undefined
}

describe("admin authorization smoke", () => {
	beforeEach(async () => {
		await resetDb()
		globalThis.__mockUserId = undefined
	})

	it("non-admin user receives 403 from admin/check", async () => {
		const user = await createUser({ is_admin: false })
		globalThis.__mockUserId = user.user_id
		const res = await AdminCheckGET()
		expect(res.status).toBe(403)
	})

	it("admin user can access admin/check", async () => {
		const admin = await createUser({ is_admin: true })
		globalThis.__mockUserId = admin.user_id
		const res = await AdminCheckGET()
		expect(res.status).toBe(200)
	})

	it("non-admin is blocked on admin bundles GET", async () => {
		const user = await createUser({ is_admin: false })
		globalThis.__mockUserId = user.user_id
		const res = await AdminBundlesGET()
		expect(res.status).toBe(403)
	})

	it("admin can list admin bundles GET", async () => {
		const admin = await createUser({ is_admin: true })
		globalThis.__mockUserId = admin.user_id
		const res = await AdminBundlesGET()
		expect(res.status).toBe(200)
	})

	it("non-admin is blocked on admin podcasts GET", async () => {
		const user = await createUser({ is_admin: false })
		globalThis.__mockUserId = user.user_id
		const res = await AdminPodcastsGET()
		expect(res.status).toBe(403)
	})

	it("admin can list admin podcasts GET", async () => {
		const admin = await createUser({ is_admin: true })
		globalThis.__mockUserId = admin.user_id
		const res = await AdminPodcastsGET()
		expect(res.status).toBe(200)
	})
})
