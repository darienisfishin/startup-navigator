import type {
  StartupReport,
  IntakeFormData,
  BusinessProfile,
  IdeaAnalysis,
  LocalRequirement,
  CompetitiveLandscape,
  BrandingFeedback,
  RoadmapStep,
  NinetyDayPlan,
  PartnerRecommendation,
  ViabilityAssessment,
} from "@/lib/types";

// ============================================================
// INPUT QUALITY DETECTION
// ============================================================

interface InputQuality {
  overall: number; // 0-100
  nameScore: number;
  ideaScore: number;
  locationScore: number;
  differentiatorScore: number;
  completenessScore: number;
  issues: string[];
  warnings: string[];
}

function isGibberish(text: string): boolean {
  const cleaned = text.trim().toLowerCase();
  if (cleaned.length === 0) return true;
  if (cleaned.length < 3) return true;

  // Repeated character detection (e.g., "jjjjjj", "aaaa")
  const uniqueChars = new Set(cleaned.replace(/\s/g, "")).size;
  if (cleaned.length >= 4 && uniqueChars <= 2) return true;

  // No vowels at all (unlikely to be a real word)
  const vowels = cleaned.match(/[aeiou]/gi);
  if (cleaned.length > 3 && (!vowels || vowels.length < cleaned.length * 0.15)) return true;

  // All same character
  if (/^(.)\1+$/.test(cleaned.replace(/\s/g, ""))) return true;

  // Keyboard mashing patterns
  if (/^[asdfghjkl]+$/i.test(cleaned) || /^[qwerty]+$/i.test(cleaned) || /^[zxcvbnm]+$/i.test(cleaned)) {
    if (cleaned.length < 5) return true;
  }

  return false;
}

function isVagueIdea(text: string): boolean {
  const cleaned = text.trim().toLowerCase();
  if (cleaned.length < 20) return true;

  const vaguePatterns = [
    /^i want to (make|sell|do) (stuff|things|money)$/,
    /^(a business|business|make money|sell stuff)$/,
    /^(idk|i don'?t know|not sure|something)$/,
  ];
  return vaguePatterns.some((p) => p.test(cleaned));
}

function assessInputQuality(intake: IntakeFormData): InputQuality {
  const issues: string[] = [];
  const warnings: string[] = [];

  // --- Name quality ---
  let nameScore = 50; // baseline if no name provided
  const name = intake.businessName.trim();
  if (name.length > 0) {
    if (isGibberish(name)) {
      nameScore = 5;
      issues.push(`"${name}" does not appear to be a viable business name. It lacks meaning, pronunciation clarity, and memorability.`);
    } else if (name.length < 3) {
      nameScore = 15;
      issues.push("Business name is too short to be distinctive or searchable.");
    } else if (name.length > 50) {
      nameScore = 30;
      warnings.push("Business name is very long. Shorter names are easier to remember, type, and fit on signage.");
    } else {
      // Check for real word characteristics
      const hasVowels = /[aeiou]/i.test(name);
      const hasConsonants = /[bcdfghjklmnpqrstvwxyz]/i.test(name);
      const wordCount = name.split(/\s+/).length;

      if (!hasVowels || !hasConsonants) {
        nameScore = 20;
        issues.push("Business name doesn't appear to be pronounceable, which will hurt word-of-mouth marketing.");
      } else if (wordCount === 1 && name.length <= 4) {
        nameScore = 55;
        warnings.push("Short single-word names can work but are harder to trademark and find via search.");
      } else {
        nameScore = 70;
      }
    }
  } else {
    warnings.push("No business name provided. You'll need a strong name before launching.");
  }

  // --- Idea quality ---
  let ideaScore = 0;
  const idea = intake.businessIdea.trim();
  if (isGibberish(idea)) {
    ideaScore = 5;
    issues.push("Business idea description appears to be placeholder or nonsensical text. A real analysis requires a real description of what you plan to offer, who your customer is, and what problem you solve.");
  } else if (isVagueIdea(idea)) {
    ideaScore = 15;
    issues.push("Business idea is too vague to evaluate meaningfully. The more specific you are about your product, customer, and market, the better guidance we can provide.");
  } else if (idea.length < 30) {
    ideaScore = 30;
    warnings.push("Business idea description is quite short. More detail enables more specific guidance.");
  } else if (idea.length < 80) {
    ideaScore = 50;
    warnings.push("Consider expanding your idea description — who is the customer? What problem are you solving? How will you deliver?");
  } else {
    // Decent idea description
    const hasCustomerMention = /customer|client|people|user|buyer|audience|market/i.test(idea);
    const hasProblemMention = /problem|solve|need|help|improve|better|pain|struggle|challenge/i.test(idea);
    const hasHowMention = /deliver|provide|offer|create|build|sell|through|using|via|platform|app|service/i.test(idea);

    ideaScore = 55;
    if (hasCustomerMention) ideaScore += 10;
    if (hasProblemMention) ideaScore += 10;
    if (hasHowMention) ideaScore += 10;
    if (idea.length > 200) ideaScore += 5;
    if (ideaScore < 65) {
      warnings.push("Your idea description could be stronger. Try including: who your customer is, what problem you solve, and how you'll deliver your solution.");
    }
  }

  // --- Location quality ---
  let locationScore = 0;
  const city = intake.city.trim();
  const state = intake.state.trim();
  if (isGibberish(city)) {
    locationScore = 5;
    issues.push(`"${city}" does not appear to be a real city name. Accurate location data is essential for local licensing, competitor analysis, and market sizing.`);
  } else if (city.length < 3) {
    locationScore = 15;
    issues.push("City name is too short. Please enter your full city name for accurate local guidance.");
  } else if (state.length === 0) {
    locationScore = 20;
    issues.push("No state selected. State-specific requirements cannot be determined.");
  } else {
    locationScore = 80;
  }

  if (intake.county.trim().length > 0 && !isGibberish(intake.county)) {
    locationScore = Math.min(locationScore + 10, 90);
  }

  // --- Differentiator quality ---
  let differentiatorScore = 0;
  const diff = intake.differentiator.trim();
  if (diff.length === 0) {
    differentiatorScore = 15;
    warnings.push("No differentiator provided. Without a clear competitive advantage, you'll struggle to stand out in the market. This is one of the most important things to define before launching.");
  } else if (isGibberish(diff)) {
    differentiatorScore = 5;
    issues.push("Your differentiator appears to be placeholder text. A genuine competitive advantage is critical for business success.");
  } else if (diff.length < 15) {
    differentiatorScore = 30;
    warnings.push("Your differentiator is very brief. Can you be more specific about what makes you different?");
  } else {
    differentiatorScore = 65;
    const hasSpecifics = /\d|%|unique|only|first|best|faster|cheaper|better|exclusive|proprietary|patent/i.test(diff);
    if (hasSpecifics) differentiatorScore += 15;
    if (diff.length > 80) differentiatorScore += 10;
  }

  // --- Completeness ---
  let completenessScore = 0;
  if (intake.userName.trim().length > 0) completenessScore += 10;
  if (intake.businessName.trim().length > 0) completenessScore += 10;
  if (intake.businessIdea.trim().length > 20) completenessScore += 15;
  if (intake.productOrService !== "") completenessScore += 10;
  if (intake.industry !== "" && intake.industry !== "Other") completenessScore += 10;
  if (intake.city.trim().length > 2) completenessScore += 10;
  if (intake.state.trim().length > 0) completenessScore += 10;
  if (intake.differentiator.trim().length > 10) completenessScore += 10;
  if (intake.stage !== "") completenessScore += 5;
  if (intake.capitalRange !== "") completenessScore += 5;
  if (intake.county.trim().length > 0) completenessScore += 5;

  // --- Overall ---
  const overall = Math.round(
    ideaScore * 0.35 +
    nameScore * 0.15 +
    locationScore * 0.15 +
    differentiatorScore * 0.20 +
    completenessScore * 0.15
  );

  return { overall, nameScore, ideaScore, locationScore, differentiatorScore, completenessScore, issues, warnings };
}

// ============================================================
// REPORT GENERATION
// ============================================================

function generateId(): string {
  return `rpt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function generateMockReport(intake: IntakeFormData): StartupReport {
  const quality = assessInputQuality(intake);
  const profile = generateProfile(intake, quality);
  const ideaAnalysis = generateIdeaAnalysis(intake, quality);
  const localRequirements = generateLocalRequirements(intake, quality);
  const competitiveLandscape = generateCompetitiveLandscape(intake, quality);
  const branding = generateBranding(intake, quality);
  const roadmap = generateRoadmap(intake, quality);
  const ninetyDayPlan = generateNinetyDayPlan(intake, quality);
  const partners = generatePartners(intake);
  const viability = generateViability(intake, quality);

  return {
    id: generateId(),
    createdAt: new Date().toISOString(),
    intake,
    profile,
    ideaAnalysis,
    localRequirements,
    competitiveLandscape,
    branding,
    roadmap,
    ninetyDayPlan,
    partners,
    viability,
  };
}

function generateProfile(intake: IntakeFormData, quality: InputQuality): BusinessProfile {
  const isFood = intake.industry.toLowerCase().includes("food") || intake.industry.toLowerCase().includes("restaurant") || intake.industry.toLowerCase().includes("bakery") || intake.industry.toLowerCase().includes("catering");
  const isService = intake.productOrService === "service";
  const isHealth = intake.industry.toLowerCase().includes("health") || intake.industry.toLowerCase().includes("medical") || intake.industry.toLowerCase().includes("wellness");
  const isConstruction = intake.industry.toLowerCase().includes("construct") || intake.industry.toLowerCase().includes("contract");

  let regulatoryComplexity: "low" | "medium" | "high" = "medium";
  if (isFood || isHealth) regulatoryComplexity = "high";
  else if (isConstruction) regulatoryComplexity = "high";
  else if (isService) regulatoryComplexity = "low";

  return {
    industryCategory: intake.industry || "Unspecified",
    customerType: isService ? "Local consumers (B2C)" : "Direct consumers (B2C / D2C)",
    businessModel: isService ? "Service-based, recurring revenue potential" : "Product-based, per-unit or subscription",
    regulatoryComplexity,
    startupCostEstimate: intake.capitalRange || "Not specified",
    likelyBusinessType: quality.overall < 30
      ? "Cannot recommend without clearer business details"
      : "LLC (recommended for liability protection)",
  };
}

function generateIdeaAnalysis(intake: IntakeFormData, quality: InputQuality): IdeaAnalysis {
  const q = quality.overall;
  const isTerrible = q < 25;
  const isPoor = q < 45;
  const isMedium = q < 65;

  // Dynamic scoring based on input quality
  let ideaScore: number;
  let marketDemand: "low" | "moderate" | "high";
  let competitionLevel: "low" | "moderate" | "high";
  let differentiationStrength: "weak" | "moderate" | "strong";
  let startupDifficulty: "easy" | "moderate" | "challenging";
  let profitPotential: "low" | "moderate" | "high";

  if (isTerrible) {
    ideaScore = Math.max(1, Math.round(q / 10));
    marketDemand = "low";
    competitionLevel = "high";
    differentiationStrength = "weak";
    startupDifficulty = "challenging";
    profitPotential = "low";
  } else if (isPoor) {
    ideaScore = Math.round(q / 10);
    marketDemand = "moderate";
    competitionLevel = "moderate";
    differentiationStrength = "weak";
    startupDifficulty = "moderate";
    profitPotential = "low";
  } else if (isMedium) {
    ideaScore = Math.round(q / 10) - 1;
    marketDemand = "moderate";
    competitionLevel = "moderate";
    differentiationStrength = quality.differentiatorScore > 50 ? "moderate" : "weak";
    startupDifficulty = "moderate";
    profitPotential = "moderate";
  } else {
    ideaScore = Math.min(9, Math.round(q / 10));
    marketDemand = "high";
    competitionLevel = intake.knowsCompetitors ? "high" : "moderate";
    differentiationStrength = quality.differentiatorScore > 60 ? "strong" : "moderate";
    startupDifficulty = "moderate";
    profitPotential = "high";
  }

  // Build summary based on quality
  let summary: string;
  if (isTerrible) {
    summary = `We were unable to meaningfully evaluate this business concept. The information provided — "${intake.businessIdea.slice(0, 60)}${intake.businessIdea.length > 60 ? "..." : ""}" — does not contain enough detail to assess market viability, competition, or startup requirements. Before investing time or money, you need to clearly define: what you're offering, who your target customer is, what problem you're solving, and why someone would choose you over alternatives. We strongly recommend going back and providing real, specific information so we can give you genuinely useful guidance.`;
  } else if (isPoor) {
    summary = `Based on the limited information provided, this concept has significant gaps that need to be addressed before moving forward. ${quality.issues.length > 0 ? quality.issues[0] : "The business idea lacks the specificity needed for us to provide strong guidance."} We recommend revisiting your idea description with more concrete details about your target customer, your offering, and your competitive advantage before spending money on formation or branding.`;
  } else if (isMedium) {
    summary = `Your ${intake.industry || "business"} concept in ${intake.city || "your area"}, ${intake.state || "your state"} has potential but needs more development. ${quality.warnings.length > 0 ? quality.warnings[0] : ""} The idea shows some promise, but we'd want to see stronger differentiation and a clearer definition of your target customer before calling this launch-ready.`;
  } else {
    summary = `Your ${intake.industry || "business"} concept in ${intake.city}, ${intake.state} shows genuine potential. The market has room for a well-differentiated offering, and your competitive positioning — ${intake.differentiator || "which you should define more clearly"} — provides a starting point for standing out. Your timing and market conditions appear reasonable, though success will depend heavily on execution, validation, and early customer feedback.`;
  }

  // Build strengths based on actual quality
  const strengths: string[] = [];
  if (quality.ideaScore > 50) strengths.push("Business idea has enough substance to begin planning around");
  if (quality.differentiatorScore > 50) strengths.push(`Identified competitive advantage: "${intake.differentiator.slice(0, 80)}"`);
  if (quality.locationScore > 60) strengths.push(`Location data (${intake.city}, ${intake.state}) enables accurate local requirements`);
  if (intake.industry && intake.industry !== "Other") strengths.push(`Clear industry category (${intake.industry}) helps focus regulatory and competitive research`);
  if (intake.stage === "started") strengths.push("Already in progress — momentum is a real advantage");
  if (strengths.length === 0) strengths.push("You've taken the first step by exploring your idea — that alone puts you ahead of most");

  // Build risks based on actual quality
  const risks: string[] = [];
  if (quality.differentiatorScore < 40) risks.push("No clear competitive advantage identified — this is the #1 reason new businesses struggle to gain traction");
  if (quality.ideaScore < 40) risks.push("Business concept needs significant development before it's ready for market validation");
  if (quality.nameScore < 30 && intake.businessName) risks.push(`Business name "${intake.businessName}" may hurt credibility and discoverability`);
  if (quality.locationScore < 40) risks.push("Location information is incomplete, making local regulatory guidance unreliable");
  risks.push("Established competitors have existing customer relationships and brand recognition");
  risks.push("Initial customer acquisition costs often exceed founder expectations by 2-3x");

  // Build recommendations based on actual quality
  const recommendations: string[] = [];
  if (quality.ideaScore < 40) recommendations.push("Completely rewrite your business idea description with specifics: what, who, why, and how");
  if (quality.differentiatorScore < 40) recommendations.push("Define a clear, specific differentiator — what will you do that competitors cannot or do not?");
  if (quality.nameScore < 30 && intake.businessName) recommendations.push("Reconsider your business name. Choose something memorable, pronounceable, and relevant to your industry");
  if (quality.locationScore < 40) recommendations.push("Provide accurate location data so we can identify local requirements and competitors");
  recommendations.push("Validate demand with 10-15 potential customers before investing in formation or branding");
  recommendations.push("Start lean — test your concept with minimal overhead before scaling");
  if (quality.overall > 50) recommendations.push("Plan for 6 months of operating expenses before expecting profitability");

  return {
    marketDemand,
    competitionLevel,
    differentiationStrength,
    startupDifficulty,
    profitPotential,
    ideaScore,
    summary,
    strengths,
    risks,
    recommendations,
  };
}

function generateLocalRequirements(intake: IntakeFormData, quality: InputQuality): LocalRequirement[] {
  const state = intake.state || "your state";
  const county = intake.county || "your county";
  const isFood = intake.industry.toLowerCase().includes("food") || intake.industry.toLowerCase().includes("restaurant") || intake.industry.toLowerCase().includes("bakery") || intake.industry.toLowerCase().includes("bar ") || intake.industry.toLowerCase().includes("catering");
  const isHealth = intake.industry.toLowerCase().includes("health") || intake.industry.toLowerCase().includes("medical") || intake.industry.toLowerCase().includes("therapy") || intake.industry.toLowerCase().includes("dental");
  const isChildcare = intake.industry.toLowerCase().includes("childcare") || intake.industry.toLowerCase().includes("daycare");
  const isConstruction = intake.industry.toLowerCase().includes("construct") || intake.industry.toLowerCase().includes("contract") || intake.industry.toLowerCase().includes("plumb") || intake.industry.toLowerCase().includes("electric");
  const isBeauty = intake.industry.toLowerCase().includes("beauty") || intake.industry.toLowerCase().includes("salon") || intake.industry.toLowerCase().includes("barber") || intake.industry.toLowerCase().includes("cosmet");
  const isTransport = intake.industry.toLowerCase().includes("transport") || intake.industry.toLowerCase().includes("trucking") || intake.industry.toLowerCase().includes("delivery");
  const isAlcohol = intake.industry.toLowerCase().includes("bar ") || intake.industry.toLowerCase().includes("brewery") || intake.industry.toLowerCase().includes("liquor");

  // Warn if location data is bad
  if (quality.locationScore < 30) {
    return [
      {
        task: "Provide Accurate Location Information",
        description: "We cannot generate reliable local requirements without a valid city, county, and state. The location information you provided does not appear to be real. Please re-submit with your actual business location to get accurate licensing, registration, and tax guidance.",
        confidence: "verify",
        category: "other",
      },
    ];
  }

  const requirements: LocalRequirement[] = [
    {
      task: "Register Business Entity",
      description: `File your LLC or corporation with the ${state} Secretary of State. An LLC is recommended for most small businesses due to liability protection and tax flexibility.`,
      link: `https://www.sos.${state.toLowerCase().replace(/\s/g, "")}.gov`,
      confidence: "likely",
      category: "registration",
    },
    {
      task: "Obtain Employer Identification Number (EIN)",
      description: "Apply for a free EIN from the IRS. Required for business banking, hiring employees, and tax filings.",
      link: "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      confidence: "verified",
      category: "registration",
    },
    {
      task: `${county} County Business License`,
      description: `Apply for a business license through ${county} County. Most counties require this before you can legally operate.`,
      confidence: "likely",
      category: "licensing",
    },
    {
      task: `${state} Sales Tax Registration`,
      description: `Register for a sales tax permit with the ${state} Department of Revenue if you will sell taxable goods or services.`,
      confidence: "likely",
      category: "tax",
    },
    {
      task: "Open Business Bank Account",
      description: "Separate personal and business finances by opening a dedicated business checking account. You will need your EIN and formation documents.",
      confidence: "verified",
      category: "other",
    },
    {
      task: "Business Insurance",
      description: "Obtain general liability insurance at minimum. Consider professional liability if providing advice or services. Typical cost: $500-2,000/year.",
      confidence: "likely",
      category: "other",
    },
  ];

  if (isFood) {
    requirements.push(
      { task: "Health Department Permit", description: `Contact the ${county} County Health Department for food handling permits and facility inspection requirements.`, confidence: "likely", category: "health" },
      { task: "Food Handler Certification", description: "Obtain food safety certification (ServSafe or equivalent) for yourself and any food-handling employees.", confidence: "likely", category: "licensing" },
      { task: "Commercial Kitchen Requirement", description: "Most states require food businesses to operate from a licensed commercial kitchen. Home kitchens may require a cottage food license with limitations.", confidence: "likely", category: "zoning" },
      { task: "Zoning Approval", description: `Verify that your intended business location is properly zoned for food service through the ${county} County zoning office.`, confidence: "verify", category: "zoning" }
    );
  }

  if (isAlcohol) {
    requirements.push(
      { task: "Liquor License", description: `Apply for a liquor license through the ${state} Alcoholic Beverage Control Board. This process can take 3-6 months and costs vary significantly by state.`, confidence: "likely", category: "licensing" }
    );
  }

  if (isHealth) {
    requirements.push(
      { task: "Professional License", description: `Health and medical businesses typically require professional licensing through the ${state} Board of Health or relevant professional licensing board.`, confidence: "likely", category: "licensing" },
      { task: "HIPAA Compliance", description: "If handling patient health information, you must comply with HIPAA privacy and security rules.", confidence: "likely", category: "licensing" }
    );
  }

  if (isChildcare) {
    requirements.push(
      { task: "Childcare License", description: `${state} requires licensing for childcare facilities. Contact the ${state} Department of Human Resources or equivalent agency.`, confidence: "likely", category: "licensing" },
      { task: "Background Checks", description: "All childcare staff typically require FBI fingerprint background checks and state criminal history checks.", confidence: "likely", category: "licensing" }
    );
  }

  if (isConstruction) {
    requirements.push(
      { task: "Contractor License", description: `Many states require contractor licensing. Check with the ${state} Licensing Board for Contractors or equivalent.`, confidence: "likely", category: "licensing" },
      { task: "Bonding & Surety", description: "Construction businesses typically need to be bonded. Surety bond costs vary by project size and license type.", confidence: "likely", category: "licensing" }
    );
  }

  if (isBeauty) {
    requirements.push(
      { task: "Cosmetology / Barber License", description: `Obtain the required professional license from the ${state} Board of Cosmetology or Barber Examiners.`, confidence: "likely", category: "licensing" },
      { task: "Salon Inspection", description: "Your physical location will likely need to pass a state health and safety inspection before opening.", confidence: "likely", category: "health" }
    );
  }

  if (isTransport) {
    requirements.push(
      { task: "DOT Registration", description: "Commercial vehicles may require USDOT registration and MC authority depending on scope of operations.", confidence: "likely", category: "licensing" }
    );
  }

  return requirements;
}

function generateCompetitiveLandscape(intake: IntakeFormData, quality: InputQuality): CompetitiveLandscape {
  const city = intake.city || "your area";
  const industry = intake.industry || "Business";
  const shortIndustry = industry.split("/")[0].trim();

  if (quality.locationScore < 30 || quality.ideaScore < 20) {
    return {
      overview: "Unable to assess competitive landscape. Provide a valid city, state, and business description for insights.",
      saturationLevel: "moderate",
      competitorTypes: [],
      marketGaps: [],
      positioningAssessment: "Insufficient data to assess positioning.",
      advice: ["Complete your business details for a full landscape analysis."],
    };
  }

  return {
    overview: `The ${shortIndustry.toLowerCase()} market in ${city}, ${intake.state} shows moderate competition with room for differentiated newcomers. Most established players compete on reputation and convenience rather than innovation, leaving openings for businesses with a clear unique value proposition.`,
    saturationLevel: "moderate",
    competitorTypes: [
      {
        type: "Established local businesses",
        prevalence: "Several well-known operators in the area",
        typicalStrengths: ["Strong local reputation", "Existing customer base", "Established vendor relationships"],
      },
      {
        type: "Chain / franchise locations",
        prevalence: "A few national brands present",
        typicalStrengths: ["Brand recognition", "Marketing budget", "Standardized operations"],
      },
      {
        type: "Independent newcomers",
        prevalence: "Growing number of new entrants",
        typicalStrengths: ["Modern branding", "Social media savvy", "Niche focus"],
      },
    ],
    marketGaps: [
      "Limited options for premium or specialized offerings",
      "Few competitors with strong digital presence",
      "Underserved demand for personalized customer experience",
      "Opportunity for modern branding and community engagement",
    ],
    positioningAssessment: intake.differentiator
      ? `Your differentiator — "${intake.differentiator}" — could carve out a meaningful niche if executed well. Focus on making this the centerpiece of your marketing and customer experience.`
      : `Without a clear differentiator defined yet, you'll want to identify what sets you apart before launch. Consider what the existing players aren't doing well and build your positioning around that gap.`,
    advice: [
      "Study what existing businesses in your area are missing — that's your opportunity",
      "Build a strong online presence early, since many local competitors are weak here",
      "Focus on a specific niche rather than trying to serve everyone",
      "Collect reviews and testimonials from day one to build credibility fast",
    ],
  };
}

function generateBranding(intake: IntakeFormData, quality: InputQuality): BrandingFeedback {
  const name = intake.businessName.trim();
  const hasName = name.length > 0;
  const nameIsGibberish = hasName && isGibberish(name);

  // --- Name analysis with real scoring ---
  let memorability = 0, clarity = 0, relevance = 0, pronunciation = 0, distinctiveness = 0;
  let nameFeedback = "";
  let nameSuggestions: string[] = [];

  if (!hasName) {
    nameFeedback = "You haven't chosen a business name yet. This is one of the most important branding decisions you'll make. Your name should be memorable, easy to spell and pronounce, relevant to your industry, and different from competitors. Avoid generic names that blend in — and avoid inside jokes or personal nicknames that won't mean anything to customers.";
    nameSuggestions = [
      "Brainstorm 20+ name options before committing to one",
      "Check domain availability (.com strongly preferred) for every option",
      "Search USPTO.gov trademark database before investing in branding",
      "Test your top 3 names with 10 strangers — first impressions matter",
      "Google your top names to make sure nothing negative comes up",
    ];
  } else if (nameIsGibberish) {
    memorability = 1;
    clarity = 1;
    relevance = 1;
    pronunciation = 1;
    distinctiveness = 2;
    nameFeedback = `"${name}" is not a viable business name. It appears to be random characters rather than a real word or phrase. Customers will not be able to remember it, spell it, pronounce it, or search for it. A business name is the foundation of your brand — it appears on every sign, card, invoice, website, and conversation. You need a name that communicates what you do and sticks in people's minds.`;
    nameSuggestions = [
      "Start over with a completely new name",
      "Use a formula: [Descriptive word] + [Industry word] (e.g., 'Bright Path Consulting')",
      "Consider your city or region as part of the name for local SEO",
      "Make sure a stranger can hear it once and spell it correctly",
      "Check that the .com domain is available before committing",
    ];
  } else {
    // Real name evaluation
    const words = name.split(/\s+/);
    const isPronounceable = /[aeiou]/i.test(name) && /[bcdfghjklmnpqrstvwxyz]/i.test(name);
    const industryWords = (intake.industry || "").toLowerCase().split(/[\s\/]+/);
    const nameContainsIndustry = industryWords.some((w) => w.length > 3 && name.toLowerCase().includes(w));

    memorability = Math.min(10, Math.max(3, words.length <= 3 ? 7 : 5));
    clarity = nameContainsIndustry ? 8 : (words.length <= 2 ? 5 : 4);
    relevance = nameContainsIndustry ? 8 : 5;
    pronunciation = isPronounceable ? (words.every((w) => w.length <= 12) ? 8 : 6) : 3;
    distinctiveness = words.length === 1 ? 5 : (name.length > 10 && name.length < 30 ? 7 : 5);

    const overallNameScore = ((memorability + clarity + relevance + pronunciation + distinctiveness) / 5).toFixed(1);
    const scoreNum = parseFloat(overallNameScore);

    if (scoreNum >= 7) {
      nameFeedback = `"${name}" is a solid business name. It's pronounceable, reasonably memorable, and has the potential to build brand recognition. Before committing, verify that the .com domain is available (or a strong alternative), check trademark availability, and test it with people in your target market. A good name is only the starting point — consistent visual branding, messaging, and customer experience build the actual brand.`;
    } else if (scoreNum >= 5) {
      nameFeedback = `"${name}" is functional but could be stronger. ${!nameContainsIndustry ? "It doesn't clearly communicate what your business does, which means you'll need to work harder in your tagline and marketing to explain your offering." : ""} ${words.length > 3 ? "It's also a bit long — shorter names are easier to fit on signage, social media handles, and logos." : ""} Consider whether this name will still feel right in 5 years, and whether a customer would remember it after hearing it once.`;
    } else {
      nameFeedback = `"${name}" needs significant improvement as a business name. It scores low on the factors that matter most for brand success: memorability, clarity, and pronounceability. A weak name makes every other part of your business harder — marketing, word-of-mouth, search visibility, and customer trust. We strongly recommend reconsidering before investing in logo design, signage, or legal formation under this name.`;
    }

    nameSuggestions = [
      "Check trademark availability at USPTO.gov before investing in branding",
      "Verify the .com domain is available (or .co, .io as alternatives)",
      "Search social media platforms to ensure handle availability",
      "Say the name out loud 10 times — does it feel natural?",
      "Ask 5 strangers to spell the name after hearing it once",
    ];
  }

  const overallNameScore = hasName
    ? parseFloat(((memorability + clarity + relevance + pronunciation + distinctiveness) / 5).toFixed(1))
    : 0;

  // --- Logo production analysis ---
  const logoAnalysis = intake.hasLogo
    ? {
        readability: 6,
        colorBalance: 5,
        categoryFit: 6,
        scalability: 5,
        uniqueness: 5,
        screenPrintability: 4,
        embroideryFriendly: 4,
        colorCount: 5,
        faviconReady: 5,
        signageReady: 6,
        overallScore: 5.1,
        feedback: "Since we can't view the uploaded logo in this demo, here's what matters most for a business logo. Your logo will appear everywhere: business cards, signage, websites, social media, packaging, invoices, apparel, and promotional items. Each of these has different technical requirements. A logo that looks great on a website may be unreadable on a pen or unaffordable to embroider.",
        improvements: [
          "Limit to 3 colors maximum — every additional color increases screen printing costs (each color is a separate screen, adding $15-30+ per color per run)",
          "Ensure the design works in a single color (black on white) — you'll need this for faxes, stamps, receipts, and budget printing",
          "Avoid fine details, thin lines, and small text — these disappear in embroidery (thread can't reproduce lines thinner than 1mm)",
          "Embroidery requires a minimum stitch density — gradients and photographic elements cannot be embroidered at all",
          "Design should be recognizable at 16x16 pixels (favicon size) and 1 inch across (business card icon size)",
          "Test your logo at billboard scale AND thumbnail scale — it should work at both extremes",
          "Vector format (SVG/AI/EPS) is mandatory — never build a logo from a raster image (PNG/JPG)",
          "For signage: check contrast ratios against common backgrounds (brick, glass, dark walls, light walls)",
          "Avoid trendy color gradients — they won't translate to vinyl cutting, screen printing, or single-color applications",
          "Consider how the logo looks on dark backgrounds vs light — you may need a reversed/white version",
        ],
      }
    : undefined;

  return {
    nameAnalysis: {
      memorability,
      clarity,
      relevance,
      pronunciation,
      distinctiveness,
      overallScore: overallNameScore,
      feedback: nameFeedback,
      suggestions: nameSuggestions,
    },
    logoAnalysis,
  };
}

function generateRoadmap(intake: IntakeFormData, quality: InputQuality): RoadmapStep[] {
  const steps: RoadmapStep[] = [];

  // If input quality is terrible, the first step is "go back and think harder"
  if (quality.overall < 25) {
    steps.push({
      step: 1,
      title: "Define Your Business Concept",
      description: "Before anything else, you need a clear answer to: What are you selling? Who is your customer? Why would they choose you? You cannot build a business on vague ideas. Write a one-page description of your concept.",
      timeframe: "This week",
      priority: "critical",
      category: "operations",
    });
    steps.push({
      step: 2,
      title: "Research Your Market",
      description: "Identify 5-10 competitors in your area and industry. Study their pricing, reviews, strengths, and weaknesses. If you can't find competitors, your market may not exist. If you find too many, you need a clear differentiator.",
      timeframe: "Week 1-2",
      priority: "critical",
      category: "operations",
    });
    steps.push({
      step: 3,
      title: "Choose a Real Business Name",
      description: "Pick a name that is memorable, pronounceable, relevant to your industry, and available as a .com domain. Check USPTO.gov for trademark conflicts.",
      timeframe: "Week 2-3",
      priority: "critical",
      category: "branding",
    });
  }

  const offset = steps.length;

  steps.push(
    {
      step: offset + 1,
      title: "Validate Your Idea With Real People",
      description: "Talk to 10-15 potential customers. Do NOT ask friends and family — they will lie to be nice. Ask strangers in your target market if they would pay for this and how much. If you can't get 5 people excited, rethink the concept.",
      timeframe: quality.overall < 40 ? "Week 3-5" : "Week 1-2",
      priority: "critical",
      category: "operations",
    },
    {
      step: offset + 2,
      title: "Register Your Business",
      description: `File your LLC with the ${intake.state || "state"} Secretary of State and obtain your EIN from the IRS (free, online, takes 10 minutes).`,
      timeframe: quality.overall < 40 ? "Week 5-6" : "Week 2-3",
      priority: "critical",
      category: "legal",
    },
    {
      step: offset + 3,
      title: "Secure Your Brand Online",
      description: "Register your domain name, claim social media handles on Instagram, Facebook, TikTok, and Google Business Profile. Set up a professional email (you@yourbusiness.com, not Gmail).",
      timeframe: quality.overall < 40 ? "Week 5-6" : "Week 2-3",
      priority: "critical",
      category: "branding",
    },
    {
      step: offset + 4,
      title: "Open Business Bank Account",
      description: "Never mix personal and business money. Open a separate business checking account immediately after receiving your EIN and formation documents.",
      timeframe: quality.overall < 40 ? "Week 6" : "Week 3",
      priority: "critical",
      category: "financial",
    },
    {
      step: offset + 5,
      title: "Get Required Licenses & Permits",
      description: `Apply for your ${intake.county || "county"} business license and any industry-specific permits. Some permits take weeks to process — start early.`,
      timeframe: quality.overall < 40 ? "Week 6-8" : "Week 3-4",
      priority: "critical",
      category: "legal",
    },
    {
      step: offset + 6,
      title: "Build Your Website",
      description: "Create a professional website with clear messaging, contact information, and a way for customers to take action (buy, book, call, or sign up). You don't need a perfect site — you need a live one.",
      timeframe: quality.overall < 40 ? "Week 8-10" : "Week 4-6",
      priority: "important",
      category: "digital",
    },
    {
      step: offset + 7,
      title: "Set Up Accounting From Day One",
      description: "Choose accounting software and track every business expense from the start. This saves you thousands in tax prep costs later and protects you in an audit.",
      timeframe: quality.overall < 40 ? "Week 8-9" : "Week 4-5",
      priority: "important",
      category: "financial",
    },
    {
      step: offset + 8,
      title: "Get Business Insurance",
      description: "Obtain general liability insurance at minimum. Get quotes from 2-3 providers. One lawsuit without insurance can destroy everything you've built.",
      timeframe: quality.overall < 40 ? "Week 9-10" : "Week 5-6",
      priority: "important",
      category: "legal",
    },
    {
      step: offset + 9,
      title: "Launch Marketing",
      description: "Start posting valuable content on 1-2 platforms where your target customers actually spend time. Consistency beats perfection — post weekly at minimum.",
      timeframe: quality.overall < 40 ? "Week 10-12" : "Week 6-8",
      priority: "important",
      category: "marketing",
    },
    {
      step: offset + 10,
      title: "Acquire Your First 10 Customers",
      description: "Focus on direct outreach, local networking, and building relationships. Your first 10 customers will teach you more than any business plan ever could.",
      timeframe: quality.overall < 40 ? "Week 12-16" : "Week 8-12",
      priority: "recommended",
      category: "marketing",
    }
  );

  return steps;
}

function generateNinetyDayPlan(intake: IntakeFormData, quality: InputQuality): NinetyDayPlan {
  if (quality.overall < 25) {
    return {
      weekOne: [
        "Write a clear one-page description of your business idea",
        "Define your exact target customer (age, location, income, problem)",
        "Identify what makes you different from every competitor",
        "Choose a real business name (check domain and trademark availability)",
        "Identify 5-10 competitors and study their pricing and reviews",
      ],
      monthOne: [
        "Talk to 10-15 potential customers (NOT friends and family)",
        "Determine if there is real demand and willingness to pay",
        "Refine your concept based on customer feedback",
        "Come back to this tool with real, detailed information",
        "Only proceed with formation if validation is positive",
      ],
      monthTwo: [
        "Register LLC and obtain EIN (if validated)",
        "Open a business bank account",
        "Register domain and set up professional email",
        "Apply for required licenses",
        "Set up basic accounting",
      ],
      monthThree: [
        "Build and launch a simple website",
        "Set up Google Business Profile",
        "Create social media profiles",
        "Get business insurance",
        "Begin outreach to potential customers",
      ],
    };
  }

  return {
    weekOne: [
      "Write a clear one-paragraph pitch for your business",
      "Identify and talk to 5 potential paying customers",
      "Research 3-5 direct competitors in your area",
      intake.businessName ? `Verify "${intake.businessName}" domain and trademark availability` : "Finalize your business name (check domain + trademark)",
      "Check social media handle availability across platforms",
    ],
    monthOne: [
      `Register LLC with ${intake.state || "state"} Secretary of State`,
      "Apply for EIN from the IRS (free, online, instant)",
      "Open a business bank account",
      `Apply for ${intake.county || "county"} business license`,
      "Register domain name and set up professional email",
      "Set up QuickBooks or Wave for accounting",
      "Draft your brand messaging and value proposition",
    ],
    monthTwo: [
      "Build and launch your website",
      "Set up 1-2 social media profiles with consistent branding",
      "Get general liability insurance",
      "Create your first 10 pieces of marketing content",
      "Set up Google Business Profile",
      "Begin local networking and outreach",
      "Finalize pricing strategy",
    ],
    monthThree: [
      "Launch marketing campaigns (start small, measure results)",
      "Acquire first 5-10 paying customers",
      "Collect customer feedback and testimonials",
      "Refine your offering based on real customer feedback",
      "Set up payment processing (Square, Stripe, or both)",
      "Review financials and adjust budget",
      "Plan for next quarter's growth goals",
    ],
  };
}

function generatePartners(intake: IntakeFormData): PartnerRecommendation[] {
  const isEcommerce = intake.industry.toLowerCase().includes("commerce") || intake.industry.toLowerCase().includes("online");
  const isService = intake.productOrService === "service";

  const partners: PartnerRecommendation[] = [
    {
      name: "LegalZoom",
      category: "Business Formation",
      description: "LLC formation, registered agent services, and compliance filing",
      why: "Simplifies the legal formation process so you can focus on building your business",
      url: "https://www.legalzoom.com",
    },
    {
      name: "QuickBooks",
      category: "Accounting",
      description: "Small business accounting, invoicing, expense tracking, and tax prep",
      why: "The most widely-used small business accounting platform — starts at $30/month",
      url: "https://quickbooks.intuit.com",
    },
    {
      name: "GoDaddy",
      category: "Domain & Hosting",
      description: "Domain registration, web hosting, and professional email",
      why: "Secure your business domain name and set up professional email immediately",
      url: "https://www.godaddy.com",
    },
  ];

  if (isEcommerce) {
    partners.push({
      name: "Shopify",
      category: "E-commerce Platform",
      description: "Complete online store with payments, shipping, and inventory",
      why: "Purpose-built for online selling — the fastest path to a professional storefront",
      url: "https://www.shopify.com",
    });
  } else {
    partners.push({
      name: "Wix",
      category: "Website Builder",
      description: "Drag-and-drop website builder with scheduling and booking tools",
      why: "Build a professional website without coding — great for service businesses",
      url: "https://www.wix.com",
    });
  }

  if (isService) {
    partners.push({
      name: "Square",
      category: "Payments & POS",
      description: "Payment processing, invoicing, and appointment scheduling",
      why: "Accept payments anywhere with no monthly fee — ideal for service businesses",
      url: "https://squareup.com",
    });
  } else {
    partners.push({
      name: "Stripe",
      category: "Payment Processing",
      description: "Online payment processing for internet businesses",
      why: "Industry-leading payment infrastructure with excellent developer tools",
      url: "https://stripe.com",
    });
  }

  partners.push(
    {
      name: "HubSpot",
      category: "CRM & Marketing",
      description: "Free CRM, email marketing, and customer management",
      why: "Start managing customer relationships professionally from day one — free tier available",
      url: "https://www.hubspot.com",
    },
    {
      name: "Canva",
      category: "Design & Branding",
      description: "Logo design, social media graphics, business cards, and marketing materials",
      why: "Create professional-looking brand assets without hiring a designer",
      url: "https://www.canva.com",
    }
  );

  return partners;
}

function generateViability(intake: IntakeFormData, quality: InputQuality): ViabilityAssessment {
  const q = quality.overall;

  // Dynamic scores based on real input quality
  const overallScore = Math.max(5, Math.min(90, q));
  const competitionDensity = intake.knowsCompetitors ? 70 : (quality.ideaScore > 50 ? 55 : 40);
  const localDemand = quality.locationScore > 60 ? (quality.ideaScore > 50 ? 65 : 40) : 20;
  const startupComplexity = quality.ideaScore > 40 ? 50 : 25;
  const pricingFeasibility = quality.ideaScore > 50 ? 60 : 30;
  const differentiationScore = Math.max(5, quality.differentiatorScore);

  // Dynamic verdict
  let verdict: string;
  if (q < 20) {
    verdict = `This submission cannot be meaningfully evaluated. The information provided does not describe a real business concept. A viability score of ${overallScore}% reflects the absence of concrete details about the product or service, the target market, the location, and the competitive advantage. To receive useful guidance, please re-submit with genuine information about what you want to build, where, and for whom. We cannot help you plan something that hasn't been thought through yet.`;
  } else if (q < 35) {
    verdict = `This business concept scores ${overallScore}% on viability, which is below the threshold we'd consider launch-ready. The primary issues are: ${quality.issues.slice(0, 2).join("; ")}. Before spending any money on formation, branding, or inventory, we strongly recommend addressing these fundamental gaps. A low score doesn't necessarily mean a bad idea — it may mean the idea isn't developed enough to assess properly.`;
  } else if (q < 55) {
    verdict = `Your ${intake.industry || "business"} concept scores ${overallScore}% on viability — a mixed result. There are aspects worth building on, but significant gaps need to be addressed. ${quality.warnings.slice(0, 2).join(" ")} The path forward is to validate your assumptions with real potential customers and strengthen your competitive positioning before making large financial commitments.`;
  } else if (q < 75) {
    verdict = `Your ${intake.industry || "business"} concept in ${intake.city || "your area"}, ${intake.state || "your state"} scores ${overallScore}% on viability — a reasonable foundation to move forward with validation. ${intake.differentiator ? `Your differentiator ("${intake.differentiator.slice(0, 60)}...") is a good starting point.` : "Defining a clearer differentiator would improve this score."} This is not a guaranteed success — no business idea is — but the combination of your inputs suggests a viable path forward if you execute the recommended steps and validate early with real customers.`;
  } else {
    verdict = `Your ${intake.industry} concept in ${intake.city}, ${intake.state} scores ${overallScore}% on viability — among the stronger submissions we see. Your clearly defined idea, specific location, and identified competitive advantage give you a solid foundation. However, even strong ideas fail with poor execution. The next step is rigorous customer validation and disciplined execution of your launch roadmap.`;
  }

  // Dynamic strengths and risks
  const topStrengths: string[] = [];
  const topRisks: string[] = [];

  if (quality.ideaScore > 60) topStrengths.push("Well-articulated business concept with clear direction");
  if (quality.differentiatorScore > 55) topStrengths.push(`Defined competitive advantage: "${(intake.differentiator || "").slice(0, 60)}"`);
  if (quality.locationScore > 60) topStrengths.push(`Accurate location data enables specific local guidance`);
  if (quality.completenessScore > 70) topStrengths.push("Thorough preparation — you've thought about the key details");
  if (topStrengths.length === 0) topStrengths.push("You've started the exploration process, which is the first real step");

  if (quality.ideaScore < 40) topRisks.push("Business concept needs significant development before market entry");
  if (quality.differentiatorScore < 40) topRisks.push("No clear competitive advantage — this is the #1 killer of new businesses");
  if (quality.nameScore < 30 && intake.businessName) topRisks.push("Business name may actively hurt credibility and discoverability");
  topRisks.push("Competition from established players with existing customers and brand trust");
  topRisks.push("Underestimating time-to-revenue — most businesses take 12-18 months to become profitable");

  const criticalFirstSteps: string[] = [];
  if (quality.overall < 35) criticalFirstSteps.push("Rewrite your business concept with specific, concrete details");
  if (quality.differentiatorScore < 40) criticalFirstSteps.push("Define exactly what makes you different from competitors");
  if (quality.nameScore < 30 && intake.businessName) criticalFirstSteps.push("Choose a professional, memorable business name");
  criticalFirstSteps.push("Validate with 10+ real potential customers before investing money");
  criticalFirstSteps.push("Form your business entity and separate personal/business finances");
  criticalFirstSteps.push("Secure your brand online (domain + social handles + Google Business Profile)");
  if (criticalFirstSteps.length < 5) criticalFirstSteps.push("Start with your lowest-cost version and iterate based on feedback");

  return {
    overallScore,
    competitionDensity,
    localDemand,
    startupComplexity,
    pricingFeasibility,
    differentiationScore,
    verdict,
    topStrengths,
    topRisks,
    criticalFirstSteps,
  };
}
