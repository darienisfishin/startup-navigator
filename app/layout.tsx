import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/components/auth/AuthProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-accent",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.launch-pilot.com"),
  title: "LaunchPilot — AI-Powered Startup Navigator",
  description:
    "Turn your business idea into a personalized launch plan. AI analyzes your idea, finds local requirements, discovers competitors, and gives you a step-by-step startup roadmap.",
  openGraph: {
    title: "LaunchPilot — AI-Powered Startup Navigator",
    description:
      "Turn your business idea into a personalized launch plan. AI analyzes your idea, finds local requirements, discovers competitors, and gives you a step-by-step startup roadmap.",
    type: "website",
    url: "https://www.launch-pilot.com",
    images: [{ url: "/og-image.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "LaunchPilot — AI-Powered Startup Navigator",
    description:
      "Turn your business idea into a personalized launch plan. AI analyzes your idea, finds local requirements, discovers competitors, and gives you a step-by-step startup roadmap.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col bg-white">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
