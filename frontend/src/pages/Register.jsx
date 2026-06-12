import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin"
  });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await register(form);
      navigate("/app/dashboard");
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Registration failed");
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-form solo" onSubmit={handleSubmit}>
        <h2>Register User</h2>
        {error && <div className="error-box">{error}</div>}

        <label>
          Name
          <input
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            required
            value={form.name}
          />
        </label>

        <label>
          Email
          <input
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
            type="email"
            value={form.email}
          />
        </label>

        <label>
          Password
          <input
            minLength="6"
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
            type="password"
            value={form.password}
          />
        </label>

        <label>
          Role
          <select
            onChange={(event) => setForm({ ...form, role: event.target.value })}
            value={form.role}
          >
            <option value="admin">Admin</option>
            <option value="astrologer">Astrologer</option>
          </select>
        </label>

        <button className="primary-button" type="submit">
          Register
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </main>
  );
};

export default Register;
