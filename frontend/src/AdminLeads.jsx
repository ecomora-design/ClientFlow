import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadLeads() {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/contacts`);
      const data = await res.json();
      setLeads(data);
    } catch (error) {
      console.error("Errore caricamento lead:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeads();
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background:
        "radial-gradient(circle at top left, rgba(88,168,255,0.12), transparent 20%), radial-gradient(circle at top right, rgba(122,92,255,0.12), transparent 22%), #0a0f18",
      color: "white",
      fontFamily: "Arial, sans-serif",
      padding: "30px"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
          marginBottom: "28px"
        }}>
          <div>
            <div style={{
              fontSize: "13px",
              letterSpacing: "0.16em",
              color: "#9db0ff",
              textTransform: "uppercase",
              marginBottom: "10px"
            }}>
              Dashboard Lead
            </div>
            <h1 style={{
              margin: 0,
              fontSize: "40px",
              letterSpacing: "-0.03em"
            }}>
              Contatti ricevuti
            </h1>
          </div>

          <button
            onClick={loadLeads}
            style={{
              border: "none",
              borderRadius: "14px",
              padding: "14px 18px",
              background: "linear-gradient(135deg, #58a8ff, #7a5cff)",
              color: "white",
              fontWeight: "800",
              cursor: "pointer"
            }}
          >
            Aggiorna
          </button>
        </div>

        <div style={{
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "24px",
          overflow: "hidden",
          background:
            "linear-gradient(180deg, rgba(88,168,255,0.08), rgba(122,92,255,0.04)), rgba(255,255,255,0.03)"
        }}>
          {loading ? (
            <div style={{ padding: "30px", color: "rgba(255,255,255,0.75)" }}>
              Caricamento...
            </div>
          ) : leads.length === 0 ? (
            <div style={{ padding: "30px", color: "rgba(255,255,255,0.75)" }}>
              Nessun contatto ricevuto.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.04)" }}>
                    {["ID", "Nome", "Attività", "Telefono", "Messaggio", "Data"].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left",
                          padding: "18px 16px",
                          fontSize: "13px",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          color: "#cfe1ff",
                          borderBottom: "1px solid rgba(255,255,255,0.06)"
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id}>
                      <td style={cell}>{lead.id}</td>
                      <td style={cell}>{lead.name}</td>
                      <td style={cell}>{lead.business_name || "-"}</td>
                      <td style={cell}>{lead.phone}</td>
                      <td style={cell}>{lead.message || "-"}</td>
                      <td style={cell}>
                        {lead.created_at ? new Date(lead.created_at).toLocaleString() : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const cell = {
  padding: "16px",
  borderBottom: "1px solid rgba(255,255,255,0.05)",
  color: "rgba(255,255,255,0.84)",
  verticalAlign: "top",
};