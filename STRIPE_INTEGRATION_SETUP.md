# Stripe Subscription Integration Setup Guide

This guide explains how to set up Stripe subscription plans with Clerk authentication for your Next.js application.

## Prerequisites

- Stripe account (https://stripe.com)
- Clerk account (https://clerk.com)
- Next.js application with Clerk authentication already configured

## Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs (create these in your Stripe dashboard)
STRIPE_BASIC_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...

# Clerk Configuration (already configured)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

## Stripe Dashboard Setup

### 1. Create Products and Prices

In your Stripe Dashboard:

1. Go to Products → Add Product
2. Create the following products:

**Basic Plan**
- Name: Basic Plan
- Description: Essential features for individuals
- Pricing: $9.99/month recurring
- Copy the Price ID to `STRIPE_BASIC_PRICE_ID`

**Pro Plan**
- Name: Pro Plan
- Description: Advanced features for power users
- Pricing: $19.99/month recurring
- Copy the Price ID to `STRIPE_PRO_PRICE_ID`

**Enterprise Plan**
- Name: Enterprise Plan
- Description: Custom solutions for organizations
- Pricing: $49.99/month recurring
- Copy the Price ID to `STRIPE_ENTERPRISE_PRICE_ID`

### 2. Configure Customer Portal

1. Go to Settings → Billing → Customer Portal
2. Enable the features you want customers to manage:
   - Update payment methods
   - Cancel subscriptions
   - Update billing information
   - Download invoices
3. Configure your branding and business information
4. Save the configuration

### 3. Set Up Webhooks

1. Go to Developers → Webhooks
2. Click "Add endpoint"
3. Set endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select the following events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `checkout.session.completed`
5. Copy the webhook secret to `STRIPE_WEBHOOK_SECRET`

## Database Schema

The subscription data is stored using the existing Prisma schema. Make sure your database includes the `Subscription` model as defined in `prisma/schema.prisma`.

## API Endpoints

The following API endpoints are available:

- `GET /api/subscription` - Get user's subscription data
- `POST /api/subscription/create-checkout` - Create Stripe checkout session
- `POST /api/subscription/billing-portal` - Access billing portal
- `POST /api/webhooks/stripe` - Handle Stripe webhooks

## React Components

### Pricing Page
Access at `/pricing` to view and select subscription plans.

### Subscription Management
Access at `/subscription` to manage current subscription.

### Access Control
Use the `AccessControl` component to protect features:

```tsx
import { AccessControl } from "@/components/access-control"

<AccessControl feature="Advanced Analytics">
  <AdvancedAnalyticsComponent />
</AccessControl>
```

### Subscription Status
Add to your navigation:

```tsx
import { SubscriptionStatus } from "@/components/subscription-status"

<SubscriptionStatus />
```

## Feature Access Control

Features are controlled based on subscription plans:

**Free Plan Features:**
- 1 User Curation Profile
- Weekly Generation
- Basic Support
- 7-day trial

**Basic Plan Features:**
- Up to 3 User Curation Profiles
- Weekly Generation
- Email Support
- Advanced Analytics

**Pro Plan Features:**
- Unlimited User Curation Profiles
- Daily Generation
- Priority Support
- Advanced Analytics
- Custom Integrations
- Team Collaboration

**Enterprise Plan Features:**
- Everything in Pro
- White-label Solution
- Dedicated Account Manager
- Custom Integrations
- SLA Guarantee
- On-premise Deployment

## Testing

### Test Cards

Use Stripe's test cards for testing:
- Success: `4242 4242 4242 4242`
- Declined: `4000 0000 0000 0002`

### Webhook Testing

Use Stripe CLI for local webhook testing:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Deployment

1. Set environment variables in your production environment
2. Update webhook endpoint URL to your production domain
3. Switch to live mode in Stripe Dashboard
4. Create live products and update price IDs
5. Update environment variables with live keys

## Usage Examples

### Protecting a Route

```tsx
import { withAccessControl } from "@/components/access-control"

function AdvancedFeaturePage() {
  return <div>Advanced Feature Content</div>
}

export default withAccessControl(AdvancedFeaturePage, "Advanced Analytics")
```

### Checking Access in Component

```tsx
import { useFeatureAccess } from "@/components/access-control"

function MyComponent() {
  const { hasAccess, loading } = useFeatureAccess("Custom Integrations")
  
  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      {hasAccess ? (
        <CustomIntegrationsComponent />
      ) : (
        <UpgradePrompt />
      )}
    </div>
  )
}
```

## Troubleshooting

### Common Issues

1. **Webhook events not received**
   - Check webhook endpoint URL
   - Verify webhook secret
   - Check webhook event selection

2. **Checkout session fails**
   - Verify price IDs are correct
   - Check Stripe API keys
   - Ensure user is authenticated

3. **Access control not working**
   - Verify subscription data is fetched
   - Check feature names match exactly
   - Ensure user has active subscription

### Logs

Check the following for debugging:
- Browser console for client-side errors
- Server logs for API errors
- Stripe Dashboard → Events for webhook delivery

## Security Notes

- Always verify webhook signatures
- Never expose secret keys in client-side code
- Use HTTPS in production
- Validate user permissions on server-side
- Keep Stripe libraries updated

## Support

For issues related to:
- Stripe integration: Check Stripe documentation
- Clerk authentication: Check Clerk documentation
- Next.js: Check Next.js documentation
