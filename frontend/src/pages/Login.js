import { useState } from "react";
import API from "../services/api";
import { toast } from "../components/Toast";
import "./Auth.css";

export default function Login({ onLogin, onNavigate }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.email || !form.password) return toast("All fields are required", "error");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      toast(`Welcome back, ${res.data.name}! 👋`, "success");
      onLogin(res.data.token, res.data.name);
    } catch (err) {
      toast(err.response?.data?.message || "Login failed. Is the server running?", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-brand" onClick={() => onNavigate("home")}>💰 FinanceTracker</div>
          <h1 className="auth-left-title">Welcome back!</h1>
          <p className="auth-left-sub">Sign in to continue managing your finances.</p>
          <div className="auth-features">
            {["Track income & expenses","Visual spending insights","Export to CSV","Secure & private"].map(f => (
              <div key={f} className="auth-feature-item"><span className="auth-check">✓</span>{f}</div>
            ))}
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Sign In</h2>
            <p>Don't have an account? <button className="link-btn" onClick={() => onNavigate("register")}>Register</button></p>
          </div>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="input-wrap">
                <input type={showPwd ? "text" : "password"} placeholder="••••••••"
                  value={form.password} onChange={set("password")} required />
                <button type="button" className="pwd-toggle" onClick={() => setShowPwd(s => !s)}>
                  {showPwd ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            <button type="submit" className="btn-auth-submit" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : "Sign In →"}
            </button>
          </form>
          <button className="back-home" onClick={() => onNavigate("home")}>← Back to Home</button>
        </div>
      </div>
    </div>
  );
}
