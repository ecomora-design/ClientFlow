import ContactForm from "./partials/ContactForm.jsx";

export default function Beauty() {
  return (
    <div>
      <section className="hero small-hero">
        <div className="container hero-inner">
          <div className="badge">ClientFlow Beauty</div>
          <h1>Prenotazioni automatiche per il tuo salone</h1>
          <p className="subtitle">
            Ideale per parrucchieri, barber, make-up artist e centri estetici.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container cards">
          <div className="card">
            <h3>Prenotazioni online</h3>
            <p>I clienti ti trovano e prenotano più facilmente.</p>
          </div>
          <div className="card">
            <h3>Calendario ordinato</h3>
            <p>Meno confusione, più controllo.</p>
          </div>
          <div className="card">
            <h3>Gestione clienti</h3>
            <p>Una base più professionale per crescere.</p>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container form-wrap">
          <div className="form-intro">
            <h2>Vuoi ClientFlow Beauty?</h2>
            <p>Lascia i dati e ti ricontattiamo.</p>
          </div>
          <ContactForm defaultService="beauty software" />
        </div>
      </section>
    </div>
  );
}