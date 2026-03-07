import { useState, useMemo, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, MapPin, Calendar, Tag, ArrowUpDown } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import MemorialCard from "@/components/MemorialCard";
import AdBanner from "@/components/AdBanner";
import { SkeletonCard } from "@/components/SkeletonLoaders";
import { supabase } from "@/integrations/supabase/client";
import { Memorial } from "@/types/memorial";
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 12;
type SortOption = "recent" | "updated" | "alpha";

const Directory = () => {
  const { type } = useParams<{ type: string }>();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [locationFilter, setLocationFilter] = useState("");
  const [yearBirthFilter, setYearBirthFilter] = useState("");
  const [yearDeathFilter, setYearDeathFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>("recent");

  const isHuman = type !== "pet";
  const memorialType = isHuman ? "human" : "pet";
  const categoryLabel = isHuman ? "Human Memorials" : "Pet Memorials";
  const categoryEmoji = isHuman ? "🕊️" : "🐾";

  useEffect(() => { setPage(1); }, [query, locationFilter, yearBirthFilter, yearDeathFilter, tagFilter, sortBy, type]);

  const { data: dbMemorials = [], isLoading } = useQuery({
    queryKey: ["directory", memorialType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("memorials").select("*")
        .eq("type", memorialType).eq("visibility", "public").eq("is_draft", false);
      if (error) throw error;
      return (data || []).map((m: any): Memorial => ({
        id: m.id, type: m.type as "human" | "pet",
        firstName: m.first_name, lastName: m.last_name || "",
        birthDate: m.birth_date || "", deathDate: m.death_date || "",
        location: m.location || "", photoUrl: m.image_url || "/placeholder.svg",
        bio: m.bio || "", tags: m.tags || [], visibility: m.visibility as any,
        tributeCount: 0, guestbookEntries: 0, createdAt: m.created_at,
      }));
    },
  });

  const filtered = useMemo(() => {
    let result = dbMemorials.filter((m) => {
      const fullName = `${m.firstName} ${m.lastName}`.toLowerCase();
      if (query && !fullName.includes(query.toLowerCase())) return false;
      if (locationFilter && !m.location.toLowerCase().includes(locationFilter.toLowerCase())) return false;
      if (yearBirthFilter && !m.birthDate.startsWith(yearBirthFilter)) return false;
      if (yearDeathFilter && !m.deathDate.startsWith(yearDeathFilter)) return false;
      if (tagFilter) {
        const searchTag = tagFilter.toLowerCase();
        if (!m.tags.some((t) => t.toLowerCase().includes(searchTag))) return false;
      }
      return true;
    });
    result.sort((a, b) => {
      if (sortBy === "alpha") return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return result;
  }, [dbMemorials, query, locationFilter, yearBirthFilter, yearDeathFilter, tagFilter, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <>
      <Helmet>
        <title>{categoryLabel} – Eternal Memory</title>
        <meta name="description" content={`Browse ${categoryLabel.toLowerCase()} on Eternal Memory.`} />
      </Helmet>
      <Layout>
        <div className="container mx-auto px-4 py-10 md:py-14">
          <AdBanner position="top" />
          <div className="mb-8 text-center">
            <span className="mb-2 inline-block text-3xl">{categoryEmoji}</span>
            <h1 className="mb-2 font-serif text-3xl font-semibold text-foreground md:text-4xl">{categoryLabel}</h1>
            <p className="text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "memorial found" : "memorials found"}
            </p>
          </div>

          <div className="mx-auto mb-10 max-w-2xl">
            <div className="flex items-center gap-2 overflow-hidden rounded-lg border border-border bg-card shadow-soft">
              <Search className="ml-4 h-5 w-5 shrink-0 text-muted-foreground" />
              <input
                type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name..."
                className="flex-1 bg-transparent px-2 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`mr-2 rounded-md p-2 transition-colors ${showFilters ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}
              >
                <SlidersHorizontal className="h-4 w-4" />
              </button>
            </div>

            {showFilters && (
              <div className="mt-3 space-y-3 rounded-lg border border-border bg-card p-4 shadow-soft">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <input type="text" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}
                    placeholder="Filter by location (e.g. New York)..."
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <input type="text" value={yearBirthFilter} onChange={(e) => setYearBirthFilter(e.target.value)}
                    placeholder="Birth year (e.g. 1950)..."
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
                  <input type="text" value={yearDeathFilter} onChange={(e) => setYearDeathFilter(e.target.value)}
                    placeholder="Death year (e.g. 2024)..."
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <input type="text" value={tagFilter} onChange={(e) => setTagFilter(e.target.value)}
                    placeholder="Filter by tag (e.g. Veteran, Golden Retriever)..."
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
                </div>
              </div>
            )}

            <div className="mt-3 flex items-center justify-end gap-2">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="recent">Most Recent</option>
                <option value="updated">Recently Updated</option>
                <option value="alpha">Alphabetical</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (<SkeletonCard key={i} />))}
            </div>
          ) : paginated.length > 0 ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {paginated.map((memorial) => (<MemorialCard key={memorial.id} memorial={memorial} />))}
              </div>
              {totalPages > 1 && (
                <div className="mt-10">
                  <Pagination>
                    <PaginationContent>
                      {page > 1 && (<PaginationItem><PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setPage(page - 1); }} /></PaginationItem>)}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <PaginationItem key={p}><PaginationLink href="#" isActive={p === page} onClick={(e) => { e.preventDefault(); setPage(p); }}>{p}</PaginationLink></PaginationItem>
                      ))}
                      {page < totalPages && (<PaginationItem><PaginationNext href="#" onClick={(e) => { e.preventDefault(); setPage(page + 1); }} /></PaginationItem>)}
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center">
              <p className="text-lg text-muted-foreground">No memorials found</p>
              <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search filters</p>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default Directory;
