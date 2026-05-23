import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "sonner";
import Account from "@/components/Account";
import BudgetSection from "@/components/BudgetSection";
import RecentBreakdown from "@/components/RecentBreakdown";


export default function Dashboard() {
  const { getToken } = useAuth();

  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAccounts = async () => {
    try {
      const token = await getToken();

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/accounts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAccounts(res.data.data || []);
    } catch (err) {
      console.log("Error fetching accounts:", err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const defaultAcc = accounts.find((a) => a.isDefault);

      if (!defaultAcc) return;

      const token = await getToken();

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/transactions/account/${defaultAcc._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTransactions(res.data.data || []);
    } catch (err) {
      console.log("Error fetching transactions:", err);
    }
  };

  const handleDeleteAccount = async (accountId) => {
  try {
    const token = await getToken();

    await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/accounts/${accountId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // instantly update UI
    setAccounts((prev) => prev.filter((acc) => acc._id !== accountId));

    toast.success("Account deleted successfully");
  } catch (err) {
    console.log(err);
    toast.error("Failed to delete account");
  }
};

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      await fetchAccounts();

      setLoading(false);
    };

    init();
  }, []);

  useEffect(() => {
    if (accounts.length > 0) {
      fetchTransactions();
    }
  }, [accounts]);

  const defaultAccount = accounts.find((a) => a.isDefault);

  useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">

{/* Dashboard Hero */}
<div className="mb-6">
  <div className="relative overflow-hidden rounded-[28px] border border-gray-200 bg-white px-6 sm:px-8 py-10 max-w-6xl mx-auto text-center shadow-[0_20px_60px_rgba(0,0,0,0.08)]">

    {/* soft white glow */}
    <div className="absolute -top-20 left-[-50px] h-60 w-60 rounded-full bg-gray-100 blur-3xl opacity-70" />
    <div className="absolute -bottom-24 right-[-50px] h-60 w-60 rounded-full bg-zinc-100 blur-3xl opacity-70" />

    {/* top black line */}
    <div className="absolute inset-x-0 top-0 h-[4px] bg-yellow-500" />

    <div className="relative z-10 flex flex-col items-center">

      {/* badge */}
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white shadow-black px-4 py-1.5 shadow-sm">
        <div className="h-4 w-4 rounded-full bg-red-500 animate-pulse" />

        <span className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-black">
          Finance Control Center
        </span>
      </div>

      {/* title */}
      <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-none">
  <span className="text-black">Dash</span>
  <span className="text-yellow-500">board</span>
</h1>

      {/* underline */}
      <div className="mt-4 h-[3px] w-20 rounded-full bg-black" />

      {/* subtitle */}
      <p className="mt-4 max-w-xl text-sm sm:text-[15px] leading-relaxed text-gray-600">
        Track spending, monitor budgets, and manage your finances with elegant insights.
      </p>

    </div>
  </div>
</div>
    {/* Budget */}
    <BudgetSection
      defaultAccount={defaultAccount}
      transactions={transactions}
    />

    {/* Charts + Recent Transactions */}
    <RecentBreakdown transactions={transactions} />

    {/* Accounts */}
    <Account
      accounts={accounts}
      onRefetch={fetchAccounts}
      onDeleteAccount={handleDeleteAccount}
    />

  </div>
);
}