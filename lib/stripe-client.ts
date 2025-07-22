// Client-side utilities for Stripe integration
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

// Define subscription plans (client-side constants)
export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  FREE: {
    id: 'free',
    name: 'Free Plan',
    description: 'Perfect for getting started',
    price: 0,
    currency: 'usd',
    interval: 'month',
    stripePriceId: '',
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
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID || '',
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
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || '',
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
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID || '',
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

/**
 * Get all available subscription plans for client-side use
 */
export function getAvailablePlans(): SubscriptionPlan[] {
  return Object.values(SUBSCRIPTION_PLANS);
}

/**
 * Get plan by ID
 */
export function getPlanById(planId: string): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS[planId.toUpperCase()];
}
