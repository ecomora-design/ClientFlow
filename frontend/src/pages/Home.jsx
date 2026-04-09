import ContactForm from "./partials/ContactForm.jsx";

export default function Home() {
<img src="/mockup-home.png" style={{ width: "100%", maxWidth: 500 }} />
  return (
    <div>
      <section className="hero">
        <div className="container hero-inner">
          <div className="badge">ClientFlow</div>
          <h1>Più clienti. Meno stress.</h1>
          <p className="subtitle">
            Creiamo siti web, e-commerce e software automatici per saloni,
            ristoranti e attività locali.
          </p>
          <div className="hero-actions">
            <a href="#contact" className="btn btn-primary">Richiedi informazioni</a>
            <a href="/food" className="btn btn-secondary">Scopri i software</a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>I nostri servizi</h2>
          <div className="cards">
            <div className="card">
              <h3>Siti Web & E-commerce</h3>
              <p>Progetti professionali su misura con prezzo fisso.</p>
              <span className="tag">Prezzo fisso</span>
            </div>

            <div className="card">
              <h3>Food Software</h3>
              <p>Per ristoranti, pizzerie e attività food.</p>
              <span className="tag">Da 39€/mese</span>
            </div>

            <div className="card">
              <h3>Beauty Software</h3>
              <p>Per parrucchieri, saloni e professionisti beauty.</p>
              <span className="tag">Da 39€/mese</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container split">
          <div className="feature-box">
            <h2>ClientFlow Food</h2>
            <p>Più richieste, meno caos, gestione più ordinata.</p>
            <ul>
              <li>Pagina dedicata</li>
              <li>Gestione richieste</li>
              <li>Automazioni</li>
              <li>Canone semplice</li>
            </ul>
            <a href="/food" className="btn btn-primary">Vai a Food</a>
          </div>

          <div className="feature-box">
            <h2>ClientFlow Beauty</h2>
            <p>Prenotazioni online, calendario e clienti sempre ordinati.</p>
            <ul>
              <li>Prenotazioni automatiche</li>
              <li>Calendario aggiornato</li>
              <li>Gestione clienti</li>
              <li>Canone semplice</li>
            </ul>
            <a href="/beauty" className="btn btn-primary">Vai a Beauty</a>
          </div>
        </div>
      </section>

      <section id="contact" className="section">
        <div className="container form-wrap">
          <div className="form-intro">
            <h2>Vuoi più clienti?</h2>
            <p>Lascia i tuoi dati e ti ricontattiamo con la soluzione più adatta.</p>
          </div>
          <ContactForm defaultService="clientflow" />
        </div>
      </section>
    </div>
  );
}