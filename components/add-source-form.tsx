"use client"

import { addPodcastSource } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle } from "lucide-react"
import { useActionState, useEffect, useRef } from "react"
import { useFormStatus } from "react-dom"
import { toast } from "sonner"
import styles from './add-source-form.module.css'

function SubmitButton({ disabled }: { disabled: boolean }) {
	const { pending } = useFormStatus()
	return (
		<Button type="submit" disabled={disabled || pending}>
			{pending ? "Adding..." : "Add Show"}
		</Button>
	)
}

export function AddSourceForm({ disabled }: { disabled: boolean }) {
	const [state, formAction] = useActionState(addPodcastSource, { success: false, message: "" })
	const formRef = useRef<HTMLFormElement>(null)

	// biome-ignore lint/correctness/useExhaustiveDependencies: <deps expexpted>
	useEffect(() => {
		if (state?.success === true && state?.message !== "") {
			toast(`${state.message}`)
			formRef.current?.reset()
		} else if (state?.success === false && state?.message !== "") {
			toast(`Message:${state.message}`)
		}
	}, [state, toast])

	return (
		<form ref={formRef} action={formAction} className={styles["form-container"]}>
			<div className={styles["input-wrapper"]}>
				<PlusCircle className={styles["plus-icon"]} />
				<Input
					type="url"
					name="url"
					placeholder="Enter Youtube show URL..."
					className={styles["input-field"]}
					disabled={disabled}
					required
				/>
			</div>
			<SubmitButton disabled={disabled} />
		</form>
	)
}
