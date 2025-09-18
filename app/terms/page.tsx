"use client";

import Link from "next/link";
import { LandingPageHeader } from "@/components/layout/LandingPageHeader";
import { CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
	const lastUpdated = "June 15, 2025";

	return (
		<>
			<LandingPageHeader />
			<div className="container max-w-4xl mx-auto py-24 px-4">
				<div className="text-center mb-12 mt-12">
					<h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
					<p className="text-foreground/70">Last updated: {lastUpdated}</p>
				</div>

				<div className="text-foreground/70 max-w-4xl prose prose-lg">
					<div className="mb-8">
						<CardHeader className="my-4 text-xl font-bold">
							<CardTitle>1. Website Owner and Service Description</CardTitle>
						</CardHeader>
						<div>
							<p className="mb-4">
								This website is owned and operated by PodSlice ("we," "us," or "our"). These Terms of Service set forth the terms and conditions under which you may use our website and services as
								offered by us. This website offers visitors AI-powered podcast curation and summarization services, including personalized content delivery, audio summaries, and subscription-based
								features.
							</p>
							<p className="mb-4">By accessing or using the website of our service, you approve that you have read, understood, and agree to be bound by these Terms.</p>
						</div>
					</div>

					<div className="mb-8">
						<CardHeader className="my-4 text-xl font-bold">
							<CardTitle>2. Eligibility and Account Requirements</CardTitle>
						</CardHeader>
						<div>
							<p className="mb-4">
								In order to use our website and/or receive our services, you must be at least 18 years of age, or of the legal age of majority in your jurisdiction, and possess the legal authority,
								right and freedom to enter into these Terms as a binding agreement. You are not allowed to use this website and/or receive services if doing so is prohibited in your country or under
								any law or regulation applicable to you.
							</p>
							<p className="mb-4">
								To access certain features of our service, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all
								activities that occur under your account.
							</p>
						</div>
					</div>

					<div className="mb-8">
						<CardHeader className="my-4 text-xl font-bold">
							<CardTitle>3. Subscription Terms and Payment</CardTitle>
						</CardHeader>
						<div>
							<p className="mb-4">When subscribing to our service, you agree that:</p>
							<ul className="list-disc pl-6 space-y-2">
								<li>You are responsible for reading the full service description before making a commitment to subscribe</li>
								<li>You enter into a legally binding contract to purchase the service when you commit to subscribe and complete the check-out payment process</li>
								<li>Subscription fees are charged on a recurring basis according to your selected plan</li>
								<li>We reserve the right to change our prices for services displayed at any time, and to correct pricing errors that may inadvertently occur</li>
							</ul>
							<p className="mb-4">The prices we charge for using our services are listed on the website. Additional information about pricing and sales tax is available on the payments page.</p>
						</div>
					</div>

					<div className="mb-8">
						<CardHeader className="my-4 text-xl font-bold">
							<CardTitle>4. Trial Period and Cancellation</CardTitle>
						</CardHeader>
						<div>
							<p className="mb-4">
								We offer a 14-day free trial for new subscribers. During the trial period, you have full access to our service features. At the end of the trial period, your subscription will
								automatically convert to a paid plan unless you cancel before the trial ends.
							</p>
							<p className="mb-4">
								You may cancel your subscription at any time through your account settings. Cancellations will take effect at the end of your current billing period. No refunds will be provided for
								partial months of service.
							</p>
						</div>
					</div>

					<div className="mb-8">
						<CardHeader className="my-4 text-xl font-bold">
							<CardTitle>5. Service Modifications</CardTitle>
						</CardHeader>
						<div>
							<p className="mb-4">
								We may, without prior notice, change the services; stop providing the services or any features of the services we offer; or create limits for the services. We may permanently or
								temporarily terminate or suspend access to the services without notice and liability for any reason, or for no reason.
							</p>
						</div>
					</div>

					<div className="mb-8">
						<CardHeader className="my-4 text-xl font-bold">
							<CardTitle>6. Service Warranties and Limitations</CardTitle>
						</CardHeader>
						<div>
							<p className="mb-4">
								Our service is provided "as is" and "as available" without warranties of any kind. We do not guarantee that our service will be uninterrupted, secure, or error-free. We are not
								responsible for the accuracy, completeness, or usefulness of any content generated by our AI systems.
							</p>
							<p className="mb-4">
								To the maximum extent permitted by applicable law, in no event shall PodSlice be liable for any indirect, punitive, incidental, special, consequential or exemplary damages, including
								without limitation, damages for loss of profits, goodwill, use, data or other intangible losses, arising out of or relating to the use of, or inability to use, the service.
							</p>
						</div>
					</div>

					<div className="mb-8">
						<CardHeader className="my-4 text-xl font-bold">
							<CardTitle>7. Intellectual Property Rights</CardTitle>
						</CardHeader>
						<div>
							<p className="mb-4">
								The Service and all materials therein or transferred thereby, including, without limitation, software, images, text, graphics, logos, patents, trademarks, service marks, copyrights,
								photographs, audio, videos, music and all Intellectual Property Rights related thereto, are the exclusive property of PodSlice. Except as explicitly provided herein, nothing in these
								Terms shall be deemed to create a license in or under any such Intellectual Property Rights, and you agree not to sell, license, rent, modify, distribute, copy, reproduce, transmit,
								publicly display, publicly perform, publish, adapt, edit or create derivative works thereof.
							</p>
							<p>
								You retain ownership of any content you upload to our service. By uploading content, you grant us a limited license to use, process, and display your content solely for the purpose of
								providing our service to you.
							</p>
						</div>
					</div>

					<div className="mb-8">
						<CardHeader className="my-4 text-xl font-bold">
							<CardTitle>8. Account Suspension and Termination</CardTitle>
						</CardHeader>
						<div>
							<p>
								We may permanently or temporarily terminate or suspend your access to the service without notice and liability for any reason, including if in our sole determination you violate any
								provision of these Terms or any applicable law or regulations. You may discontinue use and request to cancel your account and/or any services at any time.
							</p>
							<p>
								Notwithstanding anything to the contrary in the foregoing, with respect to automatically-renewed subscriptions to paid services, such subscriptions will be discontinued only upon the
								expiration of the respective period for which you have already made payment.
							</p>
						</div>
					</div>

					<div className="mb-8">
						<CardHeader className="my-4 text-xl font-bold">
							<CardTitle>9. Indemnification</CardTitle>
						</CardHeader>
						<div>
							<p>
								You agree to indemnify and hold PodSlice harmless from any demands, loss, liability, claims or expenses (including attorneys' fees), made against them by any third party due to, or
								arising out of, or in connection with your use of the website or any of the services offered on the website.
							</p>
						</div>
					</div>

					<div className="mb-8">
						<CardHeader className="my-4 text-xl font-bold">
							<CardTitle>10. Limitation of Liability</CardTitle>
						</CardHeader>
						<div>
							<p className="mb-4">
								To the maximum extent permitted by applicable law, PodSlice assumes no liability or responsibility for any (i) errors, mistakes, or inaccuracies of content; (ii) personal injury or
								property damage, of any nature whatsoever, resulting from your access to or use of our service; and (iii) any unauthorized access to or use of our secure servers and/or any and all
								personal information stored therein.
							</p>
						</div>
					</div>

					<div className="mb-8">
						<CardHeader className="my-4 text-xl font-bold">
							<CardTitle>11. Terms Modifications</CardTitle>
						</CardHeader>
						<div>
							<p className="mb-4">
								We reserve the right to modify these terms from time to time at our sole discretion. Therefore, you should review these page periodically. When we change the Terms in a material
								manner, we will notify you that material changes have been made to the Terms. Your continued use of the Website or our service after any such change constitutes your acceptance of the
								new Terms. If you do not agree to any of these terms or any future version of the Terms, do not use or access (or continue to access) the website or the service.
							</p>
						</div>
					</div>

					<div className="mb-8">
						<CardHeader className="my-4 text-xl font-bold	">
							<CardTitle>12. Communications and Marketing</CardTitle>
						</CardHeader>
						<div>
							<p className="mb-4">
								You agree to receive from time to time promotional messages and materials from us, by mail, email or any other contact form you may provide us with (including your phone number for
								calls or text messages). If you don't want to receive such promotional materials or notices – please just notify us at any time.
							</p>
						</div>
					</div>

					<div className="mb-8">
						<CardHeader className="my-4 text-xl font-bold">
							<CardTitle>13. Governing Law and Dispute Resolution</CardTitle>
						</CardHeader>
						<div>
							<p className="mb-4">These Terms is to be governed, interpreted and implemented in accordance with the laws of South Africa.</p>
							<ol className="list-decimal pl-6 space-y-2">
								<li>
									You consent to the non-exclusive jurisdiction of the High Court of South Africa, Western Cape Local Division, Cape Town for any proceedings arising out of or in connection with these
									Terms.
								</li>

								<li>
									The grant of any indulgence, extension of time or relaxation of any provision by Stitch under these Terms shall not constitute a waiver of any right by us or prevent or adversely
									affect the exercise by us of any existing or future right of ours.
								</li>

								<li>
									Any provision in these Terms which is or may become illegal, invalid or unenforceable shall be ineffective to the extent of such prohibition or unenforceability and shall be treated
									as having not been written and severed from the balance of these Terms, without invalidating the remaining provisions of these Terms or affecting the validity or enforceability of
									such provision.
								</li>

								<li>
									Any provision in these Terms which is or may become illegal, invalid or unenforceable shall be ineffective to the extent of such prohibition or unenforceability and shall be treated
									as having not been written and severed from the balance of these Terms, without invalidating the remaining provisions of these Terms or affecting the validity or enforceability of
									such provision.
								</li>

								<li>You may not cede any or all of its rights or delegate any or all of its obligations under these Terms.</li>
							</ol>
						</div>
					</div>

					<div className="mb-8">
						<CardHeader className="my-4 text-xl font-bold">
							<CardTitle>14. Contact Information</CardTitle>
						</CardHeader>
						<div>
							<p className="mb-4">For questions about these Terms of Service, please contact us at:</p>
							<div className="mt-4 p-4 bg-background rounded-lg border">
								<p className="font-semibold text-custom-h5">The Podslice Team</p>
								<p>Email: notifications@podslice.ai</p>
								<p>
									Website:{" "}
									<Link href="/" className="text-primary-forefround hover:underline">
										www.podslice.ai
									</Link>
								</p>
							</div>
						</div>
					</div>

					<div className="text-left mt-4 pt-8 border-t">
						<p className="text-base text-muted-foreground">By using our service, you acknowledge that you have read and understood these Terms of Service and agree to be bound by them.</p>
						<div className="mt-4">
							<Link href="/privacy" className="text-xs text-primary-forefround hover:underline">
								View our Privacy Policy
							</Link>
						</div>
					</div>
				</div>
			</div>
			<footer className="  w-screen 	hidden md:block fixed botton-0 text-right right-4  bottom-4 z-40">
				<div className="w-screen flex items-center space-x-2 text-muted-foreground">
					<Link href="/terms" className="hover:text-foreground transition-colors w-full text-[0.4rem]">
						<span className="text-shadow-sm text-muted-foreground text-xs">Terms</span>
					</Link>
					<span>|</span>
					<Link href="/privacy" className="hover:text-foreground transition-colors text-[0.4rem]">
						<span className="text-shadow-sm text-muted-foreground text-xs">Privacy</span>
					</Link>
				</div>
			</footer>
		</>
	);
}
