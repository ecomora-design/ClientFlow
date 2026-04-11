import { useEffect, useMemo, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const WHATSAPP_NUMBER = "393884027650";

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [offerBarVisible, setOfferBarVisible] = useState(true);
  const [form, setForm] = useState({
    name: "",
    business: "",
    phone: "",
    service: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const [timeLeft, setTimeLeft] = useState(48 * 60 * 60);
  const [openFaq, setOpenFaq] = useState(0);

  const whatsappLink = useMemo(() => {
    const lines = [
      "Ciao, vorrei informazioni su ClientFlow.",
      form.name ? `Nome: ${form.name}` : "",
      form.business ? `Attività: ${form.business}` : "",
      form.phone ? `Telefono: ${form.phone}` : "",
      form.service ? `Pacchetto di interesse: ${form.service}` : "",
      form.message ? `Messaggio: ${form.message}` : "",
    ].filter(Boolean);

    const text = encodeURIComponent(lines.join("\n"));
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  }, [form]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const cards = document.querySelectorAll(".tilt");

    const listeners = [];

    cards.forEach((card) => {
      const onMove = (e) => {
        if (window.innerWidth <= 768) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = -(y - centerY) / 14;
        const rotateY = (x - centerX) / 14;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        card.style.setProperty("--x", `${x}px`);
        card.style.setProperty("--y", `${y}px`);
      };

      const onLeave = () => {
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
      };

      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);

      listeners.push({ card, onMove, onLeave });
    });

    return () => {
      listeners.forEach(({ card, onMove, onLeave }) => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  }

  function goToContacts(service = "") {
    const section = document.getElementById("contatti");

    setForm((prev) => ({
      ...prev,
      service,
      message: service ? `Ciao, vorrei informazioni su ${service}.` : prev.message,
    }));

    if (section) section.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
    setShowPopup(false);
  }

  async function saveLeadAndOpenWhatsApp() {
    if (!form.name || !form.phone) {
      alert("Inserisci almeno nome e telefono.");
      return;
    }

    try {
      setSending(true);
      await fetch(`${API_URL}/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          business_name: form.business,
          phone: form.phone,
          email: "",
          service_interest: form.service || "clientflow",
          message: form.message,
        }),
      });
    } catch (error) {
      console.error("Errore salvataggio contatto:", error);
    } finally {
      setSending(false);
      window.open(whatsappLink, "_blank");
    }
  }

  const services = [
    {
      emoji: "📲",
      title: "Beauty Software",
      text: "Per saloni, parrucchieri ed estetica. Rende più semplice ricevere prenotazioni, ordinare le richieste e offrire ai clienti un’esperienza moderna anche come app.",
      promo: "Promo 39€/mese",
    },
    {
      emoji: "🍽️",
      title: "Food Software",
      text: "Per ristoranti, pizzerie e attività food. Più ordine nelle richieste, contatti più veloci e un sistema semplice che aiuta il cliente a tornare più facilmente.",
      promo: "Promo 39€/mese",
    },
    {
      emoji: "💻",
      title: "Siti Web",
      text: "Siti professionali progettati per presentarti meglio, aumentare la fiducia e trasformare le visite in contatti reali.",
      promo: "Da 499€",
    },
    {
      emoji: "🛒",
      title: "E-commerce",
      text: "Shop online su misura, credibili e moderni, pensati per vendere bene e dare più valore al tuo brand.",
      promo: "Da 1500€",
    },
  ];

  const reasons = [
    {
      title: "Più richieste, meno confusione",
      text: "Un sistema chiaro fa risparmiare tempo e rende più facile per il cliente contattarti o prenotare.",
    },
    {
      title: "Più clienti che ritornano",
      text: "Quando usare il servizio è semplice, veloce e moderno, il cliente torna più volentieri.",
    },
    {
      title: "Più valore percepito",
      text: "Design, struttura e facilità d’uso fanno sembrare la tua attività più seria, più forte e più professionale.",
    },
  ];

  const testimonials = [
    {
      name: "Salone Lucia",
      role: "Beauty",
      text: "I clienti trovano tutto più semplice e oggi le richieste sono molto più ordinate rispetto a prima.",
      result: "Più appuntamenti",
    },
    {
      name: "Pizzeria Centro",
      role: "Food",
      text: "La struttura è più chiara, i clienti ci contattano più facilmente e tutto sembra molto più professionale.",
      result: "Più richieste",
    },
    {
      name: "Studio Locale",
      role: "Web",
      text: "Abbiamo alzato il valore percepito della nostra attività già dal primo impatto.",
      result: "Più credibilità",
    },
  ];

  const pricing = [
    {
      name: "Software",
      price: "39€/mese",
      highlight: true,
      subtitle: "Promo limitata",
      features: [
        "Beauty o Food",
        "Esperienza semplice anche come app",
        "Più ordine nelle richieste",
        "Più facilità nel far tornare i clienti",
      ],
      cta: "Software promo 39€/mese",
      ctaLabel: "Attiva la promo",
    },
    {
      name: "Sito Web",
      price: "499€",
      highlight: false,
      subtitle: "Ingresso professionale",
      features: [
        "Design premium",
        "Struttura per ricevere contatti",
        "Perfetto anche su mobile",
        "Immagine più autorevole",
      ],
      cta: "Sito Web da 499€",
      ctaLabel: "Richiedi il sito",
    },
    {
      name: "E-commerce",
      price: "1500€",
      highlight: false,
      subtitle: "Per vendere online",
      features: [
        "Shop moderno e credibile",
        "Esperienza chiara per il cliente",
        "Struttura su misura",
        "Più valore percepito",
      ],
      cta: "E-commerce da 1500€",
      ctaLabel: "Richiedi e-commerce",
    },
  ];

  const faqs = [
    {
      q: "I software possono essere usati anche come app?",
      a: "Sì. L’esperienza è pensata per essere molto semplice e immediata, così da risultare comoda anche come app e far tornare più facilmente i clienti.",
    },
    {
      q: "Perché la promo a 39€/mese è importante?",
      a: "Perché ti permette di partire subito con un costo accessibile e con una soluzione già premium, più ordinata e più semplice da usare.",
    },
    {
      q: "Che differenza c’è tra sito web ed e-commerce?",
      a: "Il sito web è pensato per presentarti al meglio e ricevere contatti. L’e-commerce è progettato per vendere online prodotti o servizi con una struttura dedicata.",
    },
    {
      q: "Il sito sarà fatto bene anche su mobile?",
      a: "Sì. Ogni sezione è pensata per essere leggibile, ordinata e professionale anche da smartphone.",
    },
  ];

  return (
    <div className="cf-page">
      <style>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body {
          margin: 0;
          font-family: Arial, sans-serif;
          background: #070a12;
          color: white;
        }
        a, button, input, textarea { font-family: inherit; }
        a { text-decoration: none; color: inherit; }

        .cf-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 12% 0%, rgba(88,168,255,0.14), transparent 22%),
            radial-gradient(circle at 100% 8%, rgba(122,92,255,0.12), transparent 26%),
            radial-gradient(circle at 50% 40%, rgba(62,124,255,0.07), transparent 30%),
            linear-gradient(180deg, #070a12 0%, #0a0f18 52%, #081019 100%);
          overflow-x: hidden;
        }

        .reveal {
          opacity: 0;
          transform: translateY(34px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .tilt {
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.25s ease;
          will-change: transform;
        }

        .tilt::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: radial-gradient(
            circle at var(--x, 50%) var(--y, 50%),
            rgba(255,255,255,0.12),
            transparent 60%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .tilt:hover::before {
          opacity: 1;
        }

        .bg-glow {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .bg-glow::before,
        .bg-glow::after {
          content: "";
          position: absolute;
          border-radius: 999px;
          filter: blur(100px);
          opacity: 0.5;
          animation: floatGlow 10s ease-in-out infinite;
        }

        .bg-glow::before {
          width: 340px;
          height: 340px;
          left: -70px;
          top: 70px;
          background: rgba(88, 168, 255, 0.18);
        }

        .bg-glow::after {
          width: 380px;
          height: 380px;
          right: -90px;
          top: 130px;
          background: rgba(122, 92, 255, 0.18);
          animation-delay: 1.5s;
        }

        @keyframes floatGlow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(18px) translateX(8px); }
        }

        .container {
          width: min(1180px, 92%);
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .fade-up {
          opacity: 0;
          transform: translateY(28px);
          animation: fadeUp 0.8s ease forwards;
        }

        .fade-up-delay-1 { animation-delay: 0.08s; }
        .fade-up-delay-2 { animation-delay: 0.16s; }
        .fade-up-delay-3 { animation-delay: 0.24s; }
        .fade-up-delay-4 { animation-delay: 0.32s; }

        .fade-scale {
          opacity: 0;
          transform: translateY(24px) scale(0.985);
          animation: fadeScale 0.85s ease forwards;
        }

        .fade-scale-delay-1 { animation-delay: 0.1s; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeScale {
          from { opacity: 0; transform: translateY(24px) scale(0.985); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .hover-lift {
          transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease;
        }

        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 28px 60px rgba(0,0,0,0.26);
          border-color: rgba(88,168,255,0.28);
        }

        .shine {
          position: relative;
          overflow: hidden;
        }

        .shine::after {
          content: "";
          position: absolute;
          top: -20%;
          left: -120%;
          width: 60%;
          height: 160%;
          transform: rotate(16deg);
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.05) 50%,
            rgba(255,255,255,0) 100%
          );
          transition: left 0.8s ease;
        }

        .shine:hover::after {
          left: 150%;
        }

        .offer-bar {
          position: sticky;
          top: 0;
          z-index: 140;
          display: flex;
          justify-content: center;
          padding: 8px 14px 0;
        }

        .offer-bar-inner {
          width: min(1180px, 100%);
          border-radius: 18px;
          border: 1px solid rgba(88,168,255,0.16);
          background:
            linear-gradient(135deg, rgba(88,168,255,0.18), rgba(122,92,255,0.14)),
            rgba(9,12,20,0.9);
          backdrop-filter: blur(14px);
          padding: 11px 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          text-align: center;
          box-shadow: 0 12px 36px rgba(0,0,0,0.22);
          position: relative;
        }

        .offer-close {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          width: 30px;
          height: 30px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(255,255,255,0.06);
          color: white;
          cursor: pointer;
          font-size: 16px;
          line-height: 1;
        }

        .offer-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 7px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,0.14);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.05em;
        }

        .offer-text {
          font-size: 14px;
          color: rgba(255,255,255,0.92);
          padding-right: 32px;
        }

        .offer-strong {
          font-weight: 900;
          color: white;
        }

        .offer-time {
          font-weight: 800;
          color: #bfe1ff;
        }

        .navbar-wrap {
  position: sticky;
  top: 12px;
  z-index: 160;
  padding: 0 14px;
}

.navbar-shell {
  width: min(1180px, calc(100% - 8px));
  margin: 0 auto;
  border: 1px solid rgba(255,255,255,0.08);
  background:
    linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.025)),
    rgba(10, 14, 24, 0.72);
  backdrop-filter: blur(22px) saturate(180%);
  -webkit-backdrop-filter: blur(22px) saturate(180%);
  border-radius: 24px;
  box-shadow:
    0 16px 50px rgba(0,0,0,0.28),
    inset 0 1px 0 rgba(255,255,255,0.05);
}

.navbar-inner {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 18px;
  padding: 12px 16px;
  min-height: 74px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-width: max-content;
}

.brand img {
  height: 46px;
  width: auto;
  filter: drop-shadow(0 0 18px rgba(122,92,255,0.24));
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.02;
}

.brand-title {
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.brand-sub {
  font-size: 11px;
  color: rgba(255,255,255,0.52);
  margin-top: 4px;
}

.nav-center {
  display: flex;
  justify-content: center;
}

.nav-links {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px;
  border-radius: 999px;
  background: rgba(255,255,255,0.035);
  border: 1px solid rgba(255,255,255,0.05);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.03);
}

.nav-links a {
  position: relative;
  padding: 10px 14px;
  border-radius: 999px;
  color: rgba(255,255,255,0.72);
  font-size: 14px;
  font-weight: 600;
  transition:
    color 0.22s ease,
    background 0.22s ease,
    transform 0.22s ease,
    box-shadow 0.22s ease;
}

.nav-links a:hover {
  background: rgba(255,255,255,0.07);
  color: white;
  transform: translateY(-1px);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
}

.nav-right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
}

.wa-top {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0 18px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.08);
  background:
    linear-gradient(135deg, rgba(255,255,255,0.98), rgba(236,243,255,0.96));
  color: #090b12;
  font-weight: 800;
  font-size: 14px;
  box-shadow:
    0 10px 24px rgba(255,255,255,0.08),
    inset 0 1px 0 rgba(255,255,255,0.8);
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}

.wa-top:hover {
  transform: translateY(-1px);
  box-shadow:
    0 14px 28px rgba(255,255,255,0.12),
    inset 0 1px 0 rgba(255,255,255,0.9);
}

.menu-toggle {
  display: none;
  width: 48px;
  height: 48px;
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.08);
  background:
    linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.025)),
    rgba(255,255,255,0.03);
  color: white;
  cursor: pointer;
  box-shadow:
    0 8px 22px rgba(0,0,0,0.16),
    inset 0 1px 0 rgba(255,255,255,0.05);
}

.menu-lines {
  position: relative;
  width: 18px;
  height: 14px;
  display: inline-block;
}

.menu-lines span {
  position: absolute;
  left: 0;
  width: 18px;
  height: 2px;
  border-radius: 999px;
  background: white;
  transition: transform 0.28s ease, opacity 0.28s ease, top 0.28s ease;
}

.menu-lines span:nth-child(1) { top: 0; }
.menu-lines span:nth-child(2) { top: 6px; }
.menu-lines span:nth-child(3) { top: 12px; }

.menu-lines.open span:nth-child(1) {
  top: 6px;
  transform: rotate(45deg);
}

.menu-lines.open span:nth-child(2) {
  opacity: 0;
}

.menu-lines.open span:nth-child(3) {
  top: 6px;
  transform: rotate(-45deg);
}

.mobile-menu {
  display: none;
  padding: 0 14px 14px;
}

.mobile-menu.show {
  display: block;
}

.mobile-menu-card {
  border-top: 1px solid rgba(255,255,255,0.06);
  padding-top: 14px;
}

.mobile-menu-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.mobile-nav-item {
  min-height: 84px;
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.07);
  background:
    linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02)),
    rgba(255,255,255,0.03);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-align: center;
  padding: 14px 10px;
  color: white;
  backdrop-filter: blur(10px);
}

.mobile-nav-icon {
  font-size: 18px;
}

.mobile-nav-label {
  font-size: 12px;
  font-weight: 700;
}

.mobile-wa {
  margin-top: 12px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 50px;
  padding: 0 16px;
  border-radius: 18px;
  background: linear-gradient(135deg, #58a8ff, #7a5cff);
  color: white;
  font-weight: 800;
  box-shadow: 0 14px 28px rgba(88,168,255,0.18);
}

@media (max-width: 768px) {
  .nav-center,
  .nav-right .wa-top {
    display: none;
  }

  .navbar-wrap {
    top: 10px;
    padding: 0 10px;
  }

  .navbar-shell {
    border-radius: 22px;
  }

  .navbar-inner {
    grid-template-columns: 48px 1fr 48px;
    min-height: 70px;
    padding: 10px 12px;
  }

  .menu-toggle {
    display: inline-flex;
    justify-self: start;
    align-items: center;
    justify-content: center;
  }

  .brand {
    justify-self: center;
    gap: 0;
  }

  .brand img {
    height: 58px;
  }

  .brand-text {
    display: none;
  }

  .mobile-menu-card {
    padding-top: 12px;
  }

  .mobile-menu-grid {
    gap: 10px;
    margin-top: 4px;
  }

  .mobile-nav-item {
    min-height: 80px;
    border-radius: 18px;
    padding: 12px 8px;
  }

  .mobile-nav-label {
    font-size: 12px;
  }
}

        .hero {
  padding: 110px 0 84px;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 56px;
  align-items: center;
}

.hero-copy {
  max-width: 680px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 999px;
  background: rgba(255,255,255,0.045);
  border: 1px solid rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.82);
  font-size: 12px;
  letter-spacing: 0.04em;
  margin-bottom: 22px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
}

.hero h1 {
  margin: 0 0 18px;
  font-size: 78px;
  line-height: 0.9;
  letter-spacing: -0.075em;
  max-width: 760px;
  font-weight: 900;
  background: linear-gradient(180deg, #ffffff 0%, #e7eeff 52%, #bfd0ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-wrap: balance;
}

.hero p {
  margin: 0;
  max-width: 600px;
  font-size: 18px;
  line-height: 1.78;
  color: rgba(255,255,255,0.68);
}

.hero-actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 30px;
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 22px;
}

.hero-tag {
  padding: 9px 13px;
  border-radius: 999px;
  background: rgba(88,168,255,0.08);
  border: 1px solid rgba(88,168,255,0.10);
  color: rgba(255,255,255,0.84);
  font-size: 13px;
}

.hero-tag.promo {
  background: linear-gradient(135deg, #58a8ff, #7a5cff);
  color: white;
  font-weight: 900;
  box-shadow: 0 10px 28px rgba(88,168,255,0.24);
}

.hero-visual {
  position: relative;
}

.hero-stack {
  display: grid;
  gap: 18px;
}

.hero-top-card {
  border-radius: 34px;
  border: 1px solid rgba(255,255,255,0.08);
  background:
    linear-gradient(180deg, rgba(88,168,255,0.10), rgba(122,92,255,0.06)),
    linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
  padding: 14px;
  box-shadow: 0 34px 90px rgba(0,0,0,0.30);
}

.hero-top-image {
  width: 100%;
  height: 330px;
  object-fit: cover;
  object-position: center 18%;
  border-radius: 26px;
  display: block;
}

@media (max-width: 1024px) {
  .hero-grid {
    grid-template-columns: 1fr;
    gap: 34px;
  }

  .hero-top-image {
    height: 280px;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 62px 0 40px;
  }

  .hero-grid {
    gap: 24px;
  }

  .hero-copy {
    max-width: 100%;
    text-align: center;
  }

  .hero h1 {
    font-size: 46px;
    line-height: 0.94;
    max-width: 100%;
    letter-spacing: -0.07em;
  }

  .hero p {
    font-size: 14px;
    line-height: 1.62;
    max-width: 96%;
    margin-left: auto;
    margin-right: auto;
  }

  .hero-actions,
  .hero-tags {
    justify-content: center;
  }

  .hero-actions {
    margin-top: 24px;
    gap: 10px;
  }

  .hero-top-image {
    height: 230px;
    object-position: center 14%;
  }

  .badge {
    font-size: 11px;
    margin-bottom: 18px;
  }

  .hero-tag {
    font-size: 11px;
  }
}

        .metric-main,
        .metric-card,
        .service-card,
        .reason-card,
        .testimonial-card,
        .price-card,
        .faq-item,
        .info-box,
        .contact-box {
          border-radius: 26px;
          border: 1px solid rgba(255,255,255,0.08);
          background:
            linear-gradient(180deg, rgba(88,168,255,0.07), rgba(122,92,255,0.035)),
            linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.018));
          box-shadow: 0 18px 45px rgba(0,0,0,0.18);
        }

        .metric-main,
        .metric-card,
        .service-card,
        .reason-card,
        .testimonial-card,
        .price-card,
        .info-box,
        .contact-box {
          padding: 22px;
        }

        .metric-kicker,
        .section-kicker {
          font-size: 12px;
          color: #9db0ff;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          margin-bottom: 10px;
        }

        .metric-main {
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 100%;
        }

        .metric-title {
          font-size: 26px;
          line-height: 1.08;
          font-weight: 900;
          letter-spacing: -0.045em;
          margin-bottom: 10px;
          color: white;
        }

        .metric-text,
        .service-card p,
        .reason-card p,
        .testimonial-card p {
          font-size: 14px;
          line-height: 1.68;
          color: rgba(255,255,255,0.66);
        }

        .metric-card {
          min-height: 112px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 18px 18px;
        }

        .metric-value {
          font-size: 28px;
          font-weight: 900;
          line-height: 1;
          margin-bottom: 8px;
          letter-spacing: -0.04em;
        }

        .metric-label {
          color: rgba(255,255,255,0.60);
          font-size: 12px;
          line-height: 1.45;
        }

        .section {
          padding: 84px 0;
          position: relative;
        }

        .section.alt {
          background: #0d131e;
          border-top: 1px solid rgba(255,255,255,0.05);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .section-intro {
          max-width: 780px;
          margin-bottom: 34px;
        }

        .section-intro.center {
          max-width: 780px;
          margin: 0 auto 34px;
          text-align: center;
        }

        .section-title {
          margin: 0 0 14px;
          font-size: 50px;
          line-height: 0.96;
          letter-spacing: -0.06em;
          font-weight: 900;
          background: linear-gradient(180deg, #ffffff 0%, #dde7ff 70%, #c8d7ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-wrap: balance;
        }

        .section-text {
          margin: 0;
          color: rgba(255,255,255,0.67);
          font-size: 17px;
          line-height: 1.72;
        }

        .services-grid,
        .reasons-grid,
        .testimonials-grid,
        .pricing-grid {
          display: grid;
          gap: 20px;
        }

        .services-grid,
        .testimonials-grid {
          grid-template-columns: repeat(3, 1fr);
        }

        .reasons-grid {
          grid-template-columns: repeat(3, 1fr);
        }

       .services-grid.four {
  grid-template-columns: repeat(4, 1fr);
  gap: 22px;
}

        .pricing-grid {
  grid-template-columns: repeat(3, 1fr);
  align-items: stretch;
  gap: 24px;
}

        .service-card,
.price-card {
  position: relative;
  padding: 22px;
  border-radius: 30px;
  border: 1px solid rgba(255,255,255,0.08);
  background:
    radial-gradient(circle at top left, rgba(88,168,255,0.10), transparent 34%),
    radial-gradient(circle at bottom right, rgba(122,92,255,0.10), transparent 34%),
    linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
  box-shadow:
    0 24px 60px rgba(0,0,0,0.24),
    inset 0 1px 0 rgba(255,255,255,0.05);
  overflow: hidden;
}

.service-card::after,
.price-card::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background: linear-gradient(
    135deg,
    rgba(255,255,255,0.10),
    rgba(255,255,255,0.00) 28%,
    rgba(255,255,255,0.00) 72%,
    rgba(255,255,255,0.05)
  );
  opacity: 0.75;
}

.service-icon {
  width: 50px;
  height: 50px;
  border-radius: 18px;
  background:
    linear-gradient(135deg, rgba(88,168,255,0.24), rgba(122,92,255,0.22));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  margin-bottom: 18px;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.10),
    0 12px 28px rgba(88,168,255,0.16);
}

.service-card h3,
.price-card h3 {
  margin: 0 0 12px;
  font-size: 25px;
  line-height: 1.08;
  letter-spacing: -0.035em;
  font-weight: 900;
}

.price-highlight {
  margin-top: 18px;
  padding: 15px 15px 13px;
  border-radius: 20px;
  background:
    linear-gradient(135deg, rgba(88,168,255,0.12), rgba(122,92,255,0.10));
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
}

.price-topline {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: #aac1ff;
  margin-bottom: 8px;
}

.price-big {
  font-size: 28px;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.05em;
  color: white;
}

.card-btn {
  width: 100%;
  min-height: 48px;
  padding: 13px 16px;
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.08);
  background:
    linear-gradient(135deg, rgba(88,168,255,0.22), rgba(122,92,255,0.18));
  color: white;
  font-weight: 800;
  cursor: pointer;
  box-shadow:
    0 10px 24px rgba(88,168,255,0.12),
    inset 0 1px 0 rgba(255,255,255,0.06);
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
}

.card-btn:hover {
  transform: translateY(-2px);
  box-shadow:
    0 18px 36px rgba(88,168,255,0.18),
    inset 0 1px 0 rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.14);
}

.price-card.featured {
  position: relative;
  transform: scale(1.03);
  border-color: rgba(88,168,255,0.24);
  box-shadow:
    0 30px 70px rgba(88,168,255,0.14),
    inset 0 1px 0 rgba(255,255,255,0.06);
}

.featured-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 8px 12px;
  border-radius: 999px;
  background: linear-gradient(135deg, #58a8ff, #7a5cff);
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.1em;
  box-shadow: 0 12px 28px rgba(88,168,255,0.18);
}

.price-subtitle {
  color: rgba(255,255,255,0.62);
  margin-bottom: 14px;
  font-size: 14px;
}

.price-value {
  font-size: 42px;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.06em;
  margin-bottom: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #d9e5ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.price-list {
  margin: 0;
  padding-left: 18px;
  color: rgba(255,255,255,0.82);
  line-height: 1.82;
  text-align: left;
  font-size: 14px;
}
        .split-section {
          display: grid;
          grid-template-columns: 0.95fr 1.05fr;
          gap: 28px;
          align-items: center;
        }

        .split-section.reverse {
          grid-template-columns: 1.05fr 0.95fr;
        }

        .visual-wrap {
          overflow: hidden;
          border-radius: 28px;
          border: 1px solid rgba(255,255,255,0.08);
          background:
            linear-gradient(180deg, rgba(88,168,255,0.08), rgba(122,92,255,0.04)),
            rgba(255,255,255,0.03);
          padding: 12px;
          box-shadow: 0 20px 48px rgba(0,0,0,0.18);
        }

        .visual-wrap img {
          width: 100%;
          height: 390px;
          object-fit: cover;
          object-position: center 28%;
          border-radius: 22px;
          display: block;
          transition: transform 0.8s ease;
        }

        #food .visual-wrap img {
          object-position: center 38%;
        }

        #beauty .visual-wrap img {
          object-position: center 24%;
        }

        #web .visual-wrap img {
          object-position: center 18%;
        }

        .visual-wrap:hover img {
          transform: scale(1.03);
        }

        .info-pill {
          display: inline-block;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(88,168,255,0.10);
          color: rgba(255,255,255,0.80);
          font-size: 13px;
          margin-bottom: 16px;
        }

        .info-box p {
          margin: 0 0 18px;
          color: rgba(255,255,255,0.67);
          font-size: 16px;
          line-height: 1.7;
        }

        .faq-wrap {
          display: grid;
          gap: 14px;
        }

        .faq-item {
          overflow: hidden;
          padding: 0;
        }

        .faq-button {
          width: 100%;
          background: transparent;
          color: white;
          border: none;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          font-size: 17px;
          font-weight: 700;
          text-align: left;
          cursor: pointer;
        }

        .faq-icon {
          flex-shrink: 0;
          width: 34px;
          height: 34px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(88,168,255,0.12);
          font-size: 18px;
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.35s ease, opacity 0.35s ease, padding 0.35s ease;
          opacity: 0;
          padding: 0 20px;
          color: rgba(255,255,255,0.7);
          line-height: 1.75;
        }

        .faq-answer.open {
          max-height: 240px;
          opacity: 1;
          padding: 0 20px 20px;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 0.95fr 1.05fr;
          gap: 30px;
          align-items: start;
        }

        .contact-left {
          text-align: left;
        }

        .contact-box input,
        .contact-box textarea {
          width: 100%;
          padding: 15px 16px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.1);
          background: #0d111a;
          color: white;
          font-size: 15px;
          outline: none;
          margin-bottom: 14px;
        }

        .contact-box textarea {
          min-height: 120px;
          resize: vertical;
        }

        .footer {
          padding: 30px 0 42px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .footer-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .footer-brand img {
          height: 42px;
        }

        .footer-links {
          display: flex;
          gap: 18px;
          flex-wrap: wrap;
          color: rgba(255,255,255,0.64);
          font-size: 14px;
        }

        .wa-float {
          position: fixed;
          right: 18px;
          bottom: 18px;
          z-index: 120;
          background: linear-gradient(135deg, #25d366, #1ebe5d);
          color: white;
          padding: 14px 18px;
          border-radius: 999px;
          font-weight: 700;
          box-shadow: 0 14px 30px rgba(0,0,0,0.32);
        }

        .popup-overlay {
          position: fixed;
          inset: 0;
          background: rgba(2, 5, 12, 0.72);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
        }

        .popup-card {
          width: min(460px, 100%);
          border-radius: 26px;
          padding: 28px;
          border: 1px solid rgba(255,255,255,0.10);
          background:
            linear-gradient(180deg, rgba(88,168,255,0.12), rgba(122,92,255,0.08)),
            rgba(10,14,22,0.94);
          box-shadow: 0 30px 80px rgba(0,0,0,0.36);
          text-align: center;
        }

        .popup-kicker {
          display: inline-flex;
          padding: 7px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,0.10);
          font-size: 12px;
          font-weight: 800;
          margin-bottom: 14px;
        }

        .popup-card h2 {
          margin: 0 0 10px;
          font-size: 34px;
          line-height: 1.08;
          letter-spacing: -0.03em;
        }

        .popup-card p {
          margin: 0;
          color: rgba(255,255,255,0.74);
          line-height: 1.7;
        }

        .popup-price {
          margin: 18px 0 14px;
          font-size: 50px;
          font-weight: 900;
          letter-spacing: -0.05em;
          background: linear-gradient(135deg, #58a8ff, #7a5cff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .popup-time {
          margin-bottom: 18px;
          font-size: 15px;
          color: #cbe5ff;
          font-weight: 700;
        }

        .popup-actions {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .popup-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 13px 18px;
          border-radius: 14px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          color: white;
          cursor: pointer;
        }

        @media (max-width: 1024px) {
          .services-grid.four {
            grid-template-columns: repeat(2, 1fr);
          }

          .services-grid,
          .reasons-grid,
          .pricing-grid,
          .testimonials-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .hero-grid,
          .split-section,
          .split-section.reverse,
          .contact-grid {
            grid-template-columns: 1fr;
          }

          .hero-top-image {
            height: 260px;
          }
        }

        @media (max-width: 768px) {
          .tilt {
            transform: none !important;
          }

          .offer-bar {
            padding: 6px 10px 0;
          }

          .btn-primary {
            width: 100%;
            padding: 15px;
            font-size: 14px;
            border-radius: 16px;
          }

          .offer-bar-inner {
            width: min(520px, 100%);
            border-radius: 14px;
            padding: 8px 38px 8px 10px;
            gap: 8px;
            min-height: 46px;
          }

          .offer-pill {
            font-size: 10px;
            padding: 5px 8px;
          }

          .offer-text {
            font-size: 11px;
            line-height: 1.35;
            padding-right: 0;
          }

          .offer-close {
            width: 26px;
            height: 26px;
            right: 8px;
            font-size: 14px;
          }

          .nav-center,
          .nav-right .wa-top {
            display: none;
          }

          .navbar-wrap {
            top: 10px;
            padding: 8px 10px 0;
          }

          .navbar-shell {
            border-radius: 20px;
          }

          .navbar-inner {
            grid-template-columns: 48px 1fr 48px;
            min-height: 68px;
            padding: 10px 12px;
          }

          .menu-toggle {
            display: inline-flex;
            justify-self: start;
            align-items: center;
            justify-content: center;
          }

          .brand {
            justify-self: center;
            gap: 0;
          }

          .brand img {
            height: 58px;
          }

          .brand-text {
            display: none;
          }

          .mobile-menu-card {
            padding-top: 12px;
          }

          .mobile-menu-grid {
            gap: 10px;
            margin-top: 4px;
          }

          .mobile-nav-item {
            min-height: 82px;
            border-radius: 18px;
            padding: 12px 8px;
          }

          .mobile-nav-label {
            font-size: 12px;
          }

          .hero {
            padding: 58px 0 40px;
          }

          .hero-grid,
          .section-intro,
          .section-intro.center,
          .contact-left,
          .info-box,
          .service-card,
          .reason-card,
          .price-card,
          .testimonial-card {
            text-align: center;
          }

          .hero-copy {
            max-width: 100%;
          }

          .hero h1 {
            font-size: 44px;
            line-height: 0.94;
            max-width: 100%;
            letter-spacing: -0.065em;
          }

          .hero p {
            font-size: 14px;
            line-height: 1.62;
            margin-left: auto;
            margin-right: auto;
            max-width: 96%;
          }

          .hero-actions,
          .hero-tags {
            justify-content: center;
          }

          .hero-actions {
            gap: 10px;
            margin-top: 24px;
          }

          .hero-top-image {
            height: 220px;
            object-position: center 18%;
          }

          .hero-metrics {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .metric-main,
          .metric-card {
            text-align: center;
            padding: 16px;
          }

          .metric-card {
            min-height: auto;
          }

          .metric-title {
            font-size: 20px;
            line-height: 1.1;
          }

          .metric-value {
            font-size: 23px;
          }

          .metric-text,
          .metric-label {
            font-size: 13px;
            line-height: 1.5;
          }

          .section {
            padding: 58px 0;
            position: relative;
          }

          .section:not(:first-of-type)::before {
            content: "";
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 74px;
            height: 1px;
            background: linear-gradient(
              90deg,
              rgba(255,255,255,0),
              rgba(88,168,255,0.45),
              rgba(255,255,255,0)
            );
          }

          .section-intro {
            margin-bottom: 24px;
          }

          .section-title {
            font-size: 36px;
            line-height: 0.96;
            max-width: 94%;
            margin-left: auto;
            margin-right: auto;
            letter-spacing: -0.06em;
          }

          .section-text {
            font-size: 14px;
            line-height: 1.62;
            max-width: 94%;
            margin-left: auto;
            margin-right: auto;
          }

          .services-grid,
          .services-grid.four,
          .reasons-grid,
          .pricing-grid,
          .testimonials-grid {
            grid-template-columns: 1fr;
          }

          .service-card,
          .reason-card,
          .testimonial-card,
          .price-card,
          .faq-item,
          .info-box,
          .contact-box {
            border-radius: 22px;
            margin-bottom: 4px;
          }

          .service-card,
.reason-card,
.testimonial-card,
.price-card {
  padding: 18px;
}

.service-card,
.price-card {
  border-radius: 24px;
}

.service-card h3,
.reason-card h3,
.price-card h3,
.info-box h3 {
  font-size: 22px;
}

.price-big {
  font-size: 24px;
}

.price-value {
  font-size: 32px;
}

.price-highlight {
  border-radius: 18px;
}

.featured-badge {
  top: 14px;
  right: 14px;
  font-size: 9px;
  padding: 7px 10px;
}

          .price-card.featured {
            transform: none;
          }

          .visual-wrap {
            border-radius: 24px;
            margin-bottom: 8px;
          }

          .visual-wrap img {
            height: 220px;
          }

          #food .visual-wrap img {
            object-position: center 34%;
          }

          #beauty .visual-wrap img {
            object-position: center 22%;
          }

          #web .visual-wrap img {
            object-position: center 18%;
          }

          .contact-left {
            max-width: 100%;
            margin: 0 auto;
          }

          .contact-box {
            padding: 18px;
          }

          .contact-box input,
          .contact-box textarea {
            font-size: 14px;
            padding: 14px 15px;
          }

          .footer-inner,
          .footer-brand,
          .footer-links {
            justify-content: center;
            text-align: center;
          }

          .info-list,
          .price-list {
            display: inline-block;
            text-align: left;
            font-size: 14px;
            line-height: 1.7;
          }

          .hero-tags {
            margin-top: 18px;
          }

          .hero-tag,
          .badge {
            font-size: 11px;
          }

          .faq-wrap {
            gap: 16px;
          }

          .faq-button {
            padding: 18px;
            font-size: 15px;
          }

          .faq-answer.open {
            padding: 0 18px 18px;
          }

          .popup-card {
            padding: 22px;
          }

          .popup-card h2 {
            font-size: 28px;
          }

          .popup-price {
            font-size: 42px;
          }

          .btn-primary,
          .btn-secondary,
          .card-btn {
            min-height: 50px;
          }

          .wa-float {
            display: none;
          }
        }
      `}</style>

      <div className="bg-glow" />

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-card fade-scale shine">
            <div className="popup-kicker">OFFERTA LIMITATA</div>
            <h2>Solo per altre 48 ore</h2>
            <p>
              Attiva uno dei nostri software premium a un prezzo speciale e fai
              percepire subito più ordine, più semplicità e più valore alla tua attività.
            </p>
            <div className="popup-price">39€/mese</div>
            <div className="popup-time">Tempo rimasto: {formatTime(timeLeft)}</div>
            <div className="popup-actions">
              <button
                className="btn-primary"
                onClick={() => {
                  setShowPopup(false);
                  goToContacts("Software promo 39€/mese");
                }}
              >
                Richiedi ora
              </button>
              <button className="popup-secondary" onClick={() => setShowPopup(false)}>
                Continua
              </button>
            </div>
          </div>
        </div>
      )}

      {offerBarVisible && (
        <div className="offer-bar">
          <div className="offer-bar-inner shine">
            <span className="offer-pill">OFFERTA ATTIVA</span>
            <span className="offer-text">
              Solo per un tempo limitato i software sono disponibili a <span className="offer-strong">39€/mese</span>.
              Tempo rimasto: <span className="offer-time">{formatTime(timeLeft)}</span>
            </span>
            <button className="offer-close" onClick={() => setOfferBarVisible(false)}>
              ×
            </button>
          </div>
        </div>
      )}

      <div className="navbar-wrap">
  <header className="navbar-shell">
    <div className="container navbar-inner">
      <button className="menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        <span className={`menu-lines ${mobileMenuOpen ? "open" : ""}`}>
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>

      <a href="#top" className="brand">
        <img src="/logo.png" alt="ClientFlow" />
        <div className="brand-text">
          <div className="brand-title">ClientFlow</div>
          <div className="brand-sub">Più clienti. Meno stress.</div>
        </div>
      </a>

      <div className="nav-center">
        <nav className="nav-links">
          <a href="#servizi">Servizi</a>
          <a href="#food">Food</a>
          <a href="#beauty">Beauty</a>
          <a href="#pricing">Prezzi</a>
          <a href="#faq">FAQ</a>
          <a href="#contatti">Contatti</a>
        </nav>
      </div>

      <div className="nav-right">
        <a href={whatsappLink} target="_blank" rel="noreferrer" className="wa-top">
          WhatsApp
        </a>
      </div>
    </div>

    <div className={`mobile-menu ${mobileMenuOpen ? "show" : ""}`}>
      <div className="container mobile-menu-card">
        <div className="mobile-menu-grid">
          <a className="mobile-nav-item" href="#servizi" onClick={() => setMobileMenuOpen(false)}>
            <span className="mobile-nav-icon">⚡</span>
            <span className="mobile-nav-label">Servizi</span>
          </a>
          <a className="mobile-nav-item" href="#food" onClick={() => setMobileMenuOpen(false)}>
            <span className="mobile-nav-icon">🍽️</span>
            <span className="mobile-nav-label">Food</span>
          </a>
          <a className="mobile-nav-item" href="#beauty" onClick={() => setMobileMenuOpen(false)}>
            <span className="mobile-nav-icon">✂️</span>
            <span className="mobile-nav-label">Beauty</span>
          </a>
          <a className="mobile-nav-item" href="#pricing" onClick={() => setMobileMenuOpen(false)}>
            <span className="mobile-nav-icon">💎</span>
            <span className="mobile-nav-label">Prezzi</span>
          </a>
          <a className="mobile-nav-item" href="#faq" onClick={() => setMobileMenuOpen(false)}>
            <span className="mobile-nav-icon">❔</span>
            <span className="mobile-nav-label">FAQ</span>
          </a>
          <a className="mobile-nav-item" href="#contatti" onClick={() => setMobileMenuOpen(false)}>
            <span className="mobile-nav-icon">📩</span>
            <span className="mobile-nav-label">Contatti</span>
          </a>
        </div>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noreferrer"
          className="mobile-wa"
          onClick={() => setMobileMenuOpen(false)}
        >
          Scrivici
        </a>
      </div>
    </div>
  </header>
</div>
      <main id="top">
       <section className="hero">
  <div className="container hero-grid">
    <div className="hero-copy fade-up">
      <div className="badge">SOFTWARE PREMIUM · SITI WEB · PIÙ CLIENTI CHE RITORNANO</div>

      <h1>
        Fai crescere la tua attività con un’immagine più forte e un sistema più semplice.
      </h1>

      <p>
        Creiamo software Beauty e Food, siti web ed e-commerce pensati per aumentare
        il valore percepito della tua attività, semplificare le richieste e aiutare
        i clienti a tornare più facilmente.
      </p>

      <div className="hero-actions">
        <button
          className="btn-primary"
          onClick={() => goToContacts("Software promo 39€/mese")}
        >
          Scopri come funziona
        </button>

        <a href="#pricing" className="btn-secondary">
          Vedi prezzi e soluzioni
        </a>
      </div>

      <div className="hero-tags">
        <span className="hero-tag promo">🔥 Promo da 39€/mese</span>
        <span className="hero-tag">Esperienza anche come app</span>
        <span className="hero-tag">Design premium</span>
      </div>
    </div>

    <div className="hero-visual fade-scale fade-scale-delay-1">
      <div className="hero-stack">
        <div className="hero-top-card hover-lift shine reveal">
          <img src="/hero-business.jpg" alt="ClientFlow preview" className="hero-top-image" />
        </div>

        <div className="hero-metrics">
          <div className="metric-main hover-lift reveal">
            <div className="metric-kicker">Perché funziona</div>
            <div className="metric-title">
              Più ordine per te, più semplicità per il cliente.
            </div>
            <div className="metric-text">
              Un’esperienza chiara, moderna e veloce rende la tua attività più forte,
              più credibile e più facile da scegliere di nuovo.
            </div>
          </div>

          <div style={{ display: "grid", gap: "16px" }}>
            <div className="metric-card hover-lift reveal">
              <div className="metric-value">39€</div>
              <div className="metric-label">Promo software al mese</div>
            </div>

            <div className="metric-card hover-lift reveal">
              <div className="metric-value">App</div>
              <div className="metric-label">Uso semplice e immediato</div>
            </div>

            <div className="metric-card hover-lift reveal">
              <div className="metric-value">+ valore</div>
              <div className="metric-label">Immagine più premium e professionale</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="servizi" className="section">
          <div className="container">
            <div className="section-intro center reveal">
              <div className="section-kicker">Cosa offriamo</div>
              <h2 className="section-title">
                Soluzioni pensate per farti lavorare meglio e farti scegliere di nuovo.
              </h2>
              <p className="section-text">
                Non realizziamo solo un bel design: costruiamo strumenti utili per aumentare fiducia,
                richieste e ritorno clienti.
              </p>
            </div>

            <div className="services-grid four">
              {services.map((service, index) => (
                <div
                  className={`service-card tilt reveal hover-lift shine fade-up fade-up-delay-${Math.min(index + 1, 4)}`}
                  key={service.title}
                >
                  <div>
                    <div className="service-icon">{service.emoji}</div>
                    <h3>{service.title}</h3>
                    <p>{service.text}</p>

                    <div className="price-highlight">
                      <div className="price-topline">Offerta / Prezzo</div>
                      <div className="price-big">{service.promo}</div>
                    </div>
                  </div>

                  <div className="service-actions">
                    <button className="card-btn" onClick={() => goToContacts(service.title)}>
                      Richiedi informazioni
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section alt">
          <div className="container">
            <div className="section-intro center reveal">
              <div className="section-kicker">Perché funziona</div>
              <h2 className="section-title">
                Ogni dettaglio è pensato per aiutarti a ricevere più richieste e far tornare più clienti.
              </h2>
            </div>

            <div className="reasons-grid">
              {reasons.map((reason, index) => (
                <div
                  className={`reason-card tilt reveal hover-lift shine fade-up fade-up-delay-${Math.min(index + 1, 3)}`}
                  key={reason.title}
                >
                  <h3>{reason.title}</h3>
                  <p>{reason.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="section">
          <div className="container">
            <div className="section-intro center reveal">
              <div className="section-kicker">Prezzi premium</div>
              <h2 className="section-title">Scegli la soluzione più adatta alla tua crescita.</h2>
              <p className="section-text">
                Parti con la promo software oppure investi in una presenza online più forte con sito o e-commerce.
              </p>
            </div>

            <div className="pricing-grid">
              {pricing.map((plan) => (
                <div
                  key={plan.name}
                  className={`price-card tilt reveal hover-lift shine fade-up ${plan.highlight ? "featured" : ""}`}
                >
                  {plan.highlight && <div className="featured-badge">PIÙ RICHIESTA</div>}
                  <h3>{plan.name}</h3>
                  <div className="price-subtitle">{plan.subtitle}</div>
                  <div className="price-value">{plan.price}</div>
                  <ul className="price-list">
                    {plan.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                  <div className="price-action">
                    <button className="card-btn" onClick={() => goToContacts(plan.cta)}>
                      {plan.ctaLabel}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="food" className="section">
          <div className="container split-section">
            <div className="visual-wrap hover-lift shine reveal">
              <img src="/food-visual.jpg" alt="ClientFlow Food" />
            </div>
            <div className="info-box hover-lift reveal">
              <div className="info-pill">ClientFlow Food</div>
              <h3>Più ordine nelle richieste e un’esperienza più semplice per chi ti sceglie.</h3>
              <p>
                La soluzione Food è pensata per locali che vogliono essere percepiti meglio, lavorare con più ordine
                e far diventare più naturale il ritorno del cliente.
              </p>
              <ul className="info-list">
                <li>Richieste e prenotazioni più semplici</li>
                <li>Esperienza comoda anche come app</li>
                <li>Flusso più ordinato per il locale</li>
                <li>Promo 39€/mese</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="beauty" className="section alt">
          <div className="container split-section reverse">
            <div className="info-box hover-lift reveal">
              <div className="info-pill">ClientFlow Beauty</div>
              <h3>Più appuntamenti, meno confusione, più valore per il tuo salone.</h3>
              <p>
                La soluzione Beauty rende la prenotazione più semplice, migliora la percezione del brand
                e aiuta il cliente a tornare con più facilità.
              </p>
              <ul className="info-list">
                <li>Prenotazioni intuitive</li>
                <li>Esperienza moderna anche come app</li>
                <li>Gestione più ordinata</li>
                <li>Promo 39€/mese</li>
              </ul>
            </div>
            <div className="visual-wrap hover-lift shine reveal">
              <img src="/beauty-visual.jpg" alt="ClientFlow Beauty" />
            </div>
          </div>
        </section>

        <section id="web" className="section">
          <div className="container split-section">
            <div className="visual-wrap hover-lift shine reveal">
              <img src="/web-visual.jpg" alt="ClientFlow Web" />
            </div>
            <div className="info-box hover-lift reveal">
              <div className="info-pill">ClientFlow Web</div>
              <h3>Siti ed e-commerce professionali che aumentano fiducia, immagine e contatti.</h3>
              <p>
                Un sito fatto bene alza il valore percepito della tua attività. Un e-commerce fatto bene ti aiuta
                anche a vendere in modo più credibile e più ordinato.
              </p>
              <ul className="info-list">
                <li>Sito web da 499€</li>
                <li>E-commerce da 1500€</li>
                <li>Design curato e moderno</li>
                <li>Struttura pensata per convertire</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="testimonials" className="section alt">
          <div className="container">
            <div className="section-intro center reveal">
              <div className="section-kicker">Testimonial</div>
              <h2 className="section-title">Attività reali, risultati più chiari.</h2>
              <p className="section-text">
                Quando la struttura è più semplice e professionale, il cliente lo percepisce subito.
              </p>
            </div>

            <div className="testimonials-grid">
              {testimonials.map((item, index) => (
                <div
                  className={`testimonial-card tilt reveal hover-lift shine fade-up fade-up-delay-${Math.min(index + 1, 3)}`}
                  key={item.name}
                >
                  <div className="testimonial-top">★★★★★</div>
                  <p>{item.text}</p>
                  <div className="testimonial-name">{item.name}</div>
                  <div className="testimonial-role">{item.role}</div>
                  <div className="testimonial-result">{item.result}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="section alt">
          <div className="container">
            <div className="section-intro center reveal">
              <div className="section-kicker">FAQ</div>
              <h2 className="section-title">Domande frequenti</h2>
              <p className="section-text">
                Tutto quello che serve per capire se questa è la soluzione giusta per la tua attività.
              </p>
            </div>

            <div className="faq-wrap">
              {faqs.map((item, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={item.q} className="faq-item hover-lift shine reveal">
                    <button className="faq-button" onClick={() => setOpenFaq(isOpen ? -1 : index)}>
                      <span>{item.q}</span>
                      <span className="faq-icon">{isOpen ? "−" : "+"}</span>
                    </button>
                    <div className={`faq-answer ${isOpen ? "open" : ""}`}>
                      {item.a}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="contatti" className="section">
          <div className="container contact-grid">
            <div className="contact-left reveal">
              <div className="section-kicker">Contatti</div>
              <h2 className="section-title">Richiedi una consulenza e scopri la soluzione giusta per la tua attività.</h2>
              <p className="section-text">
                Lascia i tuoi dati e ti ricontattiamo su WhatsApp. In pochi minuti capiamo insieme se per te è più adatto
                un software, un sito web o un e-commerce.
              </p>
            </div>

            <div className="contact-box shine reveal">
              <input
                value={form.name}
                onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                placeholder="Nome e cognome"
              />
              <input
                value={form.business}
                onChange={(e) => setForm((s) => ({ ...s, business: e.target.value }))}
                placeholder="Nome attività"
              />
              <input
                value={form.phone}
                onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                placeholder="Telefono"
              />
              <input
                value={form.service}
                onChange={(e) => setForm((s) => ({ ...s, service: e.target.value }))}
                placeholder="Pacchetto di interesse"
              />
              <textarea
                value={form.message}
                onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
                placeholder="Scrivi cosa ti serve"
              />
              <button className="btn-primary" onClick={saveLeadAndOpenWhatsApp} disabled={sending}>
                {sending ? "Invio..." : "Scrivici su WhatsApp"}
              </button>
            </div>
          </div>
        </section>

        <footer className="footer">
          <div className="container footer-inner">
            <div className="footer-brand">
              <img src="/logo.png" alt="ClientFlow" />
              <div>
                <div style={{ fontWeight: 700 }}>ClientFlow</div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>
                  Più clienti. Meno stress.
                </div>
              </div>
            </div>

            <div className="footer-links">
              <a href="#servizi">Servizi</a>
              <a href="#pricing">Prezzi</a>
              <a href="#faq">FAQ</a>
              <a href="#contatti">Contatti</a>
            </div>
          </div>
        </footer>
      </main>

      <a href={whatsappLink} target="_blank" rel="noreferrer" className="wa-float">
        WhatsApp
      </a>
    </div>
  );
}