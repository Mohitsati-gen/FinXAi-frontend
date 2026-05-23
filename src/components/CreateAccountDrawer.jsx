import { useState } from "react";
import { useCreateAccount } from "../hooks/useCreateAccount";
import { X, Wallet, Loader2, AlertCircle } from "lucide-react";

const ACCOUNT_TYPES = ["SAVINGS", "CURRENT", "CREDIT", "INVESTMENT", "OTHER"];

const TYPE_META = {
  SAVINGS:    { emoji: "🏦" },
  CURRENT:    { emoji: "💳" },
  CREDIT:     { emoji: "💰" },
  INVESTMENT: { emoji: "📈" },
  OTHER:      { emoji: "🗂️" },
};

export default function CreateAccountDrawer({ open, onClose, onSuccess }) {
  const { createAccount, loading, error } = useCreateAccount();

  const [form, setForm] = useState({
    name:      "",
    type:      "SAVINGS",
    balance:   "",
    isDefault: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await createAccount(form);
    if (result) {
      onSuccess?.(result.data);
      onClose();
      setForm({ name: "", type: "SAVINGS", balance: "", isDefault: false });
    }
  };

  if (!open) return null;

  return (
    <>
      <style>{`
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.97) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }

        .modal-backdrop { animation: fadeIn 0.2s ease both; }
        .modal-card     { animation: scaleUp 0.25s ease both; }

        @media (max-width: 639px) {
          .modal-card { animation: slideUp 0.3s cubic-bezier(0.32,0.72,0,1) both; }
        }

        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }

        .tog-input { position: absolute; opacity: 0; width: 0; height: 0; }
        .tog-track {
          position: absolute; inset: 0; border-radius: 9999px;
          background: #e5e7eb; transition: background 0.2s;
        }
        .tog-thumb {
          position: absolute; top: 3px; left: 3px;
          width: 14px; height: 14px; border-radius: 9999px;
          background: #fff;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
        }
        .tog-input:checked ~ .tog-track { background: #f59e0b; }
        .tog-input:checked ~ .tog-thumb { transform: translateX(16px); }
      `}</style>

      {/* ── Backdrop ──
          Mobile  : items-end  → sheet rises from bottom
          Desktop : items-start + pt-20 → sits just below the navbar
      */}
      <div
        className="modal-backdrop fixed inset-0 z-40 bg-black/30 backdrop-blur-sm
          flex items-end justify-center
          sm:items-start sm:justify-center sm:pt-25 sm:px-6 sm:pb-8"
        onClick={onClose}
      >
        {/* ── Modal Card ──
            Mobile  : full width, slides up, 92vh tall
            Desktop : max-w-2xl (wider), min-h so it's tall enough, but still scrollable
        */}
        <div
          className="modal-card relative w-full bg-white overflow-hidden
            rounded-t-3xl max-h-[92vh] overflow-y-auto
            sm:rounded-3xl sm:max-w-2xl sm:w-full sm:max-h-[calc(100vh-6rem)] sm:shadow-2xl sm:shadow-gray-300/60"
          onClick={(e) => e.stopPropagation()}
        >
          {/* drag handle — mobile only */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1 rounded-full bg-gray-200" />
          </div>

    

          {/* ── Header ── */}
          <div className="flex items-center justify-between px-6 sm:px-10 pt-5 sm:pt-8 pb-5 sm:pb-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                <Wallet size={20} className="text-amber-500" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-800 leading-tight">Add Account</h2>
                <p className="text-[0.62rem] text-gray-400 uppercase tracking-wider mt-0.5">New financial account</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all duration-150 shrink-0"
            >
              <X size={15} strokeWidth={2.5} />
            </button>
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="px-6 sm:px-10 py-6 sm:py-8 flex flex-col gap-5 sm:gap-7">

            {/* Account Name */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Account Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. HDFC Savings"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 sm:py-3.5 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/15 transition-all duration-150"
              />
            </div>

            {/* Account Type */}
            <div className="flex flex-col gap-2.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Account Type
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {ACCOUNT_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, type: t }))}
                    className={`flex flex-col items-center gap-2 py-4 sm:py-5 px-2 rounded-2xl border text-center transition-all duration-150 ${
                      form.type === t
                        ? "border-amber-400 bg-amber-50 text-amber-700 shadow-sm shadow-amber-100 scale-[1.02]"
                        : "border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-2xl sm:text-xl">{TYPE_META[t].emoji}</span>
                    <span className="text-[0.58rem] font-semibold uppercase tracking-wide leading-tight">{t}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Initial Balance */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Initial Balance
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">₹</span>
                <input
                  type="number"
                  name="balance"
                  value={form.balance}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-3 sm:py-3.5 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/15 transition-all duration-150"
                />
              </div>
            </div>

            {/* Set as Default */}
            <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-gray-700">Set as default</p>
                <p className="text-xs text-gray-400 mt-0.5">Use this account for new transactions</p>
              </div>
              <label className="relative block w-9 h-5 cursor-pointer shrink-0 ml-4">
                <input
                  className="tog-input"
                  type="checkbox"
                  name="isDefault"
                  checked={form.isDefault}
                  onChange={handleChange}
                />
                <div className="tog-track" />
                <div className="tog-thumb" />
              </label>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <AlertCircle size={14} className="text-red-400 shrink-0" />
                <p className="text-xs text-red-500">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2 pb-3 sm:pb-0">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3.5 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all duration-150"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 shadow-md shadow-amber-200 hover:shadow-lg hover:shadow-amber-300 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Creating...
                  </>
                ) : "Create Account"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}