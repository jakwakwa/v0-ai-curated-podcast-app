"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePlanGatesStore } from "@/lib/stores/plan-gates-store"

type PlanOption = {
	value: string
	label: string
}

const planOptionsFallback: PlanOption[] = [{ value: "NONE", label: "None" }]

export function CuratedBundlesFilters() {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const [isPending, startTransition] = useTransition()
	const { options, loaded, load } = usePlanGatesStore()

	const initialQuery = searchParams.get("q") ?? ""
	const initialPlan = searchParams.get("min_plan") ?? ""

	const [query, setQuery] = useState(initialQuery)
	const [plan, setPlan] = useState(initialPlan)

	useEffect(() => {
		load()
	}, [load])

	useEffect(() => {
		setQuery(initialQuery)
		setPlan(initialPlan)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialQuery, initialPlan])

	const applyFilters = useCallback(
		(nextQuery: string, nextPlan: string) => {
			const params = new URLSearchParams(searchParams.toString())
			if (nextQuery.trim()) params.set("q", nextQuery.trim())
			else params.delete("q")
			if (nextPlan) params.set("min_plan", nextPlan)
			else params.delete("min_plan")

			startTransition(() => {
				router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`)
			})
		},
		[pathname, router, searchParams]
	)

	const onSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault()
			applyFilters(query, plan)
		},
		[applyFilters, plan, query]
	)

	const onClear = useCallback(() => {
		setQuery("")
		setPlan("")
		startTransition(() => {
			router.replace(pathname)
		})
	}, [pathname, router])

	const currentOptions = loaded ? (options as PlanOption[]) : planOptionsFallback
	const selectedLabel = useMemo(() => currentOptions.find(p => p.value === plan)?.label ?? "All plans", [plan, currentOptions])

	return (
		<form onSubmit={onSubmit} className="mt-4 mb-6">
			<div className="flex flex-col md:flex-row gap-3 md:items-center">
				<div className="flex-1">
					<Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search bundles or podcasts..." aria-label="Search bundles or podcasts" />
				</div>
				<div className="w-full md:w-64">
					<Select value={plan} onValueChange={setPlan}>
						<SelectTrigger aria-label="Minimum plan">
							<SelectValue placeholder="All plans">{selectedLabel}</SelectValue>
						</SelectTrigger>
						<SelectContent>
							{currentOptions.map(option => (
								<SelectItem key={option.value || "ALL"} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex gap-2">
					<Button type="submit" variant="default" disabled={isPending}>
						Apply
					</Button>
					{(initialQuery || initialPlan) && (
						<Button type="button" variant="outline" onClick={onClear} disabled={isPending}>
							Clear
						</Button>
					)}
				</div>
			</div>
		</form>
	)
}
