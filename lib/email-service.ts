import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

export interface EmailNotification {
	to: string;
	subject: string;
	text: string;
	html: string;
}

export interface EpisodeReadyEmailData {
	userFirstName: string;
	episodeTitle: string;
	episodeUrl: string;
	profileName: string;
}

export interface EpisodeFailedEmailData {
	userFirstName: string;
	episodeTitle: string;
	helpUrl?: string;
}

export interface TrialEndingEmailData {
	userFirstName: string;
	daysRemaining: number;
	upgradeUrl: string;
}

export interface SubscriptionExpiringEmailData {
	userFirstName: string;
	expirationDate: string;
	renewUrl: string;
}

class EmailService {
	private client: Resend | null = null;
	private initialized = false;

	// Remove constructor - don't initialize on import
	// constructor() {
	// 	this.initializeTransporter()
	// }

	private initializeClient() {
		// Skip if already initialized
		if (this.initialized) return;
		this.initialized = true;

		// Check if Resend is configured
		if (!process.env.RESEND_API_KEY) {
			console.warn("Email service not configured. Set RESEND_API_KEY and EMAIL_FROM environment variables.");
			return;
		}

		try {
			this.client = new Resend(process.env.RESEND_API_KEY);
			if (process.env.NODE_ENV === "development") {
				console.log("Resend client initialized");
			}
		} catch (error) {
			console.error("Failed to initialize Resend client:", error);
			this.client = null;
		}
	}

	private async canSendEmail(userId: string): Promise<boolean> {
		try {
			const user = await prisma.user.findUnique({
				where: { user_id: userId },
				select: { email_notifications: true },
			});
			return user?.email_notifications ?? false;
		} catch (error) {
			console.error("Error checking email preferences:", error);
			return false;
		}
	}

	async sendEmail(notification: EmailNotification): Promise<boolean> {
		// Lazy initialize on first use
		this.initializeClient();

		if (!this.client) {
			console.warn("Resend client not available - check RESEND_API_KEY");
			return false;
		}
		if (!process.env.EMAIL_FROM) {
			console.warn("EMAIL_FROM not set - cannot send email");
			return false;
		}

		try {
			const result = await this.client.emails.send({
				from: process.env.EMAIL_FROM,
				to: notification.to,
				subject: notification.subject,
				text: notification.text,
				html: notification.html,
			});
			if ((result as { error?: unknown }).error) {
				console.error("Resend send error:", (result as { error: unknown }).error);
				return false;
			}
			return true;
		} catch (error) {
			console.error("Failed to send email via Resend:", error);
			return false;
		}
	}

	// Episode ready notification
	async sendEpisodeReadyEmail(userId: string, userEmail: string, data: EpisodeReadyEmailData): Promise<boolean> {
		if (!(await this.canSendEmail(userId))) {
			console.log(`Email notifications disabled for user ${userId}`);
			return false;
		}

		const notification: EmailNotification = {
			to: userEmail,
			subject: `🎧 Your episode "${data.episodeTitle}" is ready!`,
			text: this.createEpisodeReadyTextTemplate(data),
			html: this.createEpisodeReadyHtmlTemplate(data),
		};

		return await this.sendEmail(notification);
	}

	// Episode failed notification
	async sendEpisodeFailedEmail(userId: string, userEmail: string, data: EpisodeFailedEmailData): Promise<boolean> {
		if (!(await this.canSendEmail(userId))) {
			console.log(`Email notifications disabled for user ${userId}`);
			return false;
		}

		const supportEmail = process.env.SUPPORT_EMAIL || "support@podslice.ai";
		const helpUrl = data.helpUrl || `${process.env.NEXT_PUBLIC_APP_URL || ""}/my-episodes`;

		const text = `Hi ${data.userFirstName},

We couldn't generate your episode "${data.episodeTitle}".

Some videos might not work reliably. You can try again and switch speaker options (single vs multi). If it still doesn't work, please reach out to ${supportEmail} and try again later.

You can manage your episodes here: ${helpUrl}

The PODSLICE Team`;

		const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Episode Generation Failed</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #dc2626; font-size: 22px; margin: 0;">We couldn't generate your episode</h1>
        </div>
        <p style="color: #374151; font-size: 16px; line-height: 1.5;">Hi ${data.userFirstName},</p>
        <p style="color: #374151; font-size: 15px; line-height: 1.6;">We couldn't generate your episode "${data.episodeTitle}".</p>
        <p style="color: #374151; font-size: 15px; line-height: 1.6;">Some videos might not work reliably. You can try again and switch speaker options (single vs multi). If it still doesn't work, please reach out to <a href="mailto:${supportEmail}">${supportEmail}</a> and try again later.</p>
        <div style="text-align: center; margin: 24px 0;">
            <a href="${helpUrl}" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">Go to My Episodes</a>
        </div>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">The PODSLICE Team</p>
    </div>
</body>
</html>`;

		const notification: EmailNotification = {
			to: userEmail,
			subject: `We couldn't generate "${data.episodeTitle}"`,
			text,
			html,
		};

		return await this.sendEmail(notification);
	}

	// Trial ending notification
	async sendTrialEndingEmail(userId: string, userEmail: string, data: TrialEndingEmailData): Promise<boolean> {
		if (!(await this.canSendEmail(userId))) {
			console.log(`Email notifications disabled for user ${userId}`);
			return false;
		}

		const notification: EmailNotification = {
			to: userEmail,
			subject: `⏰ Your PODSLICE trial ends in ${data.daysRemaining} day${data.daysRemaining !== 1 ? "s" : ""}`,
			text: this.createTrialEndingTextTemplate(data),
			html: this.createTrialEndingHtmlTemplate(data),
		};

		return await this.sendEmail(notification);
	}

	// Subscription expiring notification
	async sendSubscriptionExpiringEmail(userId: string, userEmail: string, data: SubscriptionExpiringEmailData): Promise<boolean> {
		if (!(await this.canSendEmail(userId))) {
			console.log(`Email notifications disabled for user ${userId}`);
			return false;
		}

		const notification: EmailNotification = {
			to: userEmail,
			subject: `🔔 Your PODSLICE subscription expires soon`,
			text: this.createSubscriptionExpiringTextTemplate(data),
			html: this.createSubscriptionExpiringHtmlTemplate(data),
		};

		return await this.sendEmail(notification);
	}

	// Weekly reminder notification
	async sendWeeklyReminderEmail(userId: string, userEmail: string, userName: string): Promise<boolean> {
		if (!(await this.canSendEmail(userId))) {
			console.log(`Email notifications disabled for user ${userId}`);
			return false;
		}

		const notification: EmailNotification = {
			to: userEmail,
			subject: `📅 Your weekly PODSLICE episode will be generated soon`,
			text: this.createWeeklyReminderTextTemplate(userName),
			html: this.createWeeklyReminderHtmlTemplate(userName),
		};

		return await this.sendEmail(notification);
	}

	// Email Templates
	private createEpisodeReadyTextTemplate(data: EpisodeReadyEmailData): string {
		return `Hi ${data.userFirstName},

Great news! Your weekly podcast episode is ready to listen.

Episode: ${data.episodeTitle}
Personalized Feed: ${data.profileName}

Listen now: ${data.episodeUrl}

Happy listening!
The PODSLICE Team`;
	}

	private createEpisodeReadyHtmlTemplate(data: EpisodeReadyEmailData): string {
		return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Episode is Ready!</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
				<h1 style="color: #64748b; font-size: 14px; line-height: 1.5;">
            Hi ${data.userFirstName}
				</h1><br><br>
        <p style="text-size: 14px; margin-bottom: 32px;>Great news! Your weekly podcast episode has been generated and is ready for you to enjoy.
            Click the button above to start listening to your personalized content.
        </p>
            <h1 style="color: #222222; font-size: 28px; margin: 0;">🎧 Your Episode is Ready!</h1>
        </div>

        <div style="background-color: #DAD0FE; padding: 24px; border-radius: 8px; margin-bottom: 24px;">
            <h2 style="color: #361349; font-size: 20px; margin: 0 0 12px 0;">${data.episodeTitle}</h2>
        </div>

        <div style="text-align: center; margin-bottom: 32px;">
            <a href="${data.episodeUrl}" style="display: inline-block; color: #573BF6; padding: 12px 24px; text-decoration: underline; border-radius: 6px; font-weight: 500;">Listen Now</a>
        </div>
        <hr style="border: none; border-top: 1px solid #26574E; margin: 32px 0; height: 2px; background:26574E;">

        <div style="text-align: center;">
            <p style="color: #29223E; font-size: 12px; margin: 0;">
                Happy listening!<br>
                The PODSLICE.ai Team
            </p>
        </div>
    </div>
</body>
</html>`;
	}

	private createTrialEndingTextTemplate(data: TrialEndingEmailData): string {
		return `Hi ${data.userFirstName},

Your PODSLICE trial ends in ${data.daysRemaining} day${data.daysRemaining !== 1 ? "s" : ""}!

Don't lose access to your personalized podcast feeds. Upgrade now to continue creating unlimited personalized feeds and enjoying weekly AI-generated episodes.

Upgrade your account: ${data.upgradeUrl}

The PODSLICE Team`;
	}

	private createTrialEndingHtmlTemplate(data: TrialEndingEmailData): string {
		return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trial Ending Soon</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #dc2626; font-size: 28px; margin: 0;">⏰ Trial Ending Soon</h1>
        </div>

        <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 24px; border-radius: 8px; margin-bottom: 24px;">
            <p style="color: #dc2626; margin: 0; font-weight: 500; text-align: center;">
                Your trial ends in ${data.daysRemaining} day${data.daysRemaining !== 1 ? "s" : ""}
            </p>
        </div>

        <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
            Hi ${data.userFirstName},<br><br>
            Don't lose access to your personalized podcast feeds! Your PODSLICE trial is ending soon.
        </p>

        <div style="text-align: center; margin-bottom: 32px;">
            <a href="${data.upgradeUrl}" style="display: inline-block; background-color: #dc2626; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px;">Upgrade Now</a>
        </div>

        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px;">
            <h3 style="color: #374151; font-size: 18px; margin: 0 0 12px 0;">Continue enjoying:</h3>
            <ul style="color: #6b7280; margin: 0; padding-left: 20px;">
                <li>Unlimited personalized feeds</li>
                <li>Weekly AI-generated episodes</li>
                <li>Advanced curation features</li>
                <li>Priority support</li>
            </ul>
        </div>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">

        <div style="text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                Questions? Reply to this email or contact our support team.<br>
                The PODSLICE Team
            </p>
        </div>
    </div>
</body>
</html>`;
	}

	private createSubscriptionExpiringTextTemplate(data: SubscriptionExpiringEmailData): string {
		return `Hi ${data.userFirstName},

Your PODSLICE subscription expires on ${data.expirationDate}.

To continue enjoying your personalized podcast feeds and weekly episodes, please renew your subscription.

Renew now: ${data.renewUrl}

The PODSLICE Team`;
	}

	private createSubscriptionExpiringHtmlTemplate(data: SubscriptionExpiringEmailData): string {
		return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Subscription Expiring</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #f59e0b; font-size: 28px; margin: 0;">🔔 Subscription Expiring</h1>
        </div>

        <div style="background-color: #fffbeb; border: 1px solid #fed7aa; padding: 24px; border-radius: 8px; margin-bottom: 24px;">
            <p style="color: #f59e0b; margin: 0; font-weight: 500; text-align: center;">
                Expires on ${data.expirationDate}
            </p>
        </div>

        <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
            Hi ${data.userFirstName},<br><br>
            Your PODSLICE subscription is set to expire soon. Don't miss out on your personalized podcast content!
        </p>

        <div style="text-align: center; margin-bottom: 32px;">
            <a href="${data.renewUrl}" style="display: inline-block; background-color: #f59e0b; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px;">Renew Subscription</a>
        </div>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">

        <div style="text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                Need help? Contact our support team.<br>
                The PODSLICE Team
            </p>
        </div>
    </div>
</body>
</html>`;
	}

	private createWeeklyReminderTextTemplate(userName: string): string {
		return `Hi ${userName},

Just a friendly reminder that your next weekly podcast episode will be generated this Friday at midnight.

Make sure your personalized feed is set up with the content you want to hear about this week.

Visit your dashboard: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard

The PODSLICE Team`;
	}

	private createWeeklyReminderHtmlTemplate(userName: string): string {
		return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Weekly Reminder</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #3b82f6; font-size: 28px; margin: 0;">📅 Weekly Reminder</h1>
        </div>

        <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
            Hi ${userName},<br><br>
            Just a friendly reminder that your next weekly podcast episode will be generated this Friday at midnight.
        </p>

        <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
            <p style="color: #1e40af; margin: 0; font-weight: 500;">
                💡 Make sure your personalized feed is set up with the content you want to hear about this week.
            </p>
        </div>

        <div style="text-align: center; margin-bottom: 32px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">Visit Dashboard</a>
        </div>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">

        <div style="text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                Happy listening!<br>
                The PODSLICE Team
            </p>
        </div>
    </div>
</body>
</html>`;
	}

	// Test email functionality
	async sendTestEmail(to: string): Promise<boolean> {
		const notification: EmailNotification = {
			to,
			subject: "🧪 PODSLICE Email Test",
			text: "This is a test email from PODSLICE. If you received this, email notifications are working correctly!",
			html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Test</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 40px 20px;">
        <div style="text-align: center;">
            <h1 style="color: #10b981; font-size: 28px; margin: 0 0 20px 0;">🧪 Email Test Successful!</h1>
            <p style="color: #374151; font-size: 16px; line-height: 1.5;">
                This is a test email from PODSLICE. If you received this, email notifications are working correctly!
            </p>
            <div style="margin-top: 32px;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                    The PODSLICE Team
                </p>
            </div>
        </div>
    </div>
</body>
</html>`,
		};

		return await this.sendEmail(notification);
	}
}

// Export singleton instance
export const emailService = new EmailService();
export default emailService;
