import { useState, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, MapPin } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import MemorialCard from "@/components/MemorialCard";
import { mockMemorials } from "@/data/mockData";

const Directory = () => {
  const { type } = useParams<{ type: string }>();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [locationFilter, setLocationFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const isHuman = type !== "pet";
  const categoryLabel = isHuman ? "Memoriali Umani" : "Memoriali Animali";
  const categoryEmoji = isHuman ? "🕊️" : "🐾";

  const filtered = useMemo(() => {
    return mockMemorials
      .filter((m) => (isHuman ? m.type === "human" : m.type === "pet"))
      .filter((m) => {
        const fullName = `${m.firstName} ${m.lastName}`.toLowerCase();
        return !query || fullName.includes(query.toLowerCase());
      })
      .filter((m) => {
        return !locationFilter || m.location.toLowerCase().includes(locationFilter.toLowerCase());
      });
  }, [query, locationFilter, isHuman]);

  return (
    <>
      <Helmet>
        <title>{categoryLabel} – Memoria Eterna</title>
        <meta name="description" content={`Esplora i ${categoryLabel.toLowerCase()} su Memoria Eterna.`} />
      </Helmet>

      <Layout>
        <div className="container mx-auto px-4 py-10 md:py-14">
          {/* Header */}
          <div className="mb-8 text-center">
            <span className="mb-2 inline-block text-3xl">{categoryEmoji}</span>
            <h1 className="mb-2 font-serif text-3xl font-semibold text-foreground md:text-4xl">
              {categoryLabel}
            </h1>
            <p className="text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "memoriale trovato" : "memoriali trovati"}
            </p>
          </div>

          {/* Search & Filters */}
          <div className="mx-auto mb-10 max-w-2xl">
            <div className="flex items-center gap-2 overflow-hidden rounded-lg border border-border bg-card shadow-soft">
              <Search className="ml-4 h-5 w-5 shrink-0 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cerca per nome..."
                className="flex-1 bg-transparent px-2 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`mr-2 rounded-md p-2 transition-colors ${
                  showFilters ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
              </button>
            </div>

            {showFilters && (
              <div className="mt-3 rounded-lg border border-border bg-card p-4 shadow-soft">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    placeholder="Filtra per luogo..."
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((memorial) => (
                <MemorialCard key={memorial.id} memorial={memorial} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-lg text-muted-foreground">Nessun memoriale trovato</p>
              <p className="mt-1 text-sm text-muted-foreground">Prova a modificare i filtri di ricerca</p>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default Directory;
