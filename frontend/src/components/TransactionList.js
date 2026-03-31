import { useState } from "react";
import Modal from "./Modal";
import TransactionForm from "./TransactionForm";
import { toast } from "./Toast";
import API from "../services/api";
import "./TransactionList.css";

const CAT_ICONS = { food: "🍔", rent: "🏠", freelance: "💻", salary: "💼" };
const PAGE_SIZE = 8;

export default function TransactionList({ transactions, onRefresh }) {
  const [editTx, setEditTx] = useState(null);
  const [deleteTx, setDeleteTx] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(transactions.length / PAGE_SIZE);
  const paginated = transactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await API.delete(`/transactions/${deleteTx._id}`);
      toast("Transaction deleted", "success");
      setDeleteTx(null);
      onRefresh();
    } catch {
      toast("Failed to delete", "error");
    } finally {
      setDeleting(false);
    }
  };

  if (!transactions.length) return (
    <div className="empty-state">
      <div className="empty-icon">🧾</div>
      <strong>No transactions found</strong>
      <p>Add your first transaction or adjust your filters.</p>
    </div>
  );

  return (
    <>
      <div className="table-wrap">
        <table className="tx-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Description</th>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(t => (
              <tr key={t._id} className={`tx-row ${t.type}`}>
                <td>
                  <div className="tx-cat">
                    <span className="tx-cat-icon">{CAT_ICONS[t.category] || "📌"}</span>
                    <span>{t.category.charAt(0).toUpperCase() + t.category.slice(1)}</span>
                  </div>
                </td>
                <td className="tx-desc">{t.description || <span className="muted">—</span>}</td>
                <td className="tx-date">
                  {new Date(t.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td>
                  <span className={`badge badge-${t.type}`}>
                    {t.type === "income" ? "↑ Income" : "↓ Expense"}
                  </span>
                </td>
                <td>
                  <span className={`tx-amount ${t.type}`}>
                    {t.type === "income" ? "+" : "−"}₹{Number(t.amount).toLocaleString()}
                  </span>
                </td>
                <td>
                  <div className="row-actions">
                    <button className="btn-icon btn-icon-edit" onClick={() => setEditTx(t)} title="Edit">✏️</button>
                    <button className="btn-icon btn-icon-del" onClick={() => setDeleteTx(t)} title="Delete">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="pagination">
          <button className="pg-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <div className="pg-pages">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} className={`pg-num ${p === page ? "active" : ""}`} onClick={() => setPage(p)}>{p}</button>
            ))}
          </div>
          <button className="pg-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}

      {/* EDIT MODAL */}
      <Modal open={!!editTx} onClose={() => setEditTx(null)} title="Edit Transaction">
        <TransactionForm initial={editTx} onSuccess={() => { setEditTx(null); onRefresh(); }} onCancel={() => setEditTx(null)} />
      </Modal>

      {/* DELETE CONFIRM MODAL */}
      <Modal open={!!deleteTx} onClose={() => setDeleteTx(null)} title="Delete Transaction" maxWidth={420}>
        <div className="confirm-body">
          <div className="confirm-icon">🗑️</div>
          <p>Are you sure you want to delete this <strong>{deleteTx?.category}</strong> transaction of <strong>₹{deleteTx?.amount}</strong>?</p>
          <p className="confirm-sub">This action cannot be undone.</p>
          <div className="form-actions">
            <button className="btn btn-ghost" onClick={() => setDeleteTx(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Yes, Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
