import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { PenBox, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        .btn-add-tx {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #1a1a1a, #2e2e2e);
          font-size: 0.82rem;
          font-weight: 500;
          color: #fff;
          cursor: pointer;
          transition: all 0.22s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.18);
          white-space: nowrap;
        }
        .btn-add-tx:hover {
          background: linear-gradient(135deg, #d4920a, #f0c040);
          box-shadow: 0 6px 20px rgba(212,146,10,0.32);
          transform: translateY(-1px);
          color: #0a0a0a;
        }

        .btn-dashboard {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 10px;
          border: 1px solid rgba(0,0,0,0.12);
          background: #fff;
          font-size: 0.82rem;
          font-weight: 500;
          color: rgba(15,10,2,0.75);
          cursor: pointer;
          transition: all 0.22s;
          white-space: nowrap;
        }
        .btn-dashboard:hover {
          border-color: #d4920a;
          color: #d4920a;
          box-shadow: 0 4px 14px rgba(212,146,10,0.15);
          transform: translateY(-1px);
        }

        .fnx-link {
          font-size: 0.875rem;
          font-weight: 500;
          color: rgba(30,20,5,0.5);
          text-decoration: none;
          position: relative;
          padding-bottom: 2px;
          transition: color 0.2s;
        }
        .fnx-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1.5px;
          background: linear-gradient(90deg, #d4920a, #f0c040);
          transition: width 0.25s ease;
          border-radius: 2px;
        }
        .fnx-link:hover { color: rgba(30,20,5,0.9); }
        .fnx-link:hover::after { width: 100%; }

        .glass-navbar {
          background: rgba(255,255,255,0.62);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(180,140,60,0.12);
          box-shadow: 0 8px 30px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.4);
          transition: all 0.3s ease;
        }
        .glass-navbar.scrolled {
          background: rgba(249,247,244,0.88);
          box-shadow: 0 10px 35px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.5);
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* ── Mobile ── */
        @media (max-width: 480px) {
          .btn-add-tx,
          .btn-dashboard {
    padding: 5px 8px;
    font-size: 0.7rem;
    gap: 4px;
    /* let buttons shrink if needed */
    flex-shrink: 1;
    min-width: 0;
  }
          .nav-right {
            gap: 5px;
          }
          .nav-logo {
            height: 32px !important;
          }
        }
      `}</style>

      <header
        className={`fixed top-0 w-full z-50 glass-navbar ${scrolled ? "scrolled" : ""}`}
      >
        <nav className="px-4 sm:px-8 sm:pl-14 mx-auto py-3 sm:py-4 flex items-center justify-between">

          {/* LOGO */}
          <Link to="/" className="flex-shrink-0">
            <img
              src="/finxai-luxury.png"
              alt="FinX AI Logo"
              className="nav-logo w-auto object-contain"
              style={{ height: "48px" }}
            />
          </Link>

          {/* CENTER LINKS — desktop only */}
          <div className="hidden md:flex items-center space-x-8">
            <SignedOut>
              <a href="#features" className="fnx-link">Features</a>
              <a href="#how-it-works" className="fnx-link">How It Works</a>
              <a href="#testimonials" className="fnx-link">Testimonials</a>
            </SignedOut>
          </div>

          {/* RIGHT SIDE */}
          <div className="nav-right">

            <SignedIn>

              {/* DASHBOARD */}
              <Link to="/dashboard">
                <button className="btn-dashboard">
                  <LayoutDashboard size={15} />
                  <span>Dashboard</span>
                </button>
              </Link>

              {/* ADD TRANSACTION */}
              <Link to="/transaction/add">
                <button className="btn-add-tx">
                  <PenBox size={15} />
                  <span>Add Transaction</span>
                </button>
              </Link>

            </SignedIn>

            {/* LOGIN */}
            <SignedOut>
              <Link to="/sign-in">
                <Button variant="outline">Login</Button>
              </Link>
            </SignedOut>

            {/* USER AVATAR */}
           <SignedIn>
  <div style={{ flexShrink: 0 }}>
    <UserButton
      appearance={{
        elements: { avatarBox: "w-9 h-9 sm:w-10 sm:h-10" },
      }}
    />
  </div>
</SignedIn>

          </div>

        </nav>
      </header>
    </>
  );
};

export default Header;