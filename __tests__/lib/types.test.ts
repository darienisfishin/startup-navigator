import {
  INDUSTRIES,
  CAPITAL_RANGES,
  US_STATES,
  INITIAL_FORM_DATA,
  type IntakeFormData,
} from "@/lib/types";

describe("INDUSTRIES constant", () => {
  it("is a non-empty array", () => {
    expect(Array.isArray(INDUSTRIES)).toBe(true);
    expect(INDUSTRIES.length).toBeGreaterThan(0);
  });

  it("contains known industry values", () => {
    expect(INDUSTRIES).toContain("Bakery / Desserts");
    expect(INDUSTRIES).toContain("Restaurant / Food Service");
    expect(INDUSTRIES).toContain("Technology / Software");
    expect(INDUSTRIES).toContain("Cleaning Services");
    expect(INDUSTRIES).toContain("Other");
  });

  it("has no duplicate entries", () => {
    const unique = new Set(INDUSTRIES);
    expect(unique.size).toBe(INDUSTRIES.length);
  });

  it("has all entries as non-empty strings", () => {
    for (const industry of INDUSTRIES) {
      expect(typeof industry).toBe("string");
      expect(industry.trim().length).toBeGreaterThan(0);
    }
  });
});

describe("CAPITAL_RANGES constant", () => {
  it("is a non-empty array", () => {
    expect(Array.isArray(CAPITAL_RANGES)).toBe(true);
    expect(CAPITAL_RANGES.length).toBeGreaterThan(0);
  });

  it("contains expected ranges", () => {
    expect(CAPITAL_RANGES).toContain("Under $1,000");
    expect(CAPITAL_RANGES).toContain("$100,000+");
    expect(CAPITAL_RANGES).toContain("Not sure yet");
  });

  it("has no duplicate entries", () => {
    const unique = new Set(CAPITAL_RANGES);
    expect(unique.size).toBe(CAPITAL_RANGES.length);
  });
});

describe("US_STATES constant", () => {
  it("contains exactly 50 states", () => {
    expect(US_STATES.length).toBe(50);
  });

  it("contains known states", () => {
    expect(US_STATES).toContain("Texas");
    expect(US_STATES).toContain("California");
    expect(US_STATES).toContain("New York");
    expect(US_STATES).toContain("Florida");
    expect(US_STATES).toContain("Wyoming");
  });

  it("does not contain territories or DC", () => {
    expect(US_STATES).not.toContain("Puerto Rico");
    expect(US_STATES).not.toContain("Washington D.C.");
    expect(US_STATES).not.toContain("Guam");
  });

  it("has no duplicate entries", () => {
    const unique = new Set(US_STATES);
    expect(unique.size).toBe(US_STATES.length);
  });

  it("all entries are non-empty strings", () => {
    for (const state of US_STATES) {
      expect(typeof state).toBe("string");
      expect(state.trim().length).toBeGreaterThan(0);
    }
  });
});

describe("INITIAL_FORM_DATA", () => {
  it("has all required IntakeFormData fields", () => {
    const requiredKeys: (keyof IntakeFormData)[] = [
      "userName",
      "businessName",
      "businessIdea",
      "productOrService",
      "industry",
      "city",
      "county",
      "state",
      "knowsCompetitors",
      "competitors",
      "differentiator",
      "hasLogo",
      "logoFile",
      "hasWebsite",
      "websiteUrl",
      "stage",
      "capitalRange",
    ];
    for (const key of requiredKeys) {
      expect(INITIAL_FORM_DATA).toHaveProperty(key);
    }
  });

  it("initializes string fields as empty strings", () => {
    expect(INITIAL_FORM_DATA.userName).toBe("");
    expect(INITIAL_FORM_DATA.businessName).toBe("");
    expect(INITIAL_FORM_DATA.businessIdea).toBe("");
    expect(INITIAL_FORM_DATA.city).toBe("");
    expect(INITIAL_FORM_DATA.state).toBe("");
  });

  it("initializes boolean fields as false", () => {
    expect(INITIAL_FORM_DATA.knowsCompetitors).toBe(false);
    expect(INITIAL_FORM_DATA.hasLogo).toBe(false);
    expect(INITIAL_FORM_DATA.hasWebsite).toBe(false);
  });

  it("initializes logoFile as null", () => {
    expect(INITIAL_FORM_DATA.logoFile).toBeNull();
  });

  it("initializes productOrService as empty string", () => {
    expect(INITIAL_FORM_DATA.productOrService).toBe("");
  });

  it("initializes stage as empty string", () => {
    expect(INITIAL_FORM_DATA.stage).toBe("");
  });
});
