import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import Chart from "@/components/Chart";
import StatsCards from "@/components/StatsCards";
import TransactionTable from "@/components/TransactionTable";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";

export default function Accountpage() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { getToken } = useAuth();

  const [account,      setAccount]      = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [txLoading,    setTxLoading]    = useState(true);

  const location = useLocation();
const [highlightId, setHighlightId] = useState(
  location.state?.highlightTxId || null
);

useEffect(() => {
  if (!highlightId) return;
  const timer = setTimeout(() => setHighlightId(null), 3500);
  return () => clearTimeout(timer);  // cleanup on unmount
}, [highlightId]);

const fetchAccount = async () => {
  try {
    const token = await getToken();
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/accounts/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setAccount(res.data.data);
  } catch (e) {
    console.error("Error fetching account:", e.message);
  }
};

const fetchTransactions = async () => {
  try {
    setTxLoading(true);
    const token = await getToken();
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/transactions/account/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setTransactions(res.data.data || []);
  } catch (e) {
    console.error("Error fetching transactions:", e.message);
  } finally {
    setTxLoading(false);
  }
};



// call them on mount
useEffect(() => {
  fetchAccount();
  setLoading(false);
}, [id]);

useEffect(() => {
  fetchTransactions();
}, [id]);

useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}, []);

// delete handler uses both
const handleDeleteTransactions = async (ids) => {
  try {
    const token = await getToken();
    const res = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/transactions/bulk`,
      {
        headers: { Authorization: `Bearer ${token}` },
        data: { ids },
      }
    );

    if (res.data.success) {
      setTransactions(prev => prev.filter(t => !ids.includes(t._id)));
      toast.success(res.data.message);
      fetchAccount(); // refresh balance in header
    }
  } catch (err) {
    console.error("Bulk delete failed:", err);
    toast.error("Failed to delete transactions");
  }
};

const handleEditTransaction = async (txId, updatedData) => {
  try {
    const token = await getToken();
    const res = await axios.patch(
      `${import.meta.env.VITE_API_URL}/api/transactions/${txId}`,
      updatedData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.data.success) {
      // update local state instantly — no refetch needed
      setTransactions(prev =>
        prev.map(t => t._id === txId ? res.data.data : t)
      );
      toast.success("Transaction updated!");
      fetchAccount(); // refresh balance in header
    }
  } catch (err) {
    toast.error("Failed to update transaction");
  }
};


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .anim-fadeup   { animation: fadeUp 0.4s ease both; }
        .anim-fadeup-2 { animation: fadeUp 0.4s ease both 0.1s; }
        .anim-fadeup-3 { animation: fadeUp 0.4s ease both 0.18s; }
        .anim-fadeup-4 { animation: fadeUp 0.4s ease both 0.26s; }
      `}</style>

      <div className="min-h-screen bg-gray-50/80 px-4 sm:px-6 lg:px-10 pt-10 sm:pt-14 pb-16">
        <div className="max-w-6xl mx-auto">

          {/* ── Back button ── */}
          <button
            onClick={() => navigate("/dashboard")}
            className="anim-fadeup flex items-center gap-2 text-sm text-gray-400 hover:text-amber-500 transition-colors duration-150 mb-5 sm:mb-6 group"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform duration-150" />
            Back to accounts
          </button>

          {/* ── Hero Header ── */}
          <div className="anim-fadeup-2 flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-6 mb-6 sm:mb-8">
            <div className="min-w-0">
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">
                {account?.type?.charAt(0) + account?.type?.slice(1).toLowerCase()} Account
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 tracking-tight mt-1 truncate">
                {account?.name || "Account"}
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                {transactions.length} transaction{transactions.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Balance — left aligned on mobile, right on desktop */}
            <div className="sm:text-right shrink-0">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Current Balance</p>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 tracking-tight">
                <span className="text-lg sm:text-xl font-normal text-gray-400">₹</span>
                {parseFloat(account?.balance || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* divider */}
          <div className="h-px bg-gradient-to-r from-amber-400/50 to-transparent mb-6 sm:mb-8 anim-fadeup-2" />

          {/* ── Stat Cards ── */}
          <div className="anim-fadeup-3">
            <StatsCards transactions={transactions} />
          </div>

          {/* ── Chart ── */}
          <div className="anim-fadeup-4">
            <Chart transactions={transactions} loading={txLoading} />
          </div>

          {/* ── Transaction Table ── */}
          <div className="anim-fadeup-4">
            <TransactionTable onEdit={handleEditTransaction}  transactions={transactions} highlightId={highlightId} loading={txLoading} onDelete={handleDeleteTransactions}
/>
          </div>

        </div>
      </div>
    </>
  );
}











