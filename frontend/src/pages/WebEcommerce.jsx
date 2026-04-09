import ContactForm from "./partials/ContactForm.jsx";

export default function WebEcommerce() {
  return (
    <div>
      <section className="hero small-hero">
        <div className="container hero-inner">
          <div className="badge">ClientFlow Web</div>
          <h1>Siti web ed e-commerce professionali</h1>
          <p className="subtitle">
            Creiamo siti su misura per portarti clienti e vendite.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container cards">
          <div className="card">
            <h3>Sito vetrina</h3>
            <p>Perfetto per presentare la tua attività</p>
          </div>

          <div className="card">
            <h3>E-commerce</h3>
            <p>Vendi online in modo professionale</p>
          </div>

          <div className="card">
            <h3>Personalizzato</h3>
            <p>Soluzioni su misura per ogni esigenza</p>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container form-wrap">
          <div className="form-intro">
            <h2>Vuoi il tuo sito?</h2>
            <p>Lascia i dati e ti ricontattiamo.</p>
          </div>

          <ContactForm defaultService="siti web" />
        </div>
      </section>
    </div>
  );
}