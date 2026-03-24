"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  INITIAL_FORM_DATA,
  INDUSTRIES,
  CAPITAL_RANGES,
  US_STATES,
  type IntakeFormData,
} from "@/lib/types";
import {
  trackFormStart,
  trackFormComplete,
  trackReportGenerated,
} from "@/lib/analytics";

const STEPS = [
  { id: 1, label: "You" },
  { id: 2, label: "Idea" },
  { id: 3, label: "Location" },
  { id: 4, label: "Competition" },
  { id: 5, label: "Branding" },
  { id: 6, label: "Stage" },
  { id: 7, label: "Review" },
];

export default function IntakeForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<IntakeFormData>(INITIAL_FORM_DATA);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const update = (fields: Partial<IntakeFormData>) =>
    setForm((prev) => ({ ...prev, ...fields }));

  const next = () => {
    if (step === 1) trackFormStart();
    setStep((s) => Math.min(s + 1, 7));
  };
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const canAdvance = (): boolean => {
    switch (step) {
      case 1:
        return form.userName.trim().length > 0;
      case 2:
        return (
          form.businessIdea.trim().length > 10 &&
          form.productOrService !== "" &&
          form.industry !== ""
        );
      case 3:
        return form.city.trim().length > 0 && form.state !== "";
      case 4:
        return true;
      case 5:
        return true;
      case 6:
        return form.stage !== "" && form.capitalRange !== "";
      case 7:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    trackFormComplete();
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Analysis failed");
      const data = await res.json();
      trackReportGenerated();
      sessionStorage.setItem(`report_${data.id}`, JSON.stringify(data));
      router.push(`/report/${data.id}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((s) => (
            <button
              key={s.id}
              onClick={() => s.id < step && setStep(s.id)}
              className={`flex flex-col items-center gap-1 transition-all ${
                s.id === step
                  ? "text-primary-600"
                  : s.id < step
                  ? "text-green-500 cursor-pointer"
                  : "text-gray-300"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  s.id === step
                    ? "bg-primary-500 text-white shadow-sm shadow-primary-200"
                    : s.id < step
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {s.id < step ? (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  s.id
                )}
              </div>
              <span className="text-[11px] font-medium hidden sm:block">{s.label}</span>
            </button>
          ))}
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((step - 1) / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-2xl border border-border shadow-sm p-6 sm:p-8">
        {step === 1 && (
          <StepWrapper
            title="First, what's your name?"
            subtitle="We'll use it to personalize your plan."
          >
            <Field label="Your Name" required>
              <input
                type="text"
                value={form.userName}
                onChange={(e) => update({ userName: e.target.value })}
                placeholder="Enter your full name"
                className="input-field"
                autoFocus
              />
            </Field>
          </StepWrapper>
        )}

        {step === 2 && (
          <StepWrapper
            title="What's your business idea?"
            subtitle="Don't worry about being perfect — just tell us the basics."
          >
            <Field label="Business Name" hint="Skip this if you haven't decided">
              <input
                type="text"
                value={form.businessName}
                onChange={(e) => update({ businessName: e.target.value })}
                placeholder="e.g., Sunny Side Bakery"
                className="input-field"
              />
            </Field>
            <Field label="Describe Your Idea" required>
              <textarea
                value={form.businessIdea}
                onChange={(e) => update({ businessIdea: e.target.value })}
                placeholder="What do you want to build? Who is it for? What problem does it solve? More detail = better results."
                className="input-field min-h-[120px] resize-y"
                rows={4}
              />
            </Field>
            <Field label="Product, service, or both?" required>
              <div className="grid grid-cols-3 gap-2">
                {(["product", "service", "both"] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => update({ productOrService: opt })}
                    className={`px-3 py-2.5 rounded-xl border text-sm font-medium capitalize transition-all ${
                      form.productOrService === opt
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-gray-200 hover:border-gray-300 text-text-muted"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Industry" required>
              <select
                value={form.industry}
                onChange={(e) => update({ industry: e.target.value })}
                className="input-field"
              >
                <option value="">Choose an industry</option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </Field>
          </StepWrapper>
        )}

        {step === 3 && (
          <StepWrapper
            title="Where will you operate?"
            subtitle="This helps us look up local licensing and find nearby competitors."
          >
            <Field label="City" required>
              <input
                type="text"
                value={form.city}
                onChange={(e) => update({ city: e.target.value })}
                placeholder="e.g., Birmingham"
                className="input-field"
                autoFocus
              />
            </Field>
            <Field label="County" hint="Optional but helps with accuracy">
              <input
                type="text"
                value={form.county}
                onChange={(e) => update({ county: e.target.value })}
                placeholder="e.g., Jefferson County"
                className="input-field"
              />
            </Field>
            <Field label="State" required>
              <select
                value={form.state}
                onChange={(e) => update({ state: e.target.value })}
                className="input-field"
              >
                <option value="">Choose your state</option>
                {US_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </Field>
          </StepWrapper>
        )}

        {step === 4 && (
          <StepWrapper
            title="Do you know your competition?"
            subtitle="It's okay if you don't — we'll still research them for you."
          >
            <Field label="Know any competitors nearby?">
              <div className="flex gap-2">
                {[true, false].map((val) => (
                  <button
                    key={String(val)}
                    onClick={() => update({ knowsCompetitors: val })}
                    className={`flex-1 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      form.knowsCompetitors === val
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-gray-200 hover:border-gray-300 text-text-muted"
                    }`}
                  >
                    {val ? "Yes" : "Not yet"}
                  </button>
                ))}
              </div>
            </Field>
            {form.knowsCompetitors && (
              <Field label="List them" hint="Separate with commas">
                <textarea
                  value={form.competitors}
                  onChange={(e) => update({ competitors: e.target.value })}
                  placeholder="e.g., Joe's Bakery, Sweet Treats LLC"
                  className="input-field min-h-[80px] resize-y"
                  rows={2}
                />
              </Field>
            )}
            <Field label="What makes your idea different?" hint="Your edge">
              <textarea
                value={form.differentiator}
                onChange={(e) => update({ differentiator: e.target.value })}
                placeholder="What will you do differently or better than what's already out there?"
                className="input-field min-h-[80px] resize-y"
                rows={2}
              />
            </Field>
          </StepWrapper>
        )}

        {step === 5 && (
          <StepWrapper
            title="Let's talk branding"
            subtitle="We'll give you honest feedback on your name and logo."
          >
            <Field label="Do you have a logo?">
              <div className="flex gap-2">
                {[true, false].map((val) => (
                  <button
                    key={String(val)}
                    onClick={() => update({ hasLogo: val })}
                    className={`flex-1 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      form.hasLogo === val
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-gray-200 hover:border-gray-300 text-text-muted"
                    }`}
                  >
                    {val ? "Yes" : "Not yet"}
                  </button>
                ))}
              </div>
            </Field>
            {form.hasLogo && (
              <Field label="Upload it" hint="PNG, JPG, or SVG">
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-primary-300 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      update({ logoFile: file });
                    }}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label htmlFor="logo-upload" className="cursor-pointer">
                    <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-text-muted">
                      {form.logoFile ? (
                        <span className="text-green-600 font-medium">{form.logoFile.name}</span>
                      ) : (
                        "Click to upload"
                      )}
                    </p>
                  </label>
                </div>
              </Field>
            )}
            <Field label="Do you have a website?">
              <div className="flex gap-2">
                {[true, false].map((val) => (
                  <button
                    key={String(val)}
                    onClick={() => update({ hasWebsite: val })}
                    className={`flex-1 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      form.hasWebsite === val
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-gray-200 hover:border-gray-300 text-text-muted"
                    }`}
                  >
                    {val ? "Yes" : "Not yet"}
                  </button>
                ))}
              </div>
            </Field>
            {form.hasWebsite && (
              <Field label="Website URL">
                <input
                  type="url"
                  value={form.websiteUrl}
                  onChange={(e) => update({ websiteUrl: e.target.value })}
                  placeholder="https://www.example.com"
                  className="input-field"
                />
              </Field>
            )}
          </StepWrapper>
        )}

        {step === 6 && (
          <StepWrapper
            title="Where are you in the process?"
            subtitle="This helps us tailor the roadmap to where you are right now."
          >
            <Field label="Current Stage" required>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { val: "idea" as const, label: "Just an Idea" },
                  { val: "planning" as const, label: "Planning" },
                  { val: "started" as const, label: "Already Started" },
                ]).map((opt) => (
                  <button
                    key={opt.val}
                    onClick={() => update({ stage: opt.val })}
                    className={`px-3 py-3 rounded-xl border text-sm font-medium text-center transition-all ${
                      form.stage === opt.val
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-gray-200 hover:border-gray-300 text-text-muted"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="How much capital do you have?" required>
              <select
                value={form.capitalRange}
                onChange={(e) => update({ capitalRange: e.target.value })}
                className="input-field"
              >
                <option value="">Select a range</option>
                {CAPITAL_RANGES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </Field>
          </StepWrapper>
        )}

        {step === 7 && (
          <StepWrapper
            title="Looking good — ready to go?"
            subtitle="Double-check your info, then hit the button below."
          >
            <div className="space-y-3">
              <ReviewItem label="Name" value={form.userName} />
              <ReviewItem label="Business" value={form.businessName || "Not decided yet"} />
              <ReviewItem label="Idea" value={form.businessIdea} />
              <ReviewItem label="Type" value={form.productOrService} />
              <ReviewItem label="Industry" value={form.industry} />
              <ReviewItem label="Location" value={`${form.city}${form.county ? `, ${form.county}` : ""}, ${form.state}`} />
              <ReviewItem label="Edge" value={form.differentiator || "Not specified"} />
              <ReviewItem label="Stage" value={form.stage} />
              <ReviewItem label="Capital" value={form.capitalRange} />
              {form.hasLogo && <ReviewItem label="Logo" value="Uploaded" />}
              {form.hasWebsite && <ReviewItem label="Website" value={form.websiteUrl} />}
            </div>
          </StepWrapper>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100">
          {step > 1 ? (
            <button
              onClick={prev}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-text-muted hover:text-text hover:bg-surface transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          ) : (
            <div />
          )}
          {step < 7 ? (
            <button
              onClick={next}
              disabled={!canAdvance()}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white text-sm font-bold hover:bg-primary-700 transition-colors disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  Generate My Plan
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Sub-components

function StepWrapper({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-bold text-primary-900">{title}</h2>
      <p className="text-text-muted text-sm mt-1 mb-6">{subtitle}</p>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-primary-900 mb-1.5">
        {label}
        {required && <span className="text-accent-500 ml-0.5">*</span>}
        {hint && <span className="font-normal text-text-muted ml-1.5 text-xs">({hint})</span>}
      </label>
      {children}
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-xs font-medium text-text-muted w-20 flex-shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-primary-900 capitalize">{value}</span>
    </div>
  );
}
