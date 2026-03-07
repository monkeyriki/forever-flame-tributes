import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { mockMemorials } from "@/data/mockData";

const stats = [
  { value: "125.000+", label: "Famiglie" },
  { value: "45.000.000+", label: "Visitatori" },
  { value: "2.500.000+", label: "Tributi" },
];

const RecentMemorials = () => {
  const recentMemorials = mockMemorials.slice(0, 4);

  return (
    <section id="memorials" className="py-20 bg-background">
      <div className="container">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-12 uppercase tracking-wide">
          Memoriali Recenti
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {recentMemorials.map((m) => {
            const fullName = `${m.firstName} ${m.lastName || ""}`.trim();
            const lifespan =
              m.birthDate && m.deathDate
                ? `${new Date(m.birthDate).getFullYear()} – ${new Date(m.deathDate).getFullYear()}`
                : "";

            return (
              <Link
                key={m.id}
                to={`/memorial/${m.id}`}
                className="group bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-card transition-shadow"
              >
                <div className="aspect-[4/3] bg-accent flex items-center justify-center overflow-hidden">
                  {m.imageUrl ? (
                    <img src={m.imageUrl} alt={fullName} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-5xl text-sage-dark/30 font-display">
                      {m.firstName.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                    {fullName}
                  </h3>
                  {lifespan && (
                    <p className="text-sm text-muted-foreground">{lifespan}</p>
                  )}
                  {m.location && (
                    <p className="text-xs text-muted-foreground">{m.location}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="bg-card rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="font-display text-xl font-bold text-foreground mb-1">
              La Nostra Comunità
            </h3>
            <div className="flex gap-8 mt-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-bold text-primary">{s.value}</p>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <Link
            to="/directory/human"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Esplora tutti i memoriali <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RecentMemorials;
