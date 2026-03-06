import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ArrowRight, Heart, Users } from "lucide-react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import MemorialCard from "@/components/MemorialCard";
import { mockMemorials } from "@/data/mockData";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const featuredMemorials = mockMemorials.slice(0, 3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/directory/human?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Memoria Eterna – Memoriali e Necrologi Digitali</title>
        <meta
          name="description"
          content="Crea memoriali digitali duraturi per onorare i tuoi cari. Uno spazio rispettoso per ricordare esseri umani e animali domestici."
        />
      </Helmet>

      <Layout>
        {/* Hero */}
        <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroBg})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />

          <div className="relative z-10 mx-auto max-w-3xl px-4 py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="mb-4 inline-block text-4xl">🕊️</span>
              <h1 className="mb-4 font-serif text-4xl font-light leading-tight text-foreground md:text-6xl">
                Un ricordo che dura
                <span className="block font-semibold text-primary">per sempre</span>
              </h1>
              <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Crea uno spazio digitale dedicato alla memoria dei tuoi cari.
                Un tributo rispettoso e duraturo, accessibile a tutti.
              </p>
            </motion.div>

            <motion.form
              onSubmit={handleSearch}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mx-auto flex max-w-lg items-center overflow-hidden rounded-lg border border-border bg-card shadow-card"
            >
              <Search className="ml-4 h-5 w-5 shrink-0 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cerca un memoriale..."
                className="flex-1 bg-transparent px-3 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                type="submit"
                className="mr-1.5 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Cerca
              </button>
            </motion.form>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-10 text-center"
            >
              <h2 className="mb-2 font-serif text-3xl font-semibold text-foreground">
                Esplora i Memoriali
              </h2>
              <p className="text-muted-foreground">
                Scegli la categoria per trovare o creare un tributo
              </p>
            </motion.div>

            <div className="mx-auto grid max-w-2xl gap-6 md:grid-cols-2">
              <Link
                to="/directory/human"
                className="group flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-8 shadow-soft transition-all hover:shadow-card"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <div className="text-center">
                  <h3 className="mb-1 font-serif text-xl font-semibold text-foreground">
                    Memoriali Umani
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Onora la memoria delle persone care
                  </p>
                </div>
                <span className="flex items-center gap-1 text-sm text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Esplora <ArrowRight className="h-4 w-4" />
                </span>
              </Link>

              <Link
                to="/directory/pet"
                className="group flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-8 shadow-soft transition-all hover:shadow-card"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                  <span className="text-2xl">🐾</span>
                </div>
                <div className="text-center">
                  <h3 className="mb-1 font-serif text-xl font-semibold text-foreground">
                    Memoriali Animali
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Un tributo ai compagni a quattro zampe
                  </p>
                </div>
                <span className="flex items-center gap-1 text-sm text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Esplora <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured */}
        <section className="bg-card py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <h2 className="mb-2 font-serif text-3xl font-semibold text-foreground">
                  Memoriali Recenti
                </h2>
                <p className="text-sm text-muted-foreground">
                  Gli ultimi tributi pubblicati dalla comunità
                </p>
              </div>
              <Link
                to="/directory/human"
                className="hidden items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80 md:flex"
              >
                Vedi tutti <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredMemorials.map((memorial, i) => (
                <motion.div
                  key={memorial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <MemorialCard memorial={memorial} />
                </motion.div>
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Link
                to="/directory/human"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary"
              >
                Vedi tutti i memoriali <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Heart className="mx-auto mb-4 h-8 w-8 text-warm-gold" />
              <h2 className="mb-3 font-serif text-3xl font-semibold text-foreground">
                Crea un Memoriale
              </h2>
              <p className="mx-auto mb-6 max-w-md text-muted-foreground">
                Dedica uno spazio speciale alla memoria di chi ami. Semplice, rispettoso e per sempre.
              </p>
              <Link
                to="/create"
                className="inline-flex rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Inizia Ora
              </Link>
            </motion.div>
          </div>
        </section>
      </Layout>
    </HelmetProvider>
  );
};

export default Index;
