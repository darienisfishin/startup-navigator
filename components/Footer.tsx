import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-8">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-primary-500 flex items-center justify-center text-white font-bold text-xs">
                L
              </div>
              <span className="text-base font-bold text-primary-900 tracking-tight">
                Launch<span className="text-primary-500">Pilot</span>
              </span>
            </div>
            <p className="text-text-muted text-sm leading-relaxed">
              AI-powered startup navigator. Turn your business idea into a personalized launch plan.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-12">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
                Product
              </h3>
              <ul className="space-y-2">
                {[
                  { label: "How It Works", href: "/#how-it-works" },
                  { label: "Features", href: "/#features" },
                  { label: "Pricing", href: "/#pricing" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-muted hover:text-primary-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
                Legal
              </h3>
              <ul className="space-y-2">
                {[
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms of Service", href: "/terms" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-muted hover:text-primary-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-text-muted text-xs">
            &copy; {new Date().getFullYear()} LaunchPilot. All rights reserved.
          </p>
          <p className="text-text-muted text-xs">
            Planning tool only — not legal, tax, or professional advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
