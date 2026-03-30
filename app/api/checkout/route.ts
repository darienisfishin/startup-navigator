import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { priceId, reportId } = body as {
      priceId: string;
      reportId?: string;
    };

    if (!priceId || typeof priceId !== "string") {
      return NextResponse.json({ error: "priceId is required" }, { status: 400 });
    }

    // Get the logged-in user if available (optional)
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://www.launch-pilot.com");

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        priceId,
        reportId: reportId ?? "",
        userId: user?.id ?? "",
      },
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing`,
      // Pre-fill email if user is logged in
      ...(user?.email ? { customer_email: user.email } : {}),
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("[checkout] error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
