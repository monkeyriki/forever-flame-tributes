import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-10 md:py-14">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="sm:col-span-2 md:col-span-2">
            <Link to="/" className="mb-3 flex items-center gap-2">
              <span className="text-2xl">🕊️</span>
              <span className="font-serif text-xl font-semibold text-foreground">
                Eternal Memory
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              A respectful space to honor and remember those who have left us.
              Create lasting tributes, share memories, and keep their legacy alive.
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-serif text-sm font-semibold text-foreground">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/directory/human" className="transition-colors hover:text-primary">Human Memorials</Link></li>
              <li><Link to="/directory/pet" className="transition-colors hover:text-primary">Pet Memorials</Link></li>
              <li><Link to="/create" className="transition-colors hover:text-primary">Create a Memorial</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-serif text-sm font-semibold text-foreground">
              Legal
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/privacy" className="transition-colors hover:text-primary">Privacy Policy</Link></li>
              <li><Link to="/cookie-policy" className="transition-colors hover:text-primary">Cookie Policy</Link></li>
              <li><Link to="/settings" className="transition-colors hover:text-primary">Account Settings</Link></li>
            </ul>
          </div>
        </div>

        <div className="golden-divider my-8" />

        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Eternal Memory. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            GDPR & CCPA Compliant
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
