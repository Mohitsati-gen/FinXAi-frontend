// TermsOfService.jsx

import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function TermsOfService() {
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
            Terms of Service
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
              1. Acceptance of Terms
            </h2>

            <p>
              By creating an account or using FinX AI, you agree to be bound by
              these Terms of Service. If you do not agree to these terms, please
              do not use the service. We reserve the right to update these terms
              at any time, and continued use of the service constitutes
              acceptance of the updated terms.
            </p>
          </section>

          <div className="h-px bg-gray-100" />

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              2. Use of the Service
            </h2>

            <p className="mb-4">
              You agree to use FinX AI only for lawful purposes. You must not:
            </p>

            <ul className="flex flex-col gap-3">
              {[
                "Use the service to engage in fraudulent or illegal financial activity",
                "Attempt to gain unauthorized access to other users' accounts",
                "Reverse engineer, copy, or redistribute any part of the application",
                "Use automated scripts to abuse or overload the service",
                "Submit false or misleading financial information",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-red-400 mt-3 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="h-px bg-gray-100" />

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              3. Financial Information Disclaimer
            </h2>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-5 text-amber-800">
              <p className="font-semibold mb-2">
                Important Notice
              </p>

              <p className="text-sm leading-7">
                FinX AI is a personal finance tracking tool and does not provide
                financial, investment, tax, or legal advice. All AI-generated
                insights are for informational purposes only. Always consult a
                qualified financial advisor before making financial decisions.
              </p>
            </div>
          </section>

          <div className="h-px bg-gray-100" />

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              4. Account Responsibility
            </h2>

            <p>
              You are responsible for maintaining the confidentiality of your
              account credentials and for all activity that occurs under your
              account. You must notify us immediately at{" "}
              <span className="text-amber-600 font-semibold">
                support@finxai.com
              </span>{" "}
              if you suspect unauthorized access to your account. We are not
              liable for losses caused by unauthorized use of your account.
            </p>
          </section>

          <div className="h-px bg-gray-100" />

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              5. Recurring Transactions
            </h2>

            <p>
              FinX AI automates recurring transaction processing on your behalf
              based on the schedule you configure. We are not responsible for
              errors resulting from incorrect configuration or missed
              transactions due to technical issues. You should regularly review
              your account to ensure recurring transactions are processing as
              expected.
            </p>
          </section>

          <div className="h-px bg-gray-100" />

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              6. Service Availability
            </h2>

            <p>
              We strive to maintain 99.9% uptime but do not guarantee
              uninterrupted access to the service. We may perform scheduled
              maintenance that temporarily limits access. We are not liable for
              any losses resulting from service downtime or outages.
            </p>
          </section>

          <div className="h-px bg-gray-100" />

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              7. Termination
            </h2>

            <p>
              You may delete your account at any time from the settings page. We
              reserve the right to suspend or terminate accounts that violate
              these terms without prior notice. Upon termination, all your data
              will be permanently deleted from our systems within 30 days.
            </p>
          </section>

          <div className="h-px bg-gray-100" />

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              8. Limitation of Liability
            </h2>

            <p>
              FinX AI is provided "as is" without warranties of any kind. To the
              maximum extent permitted by law, we shall not be liable for any
              indirect, incidental, or consequential damages arising from your
              use of the service, including financial losses.
            </p>
          </section>

          <div className="h-px bg-gray-100" />

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              9. Contact
            </h2>

            <p>
              For questions about these Terms of Service, contact us at{" "}
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