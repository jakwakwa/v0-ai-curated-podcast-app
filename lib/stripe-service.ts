import Stripe from 'stripe';
import prisma from '@/lib/prisma';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  stripePriceId: string;
  features: string[];
}

// Define subscription plans based on Clerk's B2C SaaS model
export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  FREE: {
    id: 'free',
    name: 'Free Plan',
    description: 'Perfect for getting started',
    price: 0,
    currency: 'usd',
    interval: 'month',
    stripePriceId: '', // No Stripe price for free plan
    features: [
      '1 User Curation Profile',
      'Weekly Generation',
      'Basic Support',
      '7-day trial'
    ],
  },
  BASIC: {
    id: 'basic',
    name: 'Basic Plan',
    description: 'Essential features for individuals',
    price: 999, // $9.99 in cents
    currency: 'usd',
    interval: 'month',
    stripePriceId: process.env.STRIPE_BASIC_PRICE_ID || '',
    features: [
      'Up to 3 User Curation Profiles',
      'Weekly Generation',
      'Email Support',
      'Advanced Analytics',
    ],
  },
  PRO: {
    id: 'pro',
    name: 'Pro Plan',
    description: 'Advanced features for power users',
    price: 1999, // $19.99 in cents
    currency: 'usd',
    interval: 'month',
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID || '',
    features: [
      'Unlimited User Curation Profiles',
      'Daily Generation',
      'Priority Support',
      'Advanced Analytics',
      'Custom Integrations',
      'Team Collaboration',
    ],
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise Plan',
    description: 'Custom solutions for organizations',
    price: 4999, // $49.99 in cents
    currency: 'usd',
    interval: 'month',
    stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || '',
    features: [
      'Everything in Pro',
      'White-label Solution',
      'Dedicated Account Manager',
      'Custom Integrations',
      'SLA Guarantee',
      'On-premise Deployment',
    ],
  },
};

export class StripeService {
  /**
   * Create a Stripe checkout session for subscription
   */
  static async createCheckoutSession(
    userId: string,
    planId: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<string> {
    const plan = SUBSCRIPTION_PLANS[planId.toUpperCase()];
    
    if (!plan || plan.id === 'free') {
      throw new Error('Invalid subscription plan');
    }

    if (!plan.stripePriceId) {
      throw new Error(`Stripe price ID not configured for plan: ${plan.name}`);
    }

    try {
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: plan.stripePriceId,
            quantity: 1,
          },
        ],
        success_url: successUrl + '?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: cancelUrl,
        client_reference_id: userId,
        metadata: {
          userId,
          planId: plan.id,
        },
        subscription_data: {
          metadata: {
            userId,
            planId: plan.id,
          },
        },
        allow_promotion_codes: true,
        billing_address_collection: 'auto',
        customer_creation: 'always',
      });

      return session.url!;
    } catch (error) {
      console.error('Error creating Stripe checkout session:', error);
      throw new Error('Failed to create checkout session');
    }
  }

  /**
   * Create a Stripe billing portal session
   */
  static async createBillingPortalSession(
    customerId: string,
    returnUrl: string
  ): Promise<string> {
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });

      return session.url;
    } catch (error) {
      console.error('Error creating billing portal session:', error);
      throw new Error('Failed to create billing portal session');
    }
  }

  /**
   * Get or create Stripe customer
   */
  static async getOrCreateCustomer(userId: string, email: string): Promise<string> {
    // Check if user already has a subscription with customer ID
    const existingSubscription = await prisma.subscription.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (existingSubscription?.linkCustomerId) {
      return existingSubscription.linkCustomerId;
    }

    try {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email,
        metadata: {
          userId,
        },
      });

      return customer.id;
    } catch (error) {
      console.error('Error creating Stripe customer:', error);
      throw new Error('Failed to create customer');
    }
  }

  /**
   * Handle successful subscription from webhook
   */
  static async handleSubscriptionSuccess(
    stripeSubscription: Stripe.Subscription
  ): Promise<void> {
    const userId = stripeSubscription.metadata.userId;

    if (!userId) {
      throw new Error('User ID not found in subscription metadata');
    }

    try {
      // Update or create subscription in database
      await prisma.subscription.upsert({
        where: { userId },
        update: {
          status: stripeSubscription.status,
          linkCustomerId: stripeSubscription.customer as string,
          linkSubscriptionId: stripeSubscription.id,
          linkPriceId: stripeSubscription.items.data[0]?.price.id,
          currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
          currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
          canceledAt: stripeSubscription.canceled_at 
            ? new Date(stripeSubscription.canceled_at * 1000) 
            : null,
        },
        create: {
          userId,
          status: stripeSubscription.status,
          linkCustomerId: stripeSubscription.customer as string,
          linkSubscriptionId: stripeSubscription.id,
          linkPriceId: stripeSubscription.items.data[0]?.price.id,
          currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
          currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
          trialStart: stripeSubscription.trial_start 
            ? new Date(stripeSubscription.trial_start * 1000) 
            : null,
          trialEnd: stripeSubscription.trial_end 
            ? new Date(stripeSubscription.trial_end * 1000) 
            : null,
          canceledAt: stripeSubscription.canceled_at 
            ? new Date(stripeSubscription.canceled_at * 1000) 
            : null,
        },
      });
    } catch (error) {
      console.error('Error updating subscription in database:', error);
      throw error;
    }
  }

  /**
   * Handle subscription updates from webhook
   */
  static async handleSubscriptionUpdate(
    stripeSubscription: Stripe.Subscription
  ): Promise<void> {
    const userId = stripeSubscription.metadata.userId;

    if (!userId) {
      throw new Error('User ID not found in subscription metadata');
    }

    try {
      await prisma.subscription.updateMany({
        where: { 
          userId,
          linkSubscriptionId: stripeSubscription.id 
        },
        data: {
          status: stripeSubscription.status,
          currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
          currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
          canceledAt: stripeSubscription.canceled_at 
            ? new Date(stripeSubscription.canceled_at * 1000) 
            : null,
        },
      });
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }

  /**
   * Handle subscription deletion from webhook
   */
  static async handleSubscriptionDeletion(
    stripeSubscription: Stripe.Subscription
  ): Promise<void> {
    const userId = stripeSubscription.metadata.userId;

    if (!userId) {
      throw new Error('User ID not found in subscription metadata');
    }

    try {
      await prisma.subscription.updateMany({
        where: { 
          userId,
          linkSubscriptionId: stripeSubscription.id 
        },
        data: {
          status: 'canceled',
          canceledAt: new Date(),
        },
      });
    } catch (error) {
      console.error('Error marking subscription as deleted:', error);
      throw error;
    }
  }

  /**
   * Get user's current subscription status
   */
  static async getUserSubscription(userId: string) {
    return await prisma.subscription.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Check if user has active subscription
   */
  static async hasActiveSubscription(userId: string): Promise<boolean> {
    const subscription = await this.getUserSubscription(userId);

    if (!subscription) return false;

    const now = new Date();

    // Check if subscription is active and not expired
    if (
      ['active', 'trialing'].includes(subscription.status) &&
      subscription.currentPeriodEnd &&
      subscription.currentPeriodEnd > now
    ) {
      return true;
    }

    return false;
  }

  /**
   * Get user's subscription plan
   */
  static async getUserPlan(userId: string): Promise<SubscriptionPlan> {
    const subscription = await this.getUserSubscription(userId);
    
    if (!subscription || !await this.hasActiveSubscription(userId)) {
      return SUBSCRIPTION_PLANS.FREE;
    }

    // Find plan by price ID
    const plan = Object.values(SUBSCRIPTION_PLANS).find(
      p => p.stripePriceId === subscription.linkPriceId
    );

    return plan || SUBSCRIPTION_PLANS.FREE;
  }

  /**
   * Get all available subscription plans
   */
  static getAvailablePlans(): SubscriptionPlan[] {
    return Object.values(SUBSCRIPTION_PLANS);
  }

  /**
   * Get plan by ID
   */
  static getPlanById(planId: string): SubscriptionPlan | undefined {
    return SUBSCRIPTION_PLANS[planId.toUpperCase()];
  }

  /**
   * Verify webhook signature
   */
  static verifyWebhookSignature(
    payload: string,
    signature: string,
    secret: string
  ): Stripe.Event {
    return stripe.webhooks.constructEvent(payload, signature, secret);
  }
}
