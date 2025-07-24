# Email Notifications Setup

This guide explains how to configure email notifications for your PodSlice application.

## Overview

PodSlice can send email notifications for:

- 🎧 **Episode Ready**: When a new podcast episode is generated
- ⏰ **Trial Ending**: When a user's trial period is ending
- 🔔 **Subscription Expiring**: When a subscription is about to expire
- 📅 **Weekly Reminders**: Reminders about upcoming episode generation

## Environment Variables

Add these environment variables to your `.env.local` file:

```env
# Email Configuration
EMAIL_HOST="smtp.gmail.com"              # SMTP server
EMAIL_PORT="587"                         # SMTP port (587 for STARTTLS, 465 for SSL)
EMAIL_SECURE="false"                     # true for 465 (SSL), false for 587 (STARTTLS)
EMAIL_FROM="noreply@podslice.com"        # From email address
EMAIL_USER="your-email@gmail.com"        # SMTP username
EMAIL_PASS="your-app-password"           # SMTP password

# App URL (for email links)
NEXT_PUBLIC_APP_URL="https://yourapp.com"  # Your app's public URL
```

## SMTP Provider Setup

### Gmail

1. Enable 2-factor authentication on your Google account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → App passwords
   - Generate a new app password
3. Use these settings:

   ```env
   EMAIL_HOST="smtp.gmail.com"
   EMAIL_PORT="587"
   EMAIL_SECURE="false"
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASS="your-16-digit-app-password"
   ```

### SendGrid

1. Create a SendGrid account
2. Generate an API key
3. Use these settings:

   ```env
   EMAIL_HOST="smtp.sendgrid.net"
   EMAIL_PORT="587"
   EMAIL_SECURE="false"
   EMAIL_USER="apikey"
   EMAIL_PASS="your-sendgrid-api-key"
   ```

### Mailgun

1. Create a Mailgun account
2. Get your SMTP credentials
3. Use these settings:

   ```env
   EMAIL_HOST="smtp.mailgun.org"
   EMAIL_PORT="587"
   EMAIL_SECURE="false"
   EMAIL_USER="your-mailgun-username"
   EMAIL_PASS="your-mailgun-password"
   ```

### Custom SMTP

For other SMTP providers, check their documentation for the correct settings.

## User Email Preferences

Users can control email notifications through their account settings:

- **Email Notifications**: `User.emailNotifications` (boolean)
- **In-App Notifications**: `User.inAppNotifications` (boolean)

The email service automatically checks these preferences before sending emails.

## Testing Email

### Admin Dashboard Test

1. Go to `/admin` (admin access required)
2. Click the "Testing" tab
3. Click "Send Test Email"
4. Check your email inbox

### API Test

```bash
# Send test email (admin only)
curl -X POST https://yourapp.com/api/notifications/test-email \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

## Email Templates

The system includes responsive HTML email templates for:

1. **Episode Ready**: Beautiful template with episode details and listen button
2. **Trial Ending**: Urgent design with upgrade call-to-action
3. **Subscription Expiring**: Warning design with renewal link
4. **Weekly Reminder**: Friendly reminder about upcoming generation

All templates are mobile-responsive and include both HTML and plain text versions.

## Troubleshooting

### Email Not Sending

1. Check environment variables are set correctly
2. Verify SMTP credentials
3. Check application logs for error messages
4. Ensure user has `emailNotifications: true`

### Gmail Issues

- Use App Passwords, not your regular password
- Enable 2-factor authentication first
- Check for "less secure app" settings (though App Passwords are preferred)

### Template Issues

- Ensure `NEXT_PUBLIC_APP_URL` is set correctly for links
- Test templates across different email clients

## Production Considerations

1. **Use a dedicated email service** (SendGrid, Mailgun, SES)
2. **Set up proper DNS records** (SPF, DKIM, DMARC)
3. **Monitor email deliverability**
4. **Implement email bounce/complaint handling**
5. **Consider email rate limiting**

## Development vs Production

### Development

- Use Gmail or other personal SMTP for testing
- Set `EMAIL_FROM` to your personal email
- Test with your own email address

### Production

- Use professional email service (SendGrid, Mailgun)
- Set `EMAIL_FROM` to your domain (e.g., <noreply@podslice.com>)
- Implement proper error handling and monitoring

## Email Sending Logic

Emails are sent automatically when:

1. **Episode Generation Completes** (Inngest function)
   - Creates in-app notification
   - Sends email if user preferences allow

2. **Admin Bundle Episodes** (Inngest function)
   - Notifies all users with selected bundle
   - Respects individual email preferences

3. **Subscription Events** (future implementation)
   - Trial ending warnings
   - Subscription expiration notices

## Security Notes

- Never commit SMTP credentials to version control
- Use environment variables for all email configuration
- Consider using email service API keys instead of SMTP when possible
- Implement proper error handling to avoid exposing credentials in logs
