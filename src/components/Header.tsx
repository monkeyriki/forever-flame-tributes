import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Search, LogOut, LayoutDashboard, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isAdmin, isB2B } = useUserRole();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/directory/human", label: "Memoriali Umani" },
    { to: "/directory/pet", label: "Memoriali Animali" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleCreateClick = () => {
    if (user) {
      navigate("/create");
    } else {
      navigate("/auth");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3 md:py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🕊️</span>
          <span className="font-serif text-xl font-semibold tracking-wide text-foreground md:text-2xl">
            Memoria Eterna
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-sans text-sm tracking-wide transition-colors hover:text-primary ${
                isActive(link.to) ? "text-primary font-medium" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/directory/human"
            className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Search className="h-4 w-4" />
            Cerca
          </Link>

          {user ? (
            <>
              {(isB2B || isAdmin) && (
                <Link
                  to="/dashboard/b2b"
                  className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <Shield className="h-4 w-4" />
                  Admin
                </Link>
              )}
              <button
                onClick={handleCreateClick}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Crea Memoriale
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                title="Esci"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Accedi
              </Link>
              <button
                onClick={handleCreateClick}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Crea Memoriale
              </button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-foreground md:hidden"
          aria-label="Menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border bg-background md:hidden"
          >
            <nav className="container mx-auto flex flex-col gap-1 px-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`rounded-md px-3 py-2.5 text-sm transition-colors ${
                    isActive(link.to)
                      ? "bg-secondary text-primary font-medium"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="golden-divider my-2" />
              {user ? (
                <>
                  {(isB2B || isAdmin) && (
                    <Link
                      to="/dashboard/b2b"
                      onClick={() => setIsMenuOpen(false)}
                      className="rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary"
                    >
                      📊 Dashboard
                    </Link>
                  )}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary"
                    >
                      🛡️ Admin
                    </Link>
                  )}
                  <button
                    onClick={() => { setIsMenuOpen(false); handleCreateClick(); }}
                    className="rounded-md bg-primary px-3 py-2.5 text-center text-sm font-medium text-primary-foreground"
                  >
                    Crea Memoriale
                  </button>
                  <button
                    onClick={() => { setIsMenuOpen(false); handleSignOut(); }}
                    className="mt-1 rounded-md px-3 py-2.5 text-center text-sm text-muted-foreground hover:bg-secondary"
                  >
                    Esci
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-md px-3 py-2.5 text-center text-sm text-muted-foreground hover:bg-secondary"
                  >
                    Accedi / Registrati
                  </Link>
                  <button
                    onClick={() => { setIsMenuOpen(false); handleCreateClick(); }}
                    className="rounded-md bg-primary px-3 py-2.5 text-center text-sm font-medium text-primary-foreground"
                  >
                    Crea Memoriale
                  </button>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
