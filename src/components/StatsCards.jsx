import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

export default function StatsCards({ transactions }) {

  const totalIncome  = transactions.filter(t => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "EXPENSE").reduce((s, t) => s + Math.abs(t.amount), 0);
  const net          = totalIncome - totalExpense;

  const stats = [
    {
      label:  "Total Income",
      value:  totalIncome,
      icon:   TrendingUp,
      color:  "text-emerald-600",
      bg:     "bg-emerald-50",
      border: "border-emerald-100",
      sign:   "+",
    },
    {
      label:  "Total Expense",
      value:  totalExpense,
      icon:   TrendingDown,
      color:  "text-red-500",
      bg:     "bg-red-50",
      border: "border-red-100",
      sign:   "-",
    },
    {
      label:  "Net",
      value:  net,
      icon:   Wallet,
      color:  net >= 0 ? "text-blue-600"   : "text-red-500",
      bg:     net >= 0 ? "bg-blue-50"      : "bg-red-50",
      border: net >= 0 ? "border-blue-100" : "border-red-100",
      sign:   net >= 0 ? "+"               : "-",
    },
  ];

  return (
    /* 1 col on mobile, 3 col on sm+ */
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
      {stats.map(({ label, value, icon: Icon, color, bg, border, sign }) => (
        <div
          key={label}
          className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm flex items-center gap-4"
        >
          <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${bg} ${border} border flex items-center justify-center shrink-0`}>
            <Icon size={17} className={color} strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p className="text-[0.65rem] sm:text-xs text-gray-400 uppercase tracking-wider mb-0.5 truncate">
              {label}
            </p>
            <p className={`text-lg sm:text-xl font-bold tracking-tight ${color} truncate`}>
              {sign}₹{Math.abs(value).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}