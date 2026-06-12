import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import api from "../services/api";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  dob: "",
  zodiacSign: "",
  assignedAstrologer: ""
};

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const loadClients = async () => {
    const { data } = await api.get("/clients");
    setClients(data);
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (editingId) {
      await api.put(`/clients/${editingId}`, form);
    } else {
      await api.post("/clients", form);
    }

    setForm(emptyForm);
    setEditingId(null);
    loadClients();
  };

  const startEdit = (client) => {
    setEditingId(client._id);
    setForm({
      name: client.name || "",
      email: client.email || "",
      phone: client.phone || "",
      dob: client.dob ? client.dob.slice(0, 10) : "",
      zodiacSign: client.zodiacSign || "",
      assignedAstrologer: client.assignedAstrologer?._id || client.assignedAstrologer || ""
    });
  };

  const deleteClient = async (id) => {
    await api.delete(`/clients/${id}`);
    loadClients();
  };

  return (
    <section className="page-section">
      <div className="section-heading">
        <div>
          <p>Client Management</p>
          <h2>Clients</h2>
        </div>
      </div>

      <form className="data-form" onSubmit={handleSubmit}>
        <input
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          placeholder="Name"
          required
          value={form.name}
        />
        <input
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          placeholder="Email"
          type="email"
          value={form.email}
        />
        <input
          onChange={(event) => setForm({ ...form, phone: event.target.value })}
          placeholder="Phone"
          required
          value={form.phone}
        />
        <input
          onChange={(event) => setForm({ ...form, dob: event.target.value })}
          type="date"
          value={form.dob}
        />
        <input
          onChange={(event) => setForm({ ...form, zodiacSign: event.target.value })}
          placeholder="Zodiac"
          value={form.zodiacSign}
        />
        <input
          onChange={(event) => setForm({ ...form, assignedAstrologer: event.target.value })}
          placeholder="Astrologer user ID"
          value={form.assignedAstrologer}
        />
        <button className="primary-button compact" type="submit">
          <Plus size={17} />
          {editingId ? "Update" : "Add Client"}
        </button>
      </form>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Zodiac</th>
              <th>Assigned Astrologer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client._id}>
                <td>
                  <strong>{client.name}</strong>
                  <span>{client.email}</span>
                </td>
                <td>{client.phone}</td>
                <td>{client.zodiacSign || "Not set"}</td>
                <td>{client.assignedAstrologer?.name || "Not assigned"}</td>
                <td>
                  <div className="action-row">
                    <button aria-label="Edit client" onClick={() => startEdit(client)} type="button">
                      <Pencil size={16} />
                    </button>
                    <button aria-label="Delete client" onClick={() => deleteClient(client._id)} type="button">
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

export default Clients;
