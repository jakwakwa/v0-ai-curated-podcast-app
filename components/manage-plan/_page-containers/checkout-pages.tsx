import Head from "next/head"
import type React from "react"
import { PricingPage } from "@/components/manage-plan"

const PricingPlanLinkPage: React.FC = () => {
	return (
		<>
			<Head>
				<title>Choose Your Plan - PodSlice</title>
				<script src="https://cdn.paddle.com/paddle/paddle.js"></script>
			</Head>
			<PricingPage />
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
			<PricingPage />
		</>
	)
}

export { PricingPlanLinkPage, CheckoutLinkPage }
