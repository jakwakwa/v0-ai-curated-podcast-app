"use client"

import type { Paddle, PricePreviewParams, PricePreviewResponse } from "@paddle/paddle-js"
import { useEffect, useState } from "react"
import { PRICING_TIER } from "@/config/paddle-config"

export type PaddlePrices = Record<string, string>

// Helper function to get line items from your pricing tiers
function getLineItems(): PricePreviewParams["items"] {
	const priceId = PRICING_TIER.map(tier => [tier.priceId])
	return priceId.flat().map(priceId => ({ priceId, quantity: 1 }))
}

// Helper function to extract and format prices from the Paddle response
function getPriceAmounts(prices: PricePreviewResponse) {
	return prices.data.details.lineItems.reduce((acc, item) => {
		acc[item.price.id] = item.formattedTotals.total
		return acc
	}, {} as PaddlePrices)
}

/**
 * Custom hook to fetch prices from the Paddle API.
 * * @param paddle The initialized Paddle instance.
 * @param country The two-letter country code (e.g., "US", "DE") for currency localization.
 * @returns An object containing the fetched prices and a loading state.
 */
export function usePaddlePrices(paddle: Paddle | undefined, country: string): { prices: PaddlePrices; loading: boolean } {
	const [prices, setPrices] = useState<PaddlePrices>({})
	const [loading, setLoading] = useState<boolean>(true)

	useEffect(() => {
		// Only attempt to fetch prices if the Paddle instance is available.
		if (!paddle) {
			return
		}

		// Construct the price preview request.
		// The conditional spreading `...` is used to include the address only if a valid country is provided.
		// NOTE: The `country` parameter should be a two-letter country code (e.g., "US", "GB").
		// Using a currency code like "USD" will cause a Paddle API error.
		const paddlePricePreviewRequest: Partial<PricePreviewParams> = {
			items: getLineItems(),
			...(country && country.length === 2 && { address: { countryCode: country } }),
		}

		setLoading(true)

		paddle
			.PricePreview(paddlePricePreviewRequest as PricePreviewParams)
			.then(prices => {
				setPrices(prevState => ({ ...prevState, ...getPriceAmounts(prices) }))
				setLoading(false)
			})
			.catch(error => {
				console.error("Failed to fetch prices from Paddle:", error)
				setLoading(false)
			})
	}, [country, paddle]) // Re-run effect when `country` or `paddle` instance changes.

	return { prices, loading }
}
