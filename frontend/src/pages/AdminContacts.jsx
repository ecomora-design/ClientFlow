import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/contacts`)
      .then(res => res.json())
      .then(data => setContacts(data));
  }, []);

  return (
    <div className="section">
      <div className="container">
        <h2>Contatti ricevuti</h2>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", marginTop: 20 }}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Attività</th>
                <th>Telefono</th>
                <th>Email</th>
                <th>Servizio</th>
              </tr>
            </thead>

            <tbody>
              {contacts.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.business_name}</td>
                  <td>{c.phone}</td>
                  <td>{c.email}</td>
                  <td>{c.service_interest}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}