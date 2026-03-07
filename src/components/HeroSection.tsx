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
    <section className="relative min-h-[520px] flex items-center justify-center overflow-hidden">
      <img
        src={heroBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="hero-overlay absolute inset-0" />

      <div className="relative z-10 container max-w-3xl text-center py-20 animate-fade-up">
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
          Crea un Memoriale Online
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-10 tracking-wide uppercase font-light">
          Preserva e condividi i ricordi delle persone care
        </p>

        <form onSubmit={handleSearch} className="bg-card/80 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-lg max-w-2xl mx-auto">
          <p className="text-sm text-muted-foreground mb-4 text-left">
            Voglio condividere i ricordi di
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="text"
              placeholder="Nome"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="bg-background border-border"
            />
            <Input
              type="text"
              placeholder="Cognome"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="bg-background border-border"
            />
            <Button
              type="submit"
              className="shrink-0 gap-1 uppercase tracking-wider text-sm font-semibold px-8"
            >
              Inizia <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </form>

        <a
          href="#memorials"
          className="inline-flex items-center gap-1 mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Scopri i memoriali online <ChevronRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
