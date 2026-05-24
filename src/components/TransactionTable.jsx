import { useState } from "react";
import {
  Search, ChevronDown, SlidersHorizontal,
  Clock, RefreshCw, ChevronLeft, ChevronRight,
  Trash2, Pencil, X, Check, Loader2
} from "lucide-react";

const TX_TYPES     = ["All Types", "Income", "Expense"];
const TX_RECURRING = ["All", "Recurring", "One-time"];
const PAGE_SIZE    = 10;

const CATEGORIES = {
  EXPENSE: ["Housing","Food","Transport","Entertainment","Shopping","Utilities","Travel","Healthcare","Rental","Other"],
  INCOME:  ["Salary","Freelance","Investments","Business","Gift","Other"],
};

const CATEGORY_COLORS = {
  Entertainment: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" },
  Salary:        { bg: "bg-green-100",  text: "text-green-700",  border: "border-green-200"  },
  Freelance:     { bg: "bg-cyan-100",   text: "text-cyan-700",   border: "border-cyan-200"   },
  Investments:   { bg: "bg-blue-100",   text: "text-blue-700",   border: "border-blue-200"   },
  Utilities:     { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200" },
  Travel:        { bg: "bg-teal-100",   text: "text-teal-700",   border: "border-teal-200"   },
  Rental:        { bg: "bg-amber-100",  text: "text-amber-700",  border: "border-amber-200"  },
  Food:          { bg: "bg-rose-100",   text: "text-rose-700",   border: "border-rose-200"   },
};

function getCategoryStyle(cat) {
  return CATEGORY_COLORS[cat] || { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-200" };
}

export default function TransactionTable({ transactions, loading, onDelete, onEdit, highlightId }) {

  // ── filter / sort state ──
  const [txType,      setTxType]      = useState("All Types");
  const [txRecurring, setTxRecurring] = useState("All");
  const [search,      setSearch]      = useState("");
  const [page,        setPage]        = useState(1);
  const [typeOpen,    setTypeOpen]    = useState(false);
  const [recurOpen,   setRecurOpen]   = useState(false);
  const [sortField,   setSortField]   = useState("date");
  const [sortDir,     setSortDir]     = useState("desc");

  // ── selection / delete state ──
  const [selected,    setSelected]    = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);

  // ── per-row action menu ──
  const [menuOpenId,  setMenuOpenId]  = useState(null); // which row's menu is open

  // ── edit modal state ──
  const [editTx,       setEditTx]       = useState(null);   // transaction being edited
  const [editForm,     setEditForm]     = useState({});
  const [editLoading,  setEditLoading]  = useState(false);
  const [catEditOpen,  setCatEditOpen]  = useState(false);

  // ── sort handler — ChevronDown rotates to show direction ──
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
    setPage(1);
  };

  // ── filter ──
  const filtered = transactions.filter(t => {
    const matchType      = txType === "All Types" || t.type === txType.toUpperCase();
    const matchRecurring = txRecurring === "All" ? true : txRecurring === "Recurring" ? t.isRecurring : !t.isRecurring;
    const matchSearch    = t.description?.toLowerCase().includes(search.toLowerCase()) ||
                           t.category?.toLowerCase().includes(search.toLowerCase());
    return matchType && matchRecurring && matchSearch;
  });

  // ── sort ──
  const sorted = [...filtered].sort((a, b) => {
    if (sortField === "date") {
      const diff = new Date(a.date) - new Date(b.date);
      return sortDir === "asc" ? diff : -diff;
    }
    if (sortField === "amount") {
      const diff = Math.abs(a.amount) - Math.abs(b.amount);
      return sortDir === "asc" ? diff : -diff;
    }
    return 0;
  });

  // ── pagination ──
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated  = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── checkbox ──
  const toggleSelect = (txId) =>
    setSelected(s => s.includes(txId) ? s.filter(x => x !== txId) : [...s, txId]);
  const toggleAll = () =>
    setSelected(selected.length === paginated.length ? [] : paginated.map(t => t._id));

  // ── bulk delete ──
  const handleDeleteClick = () => setShowConfirm(true);
  const cancelDelete      = () => setShowConfirm(false);
  const confirmDelete     = () => { onDelete?.(selected); setSelected([]); setShowConfirm(false); };

  // ── single delete from row menu ──
  const handleSingleDelete = (txId) => {
    setMenuOpenId(null);
    onDelete?.([txId]);
  };

  // ── open edit modal ──
  const openEdit = (tx) => {
    setMenuOpenId(null);
    setEditTx(tx);
    setEditForm({
      type:        tx.type,
      amount:      tx.amount,
      category:    tx.category,
      date:        new Date(tx.date).toISOString().split("T")[0],
      description: tx.description || "",
      isRecurring: tx.isRecurring || false,
    });
  };

  const handleEditChange = (field, value) => {
    setEditForm(p => ({
      ...p,
      [field]: value,
      ...(field === "type" ? { category: "" } : {}),
    }));
  };

  // ── submit edit ──
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      await onEdit(editTx._id, { ...editForm, amount: parseFloat(editForm.amount) });
      setEditTx(null);
    } finally {
      setEditLoading(false);
    }
  };

  // ── sortable column header with ChevronDown ──
  const SortableHeader = ({ field, label, className = "" }) => (
    <button
      onClick={() => handleSort(field)}
      className={`flex items-center gap-1 hover:text-gray-600 transition-colors duration-150 ${className}`}
    >
      {label}
      <ChevronDown
        size={12}
        className={`text-gray-400 transition-transform duration-200
          ${sortField === field && sortDir === "asc" ? "rotate-180 text-amber-500" : ""}
          ${sortField === field && sortDir === "desc" ? "text-amber-500" : ""}
        `}
      />
    </button>
  );

  // ── shared dropdown item ──
  const DropdownItem = ({ label, active, onClick, icon }) => (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm transition-colors flex items-center justify-between gap-2
        ${active ? "bg-amber-50 text-amber-600 font-semibold" : "text-gray-600 hover:bg-gray-50"}`}
    >
      <span className="flex items-center gap-2">{icon}{label}</span>
      {active && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />}
    </button>
  );

  return (
    <>
      <style>{`
        @keyframes highlightRow {
          0%   { background-color: rgba(251,191,36,0.22); }
          70%  { background-color: rgba(251,191,36,0.12); }
          100% { background-color: transparent; }
        }
        .highlight-row { animation: highlightRow 3.5s ease-out forwards; border-left: 3px solid #f59e0b; }

        @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
        @keyframes scaleUp { from { opacity:0; transform:scale(0.95) translateY(6px); } to { opacity:1; transform:scale(1) translateY(0); } }
        .modal-backdrop { animation: fadeIn 0.15s ease both; }
        .modal-card     { animation: scaleUp 0.22s ease both; }

        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }

        .tog-input { position:absolute; opacity:0; width:0; height:0; }
        .tog-track { position:absolute; inset:0; border-radius:9999px; background:#e5e7eb; transition:background 0.2s; }
        .tog-thumb {
          position:absolute; top:3px; left:3px; width:14px; height:14px; border-radius:9999px;
          background:#fff; box-shadow:0 1px 3px rgba(0,0,0,0.2);
          transition:transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
        }
        .tog-input:checked ~ .tog-track { background:#f59e0b; }
        .tog-input:checked ~ .tog-thumb { transform:translateX(16px); }
      `}</style>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* ══ Toolbar ══ */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
         <div className="relative flex-1">

  <Search
    size={16}
    strokeWidth={2.5}
    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600"
  />

  <input
    value={search}
    onChange={e => {
      setSearch(e.target.value);
      setPage(1);
    }}
    placeholder="Search transactions..."
    className="
      w-full
      pl-11
      pr-4
      py-2.5
      sm:py-3
      text-sm
      text-gray-800
      bg-white
      border
      border-gray-300
      rounded-xl
      shadow-sm
      outline-none
      placeholder-gray-500
      focus:border-amber-400
      focus:ring-2
      focus:ring-amber-400/15
      transition-all
      duration-200
    "
  />

</div>

          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap sm:flex-nowrap">
            {selected.length > 0 && (
              <button
                onClick={handleDeleteClick}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-red-500 bg-red-50 border border-red-100 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 hover:bg-red-100 transition-all duration-150 whitespace-nowrap"
              >
                <Trash2 size={12} /> Delete ({selected.length})
              </button>
            )}

            {/* Type filter */}
            <div className="relative">
              <button
                onClick={() => { setTypeOpen(o => !o); setRecurOpen(false); }}
                className={`flex items-center gap-1.5 text-xs sm:text-sm font-medium border rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 transition-colors duration-150 whitespace-nowrap
                  ${txType !== "All Types" ? "bg-amber-50 border-amber-300 text-amber-600" : "bg-gray-50 border-gray-200 text-gray-600 hover:border-amber-300"}`}
              >
                <SlidersHorizontal size={12} className={txType !== "All Types" ? "text-amber-500" : "text-gray-400"} />
                {txType}
                <ChevronDown size={12} className={`transition-transform duration-200 ${typeOpen ? "rotate-180" : ""}`} />
              </button>
              {typeOpen && (
                <div className="absolute right-0 mt-2 w-36 sm:w-40 bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden">
                  {TX_TYPES.map(t => (
                    <DropdownItem key={t} label={t} active={txType === t}
                      onClick={() => { setTxType(t); setTypeOpen(false); setPage(1); }} />
                  ))}
                </div>
              )}
            </div>

            {/* Recurring filter */}
            <div className="relative">
              <button
                onClick={() => { setRecurOpen(o => !o); setTypeOpen(false); }}
                className={`flex items-center gap-1.5 text-xs sm:text-sm font-medium border rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 transition-colors duration-150 whitespace-nowrap
                  ${txRecurring !== "All" ? "bg-blue-50 border-blue-300 text-blue-600" : "bg-gray-50 border-gray-200 text-gray-600 hover:border-amber-300"}`}
              >
                <RefreshCw size={12} className={txRecurring !== "All" ? "text-blue-500" : "text-gray-400"} />
                {txRecurring}
                <ChevronDown size={12} className={`transition-transform duration-200 ${recurOpen ? "rotate-180" : ""}`} />
              </button>
              {recurOpen && (
                <div className="absolute right-0 mt-2 w-36 sm:w-40 bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden">
                  <DropdownItem label="All"       active={txRecurring === "All"}       onClick={() => { setTxRecurring("All");       setRecurOpen(false); setPage(1); }} />
                  <DropdownItem label="Recurring" active={txRecurring === "Recurring"} onClick={() => { setTxRecurring("Recurring"); setRecurOpen(false); setPage(1); }} icon={<RefreshCw size={11} className="text-blue-400" />} />
                  <DropdownItem label="One-time"  active={txRecurring === "One-time"}  onClick={() => { setTxRecurring("One-time");  setRecurOpen(false); setPage(1); }} icon={<Clock size={11} className="text-gray-400" />} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* active filter pills */}
        {(txType !== "All Types" || txRecurring !== "All") && (
          <div className="flex items-center gap-2 px-4 sm:px-6 py-2 bg-gray-50/60 border-b border-gray-100 flex-wrap">
            <span className="text-[0.65rem] text-gray-400 uppercase tracking-wider font-medium">Filters:</span>
            {txType !== "All Types" && (
              <span className="inline-flex items-center gap-1 text-[0.65rem] font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-0.5">
                {txType} <button onClick={() => { setTxType("All Types"); setPage(1); }}>×</button>
              </span>
            )}
            {txRecurring !== "All" && (
              <span className="inline-flex items-center gap-1 text-[0.65rem] font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-full px-2.5 py-0.5">
                {txRecurring} <button onClick={() => { setTxRecurring("All"); setPage(1); }}>×</button>
              </span>
            )}
            <button onClick={() => { setTxType("All Types"); setTxRecurring("All"); setPage(1); }} className="text-[0.65rem] text-gray-400 hover:text-red-500 font-medium ml-auto transition-colors">
              Clear all
            </button>
          </div>
        )}

        {/* ══ Table Header ══ */}
        <div className="hidden sm:grid grid-cols-[2rem_1fr_2fr_1.5fr_1fr_1fr_2.5rem] gap-3 px-6 py-3 text-[0.62rem] font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-50 bg-gray-50/60">
          <div>
            <input type="checkbox" className="rounded w-3.5 h-3.5 accent-amber-500"
              checked={selected.length === paginated.length && paginated.length > 0}
              onChange={toggleAll}
            />
          </div>
          {/* ChevronDown on Date */}
          <SortableHeader field="date"   label="Date" />
          <span>Description</span>
          <span>Category</span>
          {/* ChevronDown on Amount */}
          <SortableHeader field="amount" label="Amount" className="justify-end" />
          <span>Recurring</span>
          <span />
        </div>

        {/* ══ Mobile Select All ══ */}
<div className="sm:hidden flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/60">
  <label className="flex items-center gap-2">
    <input
      type="checkbox"
      className="rounded w-3.5 h-3.5 accent-amber-500"
      checked={
        selected.length === paginated.length &&
        paginated.length > 0
      }
      onChange={toggleAll}
    />

    <span className="text-xs font-semibold text-gray-600">
      Select All
    </span>
  </label>

  {selected.length > 0 && (
    <span className="text-[11px] text-amber-600 font-semibold">
      {selected.length} selected
    </span>
  )}
</div>

        {/* ══ Rows ══ */}
        {loading ? (
          <div className="p-4 sm:p-6 flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 sm:h-12 rounded-xl bg-gradient-to-r from-gray-100 to-gray-50 animate-pulse" />
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div className="py-12 sm:py-16 text-center">
            <p className="text-sm text-gray-400">No transactions found.</p>
            {(txType !== "All Types" || txRecurring !== "All" || search) && (
              <button onClick={() => { setTxType("All Types"); setTxRecurring("All"); setSearch(""); setPage(1); }}
                className="mt-2 text-xs text-amber-500 hover:text-amber-600 font-medium">
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {paginated.map((tx) => {
              const cat   = getCategoryStyle(tx.category);
              const isInc = tx.type === "INCOME";
              const isSel = selected.includes(tx._id);
              const isHL  = highlightId === tx._id;
              const menuOpen = menuOpenId === tx._id;

              return (
                <div
                  key={tx._id}
                  className={`flex sm:grid sm:grid-cols-[2rem_1fr_2fr_1.5fr_1fr_1fr_2.5rem] gap-2 sm:gap-3 items-center px-4 sm:px-6 py-3 sm:py-3.5 transition-colors duration-100
                    ${isSel ? "bg-amber-50/50" : ""}
                    ${isHL  ? "highlight-row"  : !isSel ? "hover:bg-gray-50/70" : ""}
                  `}
                >
                  <input type="checkbox" checked={isSel} onChange={() => toggleSelect(tx._id)}
                    className="rounded w-3.5 h-3.5 accent-amber-500 shrink-0" />

                  <div className="flex sm:contents items-center justify-between flex-1 min-w-0">
                    {/* Date — mobile */}
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-600 whitespace-nowrap">
                        {new Date(tx.date).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })}
                      </p>
                      <p className="sm:hidden text-xs text-gray-400 mt-0.5 truncate">{tx.description}</p>
                      <div className="sm:hidden mt-1 flex items-center gap-1.5 flex-wrap">
                        <span className={`inline-flex items-center text-[0.55rem] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border ${cat.bg} ${cat.text} ${cat.border}`}>
                          {tx.category}
                        </span>
                        {tx.isRecurring && (
                          <span className="inline-flex items-center gap-1 text-[0.55rem] font-semibold text-blue-500 bg-blue-50 border border-blue-100 rounded-full px-2 py-0.5">
                            <RefreshCw size={8} /> Recurring
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Amount — mobile right */}
                    <div className="sm:hidden flex flex-col items-end shrink-0 ml-2">
                      <p className={`text-xs font-bold ${isInc ? "text-emerald-600" : "text-red-500"}`}>
                        {isInc ? "+" : "-"}₹{Math.abs(tx.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-[0.6rem] text-gray-400 mt-0.5">{tx.isRecurring ? "Recurring" : "One-time"}</p>
                    </div>

                    {/* Desktop columns */}
                    <p className="hidden sm:block text-sm text-gray-700 truncate">{tx.description}</p>
                    <div className="hidden sm:flex">
                      <span className={`inline-flex items-center text-[0.63rem] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full border ${cat.bg} ${cat.text} ${cat.border}`}>
                        {tx.category}
                      </span>
                    </div>
                    <p className={`hidden sm:block text-sm font-bold text-right tracking-tight ${isInc ? "text-emerald-600" : "text-red-500"}`}>
                      {isInc ? "+" : "-"}₹{Math.abs(tx.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </p>
                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400">
                      {tx.isRecurring
                        ? <><RefreshCw size={11} className="text-blue-400" /><span className="text-blue-500 font-medium">Recurring</span></>
                        : <><Clock size={11} /> One-time</>
                      }
                    </div>

                    {/* ── Three dot menu ── */}
<div className="hidden sm:block relative">
  <button
    onClick={() => setMenuOpenId(menuOpen ? null : tx._id)}
    className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-500 transition-colors"
  >
    <ChevronDown size={14} className={`transition-transform duration-200 ${menuOpen ? "rotate-180 text-amber-500" : ""}`} />
  </button>

  {menuOpen && (
    <div className="absolute right-0 bottom-full mb-1 w-36 bg-white border border-gray-100 rounded-xl shadow-lg z-30 overflow-hidden">
      <button
        onClick={() => openEdit(tx)}
        className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-amber-50 hover:text-amber-600 flex items-center gap-2 transition-colors"
      >
        <Pencil size={13} /> Edit
      </button>
      <button
        onClick={() => handleSingleDelete(tx._id)}
        className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors"
      >
        <Trash2 size={13} /> Delete
      </button>
    </div>
  )}
</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ══ Pagination ══ */}
{totalPages > 1 && (
  <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100">

    <p className="text-xs sm:text-sm text-gray-500">
      Page{" "}
      <span className="font-semibold text-gray-800">
        {page}
      </span>{" "}
      of{" "}
      <span className="font-semibold text-gray-800">
        {totalPages}
      </span>
    </p>

    <div className="flex items-center gap-2">

      {/* Previous Button */}
      <button
        onClick={() => setPage(p => Math.max(1, p - 1))}
        disabled={page === 1}
        className="
          w-8 h-8 sm:w-9 sm:h-9
          rounded-xl
          border border-gray-300
          bg-white
          shadow-sm
          flex items-center justify-center
          text-gray-700
          hover:border-amber-500
          hover:bg-amber-50
          hover:text-amber-600
          disabled:opacity-40
          disabled:cursor-not-allowed
          transition-all duration-200
        "
      >
        <ChevronLeft
          size={17}
          strokeWidth={2.7}
        />
      </button>

      {/* Next Button */}
      <button
        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
        disabled={page === totalPages}
        className="
          w-8 h-8 sm:w-9 sm:h-9
          rounded-xl
          border border-gray-300
          bg-white
          shadow-sm
          flex items-center justify-center
          text-gray-700
          hover:border-amber-500
          hover:bg-amber-50
          hover:text-amber-600
          disabled:opacity-40
          disabled:cursor-not-allowed
          transition-all duration-200
        "
      >
        <ChevronRight
          size={17}
          strokeWidth={2.7}
        />
      </button>

    </div>
  </div>
)}
      </div>

      {/* ══ Bulk Delete Confirm ══ */}
      {showConfirm && (
        <div className="modal-backdrop fixed inset-0 z-50 bg-black/25 backdrop-blur-sm flex items-center justify-center px-4" onClick={cancelDelete}>
          <div className="modal-card bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm border border-gray-100" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={20} className="text-red-500" />
            </div>
            <h3 className="text-base font-bold text-gray-800 text-center">Delete Transactions?</h3>
            <p className="text-sm text-gray-400 text-center mt-1.5 leading-relaxed">
              You are about to delete{" "}
              <span className="font-semibold text-gray-600">{selected.length} transaction{selected.length !== 1 ? "s" : ""}</span>.
              This action cannot be undone.
            </p>
            <div className="flex gap-3 mt-6">
              <button onClick={cancelDelete} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all duration-150">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-all duration-150 flex items-center justify-center gap-2">
                <Trash2 size={13} /> Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ Edit Modal ══ */}
      {editTx && (
        <div className="modal-backdrop fixed inset-0 z-50 bg-black/25 backdrop-blur-sm flex items-center justify-center px-4" onClick={() => setEditTx(null)}>
          <div className="modal-card bg-white rounded-2xl shadow-xl w-full max-w-md border border-gray-100 overflow-hidden" onClick={e => e.stopPropagation()}>

            {/* amber top bar */}
            <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400" />

            {/* header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Pencil size={15} className="text-amber-500" />
                <h3 className="text-sm font-bold text-gray-800">Edit Transaction</h3>
              </div>
              <button onClick={() => setEditTx(null)} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 transition-colors">
                <X size={14} strokeWidth={2.5} />
              </button>
            </div>

            {/* form */}
            <form onSubmit={handleEditSubmit} className="px-6 py-5 flex flex-col gap-4">

              {/* Type */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {["EXPENSE","INCOME"].map(t => (
                    <button key={t} type="button" onClick={() => handleEditChange("type", t)}
                      className={`py-2.5 rounded-xl border text-xs font-semibold transition-all duration-150
                        ${editForm.type === t && t === "EXPENSE" ? "border-red-300 bg-red-50 text-red-600"     : ""}
                        ${editForm.type === t && t === "INCOME"  ? "border-emerald-300 bg-emerald-50 text-emerald-600" : ""}
                        ${editForm.type !== t ? "border-gray-200 text-gray-400 hover:bg-gray-50" : ""}
                      `}
                    >
                      {t.charAt(0) + t.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">₹</span>
                  <input type="number" value={editForm.amount} onChange={e => handleEditChange("amount", e.target.value)}
                    min="0" step="0.01" required
                    className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-2.5 text-sm text-gray-800 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/15 transition-all duration-150"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Category</label>
                <div className="relative">
                  <button type="button" onClick={() => setCatEditOpen(o => !o)}
                    className="w-full flex items-center justify-between border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white hover:border-amber-300 transition-all">
                    <span className={editForm.category ? "text-gray-800 font-medium" : "text-gray-300"}>
                      {editForm.category || "Select category"}
                    </span>
                    <ChevronDown size={13} className={`text-gray-400 transition-transform ${catEditOpen ? "rotate-180" : ""}`} />
                  </button>
                  {catEditOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-20 max-h-44 overflow-y-auto">
                      {(CATEGORIES[editForm.type] || []).map(c => (
                        <button key={c} type="button" onClick={() => { handleEditChange("category", c); setCatEditOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between
                            ${editForm.category === c ? "bg-amber-50 text-amber-600 font-semibold" : "text-gray-600 hover:bg-gray-50"}`}>
                          {c}
                          {editForm.category === c && <Check size={13} className="text-amber-400" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Date */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Date</label>
                <input type="date" value={editForm.date} onChange={e => handleEditChange("date", e.target.value)} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/15 transition-all duration-150"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Description</label>
                <textarea value={editForm.description} onChange={e => handleEditChange("description", e.target.value)}
                  placeholder="Add a note..." rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/15 transition-all duration-150 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setEditTx(null)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all duration-150">
                  Cancel
                </button>
                <button type="submit" disabled={editLoading}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 shadow-md shadow-amber-200 transition-all duration-150 disabled:opacity-60 flex items-center justify-center gap-2">
                  {editLoading ? <><Loader2 size={13} className="animate-spin" /> Saving...</> : <><Check size={13} /> Save Changes</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}