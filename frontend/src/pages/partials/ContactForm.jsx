import { useState } from "react";

const API_URL = "http://127.0.0.1:8000";

export default function ContactForm({ defaultService = "clientflow" }) {
  const [form, setForm] = useState({
    name: "",
    business_name: "",
    phone: "",
    email: "",
    service_interest: defaultService,
    message: "",
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name || !form.phone) {
      setStatus("Compila nome e telefono");
      return;
    }

    try {
      setLoading(true);
      setStatus("");

      const res = await fetch(`${API_URL}/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Errore invio");
      }

      setStatus("✅ Richiesta inviata con successo!");
      setForm({
        name: "",
        business_name: "",
        phone: "",
        email: "",
        service_interest: defaultService,
        message: "",
      });
    } catch (err) {
      setStatus("❌ Errore: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <input
        placeholder="Nome e cognome"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        placeholder="Nome attività"
        value={form.business_name}
        onChange={(e) => setForm({ ...form, business_name: e.target.value })}
      />

      <input
        placeholder="Telefono"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <textarea
        placeholder="Messaggio"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
      />

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Invio..." : "Invia richiesta"}
      </button>

      {status && <div className="status">{status}</div>}
    </form>
  );
}