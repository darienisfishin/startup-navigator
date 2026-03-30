import Stripe from "stripe";

// TODO: Set STRIPE_SECRET_KEY in your environment variables
// Get it from https://dashboard.stripe.com/apikeys

// Use a placeholder during build; the real key must be set at runtime
const stripeSecretKey =
  process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder_set_STRIPE_SECRET_KEY";

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2026-03-25.dahlia",
  typescript: true,
});
