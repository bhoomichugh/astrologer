import { CalendarCheck, CalendarClock, CheckCircle2, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";

import api from "../services/api";

const cards = [
  { key: "totalClients", label: "Total Clients", icon: UsersRound },
  { key: "upcomingConsultations", label: "Upcoming Consultations", icon: CalendarClock },
  { key: "completedConsultations", label: "Completed Consultations", icon: CheckCircle2 },
  { key: "pendingConsultations", label: "Pending Consultations", icon: CalendarCheck }
];

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    upcomingConsultations: 0,
    completedConsultations: 0,
    pendingConsultations: 0
  });

  useEffect(() => {
    api.get("/dashboard/stats").then(({ data }) => setStats(data));
  }, []);

  return (
    <section className="page-section">
      <div className="section-heading">
        <div>
          <p>Overview</p>
          <h2>Practice Snapshot</h2>
        </div>
      </div>

      <div className="stats-grid">
        {cards.map(({ key, label, icon: Icon }) => (
          <article className="stat-card" key={key}>
            <div className="stat-icon">
              <Icon size={22} />
            </div>
            <span>{label}</span>
            <strong>{stats[key]}</strong>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Dashboard;
