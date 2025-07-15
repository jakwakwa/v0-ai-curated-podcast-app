"use client"

import { Check, ChevronsUpDown, GalleryVerticalEnd } from "lucide-react"
import * as React from "react"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar-ui"
import styles from './version-switcher.module.css'

export function VersionSwitcher({
	versions,
	defaultVersion,
}: {
	versions: string[]
	defaultVersion: string
}) {
	const [selectedVersion, setSelectedVersion] = React.useState(defaultVersion)

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className={styles["sidebar-menu-button"]}
						>
							<div className={styles["icon-wrapper"]}>
								<GalleryVerticalEnd className={styles["icon-small"]} />
							</div>
							<div className={styles["text-container"]}>
								<span className={styles["font-semibold"]}>Ai Podcast Curator App</span>
								<span className={styles["ml-auto"]}>v{selectedVersion}</span>
							</div>
							<ChevronsUpDown className={styles["ml-auto"]} />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent className={styles["dropdown-menu-content"]} align="start">
						{versions.map(version => (
							<DropdownMenuItem key={version} onSelect={() => setSelectedVersion(version)}>
								v{version} {version === selectedVersion && <Check className={styles["ml-auto"]} />}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
