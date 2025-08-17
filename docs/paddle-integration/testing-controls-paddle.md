I've created all the necessary components for testing Paddle integration while preserving the existing Paystack functionality. Here's what I've done:

1. Updated config/ai.ts with new payment configuration:
typescript
2. Created new test controls for Paddle integration:
•  subscription-test-controls-paddle.tsx: New component for testing Paddle subscriptions
•  Includes all Paddle-specific states (trial, active, canceling, canceled)
•  Uses new fields like paddle_subscription_id, plan_type, etc.
3. Preserved Paystack integration:
•  Renamed existing test controls to subscription-test-controls.paystack.disabled.tsx
•  Keeps all Paystack functionality intact
4. Created a dynamic switcher component:
•  subscription-test-controls.tsx: Dynamically loads either Paddle or Paystack controls
•  Uses configuration to determine which provider to use
•  Handles disabled states appropriately

To use this in your environment, add these variables to your .env.local:
bash
The test controls now support:
•  Switching between Paddle and Paystack
•  All subscription states for both providers
•  Clear visual indication of current state
•  Additional Paddle-specific states (canceling at period end)
•  Feature flags for enabling/disabling providers

Would you like me to explain any part of the implementation in more detail or help you test the integration?