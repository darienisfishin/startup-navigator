import { NextRequest, NextResponse } from "next/server";
import type { StartupReport } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const report = body.reportData as StartupReport;

    if (!report) {
      return NextResponse.json({ error: "reportData is required" }, { status: 400 });
    }

    const businessName = report.intake.businessName || `${report.intake.userName}'s Business`;
    const location = `${report.intake.city}, ${report.intake.state}`;
    const startupCost = report.profile.startupCostEstimate || "Varies";
    const entity = report.profile.likelyBusinessType || "LLC";

    const roadmapItems = (report.roadmap || [])
      .map(
        (step) => `
        <div class="check-item">
          <div class="checkbox"></div>
          <div class="check-content">
            <span class="check-title">${step.title}</span>
            <span class="check-desc">${step.description}</span>
            <span class="check-meta">${step.timeframe} · ${step.category} · ${step.priority}</span>
          </div>
        </div>`
      )
      .join("");

    const requirementsItems = (report.localRequirements || [])
      .map(
        (req) => `
        <div class="check-item">
          <div class="checkbox"></div>
          <div class="check-content">
            <span class="check-title">${req.task}</span>
            <span class="check-desc">${req.description}</span>
            <span class="check-meta confidence-${req.confidence}">${
              req.confidence === "verified"
                ? "✓ Verified"
                : req.confidence === "likely"
                ? "⚠ Likely Required"
                : "⚠ Verify with Office"
            }</span>
          </div>
        </div>`
      )
      .join("");

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${businessName} — Startup Checklist</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Georgia, serif; color: #1e293b; background: #fff; }

    /* Cover page */
    .cover {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%);
      color: white;
      text-align: center;
      padding: 60px 40px;
      page-break-after: always;
    }
    .cover-logo { font-size: 14px; font-family: Arial, sans-serif; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; opacity: 0.8; margin-bottom: 60px; }
    .cover-badge { display: inline-block; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); border-radius: 50px; padding: 6px 20px; font-size: 12px; font-family: Arial, sans-serif; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 30px; }
    .cover h1 { font-size: 42px; font-weight: 700; line-height: 1.2; margin-bottom: 16px; }
    .cover p { font-size: 18px; opacity: 0.85; font-family: Arial, sans-serif; margin-bottom: 8px; }
    .cover-meta { margin-top: 60px; font-size: 13px; font-family: Arial, sans-serif; opacity: 0.7; line-height: 2; }

    /* Content pages */
    .page { padding: 60px 70px; max-width: 800px; margin: 0 auto; }
    .section { margin-bottom: 50px; page-break-inside: avoid; }
    .section-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 3px solid #6366f1;
    }
    .section-icon {
      width: 40px; height: 40px;
      background: linear-gradient(135deg, #6366f1, #818cf8);
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      color: white; font-size: 18px; flex-shrink: 0;
    }
    .section-title { font-size: 22px; font-weight: 700; color: #1e293b; }

    /* Check items */
    .check-item {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 14px 0;
      border-bottom: 1px solid #f1f5f9;
    }
    .check-item:last-child { border-bottom: none; }
    .checkbox {
      width: 20px; height: 20px;
      border: 2px solid #cbd5e1;
      border-radius: 4px;
      flex-shrink: 0;
      margin-top: 2px;
    }
    .check-content { display: flex; flex-direction: column; gap: 3px; }
    .check-title { font-size: 14px; font-weight: 600; color: #1e293b; font-family: Arial, sans-serif; }
    .check-desc { font-size: 12px; color: #64748b; font-family: Arial, sans-serif; line-height: 1.5; }
    .check-meta { font-size: 11px; font-family: Arial, sans-serif; font-weight: 600; color: #6366f1; }
    .confidence-verified { color: #059669; }
    .confidence-likely { color: #d97706; }
    .confidence-verify { color: #dc2626; }

    /* Budget table */
    .budget-table { width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 13px; }
    .budget-table th { background: #6366f1; color: white; padding: 10px 14px; text-align: left; }
    .budget-table td { padding: 10px 14px; border-bottom: 1px solid #f1f5f9; }
    .budget-table tr:nth-child(even) td { background: #f8fafc; }
    .budget-highlight { font-weight: 700; color: #4f46e5; }

    /* Info box */
    .info-box { background: #eef2ff; border-left: 4px solid #6366f1; padding: 14px 18px; border-radius: 4px; margin-bottom: 20px; font-family: Arial, sans-serif; font-size: 13px; color: #4338ca; line-height: 1.6; }

    /* Footer */
    .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; font-family: Arial, sans-serif; font-size: 11px; color: #94a3b8; }

    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .cover { page-break-after: always; }
      .section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>

<!-- Cover page -->
<div class="cover">
  <div class="cover-logo">✈ LaunchPilot</div>
  <div class="cover-badge">Pro Startup Checklist</div>
  <h1>${businessName}</h1>
  <p>${location}</p>
  <p>${report.intake.industry}</p>
  <div class="cover-meta">
    Generated by LaunchPilot AI &nbsp;·&nbsp; Estimated Startup Cost: ${startupCost}<br>
    Recommended Entity: ${entity}
  </div>
</div>

<!-- Content -->
<div class="page">

  <div class="info-box">
    ℹ️ This checklist is generated from your personalized AI report. Check off each item as you complete it. Items under "Local Requirements" should be verified with the relevant government office.
  </div>

  <!-- Legal Setup -->
  <div class="section">
    <div class="section-header">
      <div class="section-icon">⚖️</div>
      <div class="section-title">Legal Setup</div>
    </div>
    <div class="check-item"><div class="checkbox"></div><div class="check-content"><span class="check-title">Choose your business entity type</span><span class="check-desc">Recommended: ${entity} — consult a business attorney to confirm.</span></div></div>
    <div class="check-item"><div class="checkbox"></div><div class="check-content"><span class="check-title">Register your business name (DBA)</span><span class="check-desc">File a "Doing Business As" with your county or state if operating under a trade name.</span></div></div>
    <div class="check-item"><div class="checkbox"></div><div class="check-content"><span class="check-title">Obtain an EIN from the IRS</span><span class="check-desc">Free at IRS.gov. Required for bank accounts, hiring, and tax filing.</span></div></div>
    <div class="check-item"><div class="checkbox"></div><div class="check-content"><span class="check-title">Open a dedicated business bank account</span><span class="check-desc">Keep business and personal finances separate from day one.</span></div></div>
    <div class="check-item"><div class="checkbox"></div><div class="check-content"><span class="check-title">Get a general liability insurance policy</span><span class="check-desc">Protects your business from lawsuits and accidents.</span></div></div>
  </div>

  <!-- Local Requirements -->
  <div class="section">
    <div class="section-header">
      <div class="section-icon">📍</div>
      <div class="section-title">Local Requirements — ${location}</div>
    </div>
    ${requirementsItems || '<div class="check-item"><div class="checkbox"></div><div class="check-content"><span class="check-title">Contact your local city/county clerk</span><span class="check-desc">Ask about business license, zoning, and permit requirements for your business type.</span></div></div>'}
  </div>

  <!-- Branding & Marketing -->
  <div class="section">
    <div class="section-header">
      <div class="section-icon">🎨</div>
      <div class="section-title">Branding &amp; Marketing</div>
    </div>
    <div class="check-item"><div class="checkbox"></div><div class="check-content"><span class="check-title">Finalize your business name</span><span class="check-desc">Check trademark availability at USPTO.gov. Confirm the domain is available.</span></div></div>
    <div class="check-item"><div class="checkbox"></div><div class="check-content"><span class="check-title">Register your domain name</span><span class="check-desc">Use Namecheap, GoDaddy, or Google Domains. Aim for a .com if possible.</span></div></div>
    <div class="check-item"><div class="checkbox"></div><div class="check-content"><span class="check-title">Create or finalize your logo</span><span class="check-desc">Use Canva, hire a designer on Fiverr, or use your existing logo.</span></div></div>
    <div class="check-item"><div class="checkbox"></div><div class="check-content"><span class="check-title">Claim your social media handles</span><span class="check-desc">Secure @yourbusinessname on Instagram, Facebook, TikTok, LinkedIn.</span></div></div>
    <div class="check-item"><div class="checkbox"></div><div class="check-content"><span class="check-title">Set up your Google Business Profile</span><span class="check-desc">Free at business.google.com. Critical for local search visibility.</span></div></div>
    <div class="check-item"><div class="checkbox"></div><div class="check-content"><span class="check-title">Launch a basic website</span><span class="check-desc">Even a single landing page with your services and contact info is enough to start.</span></div></div>
  </div>

  <!-- Operations -->
  <div class="section">
    <div class="section-header">
      <div class="section-icon">⚙️</div>
      <div class="section-title">Operations</div>
    </div>
    <div class="check-item"><div class="checkbox"></div><div class="check-content"><span class="check-title">Set up a business email address</span><span class="check-desc">Use your domain (you@yourbusiness.com). Google Workspace starts at $6/month.</span></div></div>
    <div class="check-item"><div class="checkbox"></div><div class="check-content"><span class="check-title">Set up a payment processing system</span><span class="check-desc">Square or Stripe work great for most small businesses. Zero monthly fee to start.</span></div></div>
    <div class="check-item"><div class="checkbox"></div><div class="check-content"><span class="check-title">Create a simple pricing sheet</span><span class="check-desc">Define your products/services and prices before your first customer asks.</span></div></div>
    <div class="check-item"><div class="checkbox"></div><div class="check-content"><span class="check-title">Draft standard contracts or quotes</span><span class="check-desc">Use a template from LegalZoom or a local attorney to protect your work.</span></div></div>
  </div>

  <!-- Your Roadmap -->
  <div class="section">
    <div class="section-header">
      <div class="section-icon">🗺️</div>
      <div class="section-title">Your Personalized Action Plan</div>
    </div>
    ${roadmapItems}
  </div>

  <!-- Budget -->
  <div class="section">
    <div class="section-header">
      <div class="section-icon">💰</div>
      <div class="section-title">Budget Overview</div>
    </div>
    <table class="budget-table">
      <thead>
        <tr>
          <th>Category</th>
          <th>Estimated Cost</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Business Registration &amp; Legal</td><td>$50 – $500</td><td>LLC filing fees, registered agent</td></tr>
        <tr><td>Business Licenses &amp; Permits</td><td>$50 – $400</td><td>Varies by city/state/industry</td></tr>
        <tr><td>Branding &amp; Logo</td><td>$0 – $500</td><td>DIY with Canva or hire a designer</td></tr>
        <tr><td>Website &amp; Domain</td><td>$100 – $500/yr</td><td>Domain + hosting + builder</td></tr>
        <tr><td>Equipment &amp; Supplies</td><td>Varies</td><td>Industry-specific</td></tr>
        <tr><td>Marketing (first 90 days)</td><td>$200 – $1,000</td><td>Ads, materials, signage</td></tr>
        <tr><td>Insurance</td><td>$400 – $1,500/yr</td><td>General liability minimum</td></tr>
        <tr><td><strong>AI-Estimated Total</strong></td><td class="budget-highlight">${startupCost}</td><td>From your LaunchPilot report</td></tr>
      </tbody>
    </table>
  </div>

  <div class="footer">
    Generated by LaunchPilot · launch-pilot.com · AI-generated planning tool — not a substitute for legal, tax, or professional advice.
  </div>
</div>

</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="${businessName.replace(/[^a-z0-9]/gi, "_")}_Startup_Checklist.html"`,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("[downloads/checklist] error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
