// ============================================================
// INTAKE FORM TYPES
// ============================================================

export interface IntakeFormData {
  // Personal
  userName: string;

  // Business basics
  businessName: string;
  businessIdea: string;
  productOrService: "product" | "service" | "both" | "";
  industry: string;

  // Location
  city: string;
  county: string;
  state: string;

  // Competition
  knowsCompetitors: boolean;
  competitors: string;
  differentiator: string;

  // Branding
  hasLogo: boolean;
  logoFile: File | null;
  hasWebsite: boolean;
  websiteUrl: string;

  // Stage & capital
  stage: "idea" | "planning" | "started" | "";
  capitalRange: string;
}

export const INITIAL_FORM_DATA: IntakeFormData = {
  userName: "",
  businessName: "",
  businessIdea: "",
  productOrService: "",
  industry: "",
  city: "",
  county: "",
  state: "",
  knowsCompetitors: false,
  competitors: "",
  differentiator: "",
  hasLogo: false,
  logoFile: null,
  hasWebsite: false,
  websiteUrl: "",
  stage: "",
  capitalRange: "",
};

export const INDUSTRIES = [
  "Accounting / Bookkeeping",
  "App Development",
  "Auto Detailing",
  "Auto Repair / Mechanic",
  "Bakery / Desserts",
  "Bar / Brewery / Winery",
  "Barbershop",
  "Beauty & Personal Care",
  "Car Wash",
  "Catering",
  "Childcare / Daycare",
  "Chiropractic",
  "Cleaning Services",
  "Coffee Shop / Café",
  "Construction / Contracting",
  "Consulting",
  "Content Creator / Influencer",
  "Courier / Delivery Service",
  "Dance Studio",
  "Dental Practice",
  "Dog Walking / Pet Sitting",
  "Driving School",
  "Dropshipping",
  "E-commerce / Online Store",
  "Electrical",
  "Event Planning",
  "Farming / Agriculture",
  "Financial Planning",
  "Fitness & Training",
  "Flooring",
  "Food Truck / Mobile Food",
  "Franchise",
  "Graphic Design",
  "Hair Salon",
  "Handyman / General Contracting",
  "Health & Wellness",
  "Home Health Care",
  "Home Services (General)",
  "Hotel / Bed & Breakfast",
  "HVAC",
  "Insurance Agency",
  "Interior Design / Staging",
  "IT Services / Managed IT",
  "Landscaping / Lawn Care",
  "Legal Services",
  "Marketing / Advertising Agency",
  "Martial Arts",
  "Medical Practice",
  "Mental Health / Counseling",
  "Moving / Hauling",
  "Music / Entertainment",
  "Music Lessons / School",
  "Nail Salon",
  "Nonprofit / Social Enterprise",
  "Nursery / Garden Center",
  "Painting",
  "Pest Control",
  "Pet Boarding / Kennel",
  "Pet Grooming",
  "Pet Services (General)",
  "Pharmacy",
  "Photography / Videography",
  "Plumbing",
  "Printing / Signage",
  "Property Management",
  "Real Estate (Agent/Broker)",
  "Real Estate Investing",
  "Restaurant / Food Service",
  "Retail / Boutique",
  "Roofing",
  "SaaS / Digital Product",
  "Spa / Massage Therapy",
  "Staffing / Recruiting",
  "Subscription Box",
  "Technology / Software",
  "Towing",
  "Trucking / Freight",
  "Tutoring / Education",
  "Vacation Rental / Airbnb",
  "Veterinary Practice",
  "Web Development / Design",
  "Wedding Services",
  "Welding / Metal Fabrication",
  "Hunting / Fishing Guide",
  "Yoga / Pilates Studio",
  "Other",
] as const;

export const CAPITAL_RANGES = [
  "Under $1,000",
  "$1,000 - $5,000",
  "$5,000 - $10,000",
  "$10,000 - $25,000",
  "$25,000 - $50,000",
  "$50,000 - $100,000",
  "$100,000+",
  "Not sure yet",
] as const;

export const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California",
  "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
  "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
] as const;

// ============================================================
// AI ANALYSIS TYPES
// ============================================================

export interface BusinessProfile {
  industryCategory: string;
  customerType: string;
  businessModel: string;
  regulatoryComplexity: "low" | "medium" | "high";
  startupCostEstimate: string;
  likelyBusinessType: string;
}

export interface IdeaAnalysis {
  marketDemand: "low" | "moderate" | "high";
  competitionLevel: "low" | "moderate" | "high";
  differentiationStrength: "weak" | "moderate" | "strong";
  startupDifficulty: "easy" | "moderate" | "challenging";
  profitPotential: "low" | "moderate" | "high";
  ideaScore: number; // 1-10
  summary: string;
  strengths: string[];
  risks: string[];
  recommendations: string[];
}

export interface LocalRequirement {
  task: string;
  description: string;
  link?: string;
  confidence: "verified" | "likely" | "verify";
  category: "registration" | "licensing" | "tax" | "zoning" | "health" | "other";
}

export interface Competitor {
  name: string;
  rating: number;
  reviewCount: number;
  distance?: string;
  website?: string;
  instagram?: string;
  strengths: string[];
}

export interface BrandingFeedback {
  nameAnalysis: {
    memorability: number;
    clarity: number;
    relevance: number;
    pronunciation: number;
    distinctiveness: number;
    overallScore: number;
    feedback: string;
    suggestions: string[];
  };
  logoAnalysis?: {
    readability: number;
    colorBalance: number;
    categoryFit: number;
    scalability: number;
    uniqueness: number;
    screenPrintability: number;
    embroideryFriendly: number;
    colorCount: number;
    faviconReady: number;
    signageReady: number;
    overallScore: number;
    feedback: string;
    improvements: string[];
  };
}

export interface RoadmapStep {
  step: number;
  title: string;
  description: string;
  timeframe: string;
  priority: "critical" | "important" | "recommended";
  category: "legal" | "branding" | "digital" | "operations" | "marketing" | "financial";
}

export interface NinetyDayPlan {
  weekOne: string[];
  monthOne: string[];
  monthTwo: string[];
  monthThree: string[];
}

export interface PartnerRecommendation {
  name: string;
  category: string;
  description: string;
  why: string;
  url: string;
  logo?: string;
}

export interface ViabilityAssessment {
  overallScore: number; // 0-100
  competitionDensity: number;
  localDemand: number;
  startupComplexity: number;
  pricingFeasibility: number;
  differentiationScore: number;
  verdict: string;
  topStrengths: string[];
  topRisks: string[];
  criticalFirstSteps: string[];
}

// ============================================================
// FULL REPORT
// ============================================================

export interface StartupReport {
  id: string;
  createdAt: string;
  intake: IntakeFormData;
  profile: BusinessProfile;
  ideaAnalysis: IdeaAnalysis;
  localRequirements: LocalRequirement[];
  competitors: Competitor[];
  branding: BrandingFeedback;
  roadmap: RoadmapStep[];
  ninetyDayPlan: NinetyDayPlan;
  partners: PartnerRecommendation[];
  viability: ViabilityAssessment;
}
