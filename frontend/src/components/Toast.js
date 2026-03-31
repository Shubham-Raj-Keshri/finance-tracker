import { useState, useEffect, useCallback } from "react";
import "./Toast.css";

let _addToast = null;

export function toast(message, type = "success") {
  if (_addToast) _addToast(message, type);
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type) => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  useEffect(() => { _addToast = addToast; }, [addToast]);

  const icons = { success: "✅", error: "❌", warning: "⚠️", info: "ℹ️" };

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span className="toast-icon">{icons[t.type] || "ℹ️"}</span>
          <span className="toast-msg">{t.message}</span>
          <button className="toast-close" onClick={() => setToasts(ts => ts.filter(x => x.id !== t.id))}>✕</button>
        </div>
      ))}
    </div>
  );
}
