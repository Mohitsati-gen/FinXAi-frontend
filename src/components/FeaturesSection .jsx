import { useEffect, useRef, useState } from "react";
import {
  BarChart2,
  ScanLine,
  Target,
  CreditCard,
  Globe,
  Zap,
  Bell,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: BarChart2,
    title: "Advanced Analytics",
    desc: "Get detailed AI-powered insights into your spending patterns with beautiful visual breakdowns every month.",
    accent: "#d4920a",
  },
  {
    icon: ScanLine,
    title: "Smart Receipt Scanner",
    desc: "Snap a photo of any receipt and our AI auto-categorizes it in under 2 seconds. Zero manual entry.",
    accent: "#0ea5e9",
  },
  {
    icon: Target,
    title: "Budget Planning",
    desc: "Set smart budgets per category. Get email alerts before you overspend — never blow a limit again.",
    accent: "#10b981",
  },
  {
    icon: CreditCard,
    title: "Multi-Account Support",
    desc: "Connect and track all your bank accounts, credit cards, and wallets in one unified dashboard.",
    accent: "#8b5cf6",
  },
  {
    icon: Globe,
    title: "Multi-Currency",
    desc: "Full support for multiple currencies with live conversion rates. Perfect for frequent travellers.",
    accent: "#f59e0b",
  },
  {
    icon: Zap,
    title: "Recurring Transactions",
    desc: "Auto-detect subscriptions and recurring bills. Never miss a charge or forget a renewal date.",
    accent: "#ef4444",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    desc: "Proactive email notifications when you're approaching budget limits — powered by Inngest workflows.",
    accent: "#d4920a",
  },
  {
    icon: TrendingUp,
    title: "Monthly AI Reports",
    desc: "On the 1st of every month, receive a full AI-written financial report with personalised insights.",
    accent: "#0ea5e9",
  },
];

function FeatureCard({ feature, index, started }) {
  const [hovered, setHovered] = useState(false);
  const Icon = feature.icon;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: started ? 1 : 0,
        transform: started ? "translateY(0)" : "translateY(28px)",
        background: hovered ? "#ffffff" : "rgba(255,255,255,0.82)",
        border: `1px solid ${
          hovered
            ? feature.accent + "40"
            : "rgba(0,0,0,0.10)"
        }`,
        borderRadius: "18px",
        padding: "30px 28px",
        cursor: "default",
        boxShadow: hovered
          ? `0 14px 40px ${feature.accent}18, 0 2px 10px rgba(0,0,0,0.06)`
          : "0 2px 8px rgba(0,0,0,0.04)",
        transition: `
          opacity 0.65s ease ${index * 0.07}s,
          transform 0.65s ease ${index * 0.07}s,
          border-color 0.25s ease,
          box-shadow 0.25s ease,
          background 0.25s ease
        `,
        position: "relative",
        overflow: "hidden",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* top accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: `linear-gradient(90deg, ${feature.accent}, ${feature.accent}00)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.25s ease",
          borderRadius: "18px 18px 0 0",
        }}
      />

      {/* icon */}
      <div
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "14px",
          background: hovered
            ? feature.accent + "18"
            : "rgba(0,0,0,0.05)",
          border: `1px solid ${
            hovered
              ? feature.accent + "35"
              : "rgba(0,0,0,0.08)"
          }`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
          transition: "all 0.25s ease",
        }}
      >
        <Icon
          size={21}
          style={{
            color: hovered
              ? feature.accent
              : "rgba(20,20,30,0.72)", // darker icon
            transition: "color 0.25s ease",
          }}
        />
      </div>

      {/* title */}
      <h3
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "1rem",
          fontWeight: 700,
          color: "rgba(10,10,20,0.95)", // darker title
          marginBottom: "12px",
          letterSpacing: "-0.015em",
        }}
      >
        {feature.title}
      </h3>

      {/* desc */}
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.9rem",
          fontWeight: 400,
          color: "rgba(20,20,30,0.72)", // brighter description
          lineHeight: 1.75,
          margin: 0,
        }}
      >
        {feature.desc}
      </p>
    </div>
  );
}

export default function FeaturesSection() {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setStarted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) obs.observe(ref.current);

    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .feat-section {
          background: #fafaf8;
          position: relative;
          overflow: hidden;
        }

        .feat-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
          background-size: 56px 56px;
          pointer-events: none;
        }

        .feat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 22px;
        }

        @media (max-width: 640px) {
          .feat-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <section
        className="feat-section py-24 px-6"
        ref={ref}
        id="features"
      >
        {/* top glow */}
        <div
          style={{
            position: "absolute",
            top: "-60px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "700px",
            height: "300px",
            background:
              "radial-gradient(ellipse, rgba(212,146,10,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="max-w-6xl mx-auto relative">
          {/* heading */}
          <div
            className="text-center mb-16"
            style={{
              opacity: started ? 1 : 0,
              transform: started
                ? "translateY(0)"
                : "translateY(20px)",
              transition:
                "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            {/* badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 15px",
                borderRadius: "100px",
                border: "1px solid rgba(212,146,10,0.24)",
                background: "rgba(212,146,10,0.08)",
                marginBottom: "22px",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#d4920a",
                  flexShrink: 0,
                }}
              />

              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  color: "#a96f06",
                  textTransform: "uppercase",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                What FinX AI Offers
              </span>
            </div>

            {/* heading */}
            <h2
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: "clamp(2rem, 4vw, 3.2rem)",
                fontWeight: 400,
                color: "rgba(10,10,20,0.95)",
                lineHeight: 1.12,
                letterSpacing: "-0.025em",
                marginBottom: "16px",
              }}
            >
              Everything you need to manage
              <br />
              <em
                style={{
                  fontStyle: "italic",
                  color: "rgba(10,10,20,0.82)",
                }}
              >
                your finances
              </em>
            </h2>

            {/* subtitle */}
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "1rem",
                fontWeight: 400,
                color: "rgba(20,20,30,0.72)", // brighter subtitle
                maxWidth: "520px",
                margin: "0 auto",
                lineHeight: 1.8,
              }}
            >
              From receipt scanning to AI monthly reports —
              FinX AI handles every corner of your financial
              life automatically.
            </p>
          </div>

          {/* grid */}
          <div className="feat-grid">
            {features.map((f, i) => (
              <FeatureCard
                key={f.title}
                feature={f}
                index={i}
                started={started}
              />
            ))}
          </div>

          {/* footer text */}
          <div
            className="text-center mt-14"
            style={{
              opacity: started ? 1 : 0,
              transition: "opacity 0.7s ease 0.6s",
            }}
          >
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.84rem",
                fontWeight: 500,
                color: "rgba(20,20,30,0.58)", // brighter footer
                letterSpacing: "0.05em",
              }}
            >
              All features included in the free plan · No
              credit card required
            </p>
          </div>
        </div>
      </section>
    </>
  );
}