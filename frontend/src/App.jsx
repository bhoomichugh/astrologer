import {
  CalendarClock,
  CheckCircle2,
  FileText,
  LayoutDashboard,
  LogOut,
  MoonStar,
  Plus,
  Sparkles,
  Trash2,
  UsersRound
} from "lucide-react";
import { useEffect, useState } from "react";

import api from "./services/api";

const emptyAuth = { name: "", email: "", password: "", role: "admin" };
const emptyCustomer = {
  name: "",
  email: "",
  phone: "",
  dob: "",
  zodiacSign: "",
  assignedAstrologer: "",
  source: "Other"
};
const emptyTeamUser = { name: "", email: "", password: "", role: "astrologer" };
const emptyConsultation = {
  clientId: "",
  astrologerId: "",
  date: "",
  status: "Scheduled",
  notes: ""
};

const getStoredUser = () => {
  try {
    const stored = window.localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const saveSession = (data) => {
  window.localStorage.setItem("token", data.token);
  window.localStorage.setItem("user", JSON.stringify(data.user));
};

const clearSession = () => {
  window.localStorage.removeItem("token");
  window.localStorage.removeItem("user");
};

const App = () => {
  const [user, setUser] = useState(getStoredUser);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState(emptyAuth);
  const [view, setView] = useState("dashboard");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [stats, setStats] = useState({
    totalClients: 0,
    upcomingConsultations: 0,
    completedConsultations: 0,
    pendingConsultations: 0
  });
  const [customers, setCustomers] = useState([]);
  const [teamUsers, setTeamUsers] = useState([]);
  const [consultations, setConsultations] = useState([]);

  const [customerForm, setCustomerForm] = useState(emptyCustomer);
  const [teamUserForm, setTeamUserForm] = useState(emptyTeamUser);
  const [editingTeamUserId, setEditingTeamUserId] = useState("");
  const [consultationForm, setConsultationForm] = useState(emptyConsultation);
  const [loadingSummaryId, setLoadingSummaryId] = useState("");

  const astrologers = teamUsers.filter((member) => member.role === "astrologer");

  const loadData = async () => {
    if (!user) return;

    try {
      const [statsResponse, customerResponse, consultationResponse, usersResponse] =
        await Promise.all([
          api.get("/dashboard/stats").catch(() => ({ data: stats })),
          api.get("/clients").catch(() => ({ data: [] })),
          api.get("/consultations").catch(() => ({ data: [] })),
          user.role === "admin"
            ? api.get("/users").catch(() => ({ data: [] }))
            : Promise.resolve({ data: [] })
        ]);

      setStats(statsResponse.data);
      setCustomers(customerResponse.data);
      setConsultations(consultationResponse.data);
      setTeamUsers(usersResponse.data);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Could not load CRM data.");
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleAuth = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const payload =
        authMode === "login"
          ? { email: authForm.email, password: authForm.password }
          : authForm;
      const { data } = await api.post(`/auth/${authMode}`, payload);

      if (authMode === "register") {
        setMessage("Account created. Please login.");
        setAuthMode("login");
        setAuthForm({ ...emptyAuth, email: authForm.email });
        return;
      }

      saveSession(data);
      setUser(data.user);
      setView("dashboard");
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Backend is not running or not configured.");
    }
  };

  const logout = () => {
    clearSession();
    setUser(null);
    setView("dashboard");
  };

  const addCustomer = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await api.post("/clients", customerForm);
      setCustomerForm(emptyCustomer);
      loadData();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Could not add customer.");
    }
  };

  const deleteCustomer = async (id) => {
    await api.delete(`/clients/${id}`);
    loadData();
  };

  const saveTeamUser = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const payload = { ...teamUserForm };
      if (!payload.password) delete payload.password;

      if (editingTeamUserId) {
        await api.put(`/users/${editingTeamUserId}`, payload);
      } else {
        await api.post("/users", payload);
      }

      setTeamUserForm(emptyTeamUser);
      setEditingTeamUserId("");
      loadData();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Could not save user.");
    }
  };

  const editTeamUser = (member) => {
    setEditingTeamUserId(member._id);
    setTeamUserForm({
      name: member.name,
      email: member.email,
      password: "",
      role: member.role
    });
  };

  const deleteTeamUser = async (id) => {
    await api.delete(`/users/${id}`);
    loadData();
  };

  const addConsultation = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await api.post("/consultations", consultationForm);
      setConsultationForm(emptyConsultation);
      loadData();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Could not add consultation.");
    }
  };

  const completeConsultation = async (id) => {
    await api.put(`/consultations/${id}`, { status: "Completed" });
    loadData();
  };

  const deleteConsultation = async (id) => {
    await api.delete(`/consultations/${id}`);
    loadData();
  };

  const generateSummary = async (consultation) => {
    setLoadingSummaryId(consultation._id);
    try {
      await api.post("/ai/generate-summary", {
        consultationId: consultation._id,
        notes: consultation.notes
      });
      loadData();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Could not generate summary.");
    } finally {
      setLoadingSummaryId("");
    }
  };

  if (!user) {
    return (
      <main className="auth-page">
        <section className="auth-panel">
          <div className="auth-copy">
            <span>Astrologer CRM</span>
            <h1>Manage customers, astrologers, and consultations.</h1>
            <p>Admin can control staff accounts while astrologers manage assigned customers.</p>
          </div>

          <form className="auth-form" onSubmit={handleAuth}>
            <h2>{authMode === "login" ? "Login" : "Register User"}</h2>
            {error && <div className="error-box">{error}</div>}
            {message && <div className="success-box">{message}</div>}

            {authMode === "register" && (
              <input
                onChange={(event) => setAuthForm({ ...authForm, name: event.target.value })}
                placeholder="Name"
                required
                value={authForm.name}
              />
            )}
            <input
              onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })}
              placeholder="Email"
              required
              type="email"
              value={authForm.email}
            />
            <input
              minLength="6"
              onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })}
              placeholder="Password"
              required
              type="password"
              value={authForm.password}
            />
            {authMode === "register" && (
              <select
                onChange={(event) => setAuthForm({ ...authForm, role: event.target.value })}
                value={authForm.role}
              >
                <option value="admin">Admin</option>
                <option value="astrologer">Astrologer</option>
              </select>
            )}

            <button className="primary-button" type="submit">
              {authMode === "login" ? "Login" : "Register"}
            </button>
            <button
              className="ghost-button"
              onClick={() => {
                setAuthMode(authMode === "login" ? "register" : "login");
                setError("");
                setMessage("");
              }}
              type="button"
            >
              {authMode === "login" ? "Create account" : "Back to login"}
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <MoonStar size={28} />
          <div>
            <strong>Astrologer CRM</strong>
            <span>{user.role}</span>
          </div>
        </div>

        <nav className="nav-list">
          <button className={view === "dashboard" ? "active" : ""} onClick={() => setView("dashboard")}>
            <LayoutDashboard size={18} />
            Dashboard
          </button>
          <button className={view === "customers" ? "active" : ""} onClick={() => setView("customers")}>
            <UsersRound size={18} />
            Customers
          </button>
          {user.role === "admin" && (
            <button className={view === "users" ? "active" : ""} onClick={() => setView("users")}>
              <UsersRound size={18} />
              Admin/Astrologers
            </button>
          )}
          <button
            className={view === "consultations" ? "active" : ""}
            onClick={() => setView("consultations")}
          >
            <FileText size={18} />
            Consultations
          </button>
        </nav>

        <button className="ghost-button logout-button" onClick={logout} type="button">
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      <main className="content">
        <header className="topbar">
          <div>
            <p>Welcome back</p>
            <h1>{user.name}</h1>
          </div>
          <span className="role-pill">{user.role}</span>
        </header>

        {error && <div className="error-box page-error">{error}</div>}

        {view === "dashboard" && (
          <section className="page-section">
            <div className="section-heading">
              <div>
                <p>Overview</p>
                <h2>Practice Snapshot</h2>
              </div>
            </div>
            <div className="stats-grid">
              {[
                ["Total Customers", stats.totalClients, UsersRound],
                ["Upcoming Consultations", stats.upcomingConsultations, CalendarClock],
                ["Completed Consultations", stats.completedConsultations, CheckCircle2],
                ["Pending Consultations", stats.pendingConsultations, FileText]
              ].map(([label, value, Icon]) => (
                <article className="stat-card" key={label}>
                  <div className="stat-icon">
                    <Icon size={22} />
                  </div>
                  <span>{label}</span>
                  <strong>{value || 0}</strong>
                </article>
              ))}
            </div>
          </section>
        )}

        {view === "customers" && (
          <section className="page-section">
            <div className="section-heading">
              <div>
                <p>Customer Management</p>
                <h2>Customers</h2>
              </div>
            </div>
            <form className="data-form" onSubmit={addCustomer}>
              <input
                onChange={(event) => setCustomerForm({ ...customerForm, name: event.target.value })}
                placeholder="Name"
                required
                value={customerForm.name}
              />
              <input
                onChange={(event) => setCustomerForm({ ...customerForm, email: event.target.value })}
                placeholder="Email"
                type="email"
                value={customerForm.email}
              />
              <input
                onChange={(event) => setCustomerForm({ ...customerForm, phone: event.target.value })}
                placeholder="Phone"
                required
                value={customerForm.phone}
              />
              <input
                onChange={(event) => setCustomerForm({ ...customerForm, dob: event.target.value })}
                type="date"
                value={customerForm.dob}
              />
              <input
                onChange={(event) => setCustomerForm({ ...customerForm, zodiacSign: event.target.value })}
                placeholder="Zodiac"
                value={customerForm.zodiacSign}
              />
              <select
                onChange={(event) =>
                  setCustomerForm({ ...customerForm, assignedAstrologer: event.target.value })
                }
                value={customerForm.assignedAstrologer}
              >
                <option value="">Assign astrologer</option>
                {astrologers.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name}
                  </option>
                ))}
              </select>
              <button className="primary-button compact" type="submit">
                <Plus size={17} />
                Add Customer
              </button>
            </form>

            <DataTable
              columns={["Name", "Phone", "Zodiac", "Assigned Astrologer", "Actions"]}
              emptyText="No customers yet"
            >
              {customers.map((customer) => (
                <tr key={customer._id}>
                  <td>
                    <strong>{customer.name}</strong>
                    <span>{customer.email}</span>
                  </td>
                  <td>{customer.phone}</td>
                  <td>{customer.zodiacSign || "Not set"}</td>
                  <td>{customer.assignedAstrologer?.name || "Not assigned"}</td>
                  <td>
                    <button onClick={() => deleteCustomer(customer._id)} type="button">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </DataTable>
          </section>
        )}

        {view === "users" && user.role === "admin" && (
          <section className="page-section">
            <div className="section-heading">
              <div>
                <p>Staff Access</p>
                <h2>Admin / Astrologers</h2>
              </div>
            </div>
            <form className="data-form team-form" onSubmit={saveTeamUser}>
              <input
                onChange={(event) => setTeamUserForm({ ...teamUserForm, name: event.target.value })}
                placeholder="Name"
                required
                value={teamUserForm.name}
              />
              <input
                onChange={(event) => setTeamUserForm({ ...teamUserForm, email: event.target.value })}
                placeholder="Email"
                required
                type="email"
                value={teamUserForm.email}
              />
              <input
                minLength="6"
                onChange={(event) => setTeamUserForm({ ...teamUserForm, password: event.target.value })}
                placeholder={editingTeamUserId ? "New password optional" : "Password"}
                required={!editingTeamUserId}
                type="password"
                value={teamUserForm.password}
              />
              <select
                onChange={(event) => setTeamUserForm({ ...teamUserForm, role: event.target.value })}
                value={teamUserForm.role}
              >
                <option value="admin">Admin</option>
                <option value="astrologer">Astrologer</option>
              </select>
              <button className="primary-button compact" type="submit">
                <Plus size={17} />
                {editingTeamUserId ? "Update User" : "Add User"}
              </button>
            </form>

            <DataTable columns={["Name", "Email", "Role", "Created", "Actions"]} emptyText="No users yet">
              {teamUsers.map((member) => (
                <tr key={member._id}>
                  <td>
                    <strong>{member.name}</strong>
                    <span>{member._id}</span>
                  </td>
                  <td>{member.email}</td>
                  <td>
                    <span className="role-pill">{member.role}</span>
                  </td>
                  <td>{member.createdAt ? new Date(member.createdAt).toLocaleDateString() : "-"}</td>
                  <td>
                    <div className="action-row">
                      <button onClick={() => editTeamUser(member)} type="button">
                        Edit
                      </button>
                      <button
                        disabled={member._id === user.id}
                        onClick={() => deleteTeamUser(member._id)}
                        type="button"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </DataTable>
          </section>
        )}

        {view === "consultations" && (
          <section className="page-section">
            <div className="section-heading">
              <div>
                <p>Consultation Management</p>
                <h2>Consultations</h2>
              </div>
            </div>
            <form className="data-form consultation-form" onSubmit={addConsultation}>
              <select
                onChange={(event) =>
                  setConsultationForm({ ...consultationForm, clientId: event.target.value })
                }
                required
                value={consultationForm.clientId}
              >
                <option value="">Select customer</option>
                {customers.map((customer) => (
                  <option key={customer._id} value={customer._id}>
                    {customer.name}
                  </option>
                ))}
              </select>
              <select
                onChange={(event) =>
                  setConsultationForm({ ...consultationForm, astrologerId: event.target.value })
                }
                value={consultationForm.astrologerId}
              >
                <option value="">Select astrologer</option>
                {astrologers.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name}
                  </option>
                ))}
              </select>
              <input
                onChange={(event) => setConsultationForm({ ...consultationForm, date: event.target.value })}
                required
                type="datetime-local"
                value={consultationForm.date}
              />
              <select
                onChange={(event) => setConsultationForm({ ...consultationForm, status: event.target.value })}
                value={consultationForm.status}
              >
                <option>Scheduled</option>
                <option>Pending</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
              <textarea
                onChange={(event) => setConsultationForm({ ...consultationForm, notes: event.target.value })}
                placeholder="Consultation notes"
                value={consultationForm.notes}
              />
              <button className="primary-button compact" type="submit">
                <Plus size={17} />
                Add Consultation
              </button>
            </form>

            <DataTable
              columns={["Customer", "Date", "Status", "Notes", "AI Summary", "Actions"]}
              emptyText="No consultations yet"
            >
              {consultations.map((consultation) => (
                <tr key={consultation._id}>
                  <td>
                    <strong>{consultation.clientId?.name}</strong>
                    <span>{consultation.astrologerId?.name}</span>
                  </td>
                  <td>{new Date(consultation.date).toLocaleString()}</td>
                  <td>
                    <span className={`status ${consultation.status.toLowerCase()}`}>
                      {consultation.status}
                    </span>
                  </td>
                  <td className="notes-cell">{consultation.notes || "No notes"}</td>
                  <td className="summary-cell">{consultation.aiSummary || "Not generated"}</td>
                  <td>
                    <div className="action-row">
                      <button
                        disabled={!consultation.notes || loadingSummaryId === consultation._id}
                        onClick={() => generateSummary(consultation)}
                        type="button"
                      >
                        <Sparkles size={16} />
                      </button>
                      <button onClick={() => completeConsultation(consultation._id)} type="button">
                        Complete
                      </button>
                      <button onClick={() => deleteConsultation(consultation._id)} type="button">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </DataTable>
          </section>
        )}
      </main>
    </div>
  );
};

const DataTable = ({ columns, children, emptyText }) => {
  const rowCount = Array.isArray(children) ? children.length : children ? 1 : 0;

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowCount ? (
            children
          ) : (
            <tr>
              <td className="empty-table" colSpan={columns.length}>
                {emptyText}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default App;
