// PrivacyPolicy.jsx

import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/80 px-4 sm:px-8 pt-24 pb-16">
      <div className="max-w-5xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm text-gray-600 hover:text-amber-600 transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-2">
            Legal
          </p>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 tracking-tight">
            Privacy Policy
          </h1>

          <div className="mt-4 h-px bg-gradient-to-r from-amber-400/60 to-transparent" />

          <p className="mt-4 text-sm text-gray-400">
            Last updated: April 2026
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-12 flex flex-col gap-8 text-[15px] text-gray-600 leading-8">

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              1. Information We Collect
            </h2>

            <p>
              We collect information you provide directly when you create an
              account, including your name, email address, and financial data
              such as transaction records, account balances, and budget
              preferences. We also collect usage data automatically, such as
              device information, IP address, and how you interact with the app.
            </p>
          </section>

          <div className="h-px bg-gray-100" />

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              2. How We Use Your Information
            </h2>

            <p className="mb-4">
              We use the information we collect to:
            </p>

            <ul className="flex flex-col gap-3">
              {[
                "Provide, maintain, and improve FinX AI services",
                "Send monthly financial reports and budget alerts to your email",
                "Generate AI-powered financial insights using your transaction data",
                "Process recurring transactions on your behalf",
                "Respond to your support requests and questions",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-amber-400 mt-3 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="h-px bg-gray-100" />

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              3. Data Storage & Security
            </h2>

            <p>
              Your data is stored securely on MongoDB Atlas with encryption at
              rest and in transit. Authentication is handled by Clerk, which
              follows industry-standard security practices. We never store your
              passwords directly. Financial data is private to your account and
              is never sold to third parties.
            </p>
          </section>

          <div className="h-px bg-gray-100" />

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              4. Third-Party Services
            </h2>

            <p className="mb-4">
              FinX AI uses the following third-party services to operate:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  name: "Clerk",
                  purpose: "Authentication & user management",
                },
                {
                  name: "Resend",
                  purpose: "Transactional email delivery",
                },
                {
                  name: "Gemini",
                  purpose: "AI-powered financial insights",
                },
                {
                  name: "Inngest",
                  purpose: "Background job processing",
                },
                {
                  name: "Arcjet",
                  purpose: "Rate limiting & bot protection",
                },
              ].map(({ name, purpose }) => (
                <div
                  key={name}
                  className="flex items-start gap-3 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4"
                >
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-2 py-1 shrink-0">
                    {name}
                  </span>

                  <span className="text-sm text-gray-500">
                    {purpose}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <div className="h-px bg-gray-100" />

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              5. Your Rights
            </h2>

            <p>
              You have the right to access, correct, or delete your personal
              data at any time. You can delete your account from the settings
              page, which will permanently remove all your financial data from
              our systems. You may also request an export of your data by
              contacting us.
            </p>
          </section>

          <div className="h-px bg-gray-100" />

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              6. Cookies
            </h2>

            <p>
              We use essential cookies to keep you signed in and remember your
              preferences. We do not use advertising or tracking cookies. You
              can disable cookies in your browser settings, but some features of
              the app may not function properly.
            </p>
          </section>

          <div className="h-px bg-gray-100" />

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              7. Contact Us
            </h2>

            <p>
              If you have any questions about this Privacy Policy or how we
              handle your data, please contact us at{" "}
              <span className="text-amber-600 font-semibold">
                support@finxai.com
              </span>
              .
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}