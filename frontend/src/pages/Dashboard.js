import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import InsightsPanel from "../components/InsightsPanel";
import Modal from "../components/Modal";
import { toast } from "../components/Toast";
import "./Dashboard.css";

const CAT_ICONS = { food:"🍔", rent:"🏠", freelance:"💻", salary:"💼" };

function DonutChart({ income, expense }) {
  const total = income + expense || 1;
  const incDeg = (income / total) * 360;
  const incPct = Math.round((income / total) * 100);
  return (
    <div className="donut-card">
      <div className="donut-card-title">Budget Overview</div>
      <div className="donut-wrap">
        <div className="donut-chart" style={{ background: `conic-gradient(#10b981 0deg ${incDeg}deg, #ef4444 ${incDeg}deg 360deg)` }}>
          <div className="donut-hole">
            <span className="donut-pct">{income + expense > 0 ? `${incPct}%` : "—"}</span>
            <span className="donut-sub">income</span>
          </div>
        </div>
        <div className="donut-legend">
          <div className="legend-item">
            <div className="legend-dot" style={{ background: "#10b981" }} />
            <div className="legend-info"><div className="legend-name">Income</div><div className="legend-val">₹{Number(income).toLocaleString()}</div></div>
            <span className="legend-pct income">{incPct}%</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ background: "#ef4444" }} />
            <div className="legend-info"><div className="legend-name">Expenses</div><div className="legend-val">₹{Number(expense).toLocaleString()}</div></div>
            <span className="legend-pct expense">{100 - incPct}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function downloadCSV(transactions) {
  if (!transactions.length) return toast("No transactions to export", "warning");
  const headers = ["Date", "Type", "Category", "Amount", "Description"];
  const rows = transactions.map(t => [
    new Date(t.date).toLocaleDateString("en-IN"),
    t.type, t.category, t.amount, t.description || ""
  ]);
  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `transactions_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast("CSV downloaded!", "success");
}

export default function Dashboard({ userName, onLogout }) {
  const [tab, setTab] = useState("overview");
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [filters, setFilters] = useState({ type: "", category: "", startDate: "", endDate: "" });
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchSummary = useCallback(async () => {
    try {
      const res = await API.get("/transactions/summary");
      setSummary(res.data);
    } catch {}
  }, []);

  const fetchTransactions = useCallback(async () => {
    try {
      const params = {};
      if (filters.type) params.type = filters.type;
      if (filters.category) params.category = filters.category;
      if (filters.startDate && filters.endDate) { params.startDate = filters.startDate; params.endDate = filters.endDate; }
      const res = await API.get("/transactions", { params });
      setTransactions(Array.isArray(res.data) ? res.data : res.data.transactions || []);
    } catch {}
  }, [filters]);

  useEffect(() => { fetchSummary(); }, [fetchSummary]);
  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const refresh = () => { fetchTransactions(); fetchSummary(); };

  const setFilter = k => e => setFilters(f => ({ ...f, [k]: e.target.value }));
  const clearFilters = () => setFilters({ type: "", category: "", startDate: "", endDate: "" });
  const hasFilters = Object.values(filters).some(Boolean);
  const initials = userName ? userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "U";
  const balance = summary.balance ?? (summary.income - summary.expense);
  const recent = [...transactions].slice(0, 5);

  const NAV = [
    { id: "overview", icon: "📊", label: "Overview" },
    { id: "transactions", icon: "💳", label: "Transactions" },
    { id: "insights", icon: "📈", label: "Insights" },
  ];

  return (
    <div className="app-layout">
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-brand"><span>💰</span> FinanceTracker</div>
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div>
            <div className="sidebar-username">{userName}</div>
            <div className="sidebar-role">Personal Budget</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {NAV.map(n => (
            <button key={n.id} className={`nav-item ${tab === n.id ? "active" : ""}`}
              onClick={() => { setTab(n.id); setSidebarOpen(false); }}>
              <span className="nav-icon">{n.icon}</span>{n.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="btn-sidebar-logout" onClick={onLogout}><span>🚪</span> Logout</button>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="hamburger" onClick={() => setSidebarOpen(o => !o)}>☰</button>
            <span className="topbar-title">
              {tab === "overview" && "Overview"}
              {tab === "transactions" && "Transactions"}
              {tab === "insights" && "Insights"}
            </span>
          </div>
          <div className="topbar-right">
            {tab === "transactions" && transactions.length > 0 && (
              <button className="btn-csv" onClick={() => downloadCSV(transactions)}>⬇ Export CSV</button>
            )}
            <button className="btn-add-new" onClick={() => setShowModal(true)}>+ Add Transaction</button>
          </div>
        </header>

        <div className="page-content">

          {tab === "overview" && (
            <>
              <div className="summary-cards">
                <div className="card income">
                  <div className="card-top"><span className="card-label">Total Income</span><div className="card-icon-wrap">💚</div></div>
                  <div className="card-value">₹{Number(summary.income).toLocaleString()}</div>
                  <div className="card-sub">All time earnings</div>
                  <div className="card-bar"><div className="card-bar-fill" style={{ width: summary.income + summary.expense > 0 ? `${(summary.income / (summary.income + summary.expense)) * 100}%` : "0%" }} /></div>
                </div>
                <div className="card expense">
                  <div className="card-top"><span className="card-label">Total Expenses</span><div className="card-icon-wrap">❤️</div></div>
                  <div className="card-value">₹{Number(summary.expense).toLocaleString()}</div>
                  <div className="card-sub">All time spending</div>
                  <div className="card-bar"><div className="card-bar-fill" style={{ width: summary.income + summary.expense > 0 ? `${(summary.expense / (summary.income + summary.expense)) * 100}%` : "0%" }} /></div>
                </div>
                <div className="card balance">
                  <div className="card-top"><span className="card-label">Net Balance</span><div className="card-icon-wrap">💜</div></div>
                  <div className="card-value">₹{Number(balance).toLocaleString()}</div>
                  <div className="card-sub">{balance >= 0 ? "You're in the green 🎉" : "Spending exceeds income"}</div>
                  <div className="card-bar"><div className="card-bar-fill" style={{ width: summary.income > 0 ? `${Math.min(Math.max((balance / summary.income) * 100, 0), 100)}%` : "0%" }} /></div>
                </div>
              </div>

              <div className="overview-grid">
                <DonutChart income={summary.income} expense={summary.expense} />
                <div className="recent-card">
                  <div className="recent-card-header">
                    <h3>Recent Transactions</h3>
                    <button className="btn-view-all" onClick={() => setTab("transactions")}>View All</button>
                  </div>
                  {recent.length === 0
                    ? <div className="recent-empty">No transactions yet. Add one!</div>
                    : <div className="recent-list">
                        {recent.map(t => (
                          <div key={t._id} className={`recent-item ${t.type}`}>
                            <div className="recent-icon">{CAT_ICONS[t.category] || "📌"}</div>
                            <div className="recent-info">
                              <div className="recent-cat">{t.category}</div>
                              <div className="recent-date">{new Date(t.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                            </div>
                            <span className={`recent-amt ${t.type}`}>{t.type === "income" ? "+" : "−"}₹{Number(t.amount).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                  }
                </div>
              </div>
            </>
          )}

          {tab === "transactions" && (
            <div className="panel">
              <div className="panel-header">
                <span className="panel-title">
                  All Transactions
                  {hasFilters && <span className="filter-badge">Filtered</span>}
                  <span className="tx-count">{transactions.length} records</span>
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  {transactions.length > 0 && <button className="btn-csv" onClick={() => downloadCSV(transactions)}>⬇ CSV</button>}
                  <button className="btn-add-new" onClick={() => setShowModal(true)}>+ Add</button>
                </div>
              </div>
              <div className="filters-bar">
                <select value={filters.type} onChange={setFilter("type")}>
                  <option value="">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
                <select value={filters.category} onChange={setFilter("category")}>
                  <option value="">All Categories</option>
                  {["food","rent","freelance","salary"].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
                </select>
                <div className="date-range">
                  <input type="date" value={filters.startDate} onChange={setFilter("startDate")} />
                  <span className="date-sep">to</span>
                  <input type="date" value={filters.endDate} onChange={setFilter("endDate")} />
                </div>
                {hasFilters && <button className="btn-clear-filter" onClick={clearFilters}>✕ Clear</button>}
              </div>
              <TransactionList transactions={transactions} onRefresh={refresh} />
            </div>
          )}

          {tab === "insights" && (
            <div className="panel">
              <div className="panel-title" style={{ marginBottom: 20 }}>Spending Insights</div>
              <InsightsPanel />
            </div>
          )}
        </div>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="➕ Add Transaction">
        <TransactionForm onSuccess={() => { setShowModal(false); refresh(); }} onCancel={() => setShowModal(false)} />
      </Modal>
    </div>
  );
}
