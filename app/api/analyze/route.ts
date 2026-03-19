import { NextResponse } from "next/server";
import { generateMockReport } from "@/lib/ai/mock-responses";
import { runAIPipeline } from "@/lib/ai/pipeline";
import type { IntakeFormData } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as IntakeFormData;

    // Validate required fields
    if (!body.userName || !body.businessIdea || !body.state) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const useRealAI =
      process.env.USE_REAL_AI === "true" &&
      process.env.ANTHROPIC_API_KEY &&
      process.env.ANTHROPIC_API_KEY !== "your-anthropic-api-key-here";

    if (useRealAI) {
      // Real AI pipeline: 8 Claude calls (some parallelized)
      // Module 1: Intake Normalizer
      // Module 2-5: Business Analyst, Local Compliance, Competitor, Branding (parallel)
      // Module 6: Roadmap (depends on 2 & 3)
      // Module 7-8: Partners, Viability (parallel, depend on earlier modules)
      console.log("[API] Running REAL AI pipeline");
      const report = await runAIPipeline(body);
      return NextResponse.json(report);
    }

    // Mock mode: smart mock responses based on input quality
    console.log("[API] Running MOCK pipeline (set USE_REAL_AI=true to use Claude)");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const report = generateMockReport(body);
    return NextResponse.json(report);
  } catch (error) {
    console.error("[API] Analysis error:", error);
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
