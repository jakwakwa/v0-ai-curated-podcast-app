"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Body } from "@/components/ui/typography"
import type { Podcast } from "@/lib/types"
import { createPodcastAction, deletePodcastAction, updatePodcastAction } from "./podcasts.actions"

export default function PodcastsPanelClient({ podcasts }: { podcasts: Podcast[] }) {
	const router = useRouter()
	const [optimistic, setOptimistic] = useState<Record<string, Partial<Podcast>>>({})
	const [isPending, startTransition] = useTransition()

	const [createForm, setCreateForm] = useState({
		name: "",
		url: "",
		description: "",
		image_url: "",
		category: "",
	})

	const [editOpen, setEditOpen] = useState(false)
	const [editingPodcastId, setEditingPodcastId] = useState<string | null>(null)
	const [editForm, setEditForm] = useState({
		name: "",
		url: "",
		description: "",
		image_url: "",
		category: "",
	})

	const optimisticPodcast = (p: Podcast): Podcast => ({ ...p, ...(optimistic[p.podcast_id] || {}) }) as Podcast

	const doCreate = () => {
		if (!(createForm.name.trim() && createForm.url.trim())) return
		startTransition(async () => {
			try {
				const form = new FormData()
				form.set("name", createForm.name.trim())
				form.set("url", createForm.url.trim())
				if (createForm.description.trim()) form.set("description", createForm.description.trim())
				if (createForm.image_url.trim()) form.set("image_url", createForm.image_url.trim())
				if (createForm.category.trim()) form.set("category", createForm.category.trim())
				await createPodcastAction(form)
				setCreateForm({ name: "", url: "", description: "", image_url: "", category: "" })
				router.refresh()
			} catch (e) {
				console.error(e)
			}
		})
	}

	const openEdit = (p: Podcast) => {
		setEditingPodcastId(p.podcast_id)
		setEditForm({
			name: p.name || "",
			url: p.url || "",
			description: p.description || "",
			image_url: p.image_url || "",
			category: p.category || "",
		})
		setEditOpen(true)
	}

	const saveEdit = () => {
		if (!editingPodcastId) return
		startTransition(async () => {
			try {
				await updatePodcastAction(editingPodcastId, {
					...(editForm.name ? { name: editForm.name } : {}),
					...(editForm.description ? { description: editForm.description } : {}),
					...(editForm.url ? { url: editForm.url } : {}),
					...(editForm.image_url !== undefined ? { image_url: editForm.image_url || null } : {}),
					...(editForm.category ? { category: editForm.category } : {}),
				})
				setEditOpen(false)
				router.refresh()
			} catch (e) {
				console.error(e)
			}
		})
	}

	const toggleActive = (p: Podcast) => {
		startTransition(async () => {
			setOptimistic(prev => ({ ...prev, [p.podcast_id]: { is_active: !p.is_active } }))
			try {
				await updatePodcastAction(p.podcast_id, { is_active: !p.is_active })
				router.refresh()
			} catch (e) {
				// revert on error
				setOptimistic(prev => ({ ...prev, [p.podcast_id]: { is_active: p.is_active } }))
				console.error(e)
			}
		})
	}

	const deletePodcast = (p: Podcast) => {
		if (!confirm(`Delete podcast "${p.name}"? This cannot be undone.`)) return
		startTransition(async () => {
			try {
				await deletePodcastAction(p.podcast_id)
				setOptimistic(prev => ({ ...prev, [p.podcast_id]: { is_active: false, name: `${p.name} (deleted)` } }))
				router.refresh()
			} catch (e) {
				console.error(e)
			}
		})
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Podcasts ({podcasts.length})</CardTitle>
				<CardDescription>Create, edit, and manage curated podcasts</CardDescription>
			</CardHeader>
			<CardContent className="p-4 space-y-6">
				<div className="space-y-3 p-4 border rounded-lg">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<Label htmlFor="podName">Name</Label>
							<Input id="podName" value={createForm.name} onChange={e => setCreateForm(s => ({ ...s, name: e.target.value }))} placeholder="e.g., The Daily" />
						</div>
						<div>
							<Label htmlFor="podUrl">Feed URL</Label>
							<Input id="podUrl" value={createForm.url} onChange={e => setCreateForm(s => ({ ...s, url: e.target.value }))} placeholder="https://example.com/feed.xml" />
						</div>
						<div className="md:col-span-2">
							<Label htmlFor="podDesc">Description</Label>
							<Textarea id="podDesc" rows={2} value={createForm.description} onChange={e => setCreateForm(s => ({ ...s, description: e.target.value }))} />
						</div>
						<div>
							<Label htmlFor="podImg">Image URL</Label>
							<Input id="podImg" value={createForm.image_url} onChange={e => setCreateForm(s => ({ ...s, image_url: e.target.value }))} placeholder="https://.../image.jpg" />
						</div>
						<div>
							<Label htmlFor="podCat">Category</Label>
							<Input id="podCat" value={createForm.category} onChange={e => setCreateForm(s => ({ ...s, category: e.target.value }))} placeholder="e.g., Technology" />
						</div>
					</div>
					<Button variant="default" onClick={doCreate} disabled={isPending || !createForm.name.trim() || !createForm.url.trim()}>
						Create Podcast
					</Button>
				</div>

				<div className="space-y-3">
					{podcasts.map((podcast: Podcast) => {
						const p = optimisticPodcast(podcast)
						return (
							<div key={p.podcast_id} className="flex items-start justify-between p-3 border rounded-lg">
								<div className="flex-1">
									<div className="flex items-center gap-2 mb-1">
										<h4 className="font-medium">{p.name}</h4>
										<Badge size="sm" variant={p.is_active ? "default" : "secondary"}>
											{p.is_active ? "Active" : "Inactive"}
										</Badge>
									</div>
									<p className="text-sm text-muted-foreground mb-2">{p.description}</p>
									<Link href={p.url} target="_blank" rel="noopener noreferrer" className="flex text-xs text-cyan-600 hover:underline max-w-[10px] items-center gap-2 overflow-hidden">
										<Body className="text-muted-foreground w-1/2 max-w-[100px]">{p.url}</Body>
									</Link>
								</div>
								<div className="flex items-center gap-2 ml-4">
									<Dialog open={editOpen && editingPodcastId === p.podcast_id} onOpenChange={o => !o && setEditOpen(false)}>
										<DialogTrigger asChild>
											<Button variant="ghost" size="sm" onClick={() => openEdit(p)}>
												Edit
											</Button>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>Edit podcast</DialogTitle>
											</DialogHeader>
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div>
													<Label htmlFor="editName">Name</Label>
													<Input id="editName" value={editForm.name} onChange={e => setEditForm(s => ({ ...s, name: e.target.value }))} />
												</div>
												<div>
													<Label htmlFor="editUrl">Feed URL</Label>
													<Input id="editUrl" value={editForm.url} onChange={e => setEditForm(s => ({ ...s, url: e.target.value }))} />
												</div>
												<div className="md:col-span-2">
													<Label htmlFor="editDesc">Description</Label>
													<Textarea id="editDesc" rows={2} value={editForm.description} onChange={e => setEditForm(s => ({ ...s, description: e.target.value }))} />
												</div>
												<div>
													<Label htmlFor="editImg">Image URL</Label>
													<Input id="editImg" value={editForm.image_url} onChange={e => setEditForm(s => ({ ...s, image_url: e.target.value }))} />
												</div>
												<div>
													<Label htmlFor="editCat">Category</Label>
													<Input id="editCat" value={editForm.category} onChange={e => setEditForm(s => ({ ...s, category: e.target.value }))} />
												</div>
											</div>
											<DialogFooter>
												<Button variant="outline" onClick={() => setEditOpen(false)}>
													Cancel
												</Button>
												<Button variant="default" onClick={saveEdit} disabled={isPending || !editForm.name.trim() || !editForm.url.trim()}>
													Save
												</Button>
											</DialogFooter>
										</DialogContent>
									</Dialog>
									<Button variant="outline" size="sm" onClick={() => toggleActive(p)} disabled={isPending}>
										{p.is_active ? "Deactivate" : "Activate"}
									</Button>
									<Button variant="ghost" size="sm" onClick={() => deletePodcast(p)} disabled={isPending} className="text-destructive">
										Delete
									</Button>
								</div>
							</div>
						)
					})}
					{podcasts.length === 0 && <p className="text-center text-muted-foreground py-4">No podcasts yet.</p>}
				</div>
			</CardContent>
		</Card>
	)
}
