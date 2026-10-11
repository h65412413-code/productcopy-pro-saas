const API = {
  base: window.location.origin,
  getToken() {
    return localStorage.getItem('productcopy_token') || '';
  },
  authHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.getToken()}`
    };
  },
  async request(path, options = {}) {
    const res = await fetch(`${this.base}${path}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        ...(options.noAuth ? {} : this.authHeaders())
      }
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  }
};

const state = {
  authMode: 'login',
  token: localStorage.getItem('productcopy_token') || '',
  user: JSON.parse(localStorage.getItem('productcopy_user') || 'null'),
  history: [],
  generated: null,
  currentView: 'home'
};

function saveAuth(token, user) {
  state.token = token;
  state.user = user;
  localStorage.setItem('productcopy_token', token);
  localStorage.setItem('productcopy_user', JSON.stringify(user));
}

function clearAuth() {
  state.token = '';
  state.user = null;
  localStorage.removeItem('productcopy_token');
  localStorage.removeItem('productcopy_user');
}

function render() {
  const loggedIn = !!state.user;
  document.body.classList.toggle('logged-in', loggedIn);

  const app = document.getElementById('app');
  if (loggedIn) {
    app.innerHTML = `
      <div class="container dashboard">
        <div class="topbar">
          <div class="brand">ProductCopy Pro</div>
          <div class="nav">
            <button data-view="dashboard">Dashboard</button>
            <button data-view="pricing">Pricing</button>
            <button class="danger-btn" id="logoutBtn">Logout</button>
          </div>
        </div>

        <div class="dashboard-shell">
          <aside class="sidebar">
            <h3>Workspace</h3>
            <div class="stat-grid">
              <div class="stat-box">
                <div class="num" id="stats-credits">5</div>
                <div>Uses</div>
              </div>
              <div class="stat-box">
                <div class="num" id="stats-plan">Free</div>
                <div>Plan</div>
              </div>
            </div>

            <div class="history-list" id="historyList"></div>
          </aside>

          <main class="main-panel">
            <h3>Generate product copy</h3>
            <div class="form-grid">
              <input class="input" id="productName" placeholder="Product name" value="Máy xay sinh tố mini" />
              <select class="select" id="category">
                <option>Gia dụng</option>
                <option>Thời trang</option>
                <option>Điện tử</option>
                <option>Sắc đẹp</option>
                <option>Thể thao</option>
              </select>
              <input class="input" id="audience" placeholder="Target audience" value="Phụ nữ 25-40 sống ở thành phố" />
              <select class="select" id="tone">
                <option>Thực dụng</option>
                <option>Premium</option>
                <option>Hấp dẫn</option>
                <option>Đồng hồ giỏi</option>
                <option>Vui tươi</option>
              </select>
              <input class="input" id="keyword" placeholder="Primary keyword" value="máy xay sinh tố mini" />
              <button class="primary-btn" id="generateBtn">Generate Copy</button>
            </div>

            <div class="output-block hidden" id="outputBlock">
              <div class="output-card">
                <h4>Title</h4>
                <p id="titleOut"></p>
              </div>
              <div class="output-card">
                <h4>Short description</h4>
                <p id="descriptionOut"></p>
              </div>
              <div class="output-card">
                <h4>Benefits</h4>
                <ul id="benefitsOut"></ul>
              </div>
              <div class="output-card">
                <h4>Ad copy</h4>
                <p id="adCopyOut"></p>
              </div>
              <div class="output-card">
                <h4>SEO keywords</h4>
                <p id="seoOut"></p>
              </div>
            </div>
          </main>
        </div>
      </div>
    `;

    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('generateBtn').addEventListener('click', generateCopy);
    loadHistory();
    return;
  }

  app.innerHTML = `
    <div class="container">
      <div class="topbar">
        <div class="brand">ProductCopy Pro</div>
        <div class="nav">
          <button data-view="home">Home</button>
          <button data-view="pricing">Pricing</button>
          <button class="primary-btn" data-auth="login">Login</button>
        </div>
      </div>

      <section class="hero">
        <div class="hero-copy">
          <div class="kicker">AI-powered copywriting SaaS</div>
          <h1>Turn any product into <span class="gradient-text">high-converting copy</span> in seconds.</h1>
          <p>Generate product titles, ad copy, SEO keywords, benefits, and landing page descriptions for any product category — built for stores, agencies, and creators.</p>
          <div class="hero-actions">
            <button class="primary-btn" data-auth="login">Start free</button>
            <button class="ghost-btn" data-view="pricing">View pricing</button>
          </div>
        </div>

        <div class="hero-card">
          <div class="preview-window">
            <div class="preview-box">
              <div class="small-label">Title</div>
              <strong>Máy xay sinh tố mini - tiện lợi cho gia đình</strong>
            </div>
            <div class="preview-box">
              <div class="small-label">Ad Copy</div>
              <p>Tiết kiệm thời gian, dễ sử dụng, phù hợp cho mọi gia đình hiện đại.</p>
            </div>
            <div class="preview-box">
              <div class="small-label">SEO</div>
              <p>máy xay sinh tố mini, máy xay tiện lợi, máy xay gia đình</p>
            </div>
          </div>
        </div>
      </section>

      <section class="section" id="pricingSection">
        <div class="section-header">
          <h2>Simple pricing</h2>
        </div>
        <div class="pricing-grid">
          <div class="pricing-card">
            <div class="badge">Free</div>
            <h3>Starter</h3>
            <div class="price">$0 <small>/ mo</small></div>
            <ul>
              <li>5 generations / month</li>
              <li>1 workspace</li>
              <li>Basic keyword generation</li>
            </ul>
            <button class="ghost-btn" data-auth="login">Try free</button>
          </div>

          <div class="pricing-card featured">
            <div class="badge">Most popular</div>
            <h3>Pro</h3>
            <div class="price">$19 <small>/ mo</small></div>
            <ul>
              <li>Unlimited generations</li>
              <li>Save history</li>
              <li>Dashboard usage stats</li>
              <li>Better AI output</li>
            </ul>
            <button class="primary-btn" data-auth="login">Upgrade Pro</button>
          </div>

          <div class="pricing-card">
            <div class="badge">Agency</div>
            <h3>Scale</h3>
            <div class="price">$49 <small>/ mo</small></div>
            <ul>
              <li>Multiple team members</li>
              <li>Shared workspaces</li>
              <li>Priority support</li>
              <li>API access</li>
            </ul>
            <button class="ghost-btn" data-auth="login">Talk to sales</button>
          </div>
        </div>
      </section>

      <div class="auth-panel ${state.authMode === 'login' ? '' : 'hidden'}" id="loginBox">
        <h2>Login</h2>
        <div class="form-grid">
          <input class="input" id="loginEmail" placeholder="Email" />
          <input class="input" type="password" id="loginPassword" placeholder="Password" />
          <button class="primary-btn" id="loginBtn">Login</button>
        </div>
        <div class="switch-row">
          <span>Need an account?</span>
          <button id="switchToRegister">Register</button>
        </div>
      </div>

      <div class="auth-panel ${state.authMode === 'register' ? '' : 'hidden'}" id="registerBox">
        <h2>Create account</h2>
        <div class="form-grid">
          <input class="input" id="registerName" placeholder="Full name" />
          <input class="input" id="registerEmail" placeholder="Email" />
          <input class="input" type="password" id="registerPassword" placeholder="Password" />
          <button class="primary-btn" id="registerBtn">Create account</button>
        </div>
        <div class="switch-row">
          <span>Already have an account?</span>
          <button id="switchToLogin">Login</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('switchToRegister').onclick = () => { state.authMode = 'register'; render(); };
  document.getElementById('switchToLogin').onclick = () => { state.authMode = 'login'; render(); };
  document.getElementById('loginBtn').onclick = login;
  document.getElementById('registerBtn').onclick = register;

  document.querySelectorAll('[data-auth]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.authMode = 'login';
      render();
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
  });

  document.querySelectorAll('[data-view="pricing"]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('pricingSection').scrollIntoView({ behavior: 'smooth' });
    });
  });
}

async function login() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  try {
    const data = await API.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      noAuth: true
    });
    saveAuth(data.token, data.user);
    render();
  } catch (err) {
    alert(err.message);
  }
}

async function register() {
  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value;
  try {
    const data = await API.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
      noAuth: true
    });
    saveAuth(data.token, data.user);
    render();
  } catch (err) {
    alert(err.message);
  }
}

async function loadHistory() {
  try {
    const data = await API.request('/api/history');
    state.history = data.history || [];
    renderHistory();
  } catch (error) {
    console.warn(error.message);
  }
}

function renderHistory() {
  const list = document.getElementById('historyList');
  if (!list) return;

  if (!state.history.length) {
    list.innerHTML = '<div class="history-item"><strong>No history yet</strong><small>Your generated copy will appear here.</small></div>';
    return;
  }

  list.innerHTML = state.history.map(item => `
    <div class="history-item">
      <strong>${item.payload.productName || 'Product'}</strong>
      <small>${new Date(item.createdAt).toLocaleDateString()}</small>
      <div style="margin-top:8px; color:#cbd5e1;">${item.result.title || 'Generated copy'}</div>
    </div>
  `).join('');
}

async function generateCopy() {
  const payload = {
    productName: document.getElementById('productName').value,
    category: document.getElementById('category').value,
    audience: document.getElementById('audience').value,
    tone: document.getElementById('tone').value,
    keyword: document.getElementById('keyword').value
  };

  try {
    const data = await API.request('/api/generate', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    state.generated = data.result;
    renderGenerated(data.result);
    await loadHistory();
  } catch (err) {
    alert(err.message);
  }
}

function renderGenerated(result) {
  const output = document.getElementById('outputBlock');
  if (!output) return;

  output.classList.remove('hidden');
  document.getElementById('titleOut').textContent = result.title || '';
  document.getElementById('descriptionOut').textContent = result.description || '';
  const benefits = document.getElementById('benefitsOut');
  benefits.innerHTML = (result.benefits || []).map(item => `<li>${item}</li>`).join('');
  document.getElementById('adCopyOut').textContent = result.adCopy || '';
  document.getElementById('seoOut').textContent = result.seo || '';
}

function logout() {
  clearAuth();
  render();
}

render();
