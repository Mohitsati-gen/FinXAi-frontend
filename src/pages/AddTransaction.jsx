import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "sonner";
import {
  ArrowLeft, ScanLine, TrendingUp, TrendingDown,
  Calendar, Tag, FileText, RefreshCw, Wallet,
  ChevronDown, Loader2, CheckCircle2, PlusCircle, Sparkles
} from "lucide-react";
import CreateAccountDrawer from "@/components/CreateAccountDrawer";

// ── categories ──
const CATEGORIES = {
  EXPENSE: [
    { value: "Housing",       emoji: "🏠" },
    { value: "Food",          emoji: "🍔" },
    { value: "Transport",     emoji: "🚗" },
    { value: "Entertainment", emoji: "🎬" },
    { value: "Shopping",      emoji: "🛍️" },
    { value: "Utilities",     emoji: "⚡" },
    { value: "Travel",        emoji: "✈️" },
    { value: "Healthcare",    emoji: "🏥" },
    { value: "Rental",        emoji: "🏢" },
    { value: "Other",         emoji: "📦" },
  ],
  INCOME: [
    { value: "Salary",      emoji: "💼" },
    { value: "Freelance",   emoji: "💻" },
    { value: "Investments", emoji: "📈" },
    { value: "Business",    emoji: "🏪" },
    { value: "Gift",        emoji: "🎁" },
    { value: "Other",       emoji: "💰" },
  ],
};

const RECURRING_INTERVALS = [
  { value: "DAILY",   label: "Daily"   },
  { value: "WEEKLY",  label: "Weekly"  },
  { value: "MONTHLY", label: "Monthly" },
  { value: "YEARLY",  label: "Yearly"  },
];

export default function AddTransaction() {
  const navigate     = useNavigate();
  const { getToken } = useAuth();
  const fileRef      = useRef(null);

  const [accounts,   setAccounts]   = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [aiLoading,  setAiLoading]  = useState(false);
  const [catOpen,    setCatOpen]    = useState(false);
  const [accOpen,    setAccOpen]    = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [form, setForm] = useState({
    type:              "EXPENSE",
    amount:            "",
    accountId:         "",
    category:          "",
    date:              new Date().toISOString().split("T")[0],
    description:       "",
    isRecurring:       false,
    recurringInterval: "MONTHLY",
  });

  // ── fetch accounts ──
  const fetchAccounts = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/accounts`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const accs = res.data.data || [];
      setAccounts(accs);
      const def = accs.find(a => a.isDefault);
      if (def) setForm(p => ({ ...p, accountId: p.accountId || def._id }));
    } catch (e) {
      console.error("Failed to fetch accounts:", e.message);
    }
  };

  useEffect(() => { fetchAccounts(); }, []);

  const handleAccountCreated = (newAccount) => {
    fetchAccounts();
    if (newAccount?._id) handleChange("accountId", newAccount._id);
  };

  const handleChange = (field, value) => {
    setForm(p => ({
      ...p,
      [field]: value,
      ...(field === "type" ? { category: "" } : {}),
    }));
  };

  useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}, []);

  // ── AI receipt scan ──
  const handleScan = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setAiLoading(true);
  try {
    const token = await getToken();
    const fd    = new FormData();
    fd.append("receipt", file);

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/transactions/scan-receipt`,
      fd,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const d = res.data.data;

    const hasData = d.amount || d.category || d.description;

    if (!hasData) {
      toast.warning("Couldn't detect a receipt. Please upload a clear receipt image.", {
        duration:    5000,
        icon:        "🧾",
        description: "Make sure the image shows a valid receipt with amount and details.",
      });
      return; 
    }

    // valid receipt — fill the form
    setForm(f => ({
      ...f,
      amount:      d.amount      ?? f.amount,
      category:    d.category    ?? f.category,
      date:        d.date        ?? f.date,
      description: d.description ?? f.description,
      type:        d.type        ?? f.type,
    }));
    toast.success("Receipt scanned! Fields auto-filled ✨");

  } catch {
    toast.error("Failed to scan receipt. Please try again.");
  } finally {
    setAiLoading(false);
    if (fileRef.current) fileRef.current.value = "";
  }
};

  
  // ── submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || parseFloat(form.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!form.category) {
      toast.error("Please select a category");
      return;
    }
    if (!form.accountId) {
      toast.error("Please select an account");
      return;
    }
    try {
      setLoading(true);
      const token = await getToken();
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/transactions`,
        {
          ...form,
          amount:            parseFloat(form.amount),
          recurringInterval: form.isRecurring ? form.recurringInterval : null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Transaction added successfully!");
      navigate(`/account/${form.accountId}`, {
        state: { highlightTxId: res.data.data._id },
      });
    } catch (e) {
      console.error("Full error:", e.response?.data);
      toast.error(e.response?.data?.message || "Failed to add transaction");
    } finally {
      setLoading(false);
    }
  };

  const selectedAccount  = accounts.find(a => a._id === form.accountId);
  const selectedCategory = CATEGORIES[form.type]?.find(c => c.value === form.category);
  const isExpense        = form.type === "EXPENSE";

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .anim-1 { animation: fadeUp 0.4s ease both 0.05s; }
        .anim-2 { animation: fadeUp 0.4s ease both 0.12s; }
        .anim-3 { animation: fadeUp 0.4s ease both 0.18s; }

        @keyframes shimmerScan {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .scan-shimmer {
          background: linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b);
          background-size: 200% auto;
          animation: shimmerScan 2s linear infinite;
        }

        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }

        input[type=date]::-webkit-calendar-picker-indicator {
          opacity: 0.4; cursor: pointer;
        }

        .tog-input { position:absolute; opacity:0; width:0; height:0; }
        .tog-track {
          position:absolute; inset:0; border-radius:9999px;
          background:#e5e7eb; transition:background 0.2s;
        }
        .tog-thumb {
          position:absolute; top:3px; left:3px;
          width:16px; height:16px; border-radius:9999px;
          background:#fff; box-shadow:0 1px 3px rgba(0,0,0,0.2);
          transition:transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
        }
        .tog-input:checked ~ .tog-track { background:#f59e0b; }
        .tog-input:checked ~ .tog-thumb { transform:translateX(18px); }
      `}</style>

      {/* hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleScan}
      />

<div className="min-h-screen bg-gray-50/80 px-4 sm:px-6 pt-10 sm:pt-10 pb-10">  
      <div className="max-w-2xl mx-auto">

          {/* ── Back ── */}
          <button
            onClick={() => navigate(-1)}
            className="anim-1 flex items-center gap-2 text-sm text-gray-400 hover:text-amber-500 transition-colors duration-150 mb-6 group"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform duration-150" />
            Back
          </button>

          {/* ── Page title ── */}
          <div className="anim-1 mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-1">
              Finance Tracker
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">
              Add Transaction
            </h1>
            <div className="mt-3 h-px bg-gradient-to-r from-amber-400/60 to-transparent" />
          </div>

          {/* ── Scan Receipt with AI ── */}
          <div className="anim-2 mb-6">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={aiLoading}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-sm font-semibold text-white shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-0.5 scan-shimmer"
            >
              {aiLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Scanning receipt...
                </>
              ) : (
                <>
                  <Sparkles size={15} strokeWidth={2} />
                  Scan Receipt with AI
                  <ScanLine size={15} strokeWidth={2} />
                </>
              )}
            </button>
            {aiLoading && (
              <p className="text-center text-xs text-gray-400 mt-2 animate-pulse">
                Gemini AI is reading your receipt...
              </p>
            )}
          </div>

          {/* ── Form card ── */}
          <form
            onSubmit={handleSubmit}
            className="anim-3 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col gap-6"
          >

            {/* ── Type toggle ── */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Transaction Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {["EXPENSE", "INCOME"].map(t => {
                  const active = form.type === t;
                  const isExp  = t === "EXPENSE";
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleChange("type", t)}
                      className={`flex items-center justify-center gap-2 py-3 rounded-2xl border text-sm font-semibold transition-all duration-200
                        ${active && isExp  ? "border-red-300 bg-red-50 text-red-600 shadow-sm shadow-red-100" : ""}
                        ${active && !isExp ? "border-emerald-300 bg-emerald-50 text-emerald-600 shadow-sm shadow-emerald-100" : ""}
                        ${!active          ? "border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:bg-gray-50" : ""}
                      `}
                    >
                      {isExp
                        ? <TrendingDown size={16} strokeWidth={2} />
                        : <TrendingUp   size={16} strokeWidth={2} />
                      }
                      {t.charAt(0) + t.slice(1).toLowerCase()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Amount + Account ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Amount */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">₹</span>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={e => handleChange("amount", e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                    className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/15 transition-all duration-150"
                  />
                </div>
              </div>

              {/* Account */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Wallet size={11} /> Account
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setAccOpen(o => !o)}
                    className="w-full flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white hover:border-amber-300 outline-none transition-all duration-150"
                  >
                    <span className={selectedAccount ? "text-gray-800 font-medium" : "text-gray-300"}>
                      {selectedAccount
                        ? `${selectedAccount.name} (₹${parseFloat(selectedAccount.balance).toLocaleString("en-IN")})`
                        : "Select account"
                      }
                    </span>
                    <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${accOpen ? "rotate-180" : ""}`} />
                  </button>

                  {accOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden">
                      {accounts.length === 0 ? (
                        <p className="px-4 py-3 text-xs text-gray-400 text-center">No accounts yet</p>
                      ) : (
                        accounts.map(a => (
                          <button
                            key={a._id}
                            type="button"
                            onClick={() => { handleChange("accountId", a._id); setAccOpen(false); }}
                            className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between
                              ${form.accountId === a._id
                                ? "bg-amber-50 text-amber-600 font-semibold"
                                : "text-gray-600 hover:bg-gray-50"
                              }`}
                          >
                            <span className="flex items-center gap-2">
                              {a.isDefault && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />}
                              {a.name}
                            </span>
                            <span className="text-xs text-gray-400 shrink-0 ml-2">
                              ₹{parseFloat(a.balance).toLocaleString("en-IN")}
                            </span>
                          </button>
                        ))
                      )}
                      <div className="h-px bg-gray-100 mx-3" />
                      <button
                        type="button"
                        onClick={() => { setAccOpen(false); setDrawerOpen(true); }}
                        className="w-full text-left px-4 py-3 text-sm font-semibold text-amber-500 hover:bg-amber-50 flex items-center gap-2 transition-colors duration-150"
                      >
                        <PlusCircle size={14} />
                        Create Account
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Category ── */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Tag size={11} /> Category
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCatOpen(o => !o)}
                  className="w-full flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white hover:border-amber-300 outline-none transition-all duration-150"
                >
                  <span className={selectedCategory ? "text-gray-800 font-medium" : "text-gray-300"}>
                    {selectedCategory
                      ? <span className="flex items-center gap-2">{selectedCategory.emoji} {selectedCategory.value}</span>
                      : "Select category"
                    }
                  </span>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${catOpen ? "rotate-180" : ""}`} />
                </button>
                {catOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden max-h-52 overflow-y-auto">
                    {CATEGORIES[form.type].map(c => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => { handleChange("category", c.value); setCatOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2.5
                          ${form.category === c.value ? "bg-amber-50 text-amber-600 font-semibold" : "text-gray-600 hover:bg-gray-50"}`}
                      >
                        <span>{c.emoji}</span>
                        <span>{c.value}</span>
                        {form.category === c.value && <CheckCircle2 size={13} className="ml-auto text-amber-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── Date ── */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Calendar size={11} /> Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={e => handleChange("date", e.target.value)}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/15 transition-all duration-150"
              />
            </div>

            {/* ── Description ── */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <FileText size={11} /> Description
                <span className="text-gray-300 font-normal normal-case tracking-normal ml-1">(optional)</span>
              </label>
              <textarea
                value={form.description}
                onChange={e => handleChange("description", e.target.value)}
                placeholder="Add a note..."
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/15 transition-all duration-150 resize-none"
              />
            </div>

            {/* ── Recurring toggle ── */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <RefreshCw size={15} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Recurring Transaction</p>
                    <p className="text-xs text-gray-400 mt-0.5">Set up a recurring schedule</p>
                  </div>
                </div>
                <label className="relative block w-10 h-[22px] cursor-pointer shrink-0">
                  <input
                    className="tog-input"
                    type="checkbox"
                    checked={form.isRecurring}
                    onChange={e => handleChange("isRecurring", e.target.checked)}
                  />
                  <div className="tog-track" />
                  <div className="tog-thumb" />
                </label>
              </div>

              {form.isRecurring && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Repeat Interval
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {RECURRING_INTERVALS.map(interval => (
                      <button
                        key={interval.value}
                        type="button"
                        onClick={() => handleChange("recurringInterval", interval.value)}
                        className={`py-2.5 rounded-xl border text-xs font-semibold transition-all duration-150
                          ${form.recurringInterval === interval.value
                            ? "border-amber-400 bg-amber-50 text-amber-700 shadow-sm"
                            : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                      >
                        {interval.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── divider ── */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />

            {/* ── Actions ── */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 py-3.5 rounded-2xl text-sm font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all duration-150"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-3.5 rounded-2xl text-sm font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-md
                  ${isExpense
                    ? "bg-gradient-to-r from-red-500 to-rose-400 hover:from-red-600 hover:to-rose-500 shadow-red-200 hover:shadow-red-300"
                    : "bg-gradient-to-r from-emerald-500 to-green-400 hover:from-emerald-600 hover:to-green-500 shadow-emerald-200 hover:shadow-emerald-300"
                  } disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-0.5`}
              >
                {loading ? (
                  <><Loader2 size={14} className="animate-spin" /> Adding...</>
                ) : (
                  <>
                    {isExpense
                      ? <TrendingDown size={14} strokeWidth={2} />
                      : <TrendingUp   size={14} strokeWidth={2} />
                    }
                    Add {isExpense ? "Expense" : "Income"}
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* ── Create Account Drawer ── */}
      <CreateAccountDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSuccess={handleAccountCreated}
      />
    </>
  );
}