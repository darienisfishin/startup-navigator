import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface WelcomeEmailProps {
  userName?: string;
  startUrl?: string;
}

export function WelcomeEmail({
  userName = "there",
  startUrl = "https://launch-pilot.com/start",
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to LaunchWise — your AI-powered startup navigator is ready</Preview>
      <Body style={body}>
        {/* Header */}
        <Section style={header}>
          <Text style={brandName}>LaunchWise</Text>
          <Text style={brandTagline}>Your startup navigator</Text>
        </Section>

        <Container style={container}>
          <Heading style={h1}>Welcome, {userName}! 👋</Heading>

          <Text style={intro}>
            You're now set up with LaunchWise — the AI-powered tool that turns your business idea
            into a full launch plan in minutes.
          </Text>

          <Section style={featureList}>
            <Text style={featureItem}>
              <span style={featureIcon}>📊</span>
              <strong>Viability Score</strong> — instantly know if your idea has legs
            </Text>
            <Text style={featureItem}>
              <span style={featureIcon}>📋</span>
              <strong>Local Requirements</strong> — licenses, permits, and registrations for your
              state
            </Text>
            <Text style={featureItem}>
              <span style={featureIcon}>🗺️</span>
              <strong>90-Day Roadmap</strong> — a clear action plan from day one
            </Text>
            <Text style={featureItem}>
              <span style={featureIcon}>🏆</span>
              <strong>Competitor Analysis</strong> — know who you're up against
            </Text>
            <Text style={featureItem}>
              <span style={featureIcon}>🎨</span>
              <strong>Branding Feedback</strong> — honest critique of your name and logo
            </Text>
          </Section>

          <Hr style={divider} />

          <Section style={ctaSection}>
            <Text style={ctaHeading}>Ready to launch your first analysis?</Text>
            <Text style={ctaSubtext}>
              It only takes a few minutes. Answer some questions about your idea and we'll generate
              a complete report tailored to your business and location.
            </Text>
            <Button style={ctaButton} href={startUrl}>
              Start My First Report →
            </Button>
          </Section>

          <Hr style={divider} />

          <Text style={disclaimer}>
            LaunchWise is an AI-generated planning tool. Results are meant to guide — not replace
            — legal, tax, or professional business advice.
          </Text>

          <Text style={footer}>
            © {new Date().getFullYear()} LaunchWise · launch-pilot.com
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const body: React.CSSProperties = {
  backgroundColor: "#faf9f7",
  fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  margin: 0,
  padding: 0,
};

const header: React.CSSProperties = {
  backgroundColor: "#4f46e5",
  padding: "24px 32px",
  textAlign: "center",
};

const brandName: React.CSSProperties = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "700",
  margin: "0 0 4px",
  letterSpacing: "-0.5px",
};

const brandTagline: React.CSSProperties = {
  color: "#c7d2fe",
  fontSize: "13px",
  margin: 0,
};

const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  maxWidth: "560px",
  margin: "0 auto",
  padding: "32px 40px",
  borderRadius: "0 0 12px 12px",
  boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
};

const h1: React.CSSProperties = {
  color: "#1e1b4b",
  fontSize: "24px",
  fontWeight: "700",
  margin: "0 0 12px",
  letterSpacing: "-0.3px",
};

const intro: React.CSSProperties = {
  color: "#27272a",
  fontSize: "15px",
  lineHeight: "1.7",
  margin: "0 0 24px",
};

const featureList: React.CSSProperties = {
  backgroundColor: "#eef2ff",
  borderRadius: "12px",
  padding: "20px 24px",
};

const featureItem: React.CSSProperties = {
  color: "#27272a",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "0 0 10px",
  display: "block",
};

const featureIcon: React.CSSProperties = {
  marginRight: "10px",
  fontSize: "16px",
};

const divider: React.CSSProperties = {
  borderColor: "#e7e5e0",
  margin: "28px 0",
};

const ctaSection: React.CSSProperties = {
  textAlign: "center",
};

const ctaHeading: React.CSSProperties = {
  color: "#1e1b4b",
  fontSize: "18px",
  fontWeight: "700",
  margin: "0 0 8px",
};

const ctaSubtext: React.CSSProperties = {
  color: "#71717a",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0 0 20px",
};

const ctaButton: React.CSSProperties = {
  backgroundColor: "#4f46e5",
  borderRadius: "10px",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: "600",
  padding: "13px 32px",
  textDecoration: "none",
  display: "inline-block",
};

const disclaimer: React.CSSProperties = {
  color: "#a1a1aa",
  fontSize: "11px",
  lineHeight: "1.5",
  textAlign: "center",
  margin: "0 0 8px",
};

const footer: React.CSSProperties = {
  color: "#71717a",
  fontSize: "12px",
  textAlign: "center",
  margin: 0,
};
