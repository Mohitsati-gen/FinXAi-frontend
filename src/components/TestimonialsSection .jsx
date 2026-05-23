import { useEffect, useRef, useState } from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Arjun Mehta",
    role: "Software Engineer",
    city: "Bangalore",
    avatar: "AM",
    accent: "#d4920a",
    stars: 5,
    text: "FinX AI completely changed how I manage money. The monthly AI report on the 1st is something I genuinely look forward to — it breaks down everything I did wrong and right that month.",
  },
  {
    name: "Priya Sharma",
    role: "Product Designer",
    city: "Mumbai",
    avatar: "PS",
    accent: "#0ea5e9",
    stars: 5,
    text: "The receipt scanner is insane. I just photograph my bills and everything gets categorized perfectly. I haven't typed a single transaction manually in two months.",
  },
  {
    name: "Rohan Verma",
    role: "Startup Founder",
    city: "Delhi",
    avatar: "RV",
    accent: "#10b981",
    stars: 5,
    text: "Budget alerts via email saved me so many times from overspending. I set a ₹5000 limit on dining and FinX actually emails me when I hit 80%. Game changer.",
  },
  {
    name: "Sneha Iyer",
    role: "Data Analyst",
    city: "Hyderabad",
    avatar: "SI",
    accent: "#8b5cf6",
    stars: 5,
    text: "I have four bank accounts and two credit cards. FinX AI tracks everything in one place. The multi-account dashboard is cleaner than anything I've tried before.",
  },
  {
    name: "Kabir Nair",
    role: "Freelance Consultant",
    city: "Pune",
    avatar: "KN",
    accent: "#ef4444",
    stars: 5,
    text: "As a freelancer my income is irregular. The spending analysis helps me see exactly where money goes in lean months. The AI suggestions are actually useful, not generic.",
  },
  {
    name: "Ananya Bose",
    role: "Medical Resident",
    city: "Chennai",
    avatar: "AB",
    accent: "#d4920a",
    stars: 5,
    text: "I barely have time to manage finances during residency. FinX runs everything on autopilot. The recurring transaction detection caught a subscription I forgot I had.",
  },
];

function StarRow({ count, accent }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "4px",
        marginBottom: "16px",
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          size={13}
          fill={accent}
          style={{ color: accent }}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ t, index, started }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: started ? 1 : 0,
        transform: started
          ? "translateY(0)"
          : "translateY(28px)",
        transition: `opacity 0.65s ease ${
          index * 0.09
        }s, transform 0.65s ease ${
          index * 0.09
        }s`,
        breakInside: "avoid",
        marginBottom: "22px",
      }}
    >
      <div
        style={{
          background: hovered
            ? "#ffffff"
            : "rgba(255,255,255,0.9)",
          border: `1px solid ${
            hovered
              ? t.accent + "40"
              : "rgba(0,0,0,0.09)"
          }`,
          borderRadius: "20px",
          padding: "28px 26px",
          boxShadow: hovered
            ? `0 18px 50px ${t.accent}14, 0 2px 10px rgba(0,0,0,0.05)`
            : "0 2px 8px rgba(0,0,0,0.04)",
          transition: "all 0.25s ease",
          position: "relative",
          overflow: "hidden",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: `linear-gradient(90deg, ${t.accent}, ${t.accent}00)`,
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.25s",
            borderRadius: "20px 20px 0 0",
          }}
        />

        {/* quote */}
        <div
          style={{
            position: "absolute",
            top: "18px",
            right: "20px",
            opacity: 0.1,
          }}
        >
          <Quote
            size={40}
            style={{ color: t.accent }}
          />
        </div>

        {/* stars */}
        <StarRow
          count={t.stars}
          accent={t.accent}
        />

        {/* text */}
        <p
          style={{
            fontFamily:
              "'Cormorant Garamond', serif",
            fontSize: "1.1rem",
            fontWeight: 500,
            color: "rgba(10,10,20,0.9)", // darker text
            lineHeight: 1.8,
            marginBottom: "22px",
            fontStyle: "italic",
            letterSpacing: "0.01em",
          }}
        >
          "{t.text}"
        </p>

        {/* divider */}
        <div
          style={{
            height: "1px",
            background: `linear-gradient(90deg, ${t.accent}28, transparent)`,
            marginBottom: "18px",
          }}
        />

        {/* author */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "13px",
          }}
        >
          {/* avatar */}
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${t.accent}22, ${t.accent}44)`,
              border: `1.5px solid ${t.accent}38`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily:
                  "'DM Sans', sans-serif",
                fontSize: "0.72rem",
                fontWeight: 700,
                color: t.accent,
                letterSpacing: "0.04em",
              }}
            >
              {t.avatar}
            </span>
          </div>

          <div>
            {/* name */}
            <div
              style={{
                fontFamily:
                  "'DM Sans', sans-serif",
                fontSize: "0.9rem",
                fontWeight: 700,
                color: "rgba(10,10,20,0.95)", // darker
                letterSpacing: "-0.01em",
              }}
            >
              {t.name}
            </div>

            {/* role */}
            <div
              style={{
                fontFamily:
                  "'DM Sans', sans-serif",
                fontSize: "0.76rem",
                fontWeight: 500,
                color: "rgba(20,20,30,0.62)", // brighter
                marginTop: "2px",
              }}
            >
              {t.role} · {t.city}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
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

  // masonry columns
  const col1 = [testimonials[0], testimonials[3]];
  const col2 = [testimonials[1], testimonials[4]];
  const col3 = [testimonials[2], testimonials[5]];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .testi-root {
          background: #fafaf8;
          position: relative;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        .testi-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px);
          background-size: 64px 64px;
          pointer-events: none;
        }

        .testi-masonry {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
          align-items: start;
        }

        @media (max-width: 900px) {
          .testi-masonry {
            grid-template-columns: repeat(2, 1fr);
          }

          .testi-col:last-child {
            display: none;
          }
        }

        @media (max-width: 580px) {
          .testi-masonry {
            grid-template-columns: 1fr;
          }

          .testi-col:last-child {
            display: block;
          }
        }

        @keyframes pulse-dot {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }

          50% {
            opacity: 0.5;
            transform: scale(0.85);
          }
        }
      `}</style>

      <section
        className="testi-root py-24 px-6"
        ref={ref}
        id="testimonials"
      >
        {/* glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "900px",
            height: "500px",
            background:
              "radial-gradient(ellipse 70% 55% at 50% 5%, rgba(212,146,10,0.06), transparent 65%)",
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
                padding: "6px 16px",
                borderRadius: "100px",
                border:
                  "1px solid rgba(212,146,10,0.25)",
                background:
                  "rgba(212,146,10,0.08)",
                marginBottom: "24px",
              }}
            >
              <span
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: "#d4920a",
                  animation:
                    "pulse-dot 2s ease-in-out infinite",
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
                User Stories
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
                color: "rgba(10,10,18,0.96)", // darker
                lineHeight: 1.08,
                letterSpacing: "-0.015em",
                marginBottom: "18px",
              }}
            >
              Loved by people who take
              <br />
              <span
                style={{
                  fontStyle: "italic",
                  fontWeight: 500,
                  color:
                    "rgba(10,10,18,0.9)", // brighter
                }}
              >
                their finances seriously
              </span>
            </h2>

            {/* subtitle */}
            <p
              style={{
                fontSize: "1rem",
                fontWeight: 400,
                color: "rgba(20,20,30,0.72)", // brighter
                maxWidth: "460px",
                margin: "0 auto",
                lineHeight: 1.8,
              }}
            >
              Real users. Real results. See how
              FinX AI is transforming the way
              India manages money.
            </p>

            {/* rating */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "22px",
                padding: "10px 20px",
                borderRadius: "100px",
                background:
                  "rgba(212,146,10,0.08)",
                border:
                  "1px solid rgba(212,146,10,0.18)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "3px",
                }}
              >
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={13}
                    fill="#d4920a"
                    style={{
                      color: "#d4920a",
                    }}
                  />
                ))}
              </div>

              <span
                style={{
                  fontFamily:
                    "'Cormorant Garamond', serif",
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  color: "#b8780a",
                }}
              >
                4.9
              </span>

              <span
                style={{
                  fontSize: "0.76rem",
                  color:
                    "rgba(20,20,30,0.62)", // brighter
                  fontWeight: 500,
                }}
              >
                from 50,000+ users
              </span>
            </div>
          </div>

          {/* masonry */}
          <div className="testi-masonry">
            {[col1, col2, col3].map((col, ci) => (
              <div key={ci} className="testi-col">
                {col.map((t, i) => (
                  <TestimonialCard
                    key={t.name}
                    t={t}
                    index={ci * 2 + i}
                    started={started}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* bottom trust bar */}
          <div
            style={{
              marginTop: "52px",
              opacity: started ? 1 : 0,
              transition:
                "opacity 0.7s ease 0.8s",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "34px",
                flexWrap: "wrap",
              }}
            >
              {[
                {
                  label: "No fake reviews",
                  dot: "#10b981",
                },
                {
                  label: "Verified users only",
                  dot: "#0ea5e9",
                },
                {
                  label: "Updated monthly",
                  dot: "#d4920a",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      background: item.dot,
                      flexShrink: 0,
                    }}
                  />

                  <span
                    style={{
                      fontSize: "0.76rem",
                      fontWeight: 500,
                      color:
                        "rgba(20,20,30,0.62)", // brighter
                      letterSpacing: "0.04em",
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}