import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-amber-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-primary-900 mb-3">
          Payment cancelled
        </h1>
        <p className="text-text-muted mb-8">
          No worries — you haven&apos;t been charged. Whenever you&apos;re
          ready, your report is waiting.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors shadow-sm shadow-primary-200"
          >
            Back to Pricing
          </Link>
          <Link
            href="/start"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border text-text-muted font-medium hover:bg-surface transition-colors"
          >
            Try Free Version
          </Link>
        </div>
      </div>
    </div>
  );
}
