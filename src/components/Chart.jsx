import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from "recharts";

const PERIODS = [
  { label: "Last 7 Days",   value: "7d"  },
  { label: "Last Month",    value: "1m"  },
  { label: "Last 3 Months", value: "3m"  },
  { label: "Last 6 Months", value: "6m"  },
  { label: "All Time",      value: "all" },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-semibold text-gray-600 mb-2">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.fill }} className="font-medium">
          {p.name}: ₹{p.value?.toLocaleString("en-IN")}
        </p>
      ))}
    </div>
  );
}

export default function Chart({ transactions, loading }) {

  const [period,     setPeriod]     = useState("1m");
  const [periodOpen, setPeriodOpen] = useState(false);

  const totalIncome  = transactions.filter(t => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "EXPENSE").reduce((s, t) => s + Math.abs(t.amount), 0);
  const net          = totalIncome - totalExpense;

  const chartData = (() => {

  const now = new Date();

  const filtered = transactions.filter((t) => {
    const txDate = new Date(t.date);

    const diffTime = now - txDate;

    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    switch (period) {

      case "7d":
        return diffDays <= 7;

      case "1m":
        return diffDays <= 30;

      case "3m":
        return diffDays <= 90;

      case "6m":
        return diffDays <= 180;

      case "all":
      default:
        return true;
    }
  });

  const map = {};

  filtered.forEach((t) => {

    const d = new Date(t.date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
      }
    );

    if (!map[d]) {
      map[d] = {
        date: d,
        Income: 0,
        Expense: 0,
      };
    }

    if (t.type === "INCOME") {
      map[d].Income += t.amount;
    }

    if (t.type === "EXPENSE") {
      map[d].Expense += Math.abs(t.amount);
    }
  });

  return Object.values(map);

})();

  return (
    <>
      <style>{`
        .dropdown-enter { animation: fadeUp 0.15s ease both; }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .shimmer {
          background: linear-gradient(110deg,#f5f5f5 30%,#ebebeb 50%,#f5f5f5 70%);
          background-size:200% 100%;
          animation:shimmer 1.4s ease-in-out infinite;
        }
        @keyframes shimmer {
          0%   { background-position:200% 0; }
          100% { background-position:-200% 0; }
        }
      `}</style>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">

        {/* ── Header row ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-0.5">Overview</p>
            <h2 className="text-sm sm:text-base font-bold text-gray-800">Transaction Chart</h2>
          </div>

          {/* Period selector */}
          <div className="relative self-start sm:self-auto">
            <button
              onClick={() => setPeriodOpen(o => !o)}
              className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-xl px-3 sm:px-4 py-2 hover:border-amber-300 transition-colors duration-150"
            >
              {PERIODS.find(p => p.value === period)?.label}
              <ChevronDown size={13} className={`transition-transform duration-200 ${periodOpen ? "rotate-180" : ""}`} />
            </button>
            {periodOpen && (
              <div className="dropdown-enter absolute right-0 mt-2 w-40 sm:w-44 bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden">
                {PERIODS.map(p => (
                  <button
                    key={p.value}
                    onClick={() => { setPeriod(p.value); setPeriodOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm transition-colors duration-100 flex items-center justify-between
                      ${period === p.value ? "bg-amber-50 text-amber-600 font-semibold" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    {p.label}
                    {period === p.value && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Stats row — 3 cols always, font scales ── */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-5 sm:mb-6">
          <div className="text-center">
            <p className="text-[0.6rem] sm:text-xs text-gray-400 mb-1">Total Income</p>
            <p className="text-sm sm:text-lg font-bold text-emerald-600 truncate">
              +₹{totalIncome.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[0.6rem] sm:text-xs text-gray-400 mb-1">Total Expenses</p>
            <p className="text-sm sm:text-lg font-bold text-red-500 truncate">
              -₹{totalExpense.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[0.6rem] sm:text-xs text-gray-400 mb-1">Net</p>
            <p className={`text-sm sm:text-lg font-bold truncate ${net >= 0 ? "text-blue-600" : "text-red-500"}`}>
              {net >= 0 ? "+" : "-"}₹{Math.abs(net).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* ── Chart — shorter on mobile ── */}
        {loading ? (
          <div className="shimmer h-40 sm:h-56 rounded-xl" />
        ) : chartData.length === 0 ? (
          <div className="h-40 sm:h-56 flex items-center justify-center text-sm text-gray-400">
            No data for this period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 180 : 220}>
            <BarChart data={chartData} barGap={4} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                width={45}
                tickFormatter={v => `₹${v >= 1000 ? (v / 1000).toFixed(0) + "k" : v}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.03)", radius: 4 }} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(v) => <span style={{ fontSize: 11, color: "#6b7280" }}>{v}</span>}
              />
              <Bar dataKey="Income"  fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="Expense" fill="#f87171" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </>
  );
}