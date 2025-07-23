import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import styles from "./section-cards.module.css"

export function SectionCards() {
	return (
		<div className={`${styles["main-grid-container"]} ${styles["card-with-shadow-gradient"]} ${styles["dark-card-background"]}`}>
			<Card className={styles["card-container-styles"]}>
				<CardHeader className={styles["card-header-relative"]}>
					<CardDescription>Total Revenue</CardDescription>
					<CardTitle className={styles["card-title-lg"]}>$1,250.00</CardTitle>
					<div className={styles["absolute-top-right"]}>
						<Badge variant="outline" className={styles["badge-flex"]}>
							<TrendingUpIcon className={styles["icon-size-small"]} />
							+12.5%
						</Badge>
					</div>
				</CardHeader>
				<CardFooter className={styles["card-footer-flex-col"]}>
					<div className={styles["line-clamp-1-flex"]}>
						Trending up this month <TrendingUpIcon className={styles["icon-size-medium"]} />
					</div>
					<div className={styles["text-muted-foreground"]}>Visitors for the last 6 months</div>
				</CardFooter>
			</Card>
			<Card className={styles["card-container-styles"]}>
				<CardHeader className={styles["card-header-relative"]}>
					<CardDescription>New Customers</CardDescription>
					<CardTitle className={styles["card-title-lg"]}>1,234</CardTitle>
					<div className={styles["absolute-top-right"]}>
						<Badge variant="outline" className={styles["badge-flex"]}>
							<TrendingDownIcon className={styles["icon-size-small"]} />
							-20%
						</Badge>
					</div>
				</CardHeader>
				<CardFooter className={styles["card-footer-flex-col"]}>
					<div className={styles["line-clamp-1-flex"]}>
						Down 20% this period <TrendingDownIcon className={styles["icon-size-medium"]} />
					</div>
					<div className={styles["text-muted-foreground"]}>Acquisition needs attention</div>
				</CardFooter>
			</Card>
			<Card className={styles["card-container-styles"]}>
				<CardHeader className={styles["card-header-relative"]}>
					<CardDescription>Active Accounts</CardDescription>
					<CardTitle className={styles["card-title-lg"]}>45,678</CardTitle>
					<div className={styles["absolute-top-right"]}>
						<Badge variant="outline" className={styles["badge-flex"]}>
							<TrendingUpIcon className={styles["icon-size-small"]} />
							+12.5%
						</Badge>
					</div>
				</CardHeader>
				<CardFooter className={styles["card-footer-flex-col"]}>
					<div className={styles["line-clamp-1-flex"]}>
						Strong user retention <TrendingUpIcon className={styles["icon-size-medium"]} />
					</div>
					<div className={styles["text-muted-foreground"]}>Engagement exceed targets</div>
				</CardFooter>
			</Card>
			<Card className={styles["card-container-styles"]}>
				<CardHeader className={styles["card-header-relative"]}>
					<CardDescription>Growth Rate</CardDescription>
					<CardTitle className={styles["card-title-lg"]}>4.5%</CardTitle>
					<div className={styles["absolute-top-right"]}>
						<Badge variant="outline" className={styles["badge-flex"]}>
							<TrendingUpIcon className={styles["icon-size-small"]} />
							+4.5%
						</Badge>
					</div>
				</CardHeader>
				<CardFooter className={styles["card-footer-flex-col"]}>
					<div className={styles["line-clamp-1-flex"]}>
						Steady performance <TrendingUpIcon className={styles["icon-size-medium"]} />
					</div>
					<div className={styles["text-muted-foreground"]}>Meets growth projections</div>
				</CardFooter>
			</Card>
		</div>
	)
}
