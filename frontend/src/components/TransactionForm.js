import { useState, useEffect } from "react";
import { toast } from "./Toast";
import API from "../services/api";
import "./TransactionForm.css";

const INCOME_CATEGORIES = ["salary", "freelance"];
const EXPENSE_CATEGORIES = ["food", "rent"];
const CAT_ICONS = { food: "🍔", rent: "🏠", freelance: "💻", salary: "💼" };
const today = () => new Date().toISOString().split("T")[0];

export default function TransactionForm({ initial, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    type: "expense", amount: "", category: "food", description: "", date: today()
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initial) setForm({
      type: initial.type,
      amount: initial.amount,
      category: initial.category,
      description: initial.description || "",
      date: initial.date?.split("T")[0] || today()
    });
  }, [initial]);

  const handleTypeChange = type => {
    const defaultCat = type === "income" ? "salary" : "food";
    setForm(f => ({ ...f, type, category: defaultCat }));
  };

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) return toast("Enter a valid amount", "error");
    setLoading(true);
    try {
      if (initial) {
        await API.put(`/transactions/${initial._id}`, form);
        toast("Transaction updated!", "success");
      } else {
        await API.post("/transactions", form);
        toast("Transaction added!", "success");
      }
      onSuccess();
    } catch (err) {
      toast(err.response?.data?.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="tx-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label>Type</label>
          <div className="type-toggle">
            {["expense", "income"].map(t => (
              <button type="button" key={t}
                className={`type-btn ${form.type === t ? "active-" + t : ""}`}
                onClick={() => handleTypeChange(t)}>
                {t === "income" ? "💰 Income" : "💸 Expense"}
              </button>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>Amount (₹)</label>
          <input type="number" min="1" step="0.01" placeholder="0.00"
            value={form.amount} onChange={set("amount")} required />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Category</label>
          <select value={form.category} onChange={set("category")}>
            {(form.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(c => (
              <option key={c} value={c}>{CAT_ICONS[c]} {c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Date</label>
          <input type="date" value={form.date} max={today()} onChange={set("date")} required />
        </div>
      </div>
      <div className="form-group">
        <label>Description <span className="optional">(optional)</span></label>
        <input placeholder="Add a note..." value={form.description} onChange={set("description")} />
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className={`btn ${initial ? "btn-success" : "btn-primary"}`} disabled={loading}>
          {loading ? "Saving..." : initial ? "Update Transaction" : "Add Transaction"}
        </button>
      </div>
    </form>
  );
}
