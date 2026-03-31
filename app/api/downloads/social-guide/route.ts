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
    const industry = report.intake.industry;
    const businessType = `${report.intake.productOrService === "both" ? "Product & Service" : report.intake.productOrService} — ${report.profile.customerType}`;

    const ninetyDayPlan = report.ninetyDayPlan;

    // Build week 1 social tasks from 90-day plan
    const weekOneTasks = (ninetyDayPlan?.weekOne || []).slice(0, 4);
    const monthOneTasks = (ninetyDayPlan?.monthOne || []).slice(0, 4);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${businessName} — First Month Social Media Guide</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; color: #1e293b; background: #fff; }

    /* Cover page */
    .cover {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%);
      color: white;
      text-align: center;
      padding: 60px 40px;
      page-break-after: always;
    }
    .cover-logo { font-size: 14px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; opacity: 0.8; margin-bottom: 60px; }
    .cover-badge { display: inline-block; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); border-radius: 50px; padding: 6px 20px; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 30px; }
    .cover h1 { font-size: 42px; font-weight: 700; line-height: 1.2; margin-bottom: 16px; font-family: Georgia, serif; }
    .cover p { font-size: 18px; opacity: 0.85; margin-bottom: 8px; }
    .cover-sub { font-size: 14px; opacity: 0.7; margin-top: 8px; }
    .cover-meta { margin-top: 60px; font-size: 13px; opacity: 0.7; line-height: 2; }

    /* Content */
    .page { padding: 60px 70px; max-width: 800px; margin: 0 auto; }

    .section { margin-bottom: 50px; }
    .section-header {
      display: flex; align-items: center; gap: 12px;
      margin-bottom: 20px; padding-bottom: 12px;
    }
    .section-icon {
      width: 44px; height: 44px;
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      font-size: 22px; flex-shrink: 0;
    }
    .fb-icon { background: #1877f2; }
    .ig-icon { background: linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); }
    .section-title { font-size: 24px; font-weight: 700; color: #1e293b; font-family: Georgia, serif; }
    .section-underline { height: 3px; border-radius: 2px; margin-bottom: 20px; }
    .fb-underline { background: linear-gradient(to right, #1877f2, #4facfe); }
    .ig-underline { background: linear-gradient(to right, #f09433, #e6683c, #dc2743, #cc2366); }
    .cal-underline { background: linear-gradient(to right, #10b981, #6366f1); }

    /* Platform grid */
    .platform-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
    .platform-card { padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0; }
    .platform-card h4 { font-size: 13px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
    .platform-card ul { list-style: none; }
    .platform-card li { font-size: 13px; color: #334155; padding: 5px 0; border-bottom: 1px solid #f1f5f9; display: flex; align-items: flex-start; gap: 8px; line-height: 1.5; }
    .platform-card li:last-child { border-bottom: none; }
    .bullet { color: #6366f1; font-weight: 700; flex-shrink: 0; }

    /* Strategy boxes */
    .strategy-box { padding: 16px 20px; border-radius: 12px; margin-bottom: 16px; border-left: 4px solid; }
    .fb-box { background: #eff6ff; border-color: #1877f2; }
    .ig-box { background: #fdf4ff; border-color: #c084fc; }
    .strategy-box h4 { font-size: 13px; font-weight: 700; margin-bottom: 8px; }
    .fb-box h4 { color: #1d4ed8; }
    .ig-box h4 { color: #7e22ce; }
    .strategy-box p { font-size: 13px; color: #475569; line-height: 1.6; }

    /* Calendar */
    .calendar-week { margin-bottom: 30px; }
    .week-header { background: linear-gradient(135deg, #6366f1, #818cf8); color: white; padding: 10px 16px; border-radius: 10px 10px 0 0; font-weight: 700; font-size: 14px; }
    .day-row { display: flex; border: 1px solid #e2e8f0; border-top: none; }
    .day-row:last-child { border-radius: 0 0 10px 10px; overflow: hidden; }
    .day-label { width: 90px; flex-shrink: 0; padding: 12px; background: #f8fafc; border-right: 1px solid #e2e8f0; font-size: 12px; font-weight: 700; color: #475569; display: flex; align-items: center; justify-content: center; text-align: center; }
    .day-content { flex: 1; padding: 12px; font-size: 12px; color: #334155; line-height: 1.5; }
    .post-tag { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 700; margin-right: 6px; margin-bottom: 4px; }
    .fb-tag { background: #dbeafe; color: #1d4ed8; }
    .ig-tag { background: #fae8ff; color: #7e22ce; }
    .rest-tag { background: #f1f5f9; color: #64748b; }

    /* Hashtag section */
    .hashtag-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
    .hashtag { padding: 6px 14px; background: #fae8ff; color: #7e22ce; border-radius: 50px; font-size: 12px; font-weight: 600; border: 1px solid #e9d5ff; }

    /* Tips box */
    .tip-box { background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 16px 20px; margin-top: 16px; }
    .tip-box h4 { font-size: 13px; font-weight: 700; color: #92400e; margin-bottom: 8px; }
    .tip-box ul { list-style: none; }
    .tip-box li { font-size: 13px; color: #78350f; padding: 4px 0; display: flex; align-items: flex-start; gap: 8px; line-height: 1.5; }

    /* Footer */
    .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8; }

    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .cover { page-break-after: always; }
      .section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>

<!-- Cover -->
<div class="cover">
  <div class="cover-logo">✈ LaunchPilot</div>
  <div class="cover-badge">First Month Social Media Guide</div>
  <h1>${businessName}</h1>
  <p>${industry}</p>
  <div class="cover-sub">${businessType}</div>
  <div class="cover-meta">Generated by LaunchPilot AI &nbsp;·&nbsp; Your personal social strategy starts here</div>
</div>

<!-- Content -->
<div class="page">

  <!-- Facebook Strategy -->
  <div class="section">
    <div class="section-header">
      <div class="section-icon fb-icon">f</div>
      <div class="section-title">Facebook Strategy</div>
    </div>
    <div class="section-underline fb-underline"></div>

    <div class="strategy-box fb-box">
      <h4>🎯 Your Facebook Goal (Month 1)</h4>
      <p>Build brand awareness in your local community. Focus on reaching people in ${report.intake.city} who fit your target customer profile: <strong>${report.profile.customerType}</strong>. Aim for 50–100 page followers in your first 30 days.</p>
    </div>

    <div class="platform-grid">
      <div class="platform-card">
        <h4>📋 Page Setup Checklist</h4>
        <ul>
          <li><span class="bullet">☐</span> Create a Facebook Business Page (not a personal profile)</li>
          <li><span class="bullet">☐</span> Upload your logo as the profile photo</li>
          <li><span class="bullet">☐</span> Create a branded cover photo (use Canva)</li>
          <li><span class="bullet">☐</span> Fill in all business info (hours, location, website)</li>
          <li><span class="bullet">☐</span> Add a call-to-action button (Book Now, Contact, etc.)</li>
          <li><span class="bullet">☐</span> Connect your Instagram account</li>
          <li><span class="bullet">☐</span> Invite all contacts to like your page</li>
        </ul>
      </div>
      <div class="platform-card">
        <h4>📅 Posting Schedule</h4>
        <ul>
          <li><span class="bullet">📌</span> <strong>Monday:</strong> Business tip or insight</li>
          <li><span class="bullet">📌</span> <strong>Wednesday:</strong> Behind-the-scenes content</li>
          <li><span class="bullet">📌</span> <strong>Friday:</strong> Product/service showcase or story</li>
          <li><span class="bullet">💡</span> Best times: 9am–11am or 7pm–9pm</li>
          <li><span class="bullet">💡</span> Always respond to comments within 24 hrs</li>
          <li><span class="bullet">💡</span> Use Facebook Stories 3–5x per week</li>
        </ul>
      </div>
    </div>

    <div class="platform-card" style="grid-column: span 2; margin-bottom: 16px;">
      <h4>💡 Content Ideas for ${industry}</h4>
      <ul>
        <li><span class="bullet">→</span> "Why I started this business" — your founder story</li>
        <li><span class="bullet">→</span> Customer testimonials (ask your first 3 customers to share feedback)</li>
        <li><span class="bullet">→</span> Behind-the-scenes: how your product/service is made or delivered</li>
        <li><span class="bullet">→</span> Educational posts: tips related to your industry</li>
        <li><span class="bullet">→</span> Local community content: shout out ${report.intake.city} events or businesses</li>
        <li><span class="bullet">→</span> Before &amp; after: show the transformation your business creates</li>
      </ul>
    </div>
  </div>

  <!-- Instagram Strategy -->
  <div class="section">
    <div class="section-header">
      <div class="section-icon ig-icon">📷</div>
      <div class="section-title">Instagram Strategy</div>
    </div>
    <div class="section-underline ig-underline"></div>

    <div class="strategy-box ig-box">
      <h4>🎯 Your Instagram Goal (Month 1)</h4>
      <p>Build a visual brand identity and attract your ideal customers. For <strong>${industry}</strong>, Instagram is powerful for showcasing your work and building a loyal following. Post consistently and use Reels to maximize organic reach.</p>
    </div>

    <div class="platform-grid">
      <div class="platform-card">
        <h4>📋 Profile Setup Checklist</h4>
        <ul>
          <li><span class="bullet">☐</span> Switch to a Business or Creator account</li>
          <li><span class="bullet">☐</span> Write a clear bio with what you do + location</li>
          <li><span class="bullet">☐</span> Add your website link in bio</li>
          <li><span class="bullet">☐</span> Create 3–5 Story Highlight covers</li>
          <li><span class="bullet">☐</span> Post 9 grid photos before launching (so profile looks full)</li>
          <li><span class="bullet">☐</span> Follow 50–100 local accounts in your area</li>
        </ul>
      </div>
      <div class="platform-card">
        <h4>📅 Posting Schedule</h4>
        <ul>
          <li><span class="bullet">📌</span> <strong>Feed posts:</strong> 3x per week minimum</li>
          <li><span class="bullet">📌</span> <strong>Stories:</strong> Daily (5–10 frames)</li>
          <li><span class="bullet">📌</span> <strong>Reels:</strong> 1–2x per week for reach</li>
          <li><span class="bullet">💡</span> Best times: Tue–Fri, 11am–2pm or 7–9pm</li>
          <li><span class="bullet">💡</span> Use 5–10 hashtags per post</li>
          <li><span class="bullet">💡</span> Engage with 10 accounts per day</li>
        </ul>
      </div>
    </div>

    <div class="platform-card" style="margin-bottom: 16px;">
      <h4>📌 Content Pillars for ${industry}</h4>
      <ul>
        <li><span class="bullet">1.</span> <strong>Education</strong> — Tips, how-tos, and industry knowledge (30% of posts)</li>
        <li><span class="bullet">2.</span> <strong>Showcase</strong> — Your work, products, before/afters (30% of posts)</li>
        <li><span class="bullet">3.</span> <strong>Behind the Scenes</strong> — Process, workspace, day in the life (20% of posts)</li>
        <li><span class="bullet">4.</span> <strong>Community</strong> — Local features, customer spotlights, testimonials (20% of posts)</li>
      </ul>
    </div>

    <div>
      <h4 style="font-size: 13px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Hashtag Strategy</h4>
      <p style="font-size: 12px; color: #64748b; margin-bottom: 10px;">Use a mix of broad, niche, and local hashtags. Create your branded hashtag and use it on every post.</p>
      <div class="hashtag-grid">
        <span class="hashtag">#${businessName.replace(/\s+/g, "").toLowerCase()}</span>
        <span class="hashtag">#${report.intake.city.replace(/\s+/g, "").toLowerCase()}business</span>
        <span class="hashtag">#${report.intake.state.replace(/\s+/g, "").toLowerCase()}smallbusiness</span>
        <span class="hashtag">#shoplocal${report.intake.city.replace(/\s+/g, "").toLowerCase()}</span>
        <span class="hashtag">#smallbusinessowner</span>
        <span class="hashtag">#entrepreneurlife</span>
        <span class="hashtag">#startuplife</span>
        <span class="hashtag">#womenowned</span>
        <span class="hashtag">#supportsmallbusiness</span>
        <span class="hashtag">#newbusiness</span>
      </div>
    </div>
  </div>

  <!-- Week-by-Week Calendar -->
  <div class="section">
    <div class="section-header">
      <div class="section-icon" style="background: linear-gradient(135deg, #10b981, #6366f1);">📅</div>
      <div class="section-title">Month 1 Posting Calendar</div>
    </div>
    <div class="section-underline cal-underline"></div>

    <!-- Week 1 -->
    <div class="calendar-week">
      <div class="week-header">Week 1 — Foundation &amp; Launch</div>
      <div class="day-row"><div class="day-label">Monday</div><div class="day-content"><span class="post-tag fb-tag">FB</span><span class="post-tag ig-tag">IG</span> <strong>"Meet the Founder"</strong> post — your Day 1 story. Why you started ${businessName}. Include a photo of yourself.</div></div>
      <div class="day-row"><div class="day-label">Tuesday</div><div class="day-content"><span class="post-tag ig-tag">IG</span> Behind-the-scenes Reel or Story — show your workspace, tools, or process.</div></div>
      <div class="day-row"><div class="day-label">Wednesday</div><div class="day-content"><span class="post-tag fb-tag">FB</span><span class="post-tag ig-tag">IG</span> <strong>Showcase post</strong> — feature your product/service with a clear photo and description.</div></div>
      <div class="day-row"><div class="day-label">Thursday</div><div class="day-content"><span class="post-tag ig-tag">IG Story</span> Poll or Q&amp;A — ask followers a question about your industry or their needs.</div></div>
      <div class="day-row"><div class="day-label">Friday</div><div class="day-content"><span class="post-tag fb-tag">FB</span><span class="post-tag ig-tag">IG</span> <strong>Educational post</strong> — share 3 tips related to ${industry} that your customers would find valuable.</div></div>
      <div class="day-row"><div class="day-label">Weekend</div><div class="day-content"><span class="post-tag ig-tag">IG Story</span> Casual content — a personal moment, progress update, or motivational quote. Keep it real.</div></div>
      ${weekOneTasks.map((task) => `<div class="day-row"><div class="day-label" style="font-size:10px;color:#6366f1;">From your plan</div><div class="day-content" style="color:#4f46e5;">☐ ${task}</div></div>`).join("")}
    </div>

    <!-- Week 2 -->
    <div class="calendar-week">
      <div class="week-header">Week 2 — Engagement &amp; Growth</div>
      <div class="day-row"><div class="day-label">Monday</div><div class="day-content"><span class="post-tag fb-tag">FB</span><span class="post-tag ig-tag">IG</span> <strong>Problem/Solution post</strong> — describe a problem your customers face and how you solve it.</div></div>
      <div class="day-row"><div class="day-label">Wednesday</div><div class="day-content"><span class="post-tag ig-tag">IG Reel</span> Short video showing your process or a quick tip for your audience.</div></div>
      <div class="day-row"><div class="day-label">Friday</div><div class="day-content"><span class="post-tag fb-tag">FB</span><span class="post-tag ig-tag">IG</span> <strong>Community post</strong> — shout out a local ${report.intake.city} business or community event.</div></div>
      <div class="day-row"><div class="day-label">Daily</div><div class="day-content">Respond to every comment and DM. Follow 10 new local accounts each day. Like and comment on posts from potential customers.</div></div>
    </div>

    <!-- Week 3 -->
    <div class="calendar-week">
      <div class="week-header">Week 3 — Social Proof</div>
      <div class="day-row"><div class="day-label">Monday</div><div class="day-content"><span class="post-tag fb-tag">FB</span><span class="post-tag ig-tag">IG</span> Ask your first customer or early supporter for a testimonial. Share it as a quote graphic.</div></div>
      <div class="day-row"><div class="day-label">Wednesday</div><div class="day-content"><span class="post-tag ig-tag">IG</span> <strong>FAQ post</strong> — answer the 3 most common questions about your business in a carousel.</div></div>
      <div class="day-row"><div class="day-label">Friday</div><div class="day-content"><span class="post-tag fb-tag">FB</span><span class="post-tag ig-tag">IG</span> <strong>Progress update</strong> — share what you've accomplished in your first 3 weeks. Celebrate milestones.</div></div>
      ${monthOneTasks.map((task) => `<div class="day-row"><div class="day-label" style="font-size:10px;color:#6366f1;">From your plan</div><div class="day-content" style="color:#4f46e5;">☐ ${task}</div></div>`).join("")}
    </div>

    <!-- Week 4 -->
    <div class="calendar-week">
      <div class="week-header">Week 4 — Convert &amp; Plan Month 2</div>
      <div class="day-row"><div class="day-label">Monday</div><div class="day-content"><span class="post-tag fb-tag">FB</span><span class="post-tag ig-tag">IG</span> <strong>Offer post</strong> — introduce a launch special, discount, or incentive for first-time customers.</div></div>
      <div class="day-row"><div class="day-label">Wednesday</div><div class="day-content"><span class="post-tag ig-tag">IG Reel</span> Your most relatable content yet — a "day in the life" or honest behind-the-scenes of building your business.</div></div>
      <div class="day-row"><div class="day-label">Friday</div><div class="day-content"><span class="post-tag fb-tag">FB</span><span class="post-tag ig-tag">IG</span> <strong>Month 1 recap</strong> — what you built, what you learned, what's coming next. Build anticipation for Month 2.</div></div>
      <div class="day-row"><div class="day-label">End of Month</div><div class="day-content">Review your analytics: which posts got the most engagement? Double down on what worked. Plan Month 2 content.</div></div>
    </div>
  </div>

  <div class="tip-box">
    <h4>⭐ Pro Tips for Month 1 Success</h4>
    <ul>
      <li><span class="bullet">→</span> Post your "Day 1" story first — people love following founders from the beginning</li>
      <li><span class="bullet">→</span> Respond to EVERY comment and DM in your first 90 days, no exceptions</li>
      <li><span class="bullet">→</span> Consistency beats quality early on — a regular posting schedule outperforms sporadic "perfect" posts</li>
      <li><span class="bullet">→</span> Use your branded hashtag on every single post to build recognition</li>
      <li><span class="bullet">→</span> Create a Canva account and save brand colors/fonts for quick, consistent graphics</li>
      <li><span class="bullet">→</span> Cross-post Facebook content to Instagram (and vice versa) using Meta Business Suite — it's free</li>
    </ul>
  </div>

  <div class="footer">
    Generated by LaunchPilot · launch-pilot.com · AI-generated planning tool — not a substitute for professional marketing advice.
  </div>
</div>

</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="${businessName.replace(/[^a-z0-9]/gi, "_")}_Social_Media_Guide.html"`,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("[downloads/social-guide] error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
