import "./styles.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/* ── Zodiac Helpers ────────────────────────────────── */
const ZODIAC_DATA = {
  Aries: { symbol: "♈", dates: "Mar 21 – Apr 19", element: "Fire", traits: ["Bold", "Ambitious", "Energetic", "Courageous"], ruler: "Mars", desc: "Aries leads with passion and courage. Your fiery spirit drives you to take initiative and blaze new trails. Today is perfect for starting new projects." },
  Taurus: { symbol: "♉", dates: "Apr 20 – May 20", element: "Earth", traits: ["Reliable", "Patient", "Determined", "Sensual"], ruler: "Venus", desc: "Taurus values stability and beauty. Your grounded nature helps others feel secure. Focus on self-care and financial planning today." },
  Gemini: { symbol: "♊", dates: "May 21 – Jun 20", element: "Air", traits: ["Versatile", "Curious", "Social", "Witty"], ruler: "Mercury", desc: "Gemini thrives on communication and learning. Your dual nature allows you to see all perspectives. A great day for networking." },
  Cancer: { symbol: "♋", dates: "Jun 21 – Jul 22", element: "Water", traits: ["Nurturing", "Intuitive", "Emotional", "Protective"], ruler: "Moon", desc: "Cancer connects deeply with emotions and family. Your intuition is strong today — trust your gut feelings." },
  Leo: { symbol: "♌", dates: "Jul 23 – Aug 22", element: "Fire", traits: ["Confident", "Creative", "Generous", "Dramatic"], ruler: "Sun", desc: "Leo radiates warmth and creativity. Your natural charisma draws people in. Express yourself boldly today." },
  Virgo: { symbol: "♍", dates: "Aug 23 – Sep 22", element: "Earth", traits: ["Analytical", "Practical", "Diligent", "Kind"], ruler: "Mercury", desc: "Virgo excels at details and service. Your practical approach solves problems others miss. Organize and plan today." },
  Libra: { symbol: "♎", dates: "Sep 23 – Oct 22", element: "Air", traits: ["Diplomatic", "Harmonious", "Fair", "Social"], ruler: "Venus", desc: "Libra seeks balance and beauty in all things. Your diplomatic skills are needed today — mediate and bring peace." },
  Scorpio: { symbol: "♏", dates: "Oct 23 – Nov 21", element: "Water", traits: ["Passionate", "Resourceful", "Determined", "Mysterious"], ruler: "Pluto", desc: "Scorpio transforms and regenerates. Your deep intensity uncovers hidden truths. Embrace transformation today." },
  Sagittarius: { symbol: "♐", dates: "Nov 22 – Dec 21", element: "Fire", traits: ["Adventurous", "Optimistic", "Philosophical", "Free-spirited"], ruler: "Jupiter", desc: "Sagittarius explores and expands horizons. Your optimism is contagious today. Plan a journey or learn something new." },
  Capricorn: { symbol: "♑", dates: "Dec 22 – Jan 19", element: "Earth", traits: ["Disciplined", "Ambitious", "Responsible", "Patient"], ruler: "Saturn", desc: "Capricorn builds for the long term. Your discipline and persistence pay off. Focus on career goals today." },
  Aquarius: { symbol: "♒", dates: "Jan 20 – Feb 18", element: "Air", traits: ["Innovative", "Independent", "Humanitarian", "Original"], ruler: "Uranus", desc: "Aquarius envisions the future. Your unconventional ideas inspire change. Connect with your community today." },
  Pisces: { symbol: "♓", dates: "Feb 19 – Mar 20", element: "Water", traits: ["Compassionate", "Artistic", "Intuitive", "Dreamy"], ruler: "Neptune", desc: "Pisces flows with creativity and empathy. Your artistic and spiritual side is heightened today. Create and dream." }
};

function getZodiacSign(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  return "Pisces";
}

/* ── State ─────────────────────────────────────────── */
const state = {
  user: readUser(),
  // CRM state
  view: "dashboard",
  customers: [],
  users: [],
  consultations: [],
  crmBookings: [],
  stats: { totalClients: 0, upcomingConsultations: 0, completedConsultations: 0, pendingConsultations: 0 },
  // User portal state
  userView: "dashboard",
  astrologersList: [],
  userBookings: [],
  conversations: [],
  chatMessages: [],
  selectedAstrologer: null,
  selectedBookingChat: null,
  error: ""
};

let chatPollInterval = null;

function readUser() {
  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function token() {
  return localStorage.getItem("token");
}

async function api(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token() ? { Authorization: `Bearer ${token()}` } : {}),
      ...(options.headers || {})
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
}

/* ── CRM Data Loaders ──────────────────────────────── */
async function loadCRMData() {
  if (!state.user) return;
  try {
    const [stats, customers, consultations, users, bookings] = await Promise.all([
      api("/dashboard/stats").catch(() => state.stats),
      api("/clients").catch(() => []),
      api("/consultations").catch(() => []),
      state.user.role === "admin" ? api("/users").catch(() => []) : Promise.resolve([]),
      api("/bookings").catch(() => [])
    ]);
    state.stats = stats;
    state.customers = customers;
    state.consultations = consultations;
    state.users = users;
    state.crmBookings = bookings;
    state.error = "";
  } catch (error) {
    state.error = error.message;
  }
}

/* ── User Portal Data Loaders ──────────────────────── */
async function loadUserBookings() {
  try {
    state.userBookings = await api("/bookings");
  } catch { state.userBookings = []; }
}

async function loadAstrologers() {
  try {
    state.astrologersList = await api("/public/astrologers");
  } catch { state.astrologersList = []; }
}

async function loadConversations() {
  try {
    state.conversations = await api("/chat/conversations");
  } catch { state.conversations = []; }
}

async function loadChatMessages(bookingId) {
  try {
    state.chatMessages = await api(`/chat/messages/${bookingId}`);
  } catch { state.chatMessages = []; }
}

async function loadUserPortalData() {
  if (!state.user || state.user.role !== "user") return;
  await Promise.all([loadUserBookings(), loadAstrologers(), loadConversations()]);
}

/* ── Session ───────────────────────────────────────── */
function setSession(data) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  state.user = data.user;
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  state.user = null;
  state.view = "dashboard";
  state.userView = "dashboard";
  state.selectedAstrologer = null;
  state.selectedBookingChat = null;
  if (chatPollInterval) { clearInterval(chatPollInterval); chatPollInterval = null; }
  renderApp();
}

/* ── Template Helpers ──────────────────────────────── */
function html(strings, ...values) {
  return strings.reduce((output, string, index) => output + string + (values[index] ?? ""), "");
}

function escapeText(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/* ══════════════════════════════════════════════════════
   RENDERING — Main Router
   ══════════════════════════════════════════════════════ */
function renderApp() {
  if (chatPollInterval) { clearInterval(chatPollInterval); chatPollInterval = null; }

  if (!state.user) {
    renderLanding();
    return;
  }

  if (state.user.role === "user") {
    renderUserPortal();
  } else {
    renderCRM();
  }
}

/* ══════════════════════════════════════════════════════
   LANDING PAGE
   ══════════════════════════════════════════════════════ */
function renderLanding() {
  const root = document.getElementById("root");
  root.innerHTML = html`
    <main class="landing-page">
      <div class="landing-brand">
        <span class="brand-icon">✨</span>
        <h1>Astro Giri</h1>
        <p>Your Cosmic Journey Starts Here</p>
      </div>
      <div class="portal-cards">
        <div class="portal-card astrologer-card-portal" id="goto-astrologer">
          <span class="card-icon">🔮</span>
          <h2>Astrologer Portal</h2>
          <p>Manage consultations, clients, and your practice with powerful CRM tools</p>
          <button class="card-button" type="button">Login as Astrologer →</button>
        </div>
        <div class="portal-card user-card-portal" id="goto-user">
          <span class="card-icon">⭐</span>
          <h2>User Portal</h2>
          <p>Book consultations, explore astrologers, and discover your cosmic destiny</p>
          <button class="card-button" type="button">Login / Register →</button>
        </div>
      </div>
    </main>
  `;
  document.getElementById("goto-astrologer")?.addEventListener("click", renderAstrologerLogin);
  document.getElementById("goto-user")?.addEventListener("click", renderUserLogin);
}

/* ══════════════════════════════════════════════════════
   ASTROLOGER LOGIN (existing CRM login — orange theme)
   ══════════════════════════════════════════════════════ */
function renderAstrologerLogin() {
  const root = document.getElementById("root");
  root.innerHTML = html`
    <main class="auth-page">
      <section class="auth-panel">
        <div class="auth-copy">
          <span>Astrologer CRM</span>
          <h1>Manage customers, astrologers, and consultations.</h1>
          <p>Admin can control staff accounts while astrologers manage assigned customers.</p>
        </div>
        <form class="auth-form" id="astro-login-form">
          <h2>Astrologer Login</h2>
          ${state.error ? `<div class="error-box">${escapeText(state.error)}</div>` : ""}
          <input name="email" placeholder="Email" required type="email" />
          <input name="password" placeholder="Password" required type="password" minlength="6" />
          <button class="primary-button" type="submit">Login</button>
          <button class="ghost-button" id="astro-show-register" type="button">Create admin/astrologer account</button>
          <button class="ghost-button" id="back-landing-1" type="button">← Back to Home</button>
        </form>
      </section>
    </main>
  `;
  document.getElementById("back-landing-1")?.addEventListener("click", () => { state.error = ""; renderLanding(); });
  document.getElementById("astro-show-register")?.addEventListener("click", renderAstrologerRegister);
  document.getElementById("astro-login-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const data = await api("/auth/login", { method: "POST", body: JSON.stringify(form) });
      if (data.user.role === "user") { state.error = "Please use the User Portal to login."; renderAstrologerLogin(); return; }
      setSession(data);
      await loadCRMData();
      renderApp();
    } catch (error) {
      state.error = error.message;
      renderAstrologerLogin();
    }
  });
}

function renderAstrologerRegister() {
  const root = document.getElementById("root");
  root.innerHTML = html`
    <main class="auth-page">
      <form class="auth-form solo" id="astro-register-form">
        <h2>Register Staff</h2>
        ${state.error ? `<div class="error-box">${escapeText(state.error)}</div>` : ""}
        <input name="name" placeholder="Name" required />
        <input name="email" placeholder="Email" required type="email" />
        <input name="password" placeholder="Password" required type="password" minlength="6" />
        <select name="role"><option value="admin">Admin</option><option value="astrologer">Astrologer</option></select>
        <button class="primary-button" type="submit">Register</button>
        <button class="ghost-button" id="back-astro-login" type="button">← Back to Login</button>
      </form>
    </main>
  `;
  document.getElementById("back-astro-login")?.addEventListener("click", () => { state.error = ""; renderAstrologerLogin(); });
  document.getElementById("astro-register-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget));
    try {
      await api("/auth/register", { method: "POST", body: JSON.stringify(form) });
      state.error = "";
      renderAstrologerLogin();
    } catch (error) {
      state.error = error.message;
      renderAstrologerRegister();
    }
  });
}

/* ══════════════════════════════════════════════════════
   USER LOGIN / REGISTER (purple theme)
   ══════════════════════════════════════════════════════ */
function renderUserLogin() {
  const root = document.getElementById("root");
  root.innerHTML = html`
    <main class="user-auth-page">
      <form class="user-auth-form" id="user-login-form">
        <h2>⭐ User Login</h2>
        ${state.error ? `<div class="error-box">${escapeText(state.error)}</div>` : ""}
        <input name="email" placeholder="Email" required type="email" />
        <input name="password" placeholder="Password" required type="password" minlength="6" />
        <button class="primary-button" type="submit">Login</button>
        <button class="ghost-button" id="goto-user-register" type="button">Create an account</button>
        <button class="ghost-button" id="back-landing-2" type="button">← Back to Home</button>
      </form>
    </main>
  `;
  document.getElementById("back-landing-2")?.addEventListener("click", () => { state.error = ""; renderLanding(); });
  document.getElementById("goto-user-register")?.addEventListener("click", () => { state.error = ""; renderUserRegister(); });
  document.getElementById("user-login-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const data = await api("/auth/login", { method: "POST", body: JSON.stringify(form) });
      if (data.user.role !== "user") { state.error = "Please use the Astrologer Portal."; renderUserLogin(); return; }
      setSession(data);
      await loadUserPortalData();
      renderApp();
    } catch (error) {
      state.error = error.message;
      renderUserLogin();
    }
  });
}

function renderUserRegister() {
  const root = document.getElementById("root");
  root.innerHTML = html`
    <main class="user-auth-page">
      <form class="user-auth-form" id="user-register-form">
        <h2>⭐ Create Account</h2>
        ${state.error ? `<div class="error-box">${escapeText(state.error)}</div>` : ""}
        <input name="name" placeholder="Full Name" required />
        <input name="email" placeholder="Email" required type="email" />
        <input name="password" placeholder="Password (min 6 chars)" required type="password" minlength="6" />
        <input name="phone" placeholder="Phone Number" />
        <label>Date of Birth<input name="dob" type="date" /></label>
        <button class="primary-button" type="submit">Create Account</button>
        <button class="ghost-button" id="goto-user-login" type="button">Already have an account? Login</button>
        <button class="ghost-button" id="back-landing-3" type="button">← Back to Home</button>
      </form>
    </main>
  `;
  document.getElementById("back-landing-3")?.addEventListener("click", () => { state.error = ""; renderLanding(); });
  document.getElementById("goto-user-login")?.addEventListener("click", () => { state.error = ""; renderUserLogin(); });
  document.getElementById("user-register-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const data = await api("/auth/register-user", { method: "POST", body: JSON.stringify(form) });
      setSession(data);
      await loadUserPortalData();
      renderApp();
    } catch (error) {
      state.error = error.message;
      renderUserRegister();
    }
  });
}

/* ══════════════════════════════════════════════════════
   ASTROLOGER CRM (existing — kept intact)
   ══════════════════════════════════════════════════════ */
function renderCRM() {
  const root = document.getElementById("root");
  root.innerHTML = html`
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-mark">A</div>
          <div><strong>Astrologer CRM</strong><span>${escapeText(state.user.role)}</span></div>
        </div>
        <nav class="nav-list">
          ${navButton("dashboard", "📊 Dashboard")}
          ${navButton("customers", "👥 Customers")}
          ${state.user.role === "admin" ? navButton("users", "🛡️ Admin/Astrologers") : ""}
          ${navButton("bookings", "📅 Bookings")}
          ${navButton("consultations", "📋 Consultations")}
        </nav>
        <button class="ghost-button logout-button" id="logout" type="button">🚪 Logout</button>
      </aside>
      <main class="content">
        <header class="topbar">
          <div><p>Welcome back</p><h1>${escapeText(state.user.name)}</h1></div>
          <span class="role-pill">${escapeText(state.user.role)}</span>
        </header>
        ${state.error ? `<div class="error-box page-error">${escapeText(state.error)}</div>` : ""}
        ${crmViewMarkup()}
      </main>
    </div>
  `;
  bindCRM();
}

function navButton(view, label) {
  return `<button class="${state.view === view ? "active" : ""}" data-view="${view}" type="button">${label}</button>`;
}

function crmViewMarkup() {
  if (state.view === "customers") return customersMarkup();
  if (state.view === "users" && state.user.role === "admin") return usersMarkup();
  if (state.view === "bookings") return crmBookingsMarkup();
  if (state.view === "consultations") return consultationsMarkup();
  return dashboardMarkup();
}

function dashboardMarkup() {
  const cards = [
    ["Total Customers", state.stats.totalClients],
    ["Upcoming Consultations", state.stats.upcomingConsultations],
    ["Completed Consultations", state.stats.completedConsultations],
    ["Pending Consultations", state.stats.pendingConsultations]
  ];
  return html`
    <section class="page-section">
      <div class="section-heading"><div><p>Overview</p><h2>Practice Snapshot</h2></div></div>
      <div class="stats-grid">
        ${cards.map(([label, value]) => html`
          <article class="stat-card">
            <div class="stat-icon">${escapeText(label[0])}</div>
            <span>${escapeText(label)}</span>
            <strong>${Number(value || 0)}</strong>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function customersMarkup() {
  const astrologers = state.users.filter((u) => u.role === "astrologer");
  return html`
    <section class="page-section">
      <div class="section-heading"><div><p>Customer Management</p><h2>Customers</h2></div></div>
      <form class="data-form" id="customer-form">
        <input name="name" placeholder="Name" required />
        <input name="email" placeholder="Email" type="email" />
        <input name="phone" placeholder="Phone" required />
        <input name="dob" type="date" />
        <input name="zodiacSign" placeholder="Zodiac" />
        <select name="assignedAstrologer">
          <option value="">Assign astrologer</option>
          ${astrologers.map((u) => `<option value="${u._id}">${escapeText(u.name)}</option>`).join("")}
        </select>
        <button class="primary-button compact" type="submit">Add Customer</button>
      </form>
      ${tableMarkup(["Name", "Phone", "Zodiac", "Assigned Astrologer", "Actions"], state.customers.map((c) => html`
        <tr>
          <td><strong>${escapeText(c.name)}</strong><span>${escapeText(c.email)}</span></td>
          <td>${escapeText(c.phone)}</td>
          <td>${escapeText(c.zodiacSign || "Not set")}</td>
          <td>${escapeText(c.assignedAstrologer?.name || "Not assigned")}</td>
          <td><button data-delete-customer="${c._id}" type="button">Delete</button></td>
        </tr>
      `), "No customers yet")}
    </section>
  `;
}

function usersMarkup() {
  return html`
    <section class="page-section">
      <div class="section-heading"><div><p>Staff Access</p><h2>Admin / Astrologers</h2></div></div>
      <form class="data-form team-form" id="user-form">
        <input name="name" placeholder="Name" required />
        <input name="email" placeholder="Email" required type="email" />
        <input name="password" placeholder="Password" required type="password" minlength="6" />
        <select name="role"><option value="admin">Admin</option><option value="astrologer" selected>Astrologer</option></select>
        <button class="primary-button compact" type="submit">Add User</button>
      </form>
      ${tableMarkup(["Name", "Email", "Role", "Created", "Actions"], state.users.map((u) => html`
        <tr>
          <td><strong>${escapeText(u.name)}</strong><span>${escapeText(u._id)}</span></td>
          <td>${escapeText(u.email)}</td>
          <td><span class="role-pill">${escapeText(u.role)}</span></td>
          <td>${u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}</td>
          <td><button data-delete-user="${u._id}" ${u._id === state.user.id ? "disabled" : ""} type="button">Delete</button></td>
        </tr>
      `), "No users yet")}
    </section>
  `;
}

function crmBookingsMarkup() {
  return html`
    <section class="page-section">
      <div class="section-heading">
        <div>
          <p>${state.user.role === "astrologer" ? "Your Booked Users" : "All User Bookings"}</p>
          <h2>Bookings</h2>
        </div>
      </div>
      ${tableMarkup(["User", "Date & Time", "Duration", "Amount", "Status", "Payment", "Actions"], state.crmBookings.map((b) => html`
        <tr>
          <td>
            <strong>${escapeText(b.userId?.name || "User")}</strong>
            <span>${escapeText(b.userId?.email || "")}${b.userId?.phone ? ` • ${escapeText(b.userId.phone)}` : ""}</span>
          </td>
          <td>${new Date(b.date).toLocaleDateString()} ${escapeText(b.timeSlot || "")}</td>
          <td>${b.duration || 30} min</td>
          <td><strong>₹${b.amount || 0}</strong></td>
          <td><span class="status ${escapeText((b.status || "Pending").toLowerCase())}">${escapeText(b.status || "Pending")}</span></td>
          <td><span class="status ${b.paymentStatus === "Paid" ? "completed" : "pending"}">${escapeText(b.paymentStatus || "Pending")}</span></td>
          <td>
            <div class="action-row">
              ${b.status === "Pending" ? `<button data-booking-status="${b._id}" data-status="Confirmed" type="button">Confirm</button>` : ""}
              ${b.status === "Confirmed" ? `<button data-booking-status="${b._id}" data-status="Completed" type="button">Complete</button>` : ""}
              ${["Pending", "Confirmed"].includes(b.status) ? `<button data-booking-status="${b._id}" data-status="Cancelled" type="button">Cancel</button>` : ""}
            </div>
          </td>
        </tr>
      `), state.user.role === "astrologer" ? "No users have booked you yet." : "No bookings yet.")}
    </section>
  `;
}

function consultationsMarkup() {
  const astrologers = state.users.filter((u) => u.role === "astrologer");
  return html`
    <section class="page-section">
      <div class="section-heading"><div><p>Consultation Management</p><h2>Consultations</h2></div></div>
      <form class="data-form consultation-form" id="consultation-form">
        <select name="clientId" required>
          <option value="">Select customer</option>
          ${state.customers.map((c) => `<option value="${c._id}">${escapeText(c.name)}</option>`).join("")}
        </select>
        <select name="astrologerId">
          <option value="">Select astrologer</option>
          ${astrologers.map((u) => `<option value="${u._id}">${escapeText(u.name)}</option>`).join("")}
        </select>
        <input name="date" required type="datetime-local" />
        <select name="status"><option>Scheduled</option><option>Pending</option><option>Completed</option><option>Cancelled</option></select>
        <textarea name="notes" placeholder="Consultation notes"></textarea>
        <button class="primary-button compact" type="submit">Add Consultation</button>
      </form>
      ${tableMarkup(["Customer", "Date", "Status", "Notes", "AI Summary", "Actions"], state.consultations.map((c) => html`
        <tr>
          <td><strong>${escapeText(c.clientId?.name)}</strong><span>${escapeText(c.astrologerId?.name)}</span></td>
          <td>${new Date(c.date).toLocaleString()}</td>
          <td><span class="status ${escapeText(c.status.toLowerCase())}">${escapeText(c.status)}</span></td>
          <td class="notes-cell">${escapeText(c.notes || "No notes")}</td>
          <td class="summary-cell">${escapeText(c.aiSummary || "Not generated")}</td>
          <td>
            <div class="action-row">
              <button data-summary="${c._id}" ${!c.notes ? "disabled" : ""} type="button">AI</button>
              <button data-complete="${c._id}" type="button">Complete</button>
              <button data-delete-consultation="${c._id}" type="button">Delete</button>
            </div>
          </td>
        </tr>
      `), "No consultations yet")}
    </section>
  `;
}

function tableMarkup(columns, rows, emptyText) {
  return html`
    <div class="table-wrap">
      <table>
        <thead><tr>${columns.map((col) => `<th>${escapeText(col)}</th>`).join("")}</tr></thead>
        <tbody>${rows.length ? rows.join("") : `<tr><td class="empty-table" colspan="${columns.length}">${escapeText(emptyText)}</td></tr>`}</tbody>
      </table>
    </div>
  `;
}

function bindCRM() {
  document.getElementById("logout")?.addEventListener("click", logout);
  document.querySelectorAll("[data-view]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      state.view = btn.dataset.view;
      await loadCRMData();
      renderCRM();
    });
  });
  document.getElementById("customer-form")?.addEventListener("submit", submitCRM("/clients", "POST"));
  document.getElementById("user-form")?.addEventListener("submit", submitCRM("/users", "POST"));
  document.getElementById("consultation-form")?.addEventListener("submit", submitCRM("/consultations", "POST"));
  document.querySelectorAll("[data-delete-customer]").forEach((btn) => {
    btn.addEventListener("click", () => deleteCRM(`/clients/${btn.dataset.deleteCustomer}`));
  });
  document.querySelectorAll("[data-delete-user]").forEach((btn) => {
    btn.addEventListener("click", () => deleteCRM(`/users/${btn.dataset.deleteUser}`));
  });
  document.querySelectorAll("[data-delete-consultation]").forEach((btn) => {
    btn.addEventListener("click", () => deleteCRM(`/consultations/${btn.dataset.deleteConsultation}`));
  });
  document.querySelectorAll("[data-complete]").forEach((btn) => {
    btn.addEventListener("click", () => updateCRM(`/consultations/${btn.dataset.complete}`, { status: "Completed" }));
  });
  document.querySelectorAll("[data-booking-status]").forEach((btn) => {
    btn.addEventListener("click", () => updateCRM(`/bookings/${btn.dataset.bookingStatus}/status`, { status: btn.dataset.status }));
  });
  document.querySelectorAll("[data-summary]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const c = state.consultations.find((item) => item._id === btn.dataset.summary);
      await updateCRM("/ai/generate-summary", { consultationId: c._id, notes: c.notes }, "POST");
    });
  });
}

function submitCRM(path, method) {
  return async (event) => {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget));
    try {
      await api(path, { method, body: JSON.stringify(form) });
      await loadCRMData();
      renderCRM();
    } catch (error) {
      state.error = error.message;
      renderCRM();
    }
    event.currentTarget.reset();
  };
}

async function updateCRM(path, body, method = "PUT") {
  try {
    await api(path, { method, body: JSON.stringify(body) });
    await loadCRMData();
    renderCRM();
  } catch (error) {
    state.error = error.message;
    renderCRM();
  }
}

async function deleteCRM(path) {
  try {
    await api(path, { method: "DELETE" });
    await loadCRMData();
    renderCRM();
  } catch (error) {
    state.error = error.message;
    renderCRM();
  }
}

/* ══════════════════════════════════════════════════════
   USER PORTAL (purple theme)
   ══════════════════════════════════════════════════════ */
function userNavButton(view, emoji, label) {
  return `<button class="${state.userView === view ? "active" : ""}" data-uview="${view}" type="button">${emoji} ${label}</button>`;
}

function renderUserPortal() {
  const root = document.getElementById("root");
  const zodiac = state.user.zodiacSign || getZodiacSign(state.user.dob) || "";
  root.innerHTML = html`
    <div class="app-shell user-portal">
      <aside class="sidebar user-sidebar">
        <div class="brand">
          <div class="brand-mark" style="background:linear-gradient(135deg,var(--purple-500),var(--purple-400));color:#fff;width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;">⭐</div>
          <div><strong>Astro Giri</strong><span>user</span></div>
        </div>
        <nav class="nav-list">
          ${userNavButton("dashboard", "🏠", "Dashboard")}
          ${userNavButton("astrologers", "🔮", "Astrologers")}
          ${userNavButton("bookings", "📅", "My Bookings")}
          ${userNavButton("horoscope", "♈", "Horoscope")}
          ${userNavButton("payments", "💳", "Payments")}
          ${userNavButton("chat", "💬", "Chat")}
        </nav>
        <button class="ghost-button logout-button" id="user-logout" type="button">🚪 Logout</button>
      </aside>
      <main class="content">
        <header class="topbar user-portal-topbar">
          <div><p>Welcome back</p><h1>${escapeText(state.user.name)}</h1></div>
          <span class="role-pill user-role-pill">${zodiac ? `${ZODIAC_DATA[zodiac]?.symbol || "⭐"} ${zodiac}` : "User"}</span>
        </header>
        ${state.error ? `<div class="error-box page-error">${escapeText(state.error)}</div>` : ""}
        ${userViewMarkup()}
      </main>
    </div>
  `;
  bindUserPortal();
}

function userViewMarkup() {
  switch (state.userView) {
    case "astrologers": return state.selectedAstrologer ? bookingFormMarkup() : browseAstrologersMarkup();
    case "bookings": return myBookingsMarkup();
    case "horoscope": return horoscopeMarkup();
    case "payments": return paymentsMarkup();
    case "chat": return chatMarkup();
    default: return userDashboardMarkup();
  }
}

/* ── User Dashboard ────────────────────────────────── */
function userDashboardMarkup() {
  const total = state.userBookings.length;
  const upcoming = state.userBookings.filter((b) => b.status === "Confirmed" || b.status === "Pending").length;
  const completed = state.userBookings.filter((b) => b.status === "Completed").length;

  return html`
    <section class="page-section">
      <div class="section-heading"><div><p>Your Overview</p><h2>Dashboard</h2></div></div>
      <div class="stats-grid">
        ${[["📅 Total Bookings", total], ["⏰ Upcoming", upcoming], ["✅ Completed", completed], ["🔮 Astrologers", state.astrologersList.length]].map(([label, value]) => html`
          <article class="user-stat-card">
            <div class="user-stat-icon">${label.split(" ")[0]}</div>
            <span>${escapeText(label.substring(label.indexOf(" ") + 1))}</span>
            <strong>${value}</strong>
          </article>
        `).join("")}
      </div>
      <div class="quick-actions">
        <button class="quick-action-card" data-uview="astrologers" type="button">
          <div class="qa-icon">🔮</div>
          <div class="qa-text"><strong>Book Consultation</strong><span>Browse astrologers & book</span></div>
        </button>
        <button class="quick-action-card" data-uview="horoscope" type="button">
          <div class="qa-icon">♈</div>
          <div class="qa-text"><strong>View Horoscope</strong><span>Your zodiac insights</span></div>
        </button>
        <button class="quick-action-card" data-uview="chat" type="button">
          <div class="qa-icon">💬</div>
          <div class="qa-text"><strong>Messages</strong><span>Chat with astrologers</span></div>
        </button>
        <button class="quick-action-card" data-uview="payments" type="button">
          <div class="qa-icon">💳</div>
          <div class="qa-text"><strong>Payments</strong><span>View payment history</span></div>
        </button>
      </div>
    </section>
  `;
}

/* ── Browse Astrologers ────────────────────────────── */
function browseAstrologersMarkup() {
  if (!state.astrologersList.length) {
    return html`<section class="page-section">
      <div class="section-heading"><div><p>Find Your Guide</p><h2>Browse Astrologers</h2></div></div>
      <div class="empty-state"><p>No astrologers available at the moment. Check back soon!</p></div>
    </section>`;
  }

  return html`
    <section class="page-section">
      <div class="section-heading"><div><p>Find Your Guide</p><h2>Browse Astrologers</h2></div></div>
      <div class="astrologer-grid">
        ${state.astrologersList.map((a) => html`
          <div class="astrologer-browse-card">
            <div class="card-header">
              <div class="avatar">${escapeText((a.name || "A")[0])}</div>
              <h3>${escapeText(a.name)}</h3>
              <div class="specialization">${escapeText(a.specialization || "General Astrology")}</div>
            </div>
            <div class="card-body">
              <div class="card-meta">
                <span>Experience: <strong>${a.experience || 0} yrs</strong></span>
                <span class="rating">${"★".repeat(Math.round(a.rating || 0))}${"☆".repeat(5 - Math.round(a.rating || 0))}</span>
              </div>
              ${a.languages?.length ? `<div class="languages-list">${a.languages.map((l) => `<span class="lang-tag">${escapeText(l)}</span>`).join("")}</div>` : ""}
              <div class="card-meta">
                <span class="price">₹${a.hourlyRate || 500} <small>/hr</small></span>
              </div>
              ${a.bio ? `<p style="font-size:13px;color:var(--text-muted);margin:0;line-height:1.5">${escapeText(a.bio).substring(0, 100)}${a.bio.length > 100 ? "..." : ""}</p>` : ""}
              <button class="book-btn" data-book-astrologer="${a._id}" type="button">Book Consultation →</button>
            </div>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

/* ── Booking Form ──────────────────────────────────── */
function bookingFormMarkup() {
  const a = state.selectedAstrologer;
  if (!a) return browseAstrologersMarkup();

  const timeSlots = [];
  for (let h = 9; h <= 20; h++) {
    timeSlots.push(`${h.toString().padStart(2, "0")}:00`);
    timeSlots.push(`${h.toString().padStart(2, "0")}:30`);
  }

  return html`
    <section class="page-section">
      <button class="back-btn" id="back-to-astrologers" type="button">← Back to Astrologers</button>
      <div class="section-heading"><div><p>Schedule Session</p><h2>Book with ${escapeText(a.name)}</h2></div></div>
      <div class="booking-container">
        <form class="booking-form-card" id="booking-form">
          <h3>Consultation Details</h3>
          <label>Date<input name="date" required type="date" min="${new Date().toISOString().split("T")[0]}" /></label>
          <label>Time Slot
            <select name="timeSlot" required>
              <option value="">Select time</option>
              ${timeSlots.map((t) => `<option value="${t}">${t}</option>`).join("")}
            </select>
          </label>
          <label>Duration
            <select name="duration" id="booking-duration">
              <option value="30">30 minutes</option>
              <option value="60">60 minutes</option>
            </select>
          </label>
          <label>Notes / Questions<textarea name="notes" placeholder="Describe what you'd like to discuss..." rows="4"></textarea></label>
        </form>
        <div class="booking-summary">
          <h4>Booking Summary</h4>
          <div class="summary-row"><span>Astrologer</span><strong>${escapeText(a.name)}</strong></div>
          <div class="summary-row"><span>Specialization</span><strong>${escapeText(a.specialization || "General")}</strong></div>
          <div class="summary-row"><span>Rate</span><strong>₹${a.hourlyRate || 500}/hr</strong></div>
          <div class="summary-row"><span>Duration</span><strong id="summary-duration">30 min</strong></div>
          <div class="summary-total"><span>Total</span><span id="summary-total">₹${Math.round((a.hourlyRate || 500) * 0.5)}</span></div>
          <button class="confirm-btn" id="confirm-booking" type="button">✨ Confirm Booking</button>
        </div>
      </div>
    </section>
  `;
}

/* ── My Bookings ───────────────────────────────────── */
function myBookingsMarkup() {
  return html`
    <section class="page-section">
      <div class="section-heading"><div><p>Your Sessions</p><h2>My Bookings</h2></div></div>
      ${tableMarkup(["Astrologer", "Date & Time", "Duration", "Status", "Payment", "Actions"], state.userBookings.map((b) => html`
        <tr>
          <td><strong>${escapeText(b.astrologerId?.name)}</strong><span>${escapeText(b.astrologerId?.specialization || "")}</span></td>
          <td>${new Date(b.date).toLocaleDateString()} ${escapeText(b.timeSlot)}</td>
          <td>${b.duration} min</td>
          <td><span class="status ${escapeText(b.status.toLowerCase())}">${escapeText(b.status)}</span></td>
          <td><span class="status ${b.paymentStatus === "Paid" ? "completed" : "pending"}">${escapeText(b.paymentStatus)}</span></td>
          <td>
            <div class="action-row">
              ${b.paymentStatus !== "Paid" ? `<button class="pay-btn" data-pay-booking="${b._id}" type="button">Pay</button>` : ""}
              ${b.status === "Pending" || b.status === "Confirmed" ? `<button data-cancel-booking="${b._id}" type="button">Cancel</button>` : ""}
              <button data-chat-booking="${b._id}" data-chat-other="${state.user.id === String(b.userId?._id || b.userId) ? b.astrologerId?._id : b.userId?._id}" type="button">Chat</button>
            </div>
          </td>
        </tr>
      `), "No bookings yet. Browse astrologers to book your first consultation!")}
    </section>
  `;
}

/* ── Horoscope ─────────────────────────────────────── */
function horoscopeMarkup() {
  const sign = state.user.zodiacSign || getZodiacSign(state.user.dob) || "";
  const data = ZODIAC_DATA[sign];

  if (!sign || !data) {
    return html`<section class="page-section">
      <div class="section-heading"><div><p>Cosmic Insight</p><h2>Your Horoscope</h2></div></div>
      <div class="horoscope-detail-card"><p>Please update your date of birth in your profile to see your horoscope.</p></div>
    </section>`;
  }

  return html`
    <section class="page-section">
      <div class="section-heading"><div><p>Cosmic Insight</p><h2>Your Horoscope</h2></div></div>
      <div class="horoscope-container">
        <div class="zodiac-card">
          <span class="zodiac-symbol">${data.symbol}</span>
          <h2>${escapeText(sign)}</h2>
          <p class="zodiac-dates">${data.dates}</p>
        </div>
        <div class="horoscope-info">
          <div class="horoscope-detail-card">
            <h3>☀️ Today's Energy</h3>
            <p>${data.desc}</p>
          </div>
          <div class="horoscope-detail-card">
            <h3>✨ Your Traits</h3>
            <div class="trait-tags">${data.traits.map((t) => `<span class="trait-tag">${t}</span>`).join("")}</div>
          </div>
          <div class="horoscope-detail-card">
            <h3>🌍 Cosmic Details</h3>
            <p><strong>Element:</strong> ${data.element} &nbsp;&nbsp; <strong>Ruling Planet:</strong> ${data.ruler}</p>
          </div>
        </div>
      </div>
    </section>
  `;
}

/* ── Payments ──────────────────────────────────────── */
function paymentsMarkup() {
  return html`
    <section class="page-section">
      <div class="section-heading"><div><p>Financial</p><h2>My Payments</h2></div></div>
      ${tableMarkup(["Astrologer", "Date", "Duration", "Amount", "Status", "Action"], state.userBookings.map((b) => html`
        <tr>
          <td><strong>${escapeText(b.astrologerId?.name)}</strong></td>
          <td>${new Date(b.date).toLocaleDateString()}</td>
          <td>${b.duration} min</td>
          <td><strong>₹${b.amount}</strong></td>
          <td><span class="status ${b.paymentStatus === "Paid" ? "completed" : "pending"}">${escapeText(b.paymentStatus)}</span></td>
          <td>${b.paymentStatus !== "Paid" ? `<button class="pay-btn" data-pay-booking="${b._id}" type="button">💳 Pay Now</button>` : `<span style="color:var(--text-muted)">✅ Done</span>`}</td>
        </tr>
      `), "No payment records yet.")}
    </section>
  `;
}

/* ── Chat ──────────────────────────────────────────── */
function chatMarkup() {
  const convs = state.conversations;

  return html`
    <section class="page-section">
      <div class="section-heading"><div><p>Messages</p><h2>Chat</h2></div></div>
      <div class="chat-layout">
        <div class="chat-conversations">
          ${convs.length ? convs.map((c) => {
            const other = state.user.role === "user" ? c.booking.astrologerId : c.booking.userId;
            const isActive = state.selectedBookingChat === c.booking._id;
            return html`
              <button class="chat-conv-item ${isActive ? "active" : ""}" data-open-chat="${c.booking._id}" data-chat-receiver="${other?._id}" type="button">
                <div class="conv-avatar">${escapeText((other?.name || "?")[0])}</div>
                <div class="conv-info">
                  <strong>${escapeText(other?.name)}</strong>
                  <span>${escapeText(c.lastMessage?.message || "")}</span>
                </div>
                ${c.unreadCount ? `<span class="unread-badge">${c.unreadCount}</span>` : ""}
              </button>
            `;
          }).join("") : `<div class="chat-empty">No conversations yet</div>`}
        </div>
        <div class="chat-messages-panel">
          ${state.selectedBookingChat ? html`
            <div class="chat-header">Conversation</div>
            <div class="chat-messages" id="chat-messages-area">
              ${state.chatMessages.length ? state.chatMessages.map((m) => {
                const isSent = String(m.senderId?._id || m.senderId) === state.user.id;
                return html`
                  <div class="chat-bubble ${isSent ? "sent" : "received"}">
                    ${escapeText(m.message)}
                    <span class="bubble-time">${new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                `;
              }).join("") : `<div class="chat-empty">No messages yet. Start the conversation!</div>`}
            </div>
            <form class="chat-input-bar" id="chat-send-form">
              <input name="message" placeholder="Type a message..." required autocomplete="off" />
              <button type="submit">Send</button>
            </form>
          ` : `<div class="chat-empty">Select a conversation to start chatting</div>`}
        </div>
      </div>
    </section>
  `;
}

/* ── User Portal Bindings ──────────────────────────── */
function bindUserPortal() {
  document.getElementById("user-logout")?.addEventListener("click", logout);

  // Nav
  document.querySelectorAll("[data-uview]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      state.userView = btn.dataset.uview;
      state.selectedAstrologer = null;
      state.selectedBookingChat = null;
      state.error = "";
      await loadUserPortalData();
      renderUserPortal();
    });
  });

  // Book astrologer
  document.querySelectorAll("[data-book-astrologer]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.selectedAstrologer = state.astrologersList.find((a) => a._id === btn.dataset.bookAstrologer);
      renderUserPortal();
    });
  });

  // Back to astrologers
  document.getElementById("back-to-astrologers")?.addEventListener("click", () => {
    state.selectedAstrologer = null;
    renderUserPortal();
  });

  // Booking duration change
  const durationSelect = document.getElementById("booking-duration");
  if (durationSelect && state.selectedAstrologer) {
    durationSelect.addEventListener("change", () => {
      const dur = parseInt(durationSelect.value);
      const rate = state.selectedAstrologer.hourlyRate || 500;
      document.getElementById("summary-duration").textContent = `${dur} min`;
      document.getElementById("summary-total").textContent = `₹${Math.round(rate * (dur / 60))}`;
    });
  }

  // Confirm booking
  document.getElementById("confirm-booking")?.addEventListener("click", async () => {
    const form = document.getElementById("booking-form");
    if (!form) return;
    const formData = Object.fromEntries(new FormData(form));
    if (!formData.date || !formData.timeSlot) { state.error = "Please select date and time."; renderUserPortal(); return; }

    try {
      await api("/bookings", {
        method: "POST",
        body: JSON.stringify({
          astrologerId: state.selectedAstrologer._id,
          date: formData.date,
          timeSlot: formData.timeSlot,
          duration: parseInt(formData.duration) || 30,
          notes: formData.notes || ""
        })
      });
      state.selectedAstrologer = null;
      state.userView = "bookings";
      await loadUserPortalData();
      renderUserPortal();
    } catch (error) {
      state.error = error.message;
      renderUserPortal();
    }
  });

  // Pay booking
  document.querySelectorAll("[data-pay-booking]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        await api(`/bookings/${btn.dataset.payBooking}/pay`, { method: "PUT" });
        await loadUserBookings();
        renderUserPortal();
      } catch (error) {
        state.error = error.message;
        renderUserPortal();
      }
    });
  });

  // Cancel booking
  document.querySelectorAll("[data-cancel-booking]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        await api(`/bookings/${btn.dataset.cancelBooking}/status`, { method: "PUT", body: JSON.stringify({ status: "Cancelled" }) });
        await loadUserBookings();
        renderUserPortal();
      } catch (error) {
        state.error = error.message;
        renderUserPortal();
      }
    });
  });

  // Open chat from bookings
  document.querySelectorAll("[data-chat-booking]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      state.userView = "chat";
      state.selectedBookingChat = btn.dataset.chatBooking;
      await loadChatMessages(state.selectedBookingChat);
      await loadConversations();
      renderUserPortal();
      startChatPoll();
    });
  });

  // Open chat from conversations list
  document.querySelectorAll("[data-open-chat]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      state.selectedBookingChat = btn.dataset.openChat;
      await loadChatMessages(state.selectedBookingChat);
      renderUserPortal();
      startChatPoll();
    });
  });

  // Send message
  document.getElementById("chat-send-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = event.currentTarget.querySelector("input[name=message]");
    const message = input?.value?.trim();
    if (!message || !state.selectedBookingChat) return;

    // Find the receiver
    const booking = state.userBookings.find((b) => b._id === state.selectedBookingChat);
    let receiverId = "";
    if (booking) {
      receiverId = state.user.id === String(booking.userId?._id || booking.userId)
        ? (booking.astrologerId?._id || booking.astrologerId)
        : (booking.userId?._id || booking.userId);
    }
    // Fallback: find from conversations
    if (!receiverId) {
      const conv = state.conversations.find((c) => c.booking._id === state.selectedBookingChat);
      if (conv) {
        const other = state.user.role === "user" ? conv.booking.astrologerId : conv.booking.userId;
        receiverId = other?._id;
      }
    }

    if (!receiverId) { state.error = "Could not determine receiver."; renderUserPortal(); return; }

    try {
      await api("/chat/send", {
        method: "POST",
        body: JSON.stringify({ bookingId: state.selectedBookingChat, receiverId, message })
      });
      input.value = "";
      await loadChatMessages(state.selectedBookingChat);
      renderUserPortal();
      // Scroll to bottom
      const area = document.getElementById("chat-messages-area");
      if (area) area.scrollTop = area.scrollHeight;
    } catch (error) {
      state.error = error.message;
      renderUserPortal();
    }
  });

  // Scroll chat to bottom
  const chatArea = document.getElementById("chat-messages-area");
  if (chatArea) chatArea.scrollTop = chatArea.scrollHeight;
}

function startChatPoll() {
  if (chatPollInterval) clearInterval(chatPollInterval);
  chatPollInterval = setInterval(async () => {
    if (state.selectedBookingChat && state.userView === "chat") {
      await loadChatMessages(state.selectedBookingChat);
      const chatArea = document.getElementById("chat-messages-area");
      if (chatArea) {
        const msgs = chatArea.querySelectorAll(".chat-bubble");
        const currentCount = msgs.length;
        // Only re-render if message count changed
        if (currentCount !== state.chatMessages.length) {
          renderUserPortal();
        }
      }
    }
  }, 5000);
}

/* ══════════════════════════════════════════════════════
   BOOT
   ══════════════════════════════════════════════════════ */
async function boot() {
  if (state.user) {
    if (state.user.role === "user") {
      await loadUserPortalData();
    } else {
      await loadCRMData();
    }
  }
  renderApp();
}

boot();
