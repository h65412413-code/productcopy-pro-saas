:root {
  --bg-1: #040b16;
  --bg-2: #0d1b2a;
  --bg-3: #121d2d;
  --panel: rgba(10, 18, 31, 0.82);
  --panel-strong: #0d1727;
  --muted: #9dadc8;
  --text: #edf5ff;
  --primary: #7dd3fc;
  --secondary: #4ade80;
  --accent: #c084fc;
  --warning: #fbbf24;
  --line: rgba(148, 163, 184, 0.18);
  --shadow: rgba(0, 0, 0, 0.32);
  --radius-lg: 22px;
  --radius-md: 16px;
  --radius-sm: 12px;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  min-height: 100vh;
  font-family: Inter, 'Segoe UI', sans-serif;
  background: radial-gradient(circle at top, rgba(125, 211, 252, 0.1), transparent 28%), linear-gradient(135deg, var(--bg-1), var(--bg-2) 42%, var(--bg-3));
  color: var(--text);
}
body.logged-in { background: #091320; }

a { color: inherit; text-decoration: none; }
button, input, select, textarea {
  font: inherit;
}

.container {
  max-width: 1220px;
  margin: 0 auto;
  padding: 24px 20px 80px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 12px 0 26px;
}

.brand {
  font-size: 1.8rem;
  font-weight: 900;
  letter-spacing: 0.04em;
  background: linear-gradient(90deg, var(--primary), var(--secondary), var(--accent));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.nav {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.btn {
  border: 1px solid var(--line);
  background: rgba(15, 23, 42, 0.75);
  color: var(--text);
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.btn:hover { transform: translateY(-1px); }
.btn.primary {
  background: linear-gradient(135deg, var(--secondary), var(--primary), var(--accent));
  border: none;
  color: #061a2c;
  box-shadow: 0 14px 28px rgba(125, 211, 252, 0.25);
}
.btn.ghost {
  background: rgba(125, 211, 252, 0.08);
}
.btn.danger {
  background: rgba(251, 113, 133, 0.12);
  border-color: rgba(251, 113, 133, 0.35);
  color: #fecdd3;
}

.hero {
  display: grid;
  grid-template-columns: 1.12fr 0.88fr;
  gap: 28px;
  align-items: center;
  min-height: 500px;
}

.hero-copy {
  padding: 20px 0;
}

.kicker {
  display: inline-block;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(125, 211, 252, 0.08);
  border: 1px solid rgba(125, 211, 252, 0.25);
  color: var(--primary);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 16px;
}

h1 {
  margin: 0 0 16px;
  font-size: clamp(2.6rem, 5vw, 4.8rem);
  line-height: 1.02;
  letter-spacing: -0.06em;
}
.gradient-text {
  background: linear-gradient(90deg, var(--primary), var(--secondary), var(--accent));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-copy p {
  margin: 0;
  max-width: 620px;
  font-size: 1.08rem;
  color: var(--muted);
  line-height: 1.8;
}

.hero-actions {
  margin-top: 26px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.hero-card {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid var(--line);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 24px 48px var(--shadow);
}

.preview-window {
  background: rgba(2, 6, 23, 0.8);
  border: 1px solid rgba(125, 211, 252, 0.15);
  border-radius: 18px;
  padding: 16px;
}

.preview-box {
  background: rgba(15, 23, 42, 0.78);
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 14px;
}
.preview-box:last-child { margin-bottom: 0; }
.preview-label {
  color: var(--muted);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.preview-box strong {
  display: block;
  margin-top: 10px;
  font-size: 1.18rem;
  line-height: 1.4;
}
.preview-box p {
  margin: 8px 0 0;
  color: var(--muted);
  line-height: 1.6;
}

.section {
  margin-top: 72px;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 20px;
  margin-bottom: 22px;
}
.section-header h2 {
  margin: 0;
  font-size: clamp(1.9rem, 3vw, 2.7rem);
}

.trust-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 18px;
  color: var(--muted);
}
.trust-pill {
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.08);
  border: 1px solid rgba(148, 163, 184, 0.2);
  font-size: 12px;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.pricing-card {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid var(--line);
  border-radius: 22px;
  padding: 22px;
  position: relative;
}
.pricing-card.featured {
  background: linear-gradient(180deg, rgba(13, 29, 40, 0.9), rgba(15, 23, 42, 0.9));
  border-color: rgba(125, 211, 252, 0.45);
  transform: translateY(-6px);
}
.pricing-badge {
  display: inline-block;
  padding: 7px 9px;
  border-radius: 999px;
  background: rgba(125, 211, 252, 0.08);
  border: 1px solid rgba(125, 211, 252, 0.25);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--primary);
}
.pricing-card h3 {
  margin: 14px 0 4px;
  font-size: 1.6rem;
}
.price {
  font-size: 2.5rem;
  font-weight: 900;
  margin: 14px 0;
}
.price small {
  font-size: 1rem;
  color: var(--muted);
}
.pricing-card ul {
  margin: 18px 0 20px;
  padding-left: 18px;
  line-height: 2;
  color: var(--muted);
}

.auth-panel {
  max-width: 420px;
  margin: 40px auto 0;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid var(--line);
  border-radius: 22px;
  padding: 22px;
  box-shadow: 0 24px 50px rgba(0, 0, 0, 0.24);
}
.auth-panel h2 {
  margin: 0 0 14px;
  font-size: 1.8rem;
}
.form-grid {
  display: grid;
  gap: 12px;
}
.input, .select, .textarea {
  width: 100%;
  border: 1px solid var(--line);
  background: rgba(10, 18, 31, 0.8);
  border-radius: 12px;
  padding: 12px 14px;
  color: var(--text);
}
.textarea { resize: vertical; min-height: 110px; }

.socials {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 12px;
}
.social-btn {
  background: rgba(125, 211, 252, 0.08);
  color: var(--text);
  border: 1px solid rgba(125, 211, 252, 0.2);
  border-radius: 12px;
  padding: 12px 10px;
  font-weight: 700;
  cursor: pointer;
}
.switch-row {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 16px;
  color: var(--muted);
  font-size: 0.94rem;
}
.switch-row button {
  background: none;
  border: none;
  color: var(--primary);
  font-weight: 700;
  cursor: pointer;
}

.dashboard-shell {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 22px;
}
.sidebar, .main-panel {
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid var(--line);
  border-radius: 20px;
  padding: 22px;
}
.sidebar h3, .main-panel h3 {
  margin-top: 0;
  margin-bottom: 14px;
}
.stat-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 18px;
}
.stat-box {
  background: rgba(125, 211, 252, 0.06);
  border: 1px solid rgba(125, 211, 252, 0.18);
  border-radius: 16px;
  padding: 18px 14px;
}
.stat-box .num {
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 8px;
}
.history-list {
  margin-top: 20px;
  display: grid;
  gap: 12px;
}
.history-item {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 14px;
}
.history-item strong {
  display: block;
  margin-bottom: 8px;
}
.history-item small { color: var(--muted); }
.output-block {
  margin-top: 18px;
  display: grid;
  gap: 16px;
}
.output-card {
  background: rgba(9, 14, 25, 0.7);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 16px;
}
.output-card h4 {
  margin: 0 0 10px;
  color: var(--primary);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 11px;
}
.output-card p, .output-card li {
  color: var(--text);
  line-height: 1.8;
}
.output-card ul {
  margin: 0;
  padding-left: 18px;
}
.hidden { display: none !important; }

@media (max-width: 920px) {
  .hero,
  .dashboard-shell,
  .pricing-grid {
    grid-template-columns: 1fr;
  }
  .topbar {
    flex-wrap: wrap;
  }
  .socials {
    grid-template-columns: 1fr;
  }
}
