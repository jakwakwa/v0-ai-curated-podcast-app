import { Label } from "@/components/ui/label"
import { SidebarGroup, SidebarGroupContent, SidebarInput } from "@/components/ui/sidebar-ui"
import { Search } from "lucide-react"
import type React from "react"
import styles from './search-form.module.css'

export function SearchForm({ ...props }: React.ComponentProps<"form">) {
	return (
		<form {...props}>
			<SidebarGroup className={styles["sidebar-group-padding-y-0"]}>
				<SidebarGroupContent className={styles["sidebar-group-content-relative"]}>
					<Label htmlFor="search" className={styles["sr-only"]}>
						Search
					</Label>
					<SidebarInput id="search" placeholder="Search podcasts..." className={styles["sidebar-input-padding-left"]} />
					<Search className={styles["search-icon"]} />
				</SidebarGroupContent>
			</SidebarGroup>
		</form>
	)
}
