import { NextRequest, NextResponse } from "next/server";
import { sendReportEmail } from "@/lib/email/resend";
import type { StartupReport } from "@/lib/types";

interface RequestBody {
  recipientEmail: string;
  reportData: StartupReport;
}

export async function POST(req: NextRequest) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 503 }
    );
  }

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { recipientEmail, reportData } = body;

  if (!recipientEmail || typeof recipientEmail !== "string") {
    return NextResponse.json({ error: "recipientEmail is required" }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(recipientEmail)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  if (!reportData || typeof reportData !== "object") {
    return NextResponse.json({ error: "reportData is required" }, { status: 400 });
  }

  if (!reportData.id || !reportData.intake || !reportData.viability) {
    return NextResponse.json({ error: "reportData is incomplete" }, { status: 400 });
  }

  try {
    await sendReportEmail({ to: recipientEmail, report: reportData });
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send email";
    console.error("[send-report]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
