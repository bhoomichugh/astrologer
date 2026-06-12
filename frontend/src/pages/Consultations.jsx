import { FileText, Plus, Sparkles, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import api from "../services/api";

const emptyForm = {
  clientId: "",
  astrologerId: "",
  date: "",
  status: "Scheduled",
  notes: ""
};

const Consultations = () => {
  const [clients, setClients] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loadingSummaryId, setLoadingSummaryId] = useState("");

  const loadData = async () => {
    const [clientResponse, consultationResponse] = await Promise.all([
      api.get("/clients"),
      api.get("/consultations")
    ]);
    setClients(clientResponse.data);
    setConsultations(consultationResponse.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await api.post("/consultations", form);
    setForm(emptyForm);
    loadData();
  };

  const markCompleted = async (consultation) => {
    await api.put(`/consultations/${consultation._id}`, { status: "Completed" });
    loadData();
  };

  const deleteConsultation = async (id) => {
    await api.delete(`/consultations/${id}`);
    loadData();
  };

  const generateSummary = async (consultation) => {
    setLoadingSummaryId(consultation._id);
    await api.post("/ai/generate-summary", {
      consultationId: consultation._id,
      notes: consultation.notes
    });
    setLoadingSummaryId("");
    loadData();
  };

  return (
    <section className="page-section">
      <div className="section-heading">
        <div>
          <p>Consultation Management</p>
          <h2>Consultations</h2>
        </div>
      </div>

      <form className="data-form consultation-form" onSubmit={handleSubmit}>
        <select
          onChange={(event) => setForm({ ...form, clientId: event.target.value })}
          required
          value={form.clientId}
        >
          <option value="">Select client</option>
          {clients.map((client) => (
            <option key={client._id} value={client._id}>
              {client.name}
            </option>
          ))}
        </select>
        <input
          onChange={(event) => setForm({ ...form, astrologerId: event.target.value })}
          placeholder="Astrologer user ID"
          value={form.astrologerId}
        />
        <input
          onChange={(event) => setForm({ ...form, date: event.target.value })}
          required
          type="datetime-local"
          value={form.date}
        />
        <select
          onChange={(event) => setForm({ ...form, status: event.target.value })}
          value={form.status}
        >
          <option>Scheduled</option>
          <option>Pending</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
        <textarea
          onChange={(event) => setForm({ ...form, notes: event.target.value })}
          placeholder="Consultation notes"
          value={form.notes}
        />
        <button className="primary-button compact" type="submit">
          <Plus size={17} />
          Add Consultation
        </button>
      </form>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Client</th>
              <th>Date</th>
              <th>Status</th>
              <th>Notes</th>
              <th>AI Summary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
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
                <td className="notes-cell">
                  <FileText size={15} />
                  {consultation.notes || "No notes"}
                </td>
                <td className="summary-cell">{consultation.aiSummary || "Not generated"}</td>
                <td>
                  <div className="action-row">
                    <button
                      aria-label="Generate AI summary"
                      disabled={!consultation.notes || loadingSummaryId === consultation._id}
                      onClick={() => generateSummary(consultation)}
                      type="button"
                    >
                      <Sparkles size={16} />
                    </button>
                    <button onClick={() => markCompleted(consultation)} type="button">
                      Complete
                    </button>
                    <button
                      aria-label="Delete consultation"
                      onClick={() => deleteConsultation(consultation._id)}
                      type="button"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Consultations;
