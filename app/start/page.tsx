import IntakeForm from "@/components/IntakeForm";

export const metadata = {
  title: "Start Your Plan — LaunchPilot",
  description: "Answer a few questions and get a personalized startup roadmap powered by AI.",
};

export default function StartPage() {
  return (
    <section className="py-10 sm:py-14 bg-surface min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-900">
            Build Your Launch Plan
          </h1>
          <p className="mt-2 text-text-muted text-sm max-w-md mx-auto">
            Answer a few questions and we&apos;ll create a personalized roadmap for your business.
          </p>
          <p className="mt-3 text-sm text-text-muted">
            Preview your viability score free.{" "}
            <a href="/pricing" className="text-primary-600 hover:underline font-medium">
              Unlock your full personalized report for just $9.99.
            </a>
          </p>
        </div>
        <IntakeForm />
      </div>

      {/* Input field styles */}
      <style>{`
        .input-field {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border-radius: 0.75rem;
          border: 1.5px solid #e2e8f0;
          font-size: 0.875rem;
          color: #1e293b;
          background: white;
          transition: border-color 0.15s, box-shadow 0.15s;
          outline: none;
        }
        .input-field:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
        .input-field::placeholder {
          color: #94a3b8;
        }
      `}</style>
    </section>
  );
}
