import { CalendarClock, LayoutDashboard, LogOut, MoonStar, UsersRound } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

const AppLayout = () => {
  const { logout, user } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <MoonStar size={28} />
          <div>
            <strong>Astrologer CRM</strong>
            <span>{user?.role}</span>
          </div>
        </div>

        <nav className="nav-list">
          <NavLink to="/app/dashboard">
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>
          <NavLink to="/app/clients">
            <UsersRound size={18} />
            Clients
          </NavLink>
          <NavLink to="/app/consultations">
            <CalendarClock size={18} />
            Consultations
          </NavLink>
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
            <h1>{user?.name}</h1>
          </div>
          <span className="role-pill">{user?.role}</span>
        </header>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
