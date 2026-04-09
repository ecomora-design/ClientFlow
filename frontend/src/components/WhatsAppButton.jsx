export default function WhatsAppButton() {
  const phone = "393884027650";
  const text = encodeURIComponent("Ciao, vorrei informazioni su ClientFlow");

  return (
    <a
      href={`https://wa.me/${phone}?text=${text}`}
      target="_blank"
      rel="noreferrer"
      className="whatsapp-button"
    >
      WhatsApp
    </a>
  );
}