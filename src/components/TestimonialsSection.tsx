import { Quote } from "lucide-react";

const testimonials = [
  {
    text: "Questo memoriale ci ha permesso di riunire i ricordi di tutta la famiglia in un unico posto. È diventato il nostro luogo speciale per ricordare.",
    author: "Lucia M.",
    relation: "Figlia",
  },
  {
    text: "Anche amici lontani hanno potuto lasciare un tributo. È stato commovente vedere quante persone lo ricordavano con affetto.",
    author: "Roberto C.",
    relation: "Marito",
  },
  {
    text: "La facilità di utilizzo è incredibile. In pochi minuti avevo già creato un memoriale bellissimo per mia nonna.",
    author: "Sara T.",
    relation: "Nipote",
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-20 bg-background">
      <div className="container max-w-5xl">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-14 uppercase tracking-wide">
          Testimonianze
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.author}
              className="bg-card rounded-xl p-6 shadow-soft relative"
            >
              <Quote className="h-8 w-8 text-primary/20 absolute top-4 right-4" />
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 italic">
                "{t.text}"
              </p>
              <div>
                <p className="font-display font-semibold text-foreground text-sm">
                  {t.author}
                </p>
                <p className="text-xs text-muted-foreground">{t.relation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
