import { useEffect, useRef, useState } from "react";
import {
  UserPlus,
  ScanLine,
  BarChart2,
  Bell,
  FileText,
} from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create Your Account",
    desc: "Sign up in seconds with your email. Clerk-powered auth keeps your data secure from day one.",
    accent: "#d4920a",
    detail: "Powered by Clerk authentication",
  },
  {
    icon: ScanLine,
    title: "Scan & Add Transactions",
    desc: "Snap a receipt or manually add a transaction. Our AI auto-categorizes everything instantly.",
    accent: "#0ea5e9",
    detail: "AI categorization in under 2s",
  },
  {
    icon: BarChart2,
    title: "Track Your Spending",
    desc: "Watch your spending across all accounts in real-time with beautiful visual breakdowns.",
    accent: "#10b981",
    detail: "Multi-account live dashboard",
  },
  {
    icon: Bell,
    title: "Get Budget Alerts",
    desc: "Set limits per category. FinX AI emails you the moment you approach your spending cap.",
    accent: "#8b5cf6",
    detail: "Email alerts via Inngest",
  },
  {
    icon: FileText,
    title: "Receive Monthly Reports",
    desc: "On the 1st of every month, get a full AI-written report with insights and recommendations.",
    accent: "#ef4444",
    detail: "Delivered to your inbox automatically",
  },
];

export default function HowItWorksSection() {
  const ref = useRef(null);

  const [started, setStarted] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

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
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .hiw2-root {
          background: #fdfcfa;
          position: relative;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        .hiw2-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,0,0,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.022) 1px, transparent 1px);
          background-size: 64px 64px;
          pointer-events: none;
        }

        /* connector */
        .hiw2-line-track {
          position: absolute;
          top: 36px;
          left: calc(10% + 36px);
          right: calc(10% + 36px);
          height: 1px;
          background: rgba(0,0,0,0.10);
          z-index: 0;
        }

        .hiw2-line-fill {
          height: 100%;
          background: linear-gradient(
            90deg,
            #d4920a,
            #f0c040,
            #0ea5e9
          );
          transition: width 3s cubic-bezier(0.4,0,0.2,1) 1s;
        }

        .hiw2-line-dot {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .hiw2-card {
          background: rgba(255,255,255,0.96);
          border: 1px solid rgba(0,0,0,0.09);
          border-radius: 18px;
          padding: 26px 22px 24px;
          transition:
            border-color 0.25s,
            box-shadow 0.25s,
            transform 0.25s;
          position: relative;
          overflow: hidden;
          cursor: default;
          backdrop-filter: blur(10px);
        }

        .hiw2-card:hover {
          transform: translateY(-5px);
        }

        .hiw2-card-shine {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          border-radius: 18px 18px 0 0;
          opacity: 0;
          transition: opacity 0.25s;
        }

        .hiw2-card:hover .hiw2-card-shine {
          opacity: 1;
        }

        @media (max-width: 768px) {
          .hiw2-steps-row {
            flex-direction: column !important;
            align-items: stretch !important;
          }

          .hiw2-line-track {
            display: none;
          }

          .hiw2-step-col {
            max-width: 100% !important;
          }
        }
      `}</style>

      <section
        className="hiw2-root py-24 px-6"
        ref={ref}
        id="how-it-works"
      >
        {/* glow */}
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "400px",
            background:
              "radial-gradient(ellipse 70% 60% at 50% 10%, rgba(212,146,10,0.06), transparent 65%)",
            pointerEvents: "none",
          }}
        />

        <div className="max-w-6xl mx-auto relative">
          {/* heading */}
          <div
            className="text-center mb-20"
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
                padding: "6px 16px",
                borderRadius: "100px",
                border: "1px solid rgba(212,146,10,0.25)",
                background: "rgba(212,146,10,0.08)",
                marginBottom: "24px",
              }}
            >
              <span
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: "#d4920a",
                }}
              />

              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  color: "#a86d05",
                  textTransform: "uppercase",
                }}
              >
                Simple Process
              </span>
            </div>

            {/* title */}
            <h2
              style={{
                fontFamily:
                  "'Cormorant Garamond', serif",
                fontSize:
                  "clamp(2.3rem, 4.5vw, 3.6rem)",
                fontWeight: 600,
                color: "rgba(10,10,18,0.95)", // darker
                lineHeight: 1.08,
                letterSpacing: "-0.015em",
                marginBottom: "18px",
              }}
            >
              How FinX AI works
              <br />
              <span
                style={{
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "rgba(10,10,18,0.98)", // brighter italic
                }}
              >
                in five simple steps
              </span>
            </h2>

            {/* subtitle */}
            <p
              style={{
                fontSize: "1rem",
                fontWeight: 400,
                color: "rgba(20,20,30,0.72)", // brighter text
                maxWidth: "470px",
                margin: "0 auto",
                lineHeight: 1.8,
              }}
            >
              From sign-up to AI monthly report —
              your entire financial life automated
              in under five minutes.
            </p>
          </div>

          {/* steps */}
          <div style={{ position: "relative" }}>
            {/* line */}
            <div className="hiw2-line-track">
              <div
                className="hiw2-line-fill"
                style={{
                  width: started ? "100%" : "0%",
                }}
              />

              {steps.map((s, i) => (
                <div
                  key={i}
                  className="hiw2-line-dot"
                  style={{
                    left: `${
                      (i / (steps.length - 1)) * 100
                    }%`,
                    transform:
                      "translate(-50%, -50%)",
                    background: s.accent,
                    opacity: started ? 1 : 0,
                    transition: `opacity 0.4s ease ${
                      0.3 + i * 0.28
                    }s`,
                    boxShadow: `0 0 0 4px ${s.accent}22`,
                  }}
                />
              ))}
            </div>

            {/* row */}
            <div
              className="hiw2-steps-row"
              style={{
                display: "flex",
                alignItems: "stretch",
                gap: "18px",
                paddingTop: "72px",
              }}
            >
              {steps.map((step, i) => {
                const Icon = step.icon;
                const isHovered = hoveredIndex === i;

                return (
                  <div
                    key={step.title}
                    className="hiw2-step-col"
                    style={{
                      flex: 1,
                      minWidth: 0,
                      opacity: started ? 1 : 0,
                      transform: started
                        ? "translateY(0)"
                        : "translateY(28px)",
                      transition: `opacity 0.65s ease ${
                        i * 0.1 + 0.2
                      }s, transform 0.65s ease ${
                        i * 0.1 + 0.2
                      }s`,
                    }}
                  >
                    <div
                      className="hiw2-card"
                      onMouseEnter={() =>
                        setHoveredIndex(i)
                      }
                      onMouseLeave={() =>
                        setHoveredIndex(null)
                      }
                      style={{
                        borderColor: isHovered
                          ? `${step.accent}40`
                          : "rgba(0,0,0,0.09)",
                        boxShadow: isHovered
                          ? `0 18px 42px ${step.accent}16, 0 2px 8px rgba(0,0,0,0.05)`
                          : "0 2px 8px rgba(0,0,0,0.04)",
                        height: "100%",
                      }}
                    >
                      {/* shine */}
                      <div
                        className="hiw2-card-shine"
                        style={{
                          background: `linear-gradient(90deg, ${step.accent}, ${step.accent}00)`,
                        }}
                      />

                      {/* icon */}
                      <div
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "14px",
                          background: isHovered
                            ? `${step.accent}16`
                            : "rgba(0,0,0,0.05)",
                          border: `1px solid ${
                            isHovered
                              ? step.accent + "32"
                              : "rgba(0,0,0,0.08)"
                          }`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: "20px",
                          transition:
                            "all 0.25s ease",
                        }}
                      >
                        <Icon
                          size={22}
                          style={{
                            color: isHovered
                              ? step.accent
                              : "rgba(20,20,30,0.72)", // darker icon
                            transition:
                              "color 0.25s",
                          }}
                        />
                      </div>

                      {/* title */}
                      <h3
                        style={{
                          fontFamily:
                            "'Cormorant Garamond', serif",
                          fontSize: "1.2rem",
                          fontWeight: 700,
                          color:
                            "rgba(10,10,20,0.96)", // darker
                          marginBottom: "12px",
                          lineHeight: 1.25,
                        }}
                      >
                        {step.title}
                      </h3>

                      {/* desc */}
                      <p
                        style={{
                          fontSize: "0.88rem",
                          fontWeight: 400,
                          color:
                            "rgba(20,20,30,0.72)", // brighter
                          lineHeight: 1.8,
                          marginBottom: "18px",
                        }}
                      >
                        {step.desc}
                      </p>

                      {/* pill */}
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          padding: "5px 12px",
                          borderRadius: "100px",
                          background: `${step.accent}10`,
                          border: `1px solid ${step.accent}30`,
                          fontSize: "0.66rem",
                          fontWeight: 600,
                          color: step.accent,
                          letterSpacing: "0.04em",
                        }}
                      >
                        <span
                          style={{
                            width: "4px",
                            height: "4px",
                            borderRadius: "50%",
                            background: step.accent,
                            flexShrink: 0,
                          }}
                        />
                        {step.detail}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* bottom summary */}
          <div
            style={{
              marginTop: "56px",
              opacity: started ? 1 : 0,
              transform: started
                ? "translateY(0)"
                : "translateY(16px)",
              transition:
                "opacity 0.7s ease 0.75s, transform 0.7s ease 0.75s",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "18px",
                overflow: "hidden",
                border:
                  "1px solid rgba(212,146,10,0.15)",
                background:
                  "linear-gradient(135deg, rgba(253,252,250,0.96), rgba(255,255,255,0.98))",
                flexWrap: "wrap",
                boxShadow:
                  "0 10px 30px rgba(0,0,0,0.03)",
              }}
            >
              {[
                {
                  val: "< 5 min",
                  label: "Setup time",
                  accent: "#d4920a",
                },
                {
                  val: "Zero",
                  label: "Manual entry needed",
                  accent: "#10b981",
                },
                {
                  val: "1st",
                  label: "AI report every month",
                  accent: "#0ea5e9",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    minWidth: "170px",
                    padding: "24px 26px",
                    textAlign: "center",
                    borderRight:
                      i < 2
                        ? "1px solid rgba(0,0,0,0.07)"
                        : "none",
                  }}
                >
                  <div
                    style={{
                      fontFamily:
                        "'Cormorant Garamond', serif",
                      fontSize: "2rem",
                      fontWeight: 700,
                      background: `linear-gradient(135deg, ${item.accent}, ${item.accent}aa)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor:
                        "transparent",
                      backgroundClip: "text",
                      lineHeight: 1.1,
                      marginBottom: "8px",
                    }}
                  >
                    {item.val}
                  </div>

                  <div
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 500,
                      color:
                        "rgba(20,20,30,0.62)", // brighter
                      letterSpacing: "0.04em",
                    }}
                  >
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}