import { useState, useRef, useCallback, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin, Calendar, MessageSquare, Share2,
  QrCode, ChevronLeft, Download, X, Play
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { QRCodeCanvas } from "qrcode.react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import AdBanner from "@/components/AdBanner";
import ShareButtons from "@/components/ShareButtons";
import PasswordGate from "@/components/PasswordGate";
import TributeSelector from "@/components/TributeSelector";
import GuestbookList from "@/components/GuestbookList";
import { supabase } from "@/integrations/supabase/client";

const getVideoEmbedUrl = (url: string): string | null => {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return null;
};

const MemorialDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [showQr, setShowQr] = useState(false);
  const [passwordUnlocked, setPasswordUnlocked] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  // Fetch memorial from Supabase
  const { data: memorial, isLoading } = useQuery({
    queryKey: ["memorial", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("memorials")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Fetch tributes
  const { data: tributes = [], refetch: refetchTributes } = useQuery({
    queryKey: ["tributes", id],
    queryFn: async () => {
      const { data } = await supabase
        .from("tributes")
        .select("*")
        .eq("memorial_id", id!)
        .order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!id,
  });

  const handleDownloadQr = useCallback(() => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `qr-${id}.png`;
    a.click();
  }, [id]);




  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Caricamento...</p>
        </div>
      </Layout>
    );
  }

  if (!memorial) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="mb-4 font-serif text-3xl text-foreground">Memoriale non trovato</h1>
          <Link to="/" className="text-primary hover:underline">Torna alla Home</Link>
        </div>
      </Layout>
    );
  }

  // Password protection gate
  const isPasswordProtected = memorial.visibility === "password" && (memorial as any).password_hash;
  if (isPasswordProtected && !passwordUnlocked) {
    const name = memorial.last_name
      ? `${memorial.first_name} ${memorial.last_name}`
      : memorial.first_name;
    return (
      <Layout>
        <PasswordGate
          memorialName={name}
          onUnlock={() => {
            const attempt = sessionStorage.getItem("memorial_pin_attempt") || "";
            if (attempt === (memorial as any).password_hash) {
              setPasswordUnlocked(true);
            }
          }}
        />
      </Layout>
    );
  }

  const fullName = memorial.last_name
    ? `${memorial.first_name} ${memorial.last_name}`
    : memorial.first_name;
  const birthYear = memorial.birth_date ? new Date(memorial.birth_date).getFullYear() : "?";
  const deathYear = memorial.death_date ? new Date(memorial.death_date).getFullYear() : "?";
  const memorialUrl = `${window.location.origin}/memorial/${memorial.id}`;
  const ogTitle = `In Memoria di ${fullName}`;
  const ogDescription = memorial.bio?.slice(0, 155) || `Memoriale dedicato a ${fullName}`;
  const embedUrl = getVideoEmbedUrl(memorial.video_url || "");
  const tags = memorial.tags || [];

  return (
    <>
      <Helmet>
        <title>{ogTitle} – Memoria Eterna</title>
        <meta name="description" content={ogDescription} />
        <meta property="og:type" content="profile" />
        <meta property="og:title" content={`${ogTitle} – Memoria Eterna`} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={memorial.image_url || ""} />
        <meta property="og:url" content={memorialUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${ogTitle} – Memoria Eterna`} />
        <meta name="twitter:description" content={ogDescription} />
        <meta name="twitter:image" content={memorial.image_url || ""} />
      </Helmet>

      <Layout>
        {/* Back */}
        <div className="container mx-auto px-4 pt-6">
          <Link
            to={`/directory/${memorial.type}`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" /> Torna alla directory
          </Link>
        </div>

        <AdBanner position="top" memorialPlan={(memorial as any).plan} />

        {/* Profile */}
        <section className="container mx-auto px-4 py-8 md:py-12">
          <div className="mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-6 h-40 w-40 overflow-hidden rounded-full border-4 border-secondary shadow-card md:h-52 md:w-52">
                <img
                  src={memorial.image_url || "/placeholder.svg"}
                  alt={fullName}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>

              {memorial.type === "pet" && <span className="mb-2 text-2xl">🐾</span>}

              <h1 className="mb-2 font-serif text-4xl font-semibold text-foreground md:text-5xl">
                {fullName}
              </h1>

              <div className="mb-4 flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{birthYear} – {deathYear}</span>
                {memorial.location && (
                  <>
                    <span className="text-border">•</span>
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{memorial.location}</span>
                  </>
                )}
              </div>

              {tags.length > 0 && (
                <div className="mb-6 flex flex-wrap justify-center gap-2">
                  {tags.map((tag: string) => (
                    <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <p className="mb-8 max-w-xl text-base leading-relaxed text-muted-foreground">
                {memorial.bio}
              </p>

              {/* Share & QR */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <ShareButtons url={memorialUrl} title={ogTitle} />
                <button
                  onClick={() => setShowQr(true)}
                  className="flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary"
                >
                  <QrCode className="h-4 w-4" /> QR Code
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* QR Code Modal */}
        {showQr && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative mx-4 w-full max-w-sm rounded-xl border border-border bg-card p-8 shadow-card"
            >
              <button onClick={() => setShowQr(false)} className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-secondary">
                <X className="h-5 w-5" />
              </button>
              <h3 className="mb-1 text-center font-serif text-lg font-semibold text-foreground">QR Code</h3>
              <p className="mb-6 text-center text-xs text-muted-foreground">
                Scansiona o scarica per condividere il memoriale di {memorial.first_name}
              </p>
              <div ref={qrRef} className="mb-6 flex justify-center">
                <QRCodeCanvas value={memorialUrl} size={200} level="H" includeMargin bgColor="#FFFFFF" fgColor="#2C2C2C" />
              </div>
              <button
                onClick={handleDownloadQr}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Download className="h-4 w-4" /> Scarica PNG
              </button>
            </motion.div>
          </div>
        )}

        <div className="golden-divider mx-auto max-w-3xl" />

        {/* Video Embed */}
        {embedUrl && (
          <section className="container mx-auto max-w-3xl px-4 py-8">
            <h2 className="mb-4 text-center font-serif text-2xl font-semibold text-foreground">
              <Play className="mr-2 inline h-5 w-5" /> Video
            </h2>
            <div className="aspect-video overflow-hidden rounded-lg border border-border shadow-soft">
              <iframe
                src={embedUrl}
                title={`Video in memoria di ${fullName}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </section>
        )}

        {/* Stats */}
        <section className="container mx-auto px-4 py-8">
          <div className="mx-auto flex max-w-md justify-center gap-12">
            <div className="text-center">
              <p className="font-serif text-3xl font-semibold text-accent">{tributes.length}</p>
              <p className="text-xs text-muted-foreground">Tributi</p>
            </div>
          </div>
        </section>

        {/* Tributes & Guestbook */}
        <section className="py-10 md:py-14">
          <div className="container mx-auto max-w-3xl px-4">
            <h2 className="mb-6 text-center font-serif text-2xl font-semibold text-foreground">
              <MessageSquare className="mr-2 inline h-5 w-5" />
              Libro delle Condoglianze
            </h2>

            <div className="mb-8">
              <TributeSelector
                memorialId={memorial.id}
                firstName={memorial.first_name}
                onTributeAdded={() => refetchTributes()}
              />
            </div>

            <GuestbookList tributes={tributes as any} />
          </div>
        </section>

        <AdBanner position="sidebar" />
      </Layout>
    </>
  );
};

export default MemorialDetail;
