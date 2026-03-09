import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, User, Menu, X, LogOut, LayoutDashboard, Shield, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import flameIcon from "@/assets/flame-icon.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isAdmin, isB2B } = useUserRole();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/#about", label: "About Us", isAnchor: true },
    { to: "/directory/human", label: "Memorials" },
    { to: "/directory/pet", label: "Pet Memorials" },
    { to: "/pricing", label: "Pricing" },
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/directory/human?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <header role="banner" className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center gap-8 px-4">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="Eternal Memory - Home">
          <img src={flameIcon} alt="Flame" className="h-7 w-7 animate-flame-flicker" />
          <span
            className="font-display text-xl font-bold tracking-wide text-foreground"
            style={{ lineHeight: 1, transform: "translateY(-6px)" }}
          >
            Eternal <span className="text-primary">Memory</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`whitespace-nowrap font-body text-sm tracking-wide transition-colors hover:text-primary ${
                isActive(link.to) ? "text-primary font-medium" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-3 ml-auto">
          <form
            onSubmit={handleSearch}
            role="search"
            aria-label="Search memorials"
            className="flex items-center rounded-lg border border-border bg-card px-3"
          >
            <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input
              type="text"
              placeholder="Search a memorial..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-40 border-0 bg-transparent text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </form>

          {user ? (
            <>
              {(isB2B || isAdmin) && (
                <Link
                  to="/dashboard/b2b"
                  className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Partner Dashboard"
                >
                  <LayoutDashboard className="h-4 w-4" />
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Admin Panel"
                >
                  <Shield className="h-4 w-4" />
                </Link>
              )}
              <Link
                to="/settings"
                className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Account Settings"
              >
                <Settings className="h-4 w-4" />
              </Link>
              <Button onClick={handleCreateClick} size="sm">
                Create Memorial
              </Button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link to="/auth">
                <User className="h-4 w-4 mr-1" /> Sign In
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="ml-auto text-foreground md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
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
            <nav aria-label="Mobile navigation" className="container mx-auto flex flex-col gap-1 px-4 py-4">
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
                  <Button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleCreateClick();
                    }}
                    className="mt-1"
                  >
                    Create Memorial
                  </Button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleSignOut();
                    }}
                    className="mt-1 rounded-md px-3 py-2.5 text-center text-sm text-muted-foreground hover:bg-secondary"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Button variant="outline" asChild className="mt-1">
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <User className="h-4 w-4 mr-1" /> Sign In
                  </Link>
                </Button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
