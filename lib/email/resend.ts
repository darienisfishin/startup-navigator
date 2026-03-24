import { Resend } from "resend";
import { createElement } from "react";
import { ReportEmail } from "./report-email";
import { WelcomeEmail } from "./welcome-email";
import type { StartupReport } from "@/lib/types";

// Lazy initialization to avoid build-time errors when RESEND_API_KEY is unset
function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY environment variable is not set");
  return new Resend(key);
}

const FROM = process.env.EMAIL_FROM ?? "LaunchPilot <reports@launch-pilot.com>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://launch-pilot.com";

export interface SendReportEmailOptions {
  to: string;
  report: StartupReport;
}

export async function sendReportEmail({ to, report }: SendReportEmailOptions) {
  const reportUrl = `${APP_URL}/report/${report.id}`;
  const businessName = report.intake.businessName || `${report.intake.userName}'s Plan`;

  const resend = getResend();
  const { data, error } = await resend.emails.send({
    from: FROM,
    to,
    subject: `Your LaunchPilot report: ${businessName} (${report.viability.overallScore}/100)`,
    react: createElement(ReportEmail, { report, reportUrl }),
  });

  if (error) {
    throw new Error(`Failed to send report email: ${error.message}`);
  }

  return data;
}

export interface SendWelcomeEmailOptions {
  to: string;
  userName?: string;
}

export async function sendWelcomeEmail({ to, userName }: SendWelcomeEmailOptions) {
  const startUrl = `${APP_URL}/start`;

  const resend = getResend();
  const { data, error } = await resend.emails.send({
    from: FROM,
    to,
    subject: "Welcome to LaunchPilot — your startup navigator is ready",
    react: createElement(WelcomeEmail, { userName, startUrl }),
  });

  if (error) {
    throw new Error(`Failed to send welcome email: ${error.message}`);
  }

  return data;
}
