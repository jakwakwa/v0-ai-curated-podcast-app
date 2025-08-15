import Head from "next/head"
import type React from "react"
import { ManagPlanLandingPage } from "./manage-plan-landing-page"
// import { PricingPage } from "@/components/manage-plan"

const PricingPlanLinkPage: React.FC = () => {
	return (
		<>
			<Head>
				<title>Choose Your Plan - PodSlice</title>
				<script src="https://cdn.paddle.com/paddle/paddle.js"></script>
			</Head>
			<PricingPlanLinkPage />
		</>
	)
}

const CheckoutLinkPage: React.FC = () => {
	return (
		<>
			<Head>
				<title>Checkout Your Plan - PodSlice.ai</title>
				<script src="https://cdn.paddle.com/paddle/paddle.js"></script>
			</Head>
			<ManagPlanLandingPage />
		</>
	)
}

export { PricingPlanLinkPage, CheckoutLinkPage }
