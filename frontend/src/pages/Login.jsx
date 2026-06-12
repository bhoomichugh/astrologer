import { LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(form.email, form.password);
      navigate("/app/dashboard");
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-copy">
          <span>Astrologer CRM</span>
          <h1>Consultations, clients, and follow-ups in one workspace.</h1>
          <p>Manage every client conversation from first booking to AI-assisted summary.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Login</h2>
          {error && <div className="error-box">{error}</div>}

          <label>
            Email
            <div className="input-icon">
              <Mail size={18} />
              <input
                autoComplete="email"
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                required
                type="email"
                value={form.email}
              />
            </div>
          </label>

          <label>
            Password
            <div className="input-icon">
              <LockKeyhole size={18} />
              <input
                autoComplete="current-password"
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                required
                type="password"
                value={form.password}
              />
            </div>
          </label>

          <button className="primary-button" disabled={loading} type="submit">
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="auth-switch">
            New workspace? <Link to="/register">Register admin</Link>
          </p>
        </form>
      </section>
    </main>
  );
};

export default Login;
