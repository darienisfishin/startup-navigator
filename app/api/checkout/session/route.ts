import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";

/** GET /api/checkout/session?session_id=xxx
 *  Returns reportId from session metadata so the success page can link to the report.
 */
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "session_id is required" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const reportId = session.metadata?.reportId || null;
    const tierId = session.metadata?.tierId || null;
    return NextResponse.json({ reportId, paymentStatus: session.payment_status, tierId });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to retrieve session";
    console.error("[checkout/session] error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
