"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState, useTransition } from "react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { usePlanGatesStore } from "@/lib/stores/plan-gates-store"
import type { Bundle, Podcast } from "@/lib/types"
import { createBundleAction, updateBundleAction, deleteBundleAction } from "./bundles.actions"

// Combine bundle + podcasts for convenience
type BundleWithPodcasts = Bundle & { podcasts: Podcast[] }

type OptimisticBundle = Partial<BundleWithPodcasts>

type EditFormState = {
	name: string
	description: string
	min_plan: string
	selectedPodcastIds: string[]
}

export default function BundlesPanelClient({
	bundles,
	availablePodcasts,
}: {
	bundles: (BundleWithPodcasts & { min_plan?: string; canInteract?: boolean; lockReason?: string | null })[]
	availablePodcasts: Podcast[]
}) {
	const router = useRouter()
	const { options: planGateOptions, loaded: planGatesLoaded, load: loadPlanGates } = usePlanGatesStore()

	const [optimistic, setOptimistic] = useState<Record<string, OptimisticBundle>>({})
	const [isPending, startTransition] = useTransition()

	// CREATE form state
	const [showCreateForm, setShowCreateForm] = useState(false)
	const [createForm, setCreateForm] = useState({
		name: "",
		description: "",
		min_plan: "NONE",
		selectedPodcastIds: [] as string[],
	})
	const [isCreating, setIsCreating] = useState(false)

	// EDIT form state
	const [editOpen, setEditOpen] = useState(false)
	const [editingBundleId, setEditingBundleId] = useState<string | null>(null)
	const [editForm, setEditForm] = useState<EditFormState>({
		name: "",
		description: "",
		min_plan: "NONE",
		selectedPodcastIds: [] as string[],
	})

	useEffect(() => {
		loadPlanGates()
	}, [loadPlanGates])

	// Helpers
	const optimisticBundle = (b: BundleWithPodcasts & { min_plan?: string }): BundleWithPodcasts & { min_plan?: string } => ({
		...b,
		...(optimistic[b.bundle_id] || {}),
	})

	// CREATE
	const toggleCreatePodcastSelection = (id: string) => {
		setCreateForm(prev => ({
			...prev,
			selectedPodcastIds: prev.selectedPodcastIds.includes(id) ? prev.selectedPodcastIds.filter(x => x !== id) : [...prev.selectedPodcastIds, id],
		}))
	}

	const doCreate = async () => {
		if (!createForm.name.trim()) return
		const form = new FormData()
		form.set("name", createForm.name.trim())
		form.set("description", createForm.description.trim())
		form.set("min_plan", createForm.min_plan)
		createForm.selectedPodcastIds.forEach(id => form.append("podcast_ids", id))
		try {
			setIsCreating(true)
			await createBundleAction(form)
			setCreateForm({ name: "", description: "", min_plan: "NONE", selectedPodcastIds: [] })
			setShowCreateForm(false)
			router.refresh()
		} catch (e) {
			console.error(e)
			toast.error("Failed to create bundle")
		} finally {
			setIsCreating(false)
		}
	}

	// EDIT
	const openEdit = (b: BundleWithPodcasts & { min_plan?: string }) => {
		setEditingBundleId(b.bundle_id)
		setEditForm({
			name: b.name || "",
			description: b.description || "",
			min_plan: (b.min_plan as string) || "NONE",
			selectedPodcastIds: b.podcasts.map(p => p.podcast_id),
		})
		setEditOpen(true)
	}

	const toggleEditPodcastSelection = (id: string) => {
		setEditForm(prev => ({
			...prev,
			selectedPodcastIds: prev.selectedPodcastIds.includes(id) ? prev.selectedPodcastIds.filter(x => x !== id) : [...prev.selectedPodcastIds, id],
		}))
	}

	const saveEdit = () => {
		if (!editingBundleId) return
		const id = editingBundleId
		const prevSnapshot = optimistic[id]
		startTransition(async () => {
			// Optimistic UI update
			setOptimistic(prev => ({
				...prev,
				[id]: {
					...(prev[id] || {}),
					name: editForm.name,
					description: editForm.description,
					podcasts: availablePodcasts.filter(p => editForm.selectedPodcastIds.includes(p.podcast_id)),
				},
			}))
			try {
				await updateBundleAction(id, {
					name: editForm.name,
					description: editForm.description,
					min_plan: editForm.min_plan,
					podcastIds: editForm.selectedPodcastIds,
				})
				setEditOpen(false)
				toast.success("Bundle updated")
				router.refresh()
			} catch (e) {
				console.error(e)
				// Revert on error
				setOptimistic(prev => {
					if (prevSnapshot) return { ...prev, [id]: prevSnapshot }
					const { [id]: _removed, ...rest } = prev
					return rest
				})
				toast.error("Failed to update bundle")
			}
		})
	}

	// DELETE
	const deleteBundle = (b: BundleWithPodcasts) => {
		if (!confirm(`Delete bundle "${b.name}"? This cannot be undone.`)) return
		startTransition(async () => {
			try {
				await deleteBundleAction(b.bundle_id)
				setOptimistic(prev => ({ ...prev, [b.bundle_id]: { name: `${b.name} (deleted)` } }))
				router.refresh()
			} catch (e) {
				console.error(e)
				toast.error("Failed to delete bundle")
			}
		})
	}

	const createButtonLabel = bundles.length === 0 ? "Add your first bundle" : "Add Another Bundle"

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<div>
					<CardTitle>Bundle Management</CardTitle>
					<CardDescription>Create new bundles and manage existing ones</CardDescription>
				</div>
				<div className="flex items-center gap-2">
					<Button variant="outline" size="sm" onClick={() => setShowCreateForm(s => !s)}>
						{showCreateForm ? "Hide" : createButtonLabel}
					</Button>
					<Button variant="outline" size="sm" onClick={() => router.refresh()}>Refresh</Button>
				</div>
			</CardHeader>
			<CardContent className="p-4 space-y-6">
				{/* CREATE FORM */}
				{showCreateForm && (
					<div className="space-y-3 p-4 border rounded-lg">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<Label htmlFor="bundleName">Bundle Name</Label>
								<Input id="bundleName" value={createForm.name} onChange={e => setCreateForm(s => ({ ...s, name: e.target.value }))} placeholder="e.g., Tech Weekly" />
							</div>
							<div>
								<Label htmlFor="bundleDescription">Description</Label>
								<Textarea id="bundleDescription" value={createForm.description} onChange={e => setCreateForm(s => ({ ...s, description: e.target.value }))} rows={2} />
							</div>
							<div>
								<Label htmlFor="minPlan">Visibility</Label>
								<select id="minPlan" className="w-full border rounded h-9 px-2 bg-background" value={createForm.min_plan} onChange={e => setCreateForm(s => ({ ...s, min_plan: e.target.value }))}>
									{(planGatesLoaded ? planGateOptions : [{ value: "NONE", label: "Free (All users)" }]).map(opt => (
										<option key={opt.value} value={opt.value}>
											{opt.label}
										</option>
									))}
								</select>
							</div>
						</div>
						<div>
							<Label>Select Podcasts (optional)</Label>
							<div className="mt-2 max-h-200 overflow-y-auto border rounded-lg p-3 space-y-2">
								{availablePodcasts.map(p => (
									<div key={p.podcast_id} className="flex items-start space-x-2">
										<Checkbox id={`create-pod-${p.podcast_id}`} checked={createForm.selectedPodcastIds.includes(p.podcast_id)} onCheckedChange={() => toggleCreatePodcastSelection(p.podcast_id)} />
										<div className="flex-1">
											<label htmlFor={`create-pod-${p.podcast_id}`} className="text-sm font-medium cursor-pointer">
												{p.name}
											</label>
											<p className="text-xs text-muted-foreground">{p.description}</p>
										</div>
									</div>
								))}
							</div>
						</div>
						<Button variant="default" onClick={doCreate} disabled={isCreating || !createForm.name.trim()}>
							{isCreating ? "Creating..." : "Create Bundle"}
						</Button>
					</div>
				)}

				{/* EXISTING BUNDLES LIST */}
				<div className="space-y-4">
					<h3 className="text-sm text-muted-foreground">Existing Bundles ({bundles.length})</h3>
					{bundles.map(bundleOriginal => {
						const bundle = optimisticBundle(bundleOriginal)
						return (
							<div key={bundle.bundle_id} className={`p-4 border rounded-lg ${bundleOriginal.canInteract === false ? "opacity-60" : ""}`}>
								{/* Header */}
								<div className="flex items-start justify-between mb-2">
									<div className="flex-1">
										<h4 className="font-semibold">{bundle.name}</h4>
										<p className="text-sm text-muted-foreground mb-2">{bundle.description}</p>
										<div className="flex flex-wrap gap-1 mb-1">
											{bundle.podcasts.map(p => (
												<Badge size="sm" key={p.podcast_id} variant="outline" className="text-xs">
													{p.name}
												</Badge>
											))}
										</div>
									</div>
									{/* Actions */}
									<div className="flex items-center gap-2">
										<Dialog open={editOpen && editingBundleId === bundle.bundle_id} onOpenChange={o => !o && setEditOpen(false)}>
											<DialogTrigger asChild>
												<Button variant="ghost" size="sm" onClick={() => openEdit(bundle)}>
													Edit
												</Button>
											</DialogTrigger>
											<DialogContent>
												<DialogHeader>
													<DialogTitle>Edit bundle</DialogTitle>
												</DialogHeader>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
													<div>
														<Label htmlFor="editName">Name</Label>
														<Input id="editName" value={editForm.name} onChange={e => setEditForm(s => ({ ...s, name: e.target.value }))} />
													</div>
													<div>
														<Label htmlFor="editDescription">Description</Label>
														<Textarea id="editDescription" rows={2} value={editForm.description} onChange={e => setEditForm(s => ({ ...s, description: e.target.value }))} />
													</div>
													<div>
														<Label htmlFor="editMinPlan">Visibility</Label>
														<select id="editMinPlan" className="w-full border rounded h-9 px-2 bg-background" value={editForm.min_plan} onChange={e => setEditForm(s => ({ ...s, min_plan: e.target.value }))}>
															{(planGatesLoaded ? planGateOptions : [{ value: "NONE", label: "Free (All users)" }]).map(opt => (
																<option key={opt.value} value={opt.value}>
																	{opt.label}
																</option>
															))}
													</select>
													</div>
												</div>
												<div>
													<Label>Select Podcasts</Label>
													<div className="mt-2 max-h-200 overflow-y-auto border rounded-lg p-3 space-y-2">
														{availablePodcasts.map(p => (
															<div key={p.podcast_id} className="flex items-start space-x-2">
																<Checkbox id={`edit-pod-${p.podcast_id}`} checked={editForm.selectedPodcastIds.includes(p.podcast_id)} onCheckedChange={() => toggleEditPodcastSelection(p.podcast_id)} />
																<div className="flex-1">
																	<label htmlFor={`edit-pod-${p.podcast_id}`} className="text-sm font-medium cursor-pointer">
																		{p.name}
																	</label>
																	<p className="text-xs text-muted-foreground">{p.description}</p>
																</div>
														</div>
													))}
													</div>
												</div>
												<DialogFooter>
													<Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
													<Button variant="default" onClick={saveEdit} disabled={isPending || !editForm.name.trim()}>
														Save
													</Button>
												</DialogFooter>
											</DialogContent>
										</Dialog>
										<Button variant="ghost" size="sm" onClick={() => deleteBundle(bundle as BundleWithPodcasts)} className="text-destructive">
											Delete
										</Button>
									</div>
								</div>
							</div>
						)
					})}
					{bundles.length === 0 && <p className="text-center text-muted-foreground py-8">No bundles created yet.</p>}
				</div>
			</CardContent>
		</Card>
	)
}
