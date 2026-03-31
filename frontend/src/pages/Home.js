import "./Home.css";

export default function Home({ onNavigate }) {
  const features = [
    { icon: "📊", title: "Smart Dashboard", desc: "Real-time overview of income, expenses and net balance." },
    { icon: "🏷️", title: "Category Tracking", desc: "Organize by food, rent, salary and freelance with visual insights." },
    { icon: "🔍", title: "Filter & Search", desc: "Filter by type, category and date range instantly." },
    { icon: "⬇️", title: "CSV Export", desc: "Download your full transaction history anytime." },
    { icon: "✏️", title: "Edit & Delete", desc: "Full control — update or remove any transaction." },
    { icon: "🔒", title: "Secure & Private", desc: "JWT authentication keeps your data private." },
  ];

  return (
    <div className="home">
      <nav className="home-nav">
        <div className="home-nav-inner">
          <div className="home-brand">💰 FinanceTracker</div>
          <div className="home-nav-links">
            <button className="btn-ghost-nav" onClick={() => onNavigate("login")}>Login</button>
            <button className="btn-hero-primary" onClick={() => onNavigate("register")}>Get Started Free</button>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-text">
          <div className="hero-badge">✨ Personal Finance Made Simple</div>
          <h1 className="hero-title">Take Control of<br /><span className="hero-gradient">Your Finances</span></h1>
          <p className="hero-sub">Track income and expenses, visualize spending patterns, and make smarter financial decisions — all in one place.</p>
          <div className="hero-actions">
            <button className="btn-hero-primary" onClick={() => onNavigate("register")}>Start Tracking Free →</button>
            <button className="btn-hero-ghost" onClick={() => onNavigate("login")}>Sign In</button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><span className="hero-stat-val">100%</span><span className="hero-stat-label">Free</span></div>
            <div className="hero-stat-div" />
            <div className="hero-stat"><span className="hero-stat-val">Secure</span><span className="hero-stat-label">JWT Auth</span></div>
            <div className="hero-stat-div" />
            <div className="hero-stat"><span className="hero-stat-val">CSV</span><span className="hero-stat-label">Export</span></div>
          </div>
        </div>

        <div className="hero-preview">
          <div className="preview-card">
            <div className="preview-header">
              <span className="preview-dot red" /><span className="preview-dot yellow" /><span className="preview-dot green" />
              <span className="preview-label">Dashboard Preview</span>
            </div>
            <div className="preview-stats">
              {[{l:"Income",v:"₹85,000",c:"income"},{l:"Expenses",v:"₹32,400",c:"expense"},{l:"Balance",v:"₹52,600",c:"balance"}].map(s => (
                <div key={s.l} className={`preview-stat ${s.c}`}>
                  <div className="preview-stat-label">{s.l}</div>
                  <div className="preview-stat-val">{s.v}</div>
                </div>
              ))}
            </div>
            <div className="preview-rows">
              {[{i:"💼",c:"Salary",a:"+₹75,000",t:"income"},{i:"🏠",c:"Rent",a:"−₹15,000",t:"expense"},{i:"🍔",c:"Food",a:"−₹8,400",t:"expense"},{i:"💻",c:"Freelance",a:"+₹10,000",t:"income"}].map((r,i) => (
                <div key={i} className="preview-row">
                  <span className="preview-row-icon">{r.i}</span>
                  <span className="preview-row-cat">{r.c}</span>
                  <span className={`preview-row-amt ${r.t}`}>{r.a}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="features-inner">
          <div className="section-badge">Features</div>
          <h2 className="section-title">Everything you need to manage money</h2>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2 className="cta-title">Ready to take control?</h2>
        <p className="cta-sub">Start managing your finances smarter today.</p>
        <button className="btn-cta" onClick={() => onNavigate("register")}>Create Free Account →</button>
      </section>

      <footer className="home-footer">© 2025 Shubham Keshri. Built with ❤️</footer>
    </div>
  );
}
