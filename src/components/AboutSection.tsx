import { Heart, Users, Globe } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-card">
      <div className="container max-w-5xl">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-4 uppercase tracking-wide">
          Chi Siamo
        </h2>
        <p className="text-center text-muted-foreground mb-14 max-w-2xl mx-auto">
          Crediamo che ogni vita meriti di essere ricordata. La nostra missione è offrire uno spazio digitale
          rispettoso e duraturo dove famiglie e amici possano preservare e condividere i ricordi delle persone care.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Heart className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">
              Con Amore
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ogni memoriale è creato con cura e rispetto, perché ogni storia merita di essere raccontata.
            </p>
          </div>

          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Users className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">
              Per la Comunità
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Un luogo dove familiari e amici possono riunirsi per condividere ricordi e tributi.
            </p>
          </div>

          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Globe className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">
              Per Sempre Online
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              I memoriali restano accessibili per sempre, da qualsiasi parte del mondo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
