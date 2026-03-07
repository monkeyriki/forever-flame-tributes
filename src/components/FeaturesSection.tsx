import { Heart, Image, MessageSquare, Shield, Share2, Clock } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Tributi e Messaggi",
    desc: "Amici e familiari possono lasciare messaggi, condoglianze e ricordi condivisi.",
  },
  {
    icon: Image,
    title: "Galleria Fotografica",
    desc: "Carica e organizza foto e video per preservare i momenti più preziosi.",
  },
  {
    icon: MessageSquare,
    title: "Biografia Completa",
    desc: "Racconta la storia della vita con una timeline interattiva e dettagliata.",
  },
  {
    icon: Share2,
    title: "Condivisione Facile",
    desc: "Condividi il memoriale con familiari e amici attraverso qualsiasi canale.",
  },
  {
    icon: Shield,
    title: "Privacy e Sicurezza",
    desc: "Controlla chi può vedere e contribuire al memoriale con impostazioni di privacy.",
  },
  {
    icon: Clock,
    title: "Online Per Sempre",
    desc: "Il memoriale rimarrà online per sempre, preservando i ricordi nel tempo.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-secondary">
      <div className="container">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-4 uppercase tracking-wide">
          Funzionalità
        </h2>
        <p className="text-center text-muted-foreground mb-14 max-w-xl mx-auto">
          Tutto ciò di cui hai bisogno per creare un memoriale significativo e duraturo.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-card rounded-xl p-6 shadow-soft hover:shadow-card transition-shadow group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
