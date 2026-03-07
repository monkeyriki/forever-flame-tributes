import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = `${firstName} ${lastName}`.trim();
    if (query) {
      navigate(`/directory/human?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      <img
        src={heroBg}
        alt="A peaceful memorial landscape"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="hero-overlay absolute inset-0" />

      <div className="relative z-10 container text-center px-4">
        <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4 animate-fade-up">
          Crea un Memoriale Online
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.1s" }}>
          Preserva e condividi i ricordi delle persone care
        </p>

        <form onSubmit={handleSearch} className="max-w-xl mx-auto animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <p className="text-sm text-muted-foreground mb-3">
            Voglio condividere i ricordi di
          </p>

          <div className="flex items-center gap-2 bg-card rounded-xl p-2 shadow-card">
            <Input
              type="text"
              placeholder="Nome e cognome..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button type="submit" className="rounded-lg px-6 whitespace-nowrap">
              Inizia <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </form>

        <a
          href="#memorials"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors mt-8 animate-fade-up"
          style={{ animationDelay: "0.3s" }}
        >
          Scopri i memoriali online <ChevronRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
