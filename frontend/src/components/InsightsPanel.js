import { useState, useEffect } from "react";
import API from "../services/api";
import "./InsightsPanel.css";

const CAT_COLORS = { food: "#f59e0b", rent: "#6366f1", freelance: "#10b981", salary: "#3b82f6" };

export default function InsightsPanel() {
  const [filters, setFilters] = useState({ startDate: "", endDate: "" });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      const res = await API.get("/transactions", { params });
      const txns = Array.isArray(res.data) ? res.data : res.data.transactions || [];
      setData(txns);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const grouped = data
    ? data.reduce((acc, t) => {
        if (!acc[t.type]) acc[t.type] = {};
        acc[t.type][t.category] = (acc[t.type][t.category] || 0) + Number(t.amount);
        return acc;
      }, {})
    : {};

  const allVals = Object.values(grouped).flatMap(g => Object.values(g));
  const maxVal = allVals.length ? Math.max(...allVals) : 1;

  return (
    <div>
      {/* FILTERS */}
      <div className="insights-filters">
        <div className="date-range">
          <input
            type="date"
            value={filters.startDate}
            onChange={e => setFilters(f => ({ ...f, startDate: e.target.value }))}
          />
          <span className="date-sep">to</span>
          <input
            type="date"
            value={filters.endDate}
            onChange={e => setFilters(f => ({ ...f, endDate: e.target.value }))}
          />
        </div>
        <button className="btn-fetch" onClick={fetchInsights} disabled={loading}>
          {loading ? "Loading..." : "Apply"}
        </button>
        {(filters.startDate || filters.endDate) && (
          <button
            className="btn-clear-filter"
            onClick={() => {
              setFilters({ startDate: "", endDate: "" });
              setData(null);
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* EMPTY */}
      {data && Object.keys(grouped).length === 0 && (
        <div className="no-insights">
          <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
          <p>No transactions found for this period.</p>
        </div>
      )}

      {/* CHARTS */}
      {data && Object.keys(grouped).length > 0 && (
        <div className="insights-grid">
          {["income", "expense"].map(type =>
            grouped[type] ? (
              <div key={type} className="insights-section">
                <h4>{type === "income" ? "💰 Income" : "💸 Expenses"} by Category</h4>
                {Object.entries(grouped[type])
                  .sort((a, b) => b[1] - a[1])
                  .map(([cat, val]) => (
                    <div key={cat} className="insight-row">
                      <span className="insight-label">
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </span>
                      <div className="insight-bar-wrap">
                        <div
                          className="insight-bar"
                          style={{
                            width: `${(val / maxVal) * 100}%`,
                            background: CAT_COLORS[cat] || "#6366f1"
                          }}
                        />
                      </div>
                      <span className={`insight-amount ${type}`}>
                        ₹{Number(val).toLocaleString()}
                      </span>
                    </div>
                  ))}
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
