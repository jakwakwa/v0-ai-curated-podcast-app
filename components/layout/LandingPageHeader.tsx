import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import styles from "@/styles/landing-page-content.module.css";

export function LandingPageHeader() {
	return (
		<header className={styles.landingHeader} suppressHydrationWarning>
			<div className={styles.landingHeaderContainer}>
				<Link href="/">
					<Image src="/logo.png" width={100} height={60} alt="PODSLICE Logo" className={styles.landingLogo} />
				</Link>
				<nav className={styles.landingNav}>
					<Link href="/login">
						<Button variant="outline" size="lg">
							Sign In
						</Button>
					</Link>
				</nav>
			</div>
		</header>
	);
}
