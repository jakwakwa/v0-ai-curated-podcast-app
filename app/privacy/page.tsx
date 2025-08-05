"use client"

import { Bell, Database, Eye, FileText, Globe, Lock, Shield, Users } from "lucide-react"
import Link from "next/link"
import { LandingPageHeader } from "@/components/layout/LandingPageHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPage() {
	const lastUpdated = "July 2025"

	return (
		<>
			<LandingPageHeader />
			<div className="container max-w-4xl mx-auto py-24 px-4">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
					<p className="text-muted-foreground">Last updated: {lastUpdated}</p>
				</div>

				<div className="prose prose-lg max-w-none">
					<Card className="mb-8">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Shield className="h-5 w-5" />
								1. Our Commitment to Your Privacy
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="mb-4">
								At Podslice.ai, we are deeply committed to protecting your privacy and personal information. We believe that privacy is a fundamental human right, and we are dedicated to upholding the
								highest standards of data protection and privacy practices.
							</p>
							<p className="mb-4">
								This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our AI-powered podcast curation and summarization services. We are committed
								to transparency, user control, and implementing privacy-by-design principles in everything we do.
							</p>
							<p>
								We comply with international privacy laws including the General Data Protection Regulation (GDPR), California Consumer Privacy Act (CCPA), Protection of Personal Information Act
								(POPIA), and other applicable privacy regulations worldwide.
							</p>
						</CardContent>
					</Card>

					<Card className="mb-8">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Database className="h-5 w-5" />
								2. Information We Collect
							</CardTitle>
						</CardHeader>
						<CardContent>
							<h4 className="font-semibold mb-2">Personal Information</h4>
							<ul className="list-disc pl-6 space-y-2 mb-4">
								<li>Name and email address for account creation and communication</li>
								<li>Payment information (processed securely through trusted payment providers)</li>
								<li>Profile preferences and podcast curation settings</li>
								<li>Communication preferences and marketing consent</li>
							</ul>

							<h4 className="font-semibold mb-2">Service Usage Information</h4>
							<ul className="list-disc pl-6 space-y-2 mb-4">
								<li>Podcast selections and listening preferences</li>
								<li>AI-generated content interactions and feedback</li>
								<li>Service usage patterns and feature preferences</li>
								<li>Device information for service optimization</li>
							</ul>

							<h4 className="font-semibold mb-2">Technical Information</h4>
							<ul className="list-disc pl-6 space-y-2">
								<li>IP address and general location data (for service delivery)</li>
								<li>Browser type and device information</li>
								<li>Performance and error data for service improvement</li>
								<li>Analytics data (anonymized where possible)</li>
							</ul>
						</CardContent>
					</Card>

					<Card className="mb-8">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Eye className="h-5 w-5" />
								3. How We Use Your Information
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="mb-4">We use your information solely for the following legitimate purposes:</p>
							<ul className="list-disc pl-6 space-y-2">
								<li>Provide and maintain our podcast curation and AI summarization services</li>
								<li>Process payments and manage your subscription securely</li>
								<li>Personalize your experience and content recommendations</li>
								<li>Generate AI-powered summaries based on your preferences</li>
								<li>Communicate important service updates and features</li>
								<li>Improve our services through anonymized analytics</li>
								<li>Ensure security and prevent fraud</li>
								<li>Comply with legal obligations and privacy regulations</li>
							</ul>
							<p className="mt-4 text-sm text-muted-foreground">We will never sell, rent, or trade your personal information to third parties for marketing purposes.</p>
						</CardContent>
					</Card>

					<Card className="mb-8">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Lock className="h-5 w-5" />
								4. Data Security and Protection
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="mb-4">We implement industry-leading security measures to protect your personal information:</p>
							<ul className="list-disc pl-6 space-y-2">
								<li>End-to-end encryption for data in transit and at rest</li>
								<li>Regular security audits and vulnerability assessments</li>
								<li>Multi-factor authentication and access controls</li>
								<li>Secure payment processing through trusted providers</li>
								<li>Employee training on data protection and privacy</li>
								<li>Incident response procedures and breach notification protocols</li>
							</ul>
							<p className="mt-4 text-sm text-muted-foreground">
								While we implement robust security measures, no method of transmission over the internet is 100% secure. We continuously monitor and improve our security practices.
							</p>
						</CardContent>
					</Card>

					<Card className="mb-8">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Globe className="h-5 w-5" />
								5. International Data Transfers
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="mb-4">
								As a global service, your information may be transferred to and processed in countries other than your own. We ensure all international transfers comply with applicable privacy laws:
							</p>
							<ul className="list-disc pl-6 space-y-2">
								<li>GDPR-compliant transfers using standard contractual clauses</li>
								<li>Adequacy decisions and appropriate safeguards</li>
								<li>Transparent disclosure of transfer locations</li>
								<li>Local data protection authority compliance</li>
							</ul>
							<p className="mt-4">We maintain data processing agreements with all service providers and ensure they meet our privacy standards.</p>
						</CardContent>
					</Card>

					<Card className="mb-8">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<FileText className="h-5 w-5" />
								6. Your Privacy Rights
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="mb-4">You have comprehensive rights regarding your personal information:</p>
							<ul className="list-disc pl-6 space-y-2">
								<li>
									<strong>Access:</strong> Request a copy of your personal information
								</li>
								<li>
									<strong>Correction:</strong> Update or correct inaccurate information
								</li>
								<li>
									<strong>Deletion:</strong> Request deletion of your personal information
								</li>
								<li>
									<strong>Portability:</strong> Receive your data in a structured, machine-readable format
								</li>
								<li>
									<strong>Restriction:</strong> Limit how we process your information
								</li>
								<li>
									<strong>Objection:</strong> Object to certain types of processing
								</li>
								<li>
									<strong>Withdrawal:</strong> Withdraw consent for marketing communications
								</li>
								<li>
									<strong>Automated Decisions:</strong> Request human review of automated decisions
								</li>
							</ul>
							<p className="mt-4">
								To exercise these rights, contact us at <strong>jkotzee@icloud.com</strong>. We will respond within 30 days.
							</p>
						</CardContent>
					</Card>

					<Card className="mb-8">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Bell className="h-5 w-5" />
								7. Marketing and Communications
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="mb-4">We respect your communication preferences and only send marketing communications with your explicit consent:</p>
							<ul className="list-disc pl-6 space-y-2">
								<li>Clear opt-in mechanisms for marketing communications</li>
								<li>Easy unsubscribe options in all marketing emails</li>
								<li>Granular consent management for different communication types</li>
								<li>Respect for "Do Not Track" browser settings</li>
							</ul>
							<p className="mt-4">You can manage your communication preferences in your account settings or contact us directly.</p>
						</CardContent>
					</Card>

					<Card className="mb-8">
						<CardHeader>
							<CardTitle>8. Data Retention</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="mb-4">We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy:</p>
							<div className="space-y-2">
								<p>
									<strong>Account data:</strong> Retained while your account is active and for 30 days after deletion
								</p>
								<p>
									<strong>Payment information:</strong> Retained as required by financial regulations
								</p>
								<p>
									<strong>Usage data:</strong> Anonymized after 12 months for service improvement
								</p>
								<p>
									<strong>Marketing data:</strong> Retained until you withdraw consent or unsubscribe
								</p>
							</div>
							<p className="mt-4">We regularly review and delete data that is no longer necessary for our legitimate business purposes.</p>
						</CardContent>
					</Card>

					<Card className="mb-8">
						<CardHeader>
							<CardTitle>9. Third-Party Services</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="mb-4">We carefully select third-party service providers who share our commitment to privacy and transparency. Below are the specific services we use:</p>

							<h4 className="font-semibold mb-2 mt-6">Authentication Services</h4>
							<p className="mb-2">
								<strong>Clerk</strong> - We use Clerk for user authentication and account management. Clerk processes your login credentials, profile information, and authentication data to provide
								secure access to our services.
							</p>
							<p className="mb-4">
								•{" "}
								<Link href="https://clerk.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
									Clerk Privacy Policy
								</Link>
							</p>

							<h4 className="font-semibold mb-2 mt-6">Payment Processing</h4>
							<p className="mb-2">
								<strong>Paddle</strong> - We use Paddle for secure payment processing and subscription management. Paddle processes your payment information, billing details, and subscription data to
								facilitate transactions.
							</p>
							<p className="mb-4">
								•{" "}
								<Link href="https://www.paddle.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
									Paddle Privacy Policy
								</Link>
							</p>
							<p className="mb-4">
								•{" "}
								<Link href="https://paddle.net/find-purchase" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
									Find Your Purchase & Contact Paddle Support
								</Link>
							</p>
							<p className="mb-4">
								•{" "}
								<Link href="https://paddle.net/verify-email" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
									Verify Your Email with Paddle
								</Link>
							</p>

							<h4 className="font-semibold mb-2 mt-6">Cloud Storage Services</h4>
							<p className="mb-2">
								<strong>Google Cloud Services</strong> - We use Google Cloud for secure storage of audio files only. Google Cloud stores podcast audio content and AI-generated audio summaries. No user
								personal information is stored in Google Cloud services.
							</p>
							<p className="mb-4">
								•{" "}
								<Link href="https://cloud.google.com/terms/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
									Google Cloud Privacy Policy
								</Link>
							</p>

							<h4 className="font-semibold mb-2 mt-6">Other Service Providers</h4>
							<ul className="list-disc pl-6 space-y-2">
								<li>Cloud providers with robust security certifications</li>
								<li>Analytics services with privacy-focused configurations</li>
								<li>All providers bound by data processing agreements</li>
							</ul>

							<p className="mt-4">
								We maintain data processing agreements with all service providers and ensure they meet our privacy standards. We do not sell, rent, or trade your personal information to third parties
								for marketing purposes.
							</p>
						</CardContent>
					</Card>

					<Card className="mb-8">
						<CardHeader>
							<CardTitle>10. Children's Privacy</CardTitle>
						</CardHeader>
						<CardContent>
							<p>
								Our service is not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16. If you are a parent or guardian and believe
								your child has provided us with personal information, please contact us immediately.
							</p>
						</CardContent>
					</Card>

					<Card className="mb-8">
						<CardHeader>
							<CardTitle>11. Changes to This Policy</CardTitle>
						</CardHeader>
						<CardContent>
							<p>
								We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by posting the new policy on this
								page and updating the "Last updated" date. Your continued use of our service after such changes constitutes acceptance of the updated policy.
							</p>
						</CardContent>
					</Card>

					<Card className="mb-8">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Users className="h-5 w-5" />
								12. Contact Us
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="mb-4">If you have questions about this Privacy Policy or our data practices, please contact us:</p>
							<div className="mt-4 p-4 bg-background rounded-lg border">
								<p className="font-semibold text-custom-h5">Podslice.ai Privacy Team</p>
								<p>Email: jkotzee@icloud.com</p>
								<p>Support: jkotzee@icloud.com</p>
								<p>Payment Issues: payment@podslice.ai</p>
								<p>
									Website:{" "}
									<Link href="/" className="text-primary hover:underline">
										www.podslice.ai
									</Link>
								</p>
							</div>
							<p className="mt-4 text-sm text-muted-foreground">For EU residents: You have the right to lodge a complaint with your local data protection authority.</p>
						</CardContent>
					</Card>

					<div className="text-right mt-12 pt-8 border-t">
						<p className="text-xs text-muted-foreground">This Privacy Policy is effective as of {lastUpdated} and applies to all users of our service worldwide.</p>
						<div className="mt-4">
							<Link href="/terms" className="text-xs text-primary hover:underline">
								View our Terms of Service
							</Link>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
