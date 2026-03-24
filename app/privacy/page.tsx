export const metadata = {
  title: "Privacy Policy — LaunchPilot",
};

export default function PrivacyPage() {
  return (
    <section className="py-16 bg-white min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-primary-900 mb-2">Privacy Policy</h1>
        <p className="text-text-muted text-sm mb-8">Last updated: March 20, 2026</p>

        <div className="prose prose-sm max-w-none space-y-6 text-text">
          <div>
            <h2 className="text-lg font-bold text-primary-900 mb-2">What We Collect</h2>
            <p className="text-sm leading-relaxed text-text-muted">
              When you use LaunchPilot, we collect the information you enter into the questionnaire — your name, business idea description, location, industry, and branding details. If you provide an email address, we collect that as well.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-primary-900 mb-2">How We Use Your Data</h2>
            <p className="text-sm leading-relaxed text-text-muted">
              Your questionnaire responses are sent to our AI analysis engine to generate your personalized launch plan. If you provide an email address, we use it solely to send you your report. We do not sell, share, or distribute your data to third parties for marketing purposes.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-primary-900 mb-2">Data Storage & Security</h2>
            <p className="text-sm leading-relaxed text-text-muted">
              Your questionnaire inputs are processed in real-time and are not permanently stored on our servers. Report data is stored temporarily in your browser session and is not accessible to us or any third party. All data transmission is encrypted via HTTPS.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-primary-900 mb-2">Your Business Ideas</h2>
            <p className="text-sm leading-relaxed text-text-muted">
              We understand your business idea may be confidential. Your idea stays yours. We do not store, review, or share your business concepts. Our AI processes your inputs to generate your report and does not retain them afterward.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-primary-900 mb-2">Cookies & Analytics</h2>
            <p className="text-sm leading-relaxed text-text-muted">
              We may use basic analytics to understand how our site is used (e.g., page views, feature usage). We do not use advertising cookies or tracking pixels. We do not build user profiles for advertising purposes.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-primary-900 mb-2">Third-Party Services</h2>
            <p className="text-sm leading-relaxed text-text-muted">
              We use Anthropic&apos;s Claude AI to power our analysis engine. Your inputs are sent to Anthropic&apos;s API for processing. Anthropic does not use API inputs for model training. See Anthropic&apos;s privacy policy for more details.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-primary-900 mb-2">Contact</h2>
            <p className="text-sm leading-relaxed text-text-muted">
              If you have questions about this privacy policy or your data, contact us at privacy@launch-pilot.com.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
