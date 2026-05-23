import { useState, useEffect } from "react";
import {
  Pencil,
  Check,
  X,
  Wallet,
  TrendingDown,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "sonner";

export default function BudgetSection({ defaultAccount, transactions }) {
  const { getToken } = useAuth();

  const [budget, setBudget] = useState(null);
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/budget`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.data?.amount) {
          setBudget(res.data.data.amount);
          setInputVal(res.data.data.amount);
        }
      } catch (e) {
        console.error("Failed to fetch budget:", e.message);
      }
    })();
  }, []);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const spent = (transactions || [])
    .filter((t) => {
      const d = new Date(t.date);

      return (
        t.type === "EXPENSE" &&
        d.getMonth() === currentMonth &&
        d.getFullYear() === currentYear
      );
    })
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const percentage = budget
    ? Math.min((spent / budget) * 100, 100)
    : 0;

  const isWarning = percentage >= 80 && percentage < 100;
  const isExceeded = percentage >= 100;

  const barColor = isExceeded
    ? "bg-red-500"
    : isWarning
    ? "bg-amber-400"
    : "bg-emerald-500";

  const handleSave = async () => {
    const val = parseFloat(inputVal);

    if (!val || val <= 0) {
      toast.error("Please enter a valid budget amount");
      return;
    }

    try {
      setLoading(true);

      const token = await getToken();

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/budget`,
        { amount: val },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBudget(val);
      setEditing(false);

      toast.success("Budget updated successfully!");
    } catch (e) {
      console.error("Failed to save budget:", e.message);
      toast.error("Failed to save budget");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setInputVal(budget || "");
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") handleCancel();
  };

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .budget-anim {
          animation: fadeUp 0.4s ease both;
        }

        @keyframes growBar {
          from {
            width: 0%;
          }
          to {
            width: ${percentage}%;
          }
        }

        .progress-bar {
          animation: growBar 0.8s cubic-bezier(0.34,1.56,0.64,1) both 0.3s;
        }

        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
        }
      `}</style>

      {/* MAIN CARD */}
<div className="budget-anim w-full max-w-[1500px] mx-auto bg-white rounded-3xl border border-gray-100 shadow-md p-6 sm:p-7 mb-8">        {/* HEADER */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
              <Wallet size={20} className="text-amber-500" />
            </div>

            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-amber-500 mb-1">
                Monthly Budget
              </p>

              <p className="text-base font-semibold text-gray-700">
                {defaultAccount?.name || "Default Account"}
              </p>
            </div>
          </div>

          {!editing ? (
            <button
              onClick={() => {
                setEditing(true);
                setInputVal(budget || "");
              }}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-amber-500 transition-colors duration-150 mt-1"
            >
              <Pencil size={14} />
              {budget ? "Edit" : "Set Budget"}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                disabled={loading}
                className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 hover:bg-emerald-100 transition-all duration-150 disabled:opacity-50"
              >
                <Check size={14} strokeWidth={2.5} />
              </button>

              <button
                onClick={handleCancel}
                className="w-8 h-8 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-all duration-150"
              >
                <X size={14} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>

        {/* NO BUDGET */}
        {!budget && !editing && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
              <TrendingDown size={24} className="text-gray-300" />
            </div>

            <p className="text-base font-medium text-gray-500">
              No budget set yet
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Click{" "}
              <span className="text-amber-500 font-semibold">
                Set Budget
              </span>{" "}
              to get started
            </p>
          </div>
        )}

        {/* EDIT MODE */}
        {editing && (
          <div className="mb-6">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 block">
              Monthly Budget Amount
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">
                ₹
              </span>

              <input
                type="number"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. 50000"
                autoFocus
                className="w-full border border-gray-200 rounded-2xl pl-9 pr-4 py-3.5 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/15 transition-all duration-150"
              />
            </div>

            <p className="text-xs text-gray-400 mt-2">
              Press Enter to save, Escape to cancel
            </p>
          </div>
        )}

        {/* BUDGET DATA */}
        {budget && (
          <>
            {(isWarning || isExceeded) && (
              <div
                className={`flex items-center gap-2 rounded-2xl px-4 py-3 mb-5 text-sm font-medium
                ${
                  isExceeded
                    ? "bg-red-50 border border-red-100 text-red-600"
                    : "bg-amber-50 border border-amber-100 text-amber-600"
                }`}
              >
                <AlertTriangle size={14} className="shrink-0" />

                {isExceeded
                  ? "Budget exceeded! You've spent more than your monthly limit."
                  : `Warning! You've used ${percentage.toFixed(
                      0
                    )}% of your budget.`}
              </div>
            )}

            {/* STATS */}
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">
                  Spent this month
                </p>

                <p
                  className={`text-3xl font-bold tracking-tight ${
                    isExceeded ? "text-red-500" : "text-gray-800"
                  }`}
                >
                  <span className="text-lg font-normal text-gray-400 mr-1">
                    ₹
                  </span>

                  {spent.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-400 mb-1">of budget</p>

                <p className="text-xl font-bold text-gray-500 tracking-tight">
                  <span className="text-sm font-normal text-gray-400 mr-1">
                    ₹
                  </span>

                  {parseFloat(budget).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>

            {/* PROGRESS BAR */}
            <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
              <div
                className={`progress-bar h-full rounded-full ${barColor}`}
                style={{ width: `${percentage}%` }}
              />
            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">
                ₹
                {Math.max(0, budget - spent).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}{" "}
                remaining
              </p>

              <p
                className={`text-sm font-bold ${
                  isExceeded
                    ? "text-red-500"
                    : isWarning
                    ? "text-amber-500"
                    : "text-gray-400"
                }`}
              >
                {percentage.toFixed(1)}% used
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}