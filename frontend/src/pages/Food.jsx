import ContactForm from "./partials/ContactForm.jsx";

export default function Food() {
  return (
    <div>
      <section className="hero small-hero">
        <div className="container hero-inner">
          <div className="badge">ClientFlow Food</div>
          <h1>Più richieste per il tuo locale</h1>
          <p className="subtitle">
            Un sistema semplice per ristoranti, pizzerie e attività food.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container cards">
          <div className="card">
            <h3>Pagina dedicata</h3>
            <p>Presenza online professionale per la tua attività.</p>
          </div>
          <div className="card">
            <h3>Gestione richieste</h3>
            <p>Contatti ordinati e più facili da gestire.</p>
          </div>
          <div className="card">
            <h3>Automazioni</h3>
            <p>Meno stress e più controllo sul lavoro.</p>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container form-wrap">
          <div className="form-intro">
            <h2>Vuoi ClientFlow Food?</h2>
            <p>Lascia i dati e ti ricontattiamo.</p>
          </div>
          <ContactForm defaultService="food software" />
        </div>
      </section>
    </div>
  );
}