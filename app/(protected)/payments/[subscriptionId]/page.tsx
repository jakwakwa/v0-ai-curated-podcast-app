'use client';

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { LoadingScreen } from '@/components/ui/loading-screen';


export default function SubscriptionsPaymentPage() {
	const { subscriptionId } = useParams<{ subscriptionId: string }>();

	return (
		<main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-8">

			<Suspense fallback={<LoadingScreen />}>
				{/* <PaymentsContent subscriptionId={subscriptionId} /> */}
			</Suspense>
		</main>
	);
}
