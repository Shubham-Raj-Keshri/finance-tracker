// d:\finance-tracker\frontend\src\components\TransactionForm.js
import { useState, useEffect } from "react";

const CATEGORIES = {
  expense: ["Food", "Transport", "Housing", "Health", "Shopping", "Entertainment", "Education", "Other"],
  income: ["Salary", "Freelance", "Investment", "Gift", "Other"]
};

function TransactionForm({ onSubmit, onCancel, initial }) {
  const [form, setForm] = useState({ type: "expense", amount: "", category: "", note: "", date: new Date().toISOString().split("T")[0] });

  useEffect(() => {
    if (initial) setForm({ ...initial, date: initial.date?.split("T")[0] || new Date().toISOString().split("T")[0] });
  }, [initial]);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = () => {
    if (!form.amount || !form.category) return alert("Amount and category are required");
    onSubmit(form);
  };

  return (
    <div className="form-grid">
      <div className="form-group">
        <label>Type</label>
        <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value, category: "" }))}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>
      <div className="form-group">
        <label>Amount (₹)</label>
        <input type="number" min="0" placeholder="0.00" value={form.amount} onChange={set("amount")} />
      </div>
      <div className="form-group">
        <label>Category</label>
        <select value={form.category} onChange={set("category")}>
          <option value="">Select...</option>
          {CATEGORIES[form.type].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label>Date</label>
        <input type="date" value={form.date} onChange={set("date")} />
      </div>
      <div className="form-group">
        <label>Note</label>
        <input placeholder="Optional note" value={form.note} onChange={set("note")} />
      </div>
      <div className="form-group" style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
        <button className="btn-add" onClick={handleSubmit}>{initial ? "Update" : "Add"}</button>
        {onCancel && <button className="btn-cancel" onClick={onCancel}>Cancel</button>}
      </div>
    </div>
  );
}

export default TransactionForm;
