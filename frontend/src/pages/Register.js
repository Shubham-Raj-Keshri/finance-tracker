import { useState } from "react";
import API from "../services/api";
import { toast } from "../components/Toast";
import "./Auth.css";

export default function Register({ onNavigate }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast("All fields are required", "error");
    if (form.password.length < 6) return toast("Password must be at least 6 characters", "error");
    setLoading(true);
    try {
      await API.post("/auth/register", form);
      toast("Account created! Please log in.", "success");
      onNavigate("login");
    } catch (err) {
      toast(err.response?.data?.message || "Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-brand" onClick={() => onNavigate("home")}>💰 FinanceTracker</div>
          <h1 className="auth-left-title">Start your financial journey</h1>
          <p className="auth-left-sub">Create a free account and take control of your money today.</p>
          <div className="auth-features">
            {["Free forever","Secure JWT auth","CSV export","Category insights"].map(f => (
              <div key={f} className="auth-feature-item"><span className="auth-check">✓</span>{f}</div>
            ))}
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Create Account</h2>
            <p>Already have an account? <button className="link-btn" onClick={() => onNavigate("login")}>Sign in</button></p>
          </div>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <input placeholder="John Doe" value={form.name} onChange={set("name")} required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} required />
            </div>
            <div className="form-group">
              <label>Password <span className="optional">(min 6 chars)</span></label>
              <div className="input-wrap">
                <input type={showPwd ? "text" : "password"} placeholder="••••••••"
                  value={form.password} onChange={set("password")} required />
                <button type="button" className="pwd-toggle" onClick={() => setShowPwd(s => !s)}>
                  {showPwd ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            <button type="submit" className="btn-auth-submit" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : "Create Account →"}
            </button>
          </form>
          <button className="back-home" onClick={() => onNavigate("home")}>← Back to Home</button>
        </div>
      </div>
    </div>
  );
}
