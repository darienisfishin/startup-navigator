import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";

// TODO: Set STRIPE_WEBHOOK_SECRET in your environment variables
// Get it from https://dashboard.stripe.com/webhooks after creating a webhook endpoint
// pointing to: https://your-domain.com/api/webhooks/stripe

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[stripe-webhook] STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook verification failed";
    console.error("[stripe-webhook] signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { reportId, userId } = session.metadata ?? {};

    if (reportId && userId) {
      try {
        const supabase = await createClient();
        const { error } = await supabase
          .from("reports")
          .update({
            paid: true,
            stripe_session_id: session.id,
          })
          .eq("id", reportId)
          .eq("user_id", userId);

        if (error) {
          console.error("[stripe-webhook] failed to update report:", error.message);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("[stripe-webhook] supabase error:", message);
      }
    }
  }

  return NextResponse.json({ received: true });
}
