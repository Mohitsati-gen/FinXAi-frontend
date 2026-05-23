import { useState } from "react";
import { PlusCircle, TrendingUp, TrendingDown, Sparkles,Trash2,AlertTriangle,X } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CreateAccountDrawer from "./CreateAccountDrawer";
import { toast } from "sonner";

export default function Account({ accounts = [], onRefetch , onDeleteAccount }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { getToken }                = useAuth();
  const navigate                    = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
const [selectedAccountId, setSelectedAccountId] = useState(null);

  const handleSetDefault = async (e, accountId) => {
    e.stopPropagation();
    try {
      const token = await getToken();
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/accounts/${accountId}/default`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Default account updated successfully! 🎉");
      onRefetch();
    } catch (err) {
      console.error("Failed to set default:", err);
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .anim-fadeup { animation: fadeUp 0.45s ease both; }
        .anim-shimmer {
          background: linear-gradient(110deg, #f5f5f5 30%, #ebebeb 50%, #f5f5f5 70%);
          background-size: 200% 100%;
          animation: shimmer 1.5s ease-in-out infinite;
        }
        .tog-input { position: absolute; opacity: 0; width: 0; height: 0; }
        .tog-track {
          position: absolute; inset: 0; border-radius: 9999px;
          background: #e5e7eb; transition: background 0.2s;
        }
        .tog-thumb {
          position: absolute; top: 3px; left: 3px;
          width: 14px; height: 14px; border-radius: 9999px;
          background: #fff;
          box-shadow: 0 1px 3px rgba(0,0,0,0.18);
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
        }
        .tog-input:checked ~ .tog-track { background: #f59e0b; }
        .tog-input:checked ~ .tog-thumb { transform: translateX(16px); }
      `}</style>

      <div className="min-h-screen bg-gray-50/80 px-6 md:px-10 pt-24 pb-16">
        <div className="max-w-7xl mx-auto">

          {/* ── Header ── */}
          <div className="anim-fadeup mb-8">
            <div className="flex items-end justify-between">
              <h1 className="text-2xl font-bold text-gray-800">My Accounts</h1>
              <span className="text-xs text-gray-400">
                {accounts.length} account{accounts.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="mt-3 h-px bg-gradient-to-r from-amber-400/60 to-transparent" />
          </div>

          {/* ── Grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Add New Account */}
            <div
              className="anim-fadeup group border-2 border-dashed border-gray-200 rounded-2xl bg-white flex flex-col items-center justify-center gap-3 min-h-[170px] cursor-pointer transition-all duration-200 hover:border-amber-400 hover:bg-amber-50/50 hover:-translate-y-0.5 hover:shadow-md hover:shadow-amber-100"
              onClick={() => setDrawerOpen(true)}
            >
              <div className="w-11 h-11 rounded-full bg-gray-100 group-hover:bg-amber-100 flex items-center justify-center text-gray-400 group-hover:text-amber-500 transition-all duration-200 group-hover:scale-110">
                <PlusCircle size={22} strokeWidth={1.6} />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 group-hover:text-amber-500 transition-colors duration-200">
                Add New Account
              </span>
            </div>

            {/* Skeletons — shown while Dashboard is still loading */}
            {accounts.length === 0 && Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="anim-shimmer rounded-2xl min-h-[170px]" />
            ))}

            {/* Account Cards */}
            {accounts.map((acc, idx) => (
              <div
                key={acc._id}
                onClick={() => navigate(`/account/${acc._id}`)}
                className="anim-fadeup group relative bg-white rounded-2xl border border-gray-100 p-5 flex flex-col min-h-[170px] shadow-sm hover:shadow-md hover:shadow-gray-200/80 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                style={{ animationDelay: `${0.07 * (idx + 1)}s` }}
              >
                {/* subtle top accent line */}
                <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-amber-300/50 to-transparent rounded-full" />

                {/* ── Top Row ── */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{acc.name}</p>
                    <p className="text-[0.68rem] text-gray-400 uppercase tracking-wide mt-0.5">
                      {acc.type.charAt(0) + acc.type.slice(1).toLowerCase()} Account
                    </p>
                    {acc.isDefault && (
                      <span className="mt-1.5 inline-flex items-center gap-1 text-[0.6rem] font-semibold uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                        <Sparkles size={8} />
                        Default
                      </span>
                    )}
                  </div>

                 {/* Toggle + Delete */}
<div
  className="flex items-start gap-5 ml-2"
  onClick={(e) => e.stopPropagation()}
>

  {/* Toggle */}
  <div className="flex flex-col items-end gap-1">
    <span
      className={`text-[0.58rem] uppercase tracking-wider font-medium ${
        acc.isDefault ? "text-amber-500" : "text-gray-300"
      }`}
    >
      {acc.isDefault ? "Default" : "Set default"}
    </span>

    <label className="relative block w-9 h-5 cursor-pointer">
      <input
        className="tog-input"
        type="checkbox"
        checked={acc.isDefault}
        onChange={(e) => !acc.isDefault && handleSetDefault(e, acc._id)}
      />
      <div className="tog-track" />
      <div className="tog-thumb" />
    </label>
  </div>

  {/* Delete Button */}
  <button
  onClick={(e) => {
    e.stopPropagation();
    setSelectedAccountId(acc._id);
    setDeleteModalOpen(true);
  }}
  className="mt-0.5 p-1.5 rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
>
  <Trash2 size={15} strokeWidth={2} />
</button>
</div>
                </div>

                {/* ── Balance ── */}
                <div className="flex-1 flex items-end">
                  <p className="text-2xl font-bold text-gray-800 tracking-tight">
                    <span className="text-base font-normal text-gray-400 mr-0.5">₹</span>
                    {parseFloat(acc.balance).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </p>
                </div>

                {/* ── Footer ── */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1 hover:bg-emerald-100 transition-colors duration-150"
                  >
                    <TrendingUp size={11} strokeWidth={2.2} />
                    Income
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-wider text-red-500 bg-red-50 border border-red-100 rounded-full px-3 py-1 hover:bg-red-100 transition-colors duration-150"
                  >
                    <TrendingDown size={11} strokeWidth={2.2} />
                    Expense
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <CreateAccountDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onSuccess={onRefetch}
        />


        {/* Delete Confirmation Modal */}
{deleteModalOpen && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">

    <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-red-200 bg-white shadow-[0_25px_80px_rgba(239,68,68,0.25)] animate-[fadeUp_.25s_ease]">

      {/* top danger line */}
      <div className="h-1 w-full bg-gradient-to-r from-red-500 via-red-400 to-red-500" />

      {/* close button */}
      <button
        onClick={() => setDeleteModalOpen(false)}
        className="absolute right-4 top-4 text-gray-400 hover:text-black transition-colors"
      >
        <X size={18} />
      </button>

      <div className="p-7">

        {/* icon */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500 shadow-inner shadow-red-200">
          <AlertTriangle size={30} />
        </div>

        {/* heading */}
        <h2 className="text-center text-2xl font-black tracking-tight text-gray-900">
          Delete Account?
        </h2>

        {/* text */}
        <p className="mt-3 text-center text-sm leading-relaxed text-gray-500">
          This action will permanently remove this account and all associated transactions.
          <span className="block mt-2 font-semibold text-red-500">
            This action cannot be undone.
          </span>
        </p>

        {/* buttons */}
        <div className="mt-7 flex gap-3">

          <button
            onClick={() => setDeleteModalOpen(false)}
            className="flex-1 rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200"
          >
            Cancel
          </button>

          <button
            onClick={async () => {
              await onDeleteAccount(selectedAccountId);
              setDeleteModalOpen(false);
            }}
            className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/30 hover:bg-red-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            Delete Forever
          </button>

        </div>
      </div>
    </div>
  </div>
)}
      </div>
    </>
  );
}