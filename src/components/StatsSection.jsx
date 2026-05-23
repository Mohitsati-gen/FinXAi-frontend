import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 50000, suffix: "K+", label: "Active Users",          prefix: "" },
  { value: 2,     suffix: "B+", label: "Transactions Tracked",  prefix: "$" },
  { value: 99.9,  suffix: "%",  label: "Uptime",                prefix: "" },
  { value: 4.9,   suffix: "/5", label: "User Rating",           prefix: "" },
];

function useCountUp(target, duration = 2000, started = false, decimals = 0) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!started) return;

    let start = null;

    const step = (ts) => {
      if (!start) start = ts;

      const progress = Math.min((ts - start) / duration, 1);

      // ease out
      const eased = 1 - Math.pow(1 - progress, 3);

      setCurrent(parseFloat((eased * target).toFixed(decimals)));

      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [started, target, duration, decimals]);

  return current;
}

function StatItem({ stat, started, index }) {
  const decimals = stat.value % 1 !== 0 ? 1 : 0;

  const count = useCountUp(
    stat.value,
    1800 + index * 200,
    started,
    decimals
  );

  return (
    <div
      className="flex flex-col items-center text-center px-8 py-2"
      style={{
        opacity: started ? 1 : 0,
        transform: started ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.7s ease ${index * 0.12}s, transform 0.7s ease ${index * 0.12}s`,
      }}
    >
      {/* Number */}
      <span
        className="font-bold mb-2 tabular-nums"
        style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: "clamp(2rem, 4vw, 3rem)",
          background: "linear-gradient(135deg, #c57f00, #f5c542)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          lineHeight: 1.1,
          textShadow: "0 0 10px rgba(245,197,66,0.15)",
        }}
      >
        {stat.prefix}
        {decimals > 0 ? count.toFixed(1) : Math.floor(count)}
        {stat.suffix}
      </span>

      {/* Label */}
      <span
        className="text-sm md:text-base font-medium tracking-wide"
        style={{
          color: "rgba(20,20,30,0.82)", // darker text
        }}
      >
        {stat.label}
      </span>
    </div>
  );
}

export default function StatsSection() {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif&family=DM+Sans:wght@400;500;700&display=swap');

        .stats-section {
          font-family: 'DM Sans', sans-serif;
          background: #ffffff;
          position: relative;
          overflow: hidden;
        }

        .stats-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(212,146,10,0.25),
            transparent
          );
        }

        .stats-section::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(212,146,10,0.15),
            transparent
          );
        }

        .stats-divider {
          width: 1px;
          background: linear-gradient(
            180deg,
            transparent,
            rgba(0,0,0,0.12),
            transparent
          );
          align-self: stretch;
          margin: 16px 0;
        }

        .stats-bg-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 200px;
          background: radial-gradient(
            ellipse,
            rgba(212,146,10,0.06) 0%,
            transparent 70%
          );
          pointer-events: none;
        }
      `}</style>

      <section className="stats-section py-16 px-6" ref={ref}>
        <div className="stats-bg-glow" />

        <div
          className="max-w-5xl mx-auto relative"
          style={{
            background: "rgba(250,248,244,0.85)",
            border: "1px solid rgba(212,146,10,0.12)",
            borderRadius: "22px",
            backdropFilter: "blur(10px)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
          }}
        >
          <div className="flex flex-wrap justify-around items-center py-8 px-4">
            {stats.map((stat, i) => (
              <div key={stat.label} className="flex items-center">
                <StatItem stat={stat} started={started} index={i} />

                {i < stats.length - 1 && (
                  <div className="stats-divider hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom label */}
        <p
          className="text-center mt-6 text-xs tracking-widest uppercase"
          style={{
            color: "rgba(20,20,30,0.58)", // brighter & visible
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: "600",
            letterSpacing: "0.18em",
            opacity: started ? 1 : 0,
            transition: "opacity 0.8s ease 0.6s",
          }}
        >
          Trusted by finance-savvy users worldwide
        </p>
      </section>
    </>
  );
}