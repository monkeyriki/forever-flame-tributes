import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, User, Menu, X, LogOut, LayoutDashboard, Shield, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import flameIcon from "@/assets/flame-icon.png";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/#about", label: "About Us", isAnchor: true },
  { to: "/directory/human", label: "Memorials" },
  { to: "/directory/pet", label: "Pet Memorials" },
  { to: "/pricing", label: "Pricing" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isAdmin, isB2B } = useUserRole();

  const isActive = (path: string) => location.pathname === path;

  const handleCreateClick = () => navigate(user ? "/create" : "/auth");

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
      {/* ── Main bar ── */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* LEFT – Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="Eternal Memory - Home">
          <img src={flameIcon} alt="" className="h-6 w-6 animate-flame-flicker" />
          <span className="font-display text-xl font-bold tracking-wide text-foreground leading-none">
            Eternal <span className="text-primary">Memory</span>
          </span>
        </Link>

        {/* CENTER – Desktop nav */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium tracking-wide transition-colors hover:text-primary whitespace-nowrap ${
                isActive(link.to) ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* RIGHT – Search + actions (desktop) */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <form
            onSubmit={handleSearch}
            role="search"
            aria-label="Search memorials"
            className="flex items-center rounded-lg border border-border bg-card px-3"
          >
            <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input
              type="text"
              placeholder="Search…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-36 border-0 bg-transparent text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </form>

          {user ? (
            <>
              {(isB2B || isAdmin) && (
                <Link to="/dashboard/b2b" className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground" aria-label="Partner Dashboard">
                  <LayoutDashboard className="h-4 w-4" />
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin" className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground" aria-label="Admin Panel">
                  <Shield className="h-4 w-4" />
                </Link>
              )}
              <Link to="/settings" className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground" aria-label="Account Settings">
                <Settings className="h-4 w-4" />
              </Link>
              <Button onClick={handleCreateClick} size="sm">Create Memorial</Button>
              <button onClick={handleSignOut} className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground" title="Sign Out">
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link to="/auth"><User className="h-4 w-4 mr-1" /> Sign In</Link>
            </Button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="ml-auto md:hidden rounded-md p-2 text-foreground"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border bg-background md:hidden overflow-hidden"
          >
            <nav aria-label="Mobile navigation" className="flex flex-col gap-1 px-6 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`rounded-md px-3 py-2.5 text-sm transition-colors ${
                    isActive(link.to) ? "bg-secondary text-primary font-medium" : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="golden-divider my-2" />

              {user ? (
                <>
                  {(isB2B || isAdmin) && (
                    <Link to="/dashboard/b2b" onClick={() => setIsMenuOpen(false)} className="rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary">
                      📊 Dashboard
                    </Link>
                  )}
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary">
                      🛡️ Admin
                    </Link>
                  )}
                  <Button onClick={() => { setIsMenuOpen(false); handleCreateClick(); }} className="mt-1">
                    Create Memorial
                  </Button>
                  <button onClick={() => { setIsMenuOpen(false); handleSignOut(); }} className="mt-1 rounded-md px-3 py-2.5 text-center text-sm text-muted-foreground hover:bg-secondary">
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
