import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useUser } from "@clerk/clerk-react";

export default function HeroSection() {
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const trackRef = useRef(null);
  const realIndex = useRef(0);
  const { isSignedIn } = useUser();

  const words = ["Expenses", "Budgets", "Receipts", "Accounts", "Finances"];
  const looped = [...words, ...words, ...words];
  const OFFSET = words.length;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setIndex(OFFSET);
    realIndex.current = OFFSET;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      realIndex.current += 1;
      setIndex(realIndex.current);

      if (realIndex.current >= words.length * 2) {
        setTimeout(() => {
          if (trackRef.current) trackRef.current.style.transition = "none";
          realIndex.current = words.length;
          setIndex(words.length);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              if (trackRef.current)
                trackRef.current.style.transition =
                  "transform 0.55s cubic-bezier(0.77,0,0.18,1)";
            });
          });
        }, 580);
      }
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        .hs-root  { font-family: 'DM Sans', sans-serif; }
        .hs-serif { font-family: 'Instrument Serif', serif; }

        /* ── LIGHT BACKGROUND ── */
        .hs-bg {
          background:
            radial-gradient(ellipse 80% 50% at 50% -5%,  rgba(212,146,10,0.08)  0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 5%  80%,  rgba(212,146,10,0.05)  0%, transparent 55%),
            radial-gradient(ellipse 40% 35% at 95% 70%,  rgba(180,200,255,0.06) 0%, transparent 55%),
            #f9f7f4;
        }

        .hs-grid {
          background-image:
            linear-gradient(rgba(180,150,80,0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(180,150,80,0.055) 1px, transparent 1px);
          background-size: 68px 68px;
        }

        .fu { opacity:0; transform:translateY(22px); transition: opacity 0.8s ease, transform 0.8s ease; }
        .fu.in { opacity:1; transform:translateY(0); }

        .gtext {
          background: linear-gradient(125deg, #b8720a 0%, #d4920a 45%, #e8a820 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: inline-block;
        }

        /* ── TICKER ── */
        .ticker-outer {
          display: inline-flex;
          align-items: baseline;
          overflow: hidden;
          vertical-align: baseline;
          height: 1.08em;
          position: relative;
          /* fluid width: enough for longest word at every font size */
          min-width: 3.2em;
          max-width: 100%;
        }

        .ticker-track {
          display: flex;
          flex-direction: column;
          transition: transform 0.55s cubic-bezier(0.77,0,0.18,1);
          will-change: transform;
        }

        .ticker-word {
          height: 1.08em;
          line-height: 1.08em;
          display: flex;
          align-items: center;
          white-space: nowrap;
          flex-shrink: 0;
        }

/* HEADLINE */
.hs-headline {
  font-size: clamp(2rem, 6.5vw, 5.4rem);
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: rgba(20,15,5,0.95);   /* was 0.88 */
}

/* second line */
<em style={{ fontStyle:"italic", color:"rgba(20,15,5,0.82)" }}>

        /* first line: allow wrap so ticker stays with text */
        .hs-line1 {
          display: block;
          /* on small screens wrap is fine */
          white-space: normal;
          word-break: normal;
        }

        /* on md+ keep it on one line */
        @media (min-width: 640px) {
          .hs-line1 { white-space: nowrap; }
          .hs-root {
    justify-content: flex-start;
  }
    .hs-headline {
    margin-top: 10px;
  }

  .ticker-outer {
    min-width: 2.8em;
  }
        }

        .bdot { animation: bdotAnim 2s ease-in-out infinite; }
        @keyframes bdotAnim {
          0%,100% { box-shadow: 0 0 0 0 rgba(212,146,10,0.6); }
          50%      { box-shadow: 0 0 0 6px rgba(212,146,10,0); }
        }

        .orb1 { animation: d1 15s ease-in-out infinite alternate; }
        .orb2 { animation: d2 19s ease-in-out infinite alternate; }
        .orb3 { animation: d3 22s ease-in-out infinite alternate; }
        @keyframes d1 { to { transform: translate(35px,28px);  } }
        @keyframes d2 { to { transform: translate(-28px,22px); } }
        @keyframes d3 { to { transform: translate(22px,-32px); } }

        .shimmer-line { position:relative; overflow:hidden; }
        .shimmer-line::after {
          content:''; position:absolute; top:0; left:-100%;
          width:55%; height:100%;
          background: linear-gradient(90deg, transparent, rgba(212,146,10,0.4), transparent);
          animation: shimmer 4s ease-in-out infinite;
        }
        @keyframes shimmer { to { left:140%; } }

        .btn-primary {
          background: linear-gradient(135deg, #b8720a, #d4920a);
          color: #fff;
          transition: transform 0.22s, box-shadow 0.22s;
        }
        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 40px rgba(180,110,10,0.3), 0 0 0 1px rgba(212,146,10,0.3);
        }

        /* outline button */
.btn-outline {
  border: 1px solid rgba(20,15,5,0.18);
  color: rgba(20,15,5,0.72);   /* was 0.55 */
  transition: all 0.22s;
}
        .btn-outline:hover {
          border-color: rgba(20,15,5,0.3);
          background: rgba(20,15,5,0.04);
          transform: translateY(-2px);
          color: rgba(20,15,5,0.8);
        }

        /* floating cards */
        .card-float {
          backdrop-filter: blur(16px);
          border: 1px solid rgba(180,140,60,0.15);
          background: rgba(255,255,255,0.72);
          box-shadow: 0 4px 24px rgba(160,120,20,0.08);
        }
        .card-left  { animation: floatL 6s ease-in-out infinite; }
        .card-right { animation: floatR 7.5s ease-in-out infinite; }
        @keyframes floatL { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-30px)} }
        @keyframes floatR { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-30px)} }

        .sparkle { animation: spk 3s ease-in-out infinite ; }
        @keyframes spk {
          0%,100% { opacity:0.4;  transform:scale(1)    rotate(0deg);  }
          50%      { opacity:1;   transform:scale(1.35) rotate(18deg); }
        }

        .scroll-hint { animation: sb 2.4s ease-in-out infinite; }
        @keyframes sb {
          0%,100% { transform:translateY(0);   opacity:0.25; }
          50%      { transform:translateY(7px); opacity:0.7;  }
        }

        .noise {
          pointer-events:none; position:absolute; inset:0; opacity:0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }

       /* trust pills */
.trust-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.88rem;
  font-weight: 400;
  color: rgba(20,15,5,0.75);   /* was 0.38 */
}
        .trust-divider {
          width: 1px; height: 12px;
          background: rgba(20,15,5,0.1);
          margin-left: 12px;
        }

        /* sub text */
.hs-sub {
  font-size: clamp(0.9rem, 2vw, 1.05rem);
  color: rgba(20,15,5,0.62);   /* was 0.45 */
  line-height: 1.7;
  font-weight: 300;
}
      `}</style>

<section className="hs-root hs-bg relative w-full min-h-[80svh] flex flex-col items-center overflow-hidden px-5 sm:px-8 pt-[110px] sm:pt-[130px] pb-10 sm:pb-16">        <div className="noise" />
        <div className="hs-grid absolute inset-0 pointer-events-none" />

        {/* top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-72 pointer-events-none"
          style={{ background:"radial-gradient(ellipse 80% 100% at 50% 0%, rgba(212,146,10,0.07) 0%, transparent 70%)" }} />

        {/* ambient orbs */}
        <div className="orb1 absolute top-[6%] left-[3%] w-64 h-64 rounded-full pointer-events-none opacity-40"
          style={{ background:"rgba(212,146,10,0.1)", filter:"blur(72px)" }} />
        <div className="orb2 absolute bottom-[10%] right-[4%] w-80 h-80 rounded-full pointer-events-none opacity-30"
          style={{ background:"rgba(180,200,220,0.18)", filter:"blur(80px)" }} />
        <div className="orb3 absolute top-[45%] right-[10%] w-48 h-48 rounded-full pointer-events-none opacity-20"
          style={{ background:"rgba(200,180,120,0.15)", filter:"blur(60px)" }} />

        {/* floating card LEFT — xl only */}
        <div className={`card-float card-left absolute left-[1.5%] top-1/2 -translate-y-1/2 rounded-2xl px-6 py-5 hidden xl:block fu ${visible?"in":""}`}
          style={{ transitionDelay:"900ms" }}>
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
              style={{ background:"linear-gradient(135deg,#d4920a,#f0c040)" }}>💳</div>
            <span className="text-[0.68rem] font-medium tracking-wide" style={{ color:"rgba(20,15,5,0.99)" }}>Monthly Saved</span>
          </div>
          <div className="hs-serif text-2xl mb-1" style={{ color:"rgba(20,15,5,0.99)" }}>₹12,400</div>
          <div className="text-[0.63rem] flex items-center gap-1" style={{ color:"#16a34a" }}>
            ↑ <span>18% vs last month</span>
          </div>
        </div>

        {/* floating card RIGHT — xl only */}
        <div className={`card-float card-right absolute right-[1.5%] top-[36%] rounded-2xl  px-6 py-5 hidden xl:block fu ${visible?"in":""}`}
          style={{ transitionDelay:"1050ms" }}>
          <div className="flex items-center gap-2 mb-2.5">
            <span className="text-sm">🧾</span>
            <span className="text-[0.68rem] font-medium tracking-wide" style={{ color:"rgba(20,15,5,0.99)" }}>AI Scanned</span>
          </div>
          <div className="text-[0.78rem] font-medium mb-2" style={{ color:"rgba(20,15,5,0.99)" }}>Zomato · ₹340</div>
          <span className="px-2.5 py-1 rounded-full text-[0.6rem] font-semibold"
            style={{ background:"rgba(212,146,10,0.12)", color:"#b8720a" }}>
            🍽 Food & Dining
          </span>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center mt-4 sm:mt-0">

          {/* badge */}
          <div className={`fu ${visible?"in":""} mb-8`} style={{ transitionDelay:"0ms" }}>
            <div className="shimmer-line inline-flex items-center gap-2.5 px-5 py-2 rounded-full"
              style={{ border:"1px solid rgba(212,146,10,0.85)", background:"rgba(212,146,10,0.06)" }}>
              <span className="bdot w-2 h-2 rounded-full block flex-shrink-0" style={{ background:"#d4920a" }} />
              <span className="text-[0.88rem] font-medium tracking-widest uppercase" style={{ color:"#b8720a" }}>
                AI-Powered Finance Intelligence
              </span>
              <span className="sparkle text-sm  " style={{ color:"#d4920a" }}>✦</span>
            </div>
          </div>

          {/* HEADLINE */}
          <h1 className={`hs-serif hs-headline fu ${visible?"in":""} w-full mb-6`}
            style={{ transitionDelay:"130ms" }}>

            {/* line 1 — on mobile wraps naturally, on sm+ stays nowrap */}
            <span className="hs-line1">
              Take control of your{" "}
              <span className="ticker-outer">
                <span
                  ref={trackRef}
                  className="ticker-track"
                  style={{ transform:`translateY(calc(-${index} * 1.08em))` }}
                >
                  {looped.map((w, i) => (
                    <span key={i} className="ticker-word gtext hs-serif">{w}</span>
                  ))}
                </span>
              </span>
            </span>

            {/* line 2 */}
            <span style={{ display:"block" }}>
              <em style={{ fontStyle:"italic", color:"rgba(20,15,5,0.9)" }}>with intelligence</em>
            </span>
          </h1>

          {/* subheading */}
          <p className={`hs-sub fu ${visible?"in":""} mb-9 max-w-lg`}
            style={{ transitionDelay:"260ms" }}>
            Track spending across every account, scan receipts instantly,
            manage budgets smarter — and receive AI-powered monthly reports
            on the 1st of every month.
          </p>

          {/* CTAs */}
          <div className={`fu ${visible?"in":""} flex gap-3 flex-wrap justify-center mb-9`}
            style={{ transitionDelay:"380ms" }}>
            
            <Link to={ isSignedIn ?  "/transaction/add" : "/sign-in"}>
            <button   className="btn-primary px-8 py-3.5 rounded-xl text-sm font-semibold cursor-pointer border-0">
              Get Started Free
            </button>
            </Link>
          <a
  href="#how-it-works"
>  
            <button className="btn-outline px-8 py-3.5 rounded-xl text-sm font-normal bg-transparent cursor-pointer">
              
  See How it Works

            </button>
            </a>
          </div>

          {/* trust pills */}
          <div className={`fu ${visible?"in":""} flex items-center gap-4 flex-wrap justify-center`}
            style={{ transitionDelay:"490ms" }}>
            {["No credit card", "Free forever plan", "AI-powered insights"].map((txt, i) => (
              <span key={i} className="trust-pill">
                <span style={{ color:"#b8720a" }}>✓</span>
                {txt}
                {i < 2 && <span className="trust-divider" />}
              </span>
            ))}
          </div>

        </div>

        {/* scroll hint */}
        <div className="hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5">
          <span className="text-[0.55rem] tracking-widest uppercase" style={{ color:"rgba(20,15,5,0.2)" }}>scroll</span>
          <div className="scroll-hint w-px h-6" style={{ background:"linear-gradient(to bottom, rgba(20,15,5,0.18), transparent)" }} />
        </div>

      </section>
    </>
  );
}