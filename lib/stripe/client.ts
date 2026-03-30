import { loadStripe } from "@stripe/stripe-js";

// TODO: Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your environment variables
// Get it from https://dashboard.stripe.com/apikeys
const publishableKey =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ??
  "pk_test_TODO_replace_with_real_key";

// Singleton — reuse the same Stripe instance across renders
let stripePromise: ReturnType<typeof loadStripe> | null = null;

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
}
