import React from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      href: "https://github.com/Mohitsati-gen",
      title: "GitHub",
      icon: <Github size={15} />,
    },
    {
      href: "https://www.linkedin.com/in/mohit-sati-061291313/",
      title: "LinkedIn",
      icon: <Linkedin size={15} />,
    },
    {
      href: "mailto:mohitsati583@gmail.com",
      title: "Email",
      icon: <Mail size={15} />,
    },
  ];

  return (
    <>
      <style>{`
        .finx-footer {
          background: #0a0a0a;
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 64px 0 32px;
          font-family: 'DM Sans', sans-serif;
        }
        .finx-footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2.5rem;
        }
        .finx-footer-grid {
          display: grid;
          grid-template-columns: 1.8fr 1fr 1fr 1fr;
          gap: 3rem;
          padding-bottom: 56px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        @media (max-width: 900px) {
          .finx-footer-grid { grid-template-columns: 1fr 1fr; gap: 2.5rem; }
          .finx-footer-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 540px) {
          .finx-footer-grid { grid-template-columns: 1fr; }
          .finx-footer-brand { grid-column: auto; }
          .finx-footer-inner { padding: 0 1.25rem; }
        }
        .finx-footer-brand img {
          height: 44px;
          width: auto;
          object-fit: contain;
          margin-bottom: 16px;
          filter: brightness(1.05);
        }
        .finx-footer-tagline {
          font-size: 0.845rem;
          line-height: 1.65;
          color: rgba(255,255,255,0.58);
          max-width: 260px;
          margin-bottom: 24px;
        }
        .finx-socials {
          display: flex;
          gap: 10px;
        }
        .finx-social-btn {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.4);
          text-decoration: none;
          transition: all 0.2s;
          cursor: pointer;
        }
        .finx-social-btn:hover {
          color: rgba(255,255,255,0.7);
          background: rgba(212,146,10,0.08);
          color: #f0c040;
          transform: translateY(-2px);
        }
        .finx-footer-col-label {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,1);
          margin-bottom: 18px;
        }
        .finx-footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 11px;
        }
        .finx-footer-links a {
          font-size: 0.845rem;
          color: rgba(255,255,255,0.68);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: color 0.2s;
          width: fit-content;
        }
        .finx-footer-links a:hover { color: rgba(255,255,255,0.85); }
        .finx-footer-links .ext { opacity: 0; transition: opacity 0.2s; }
        .finx-footer-links a:hover .ext { opacity: 1; }
        .ft-heart {
          display: inline-block;
          color: #e11d48;
          animation: hb 1.6s ease-in-out infinite;
        }
        @keyframes hb {
          0%,100% { transform: scale(1); }
          50%      { transform: scale(1.35); }
        }
        .finx-footer-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
          animation: pulse-dot 2.5s ease-in-out infinite;
          flex-shrink: 0;
          display: inline-block;
        }
        @keyframes pulse-dot {
          0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
          50%      { box-shadow: 0 0 0 5px rgba(34,197,94,0); }
        }
      `}</style>

      <footer className="finx-footer">
        <div className="finx-footer-inner">

          <div className="finx-footer-grid">

            {/* Brand */}
            <div className="finx-footer-brand">
              <Link to="/">
                <img src="/finxai-luxury.png" alt="FinX AI" />
              </Link>
              <p className="finx-footer-tagline">
                AI-powered personal finance — track spending, scan receipts,
                and get monthly insights delivered automatically.
              </p>
              <div className="finx-socials">
                {socialLinks.map((s) => (
                  <a
                    key={s.title}
                    href={s.href}
                    target={s.href.startsWith("mailto") ? undefined : "_blank"}
                    rel={s.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                    className="finx-social-btn"
                    title={s.title}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            

            {/* Legal */}
            <div>
              <p className="finx-footer-col-label">Legal</p>
              <ul className="finx-footer-links">
                <li>
                  <Link
                    to="/privacypolicy"
                    style={{ color: "rgba(255,255,255,0.65)", textDecoration: "none", fontSize: "0.845rem" }}
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/termsofservice"
                    style={{ color: "rgba(255,255,255,0.65)", textDecoration: "none", fontSize: "0.845rem" }}
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <p className="finx-footer-col-label">Connect</p>
              <ul className="finx-footer-links">
                <li>
                  <a href="https://github.com/Mohitsati-gen" target="_blank" rel="noopener noreferrer">
                    GitHub <ArrowUpRight size={11} className="ext" />
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/in/mohit-sati-061291313/" target="_blank" rel="noopener noreferrer">
                    LinkedIn <ArrowUpRight size={11} className="ext" />
                  </a>
                </li>
                <li>
                  <a href="mailto:mohitsati583@gmail.com">
                    hi@finxai.com
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom bar */}
          <div style={{ paddingTop: "26px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 300, color: "rgba(255,255,255,0.42)", margin: 0 }}>
              &copy; {currentYear} FinX AI. All rights reserved.
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", fontStyle: "italic", color: " rgba(255,255,255,0.52)", margin: 0 }}>
              Made with <span className="ft-heart">&#9829;</span> by Mohit Sati
            </p>
            <p style={{ fontSize: "0.65rem", fontWeight: 300, color: "rgba(255,255,255,0.42)", letterSpacing: "0.08em", margin: 0 }}>
              v1.0.0 &middot; Built with React &amp; AI
            </p>
          </div>

        </div>
      </footer>
    </>
  );
};

export default Footer;