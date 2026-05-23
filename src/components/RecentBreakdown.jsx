import { useMemo, useState } from "react";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";

const CAT_COLORS = {
  Housing: "#f59e0b",
  Food: "#10b981",
  Transport: "#3b82f6",
  Entertainment: "#8b5cf6",
  Shopping: "#ec4899",
  Utilities: "#06b6d4",
  Travel: "#f97316",
  Healthcare: "#14b8a6",
  Rental: "#ef4444",
  Salary: "#22c55e",
  Freelance: "#6366f1",
  Investments: "#0ea5e9",
  Business: "#d97706",
  Gift: "#a855f7",
  Other: "#9ca3af",
};

const fmt = (n) =>
  "₹" +
  Math.abs(n).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const { name, value } = payload[0].payload;

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #f0f0f0",
        borderRadius: 10,
        padding: "8px 14px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        fontSize: 13,
        fontWeight: 600,
        color: "#111",
      }}
    >
      {name} · {fmt(value)}
    </div>
  );
};

const CenterLabel = ({
  viewBox,
  total,
  activeLabel,
  activeValue,
}) => {
  if (!viewBox) return null;

  const { cx, cy } = viewBox;

  return (
    <>
      <text
        x={cx}
        y={cy - 10}
        textAnchor="middle"
        fontSize={11}
        fill="#9ca3af"
        fontWeight={500}
      >
        {activeLabel || "Total"}
      </text>

      <text
        x={cx}
        y={cy + 14}
        textAnchor="middle"
        fontSize={16}
        fill="#111827"
        fontWeight={700}
      >
        {activeValue ? fmt(activeValue) : fmt(total)}
      </text>
    </>
  );
};

export default function RecentBreakdown({
  transactions = [],
}) {
  const [activeIndex, setActiveIndex] = useState(null);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthName = now.toLocaleString("default", {
    month: "long",
  });

  const monthExpenses = useMemo(
    () =>
      transactions.filter((t) => {
        if (!t.date) return false;

        const d = new Date(t.date);

        return (
          t.type === "EXPENSE" &&
          d.getMonth() === currentMonth &&
          d.getFullYear() === currentYear
        );
      }),
    [transactions]
  );

  const breakdown = useMemo(() => {
    const map = {};

    monthExpenses.forEach((t) => {
      const cat = t.category || "Other";

      map[cat] = (map[cat] || 0) + Math.abs(t.amount);
    });

    return Object.entries(map)
      .map(([name, value]) => ({
        name,
        value,
        color: CAT_COLORS[name] || "#9ca3af",
      }))
      .sort((a, b) => b.value - a.value);
  }, [monthExpenses]);

  const total = breakdown.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const recent = useMemo(
    () =>
      [...transactions]
        .sort(
          (a, b) =>
            new Date(b.date) - new Date(a.date)
        )
        .slice(0, 5),
    [transactions]
  );

  const active =
    activeIndex !== null
      ? breakdown[activeIndex]
      : null;

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .rb-1 {
          animation: fadeUp 0.4s ease both 0.05s;
        }

        .rb-2 {
          animation: fadeUp 0.4s ease both 0.12s;
        }

        .tx-row {
          transition: background 0.12s;
          border-radius: 12px;
        }

        .tx-row:hover {
          background: #fafafa;
        }
      `}</style>

<div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mb-6">        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* LEFT */}
          <div className="rb-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 min-w-0">

            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[0.62rem] font-semibold uppercase tracking-widest text-amber-500 mb-0.5">
                  {monthName}
                </p>

                <h2 className="text-base font-bold text-gray-800">
                  Expense Breakdown
                </h2>
              </div>

              {breakdown.length > 0 && (
                <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-gray-400 bg-gray-50 border border-gray-100 rounded-full px-2.5 py-1">
                  {breakdown.length} categories
                </span>
              )}
            </div>

            {breakdown.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-3">
                  <TrendingDown
                    size={18}
                    className="text-gray-300"
                  />
                </div>

                <p className="text-sm text-gray-400">
                  No expenses this month
                </p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">

                {/* CHART */}
                <div className="shrink-0 w-[220px] h-[220px] min-w-[220px] min-h-[220px]">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <PieChart>

                      <Pie
                        data={breakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={62}
                        outerRadius={
                          activeIndex !== null
                            ? 95
                            : 88
                        }
                        paddingAngle={2}
                        dataKey="value"
                        onMouseEnter={(_, i) =>
                          setActiveIndex(i)
                        }
                        onMouseLeave={() =>
                          setActiveIndex(null)
                        }
                        stroke="none"
                        style={{
                          transition:
                            "outer-radius 0.2s",
                          outline: "none",
                        }}
                        labelLine={false}
                      >
                        {breakdown.map(
                          (entry, i) => (
                            <Cell
                              key={entry.name}
                              fill={entry.color}
                              opacity={
                                activeIndex === null ||
                                activeIndex === i
                                  ? 1
                                  : 0.4
                              }
                              style={{
                                cursor: "pointer",
                                outline: "none",
                              }}
                            />
                          )
                        )}

                        <Label
                          content={(props) => (
                            <CenterLabel
                              {...props}
                              total={total}
                              activeLabel={
                                active?.name
                              }
                              activeValue={
                                active?.value
                              }
                            />
                          )}
                        />
                      </Pie>

                      <Tooltip
                        content={<CustomTooltip />}
                      />

                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* LEGEND */}
                <div className="flex-1 w-full flex flex-col gap-2 min-w-0">

                  {breakdown.map(
                    (
                      { name, value, color },
                      i
                    ) => {
                      const pct = (
                        (value / total) *
                        100
                      ).toFixed(0);

                      const isActive =
                        activeIndex === i;

                      return (
                        <div
                          key={name}
                          className="flex items-center gap-2.5 min-w-0 px-2 py-1.5 rounded-xl cursor-pointer transition-all duration-150"
                          style={{
                            background: isActive
                              ? color + "14"
                              : "transparent",
                          }}
                          onMouseEnter={() =>
                            setActiveIndex(i)
                          }
                          onMouseLeave={() =>
                            setActiveIndex(null)
                          }
                        >
                          <div
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{
                              background: color,
                            }}
                          />

                          <span className="text-xs font-medium text-gray-600 truncate flex-1">
                            {name}
                          </span>

                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden shrink-0">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${pct}%`,
                                background: color,
                              }}
                            />
                          </div>

                          <span className="text-xs font-bold text-gray-700 shrink-0 w-14 text-right">
                            {fmt(value)}
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="rb-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 min-w-0">

            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[0.62rem] font-semibold uppercase tracking-widest text-amber-500 mb-0.5">
                  Latest
                </p>

                <h2 className="text-base font-bold text-gray-800">
                  Recent Transactions
                </h2>
              </div>

              {recent.length > 0 && (
                <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-gray-400 bg-gray-50 border border-gray-100 rounded-full px-2.5 py-1">
                  {transactions.length} total
                </span>
              )}
            </div>

            {recent.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">

                <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-3">
                  <TrendingUp
                    size={18}
                    className="text-gray-300"
                  />
                </div>

                <p className="text-sm text-gray-400">
                  No transactions yet
                </p>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-gray-50">

                {recent.map((t) => {
                  const isIncome =
                    t.type === "INCOME";

                  const catColor =
                    CAT_COLORS[t.category] ||
                    "#9ca3af";

                  const dateStr = t.date
                    ? new Date(
                        t.date
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                        }
                      )
                    : "No date";

                  return (
                    <div
                      key={t._id}
                      className="tx-row flex items-center gap-3 py-3.5 px-2 -mx-2"
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          background:
                            catColor + "18",
                          border: `1px solid ${catColor}30`,
                        }}
                      >
                        {isIncome ? (
                          <TrendingUp
                            size={14}
                            style={{
                              color: catColor,
                            }}
                            strokeWidth={2.5}
                          />
                        ) : (
                          <TrendingDown
                            size={14}
                            style={{
                              color: catColor,
                            }}
                            strokeWidth={2.5}
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">

                          <p className="text-sm font-semibold text-gray-700 truncate">
                            {t.description ||
                              t.category ||
                              "Transaction"}
                          </p>

                          {t.isRecurring && (
                            <span className="inline-flex items-center gap-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-blue-500 bg-blue-50 border border-blue-100 rounded-full px-1.5 py-0.5 shrink-0">
                              <RefreshCw size={7} />
                              recurring
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-400 mt-0.5">
                          {t.category} · {dateStr}
                        </p>
                      </div>

                      <p
                        className={`text-sm font-bold shrink-0 ${
                          isIncome
                            ? "text-emerald-600"
                            : "text-red-500"
                        }`}
                      >
                        {isIncome ? "+" : "-"}
                        {fmt(t.amount)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}