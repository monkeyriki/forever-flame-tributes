import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-10 md:py-14">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" className="mb-3 flex items-center gap-2">
              <span className="text-2xl">🕊️</span>
              <span className="font-serif text-xl font-semibold text-foreground">
                Memoria Eterna
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Uno spazio rispettoso per onorare e ricordare chi ci ha lasciato.
              Crea tributi duraturi, condividi ricordi e mantieni viva la memoria.
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-serif text-sm font-semibold text-foreground">
              Esplora
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/directory/human" className="transition-colors hover:text-primary">Memoriali Umani</Link></li>
              <li><Link to="/directory/pet" className="transition-colors hover:text-primary">Memoriali Animali</Link></li>
              <li><Link to="/create" className="transition-colors hover:text-primary">Crea un Memoriale</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-serif text-sm font-semibold text-foreground">
              Informazioni
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/privacy" className="transition-colors hover:text-primary">Privacy Policy</Link></li>
              <li><Link to="/terms" className="transition-colors hover:text-primary">Termini di Servizio</Link></li>
              <li><Link to="/contact" className="transition-colors hover:text-primary">Contatti</Link></li>
            </ul>
          </div>
        </div>

        <div className="golden-divider my-8" />

        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Memoria Eterna. Tutti i diritti riservati.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
