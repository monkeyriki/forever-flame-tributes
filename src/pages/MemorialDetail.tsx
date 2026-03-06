import { useState, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin, Calendar, Heart, MessageSquare, Share2,
  QrCode, ChevronLeft, Send, Download, X, Play
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { QRCodeCanvas } from "qrcode.react";
import Layout from "@/components/Layout";
import { mockMemorials, virtualTributes } from "@/data/mockData";
import { GuestbookEntry } from "@/types/memorial";

const mockGuestbook: GuestbookEntry[] = [
  { id: "1", authorName: "Laura M.", message: "Mancherai a tutti noi. Riposa in pace.", createdAt: "2025-03-01" },
  { id: "2", authorName: "Marco F.", message: "Un grande uomo, un amico speciale. Ti porterò sempre nel cuore.", createdAt: "2025-02-28", tribute: virtualTributes[0] },
  { id: "3", authorName: "Silvia R.", message: "La tua gentilezza resterà per sempre nei nostri ricordi.", createdAt: "2025-02-27" },
];

const getVideoEmbedUrl = (url: string): string | null => {
  if (!url) return null;
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return null;
};

const MemorialDetail = () => {
  const { id } = useParams<{ id: string }>();
  const memorial = mockMemorials.find((m) => m.id === id);
  const [newMessage, setNewMessage] = useState("");
  const [guestbook, setGuestbook] = useState<GuestbookEntry[]>(mockGuestbook);
  const [selectedTribute, setSelectedTribute] = useState<string | null>(null);
  const [showQr, setShowQr] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownloadQr = useCallback(() => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `qr-${id}.png`;
    a.click();
  }, [id]);

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

  const fullName = memorial.lastName
    ? `${memorial.firstName} ${memorial.lastName}`
    : memorial.firstName;
  const birthYear = new Date(memorial.birthDate).getFullYear();
  const deathYear = new Date(memorial.deathDate).getFullYear();
  const memorialUrl = `${window.location.origin}/memorial/${memorial.id}`;
  const ogTitle = `In Memoria di ${fullName}`;
  const ogDescription = memorial.bio?.slice(0, 155) || `Memoriale dedicato a ${fullName}`;

  // Mock video URL for demo - in production this comes from the DB
  const videoUrl = (memorial as any).videoUrl || "";
  const embedUrl = getVideoEmbedUrl(videoUrl);

  const handleDownloadQr = useCallback(() => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `qr-${memorial.id}.png`;
    a.click();
  }, [memorial.id]);

  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const entry: GuestbookEntry = {
      id: String(Date.now()),
      authorName: "Visitatore",
      message: newMessage,
      createdAt: new Date().toISOString().split("T")[0],
      tribute: selectedTribute ? virtualTributes.find(t => t.id === selectedTribute) : undefined,
    };
    setGuestbook([entry, ...guestbook]);
    setNewMessage("");
    setSelectedTribute(null);
  };

  return (
    <>
      <Helmet>
        <title>{ogTitle} – Memoria Eterna</title>
        <meta name="description" content={ogDescription} />
        <meta property="og:type" content="profile" />
        <meta property="og:title" content={`${ogTitle} – Memoria Eterna`} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={memorial.photoUrl} />
        <meta property="og:url" content={memorialUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${ogTitle} – Memoria Eterna`} />
        <meta name="twitter:description" content={ogDescription} />
        <meta name="twitter:image" content={memorial.photoUrl} />
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
                  src={memorial.photoUrl}
                  alt={fullName}
                  className="h-full w-full object-cover"
                />
              </div>

              {memorial.type === "pet" && <span className="mb-2 text-2xl">🐾</span>}

              <h1 className="mb-2 font-serif text-4xl font-semibold text-foreground md:text-5xl">
                {fullName}
              </h1>

              <div className="mb-4 flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{birthYear} – {deathYear}</span>
                <span className="text-border">•</span>
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{memorial.location}</span>
              </div>

              <div className="mb-6 flex gap-2">
                {memorial.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="mb-8 max-w-xl text-base leading-relaxed text-muted-foreground">
                {memorial.bio}
              </p>

              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1.5 rounded-md bg-secondary px-4 py-2 text-sm text-secondary-foreground transition-colors hover:bg-secondary/80">
                  <Share2 className="h-4 w-4" /> Condividi
                </button>
                <button
                  onClick={() => setShowQr(true)}
                  className="flex items-center gap-1.5 rounded-md bg-secondary px-4 py-2 text-sm text-secondary-foreground transition-colors hover:bg-secondary/80"
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
              <button
                onClick={() => setShowQr(false)}
                className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-secondary"
              >
                <X className="h-5 w-5" />
              </button>
              <h3 className="mb-1 text-center font-serif text-lg font-semibold text-foreground">
                QR Code
              </h3>
              <p className="mb-6 text-center text-xs text-muted-foreground">
                Scansiona o scarica per condividere il memoriale di {memorial.firstName}
              </p>
              <div ref={qrRef} className="flex justify-center mb-6">
                <QRCodeCanvas
                  value={memorialUrl}
                  size={200}
                  level="H"
                  includeMargin
                  bgColor="#FFFFFF"
                  fgColor="#2C2C2C"
                />
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
              <p className="font-serif text-3xl font-semibold text-warm-gold">{memorial.tributeCount}</p>
              <p className="text-xs text-muted-foreground">Tributi</p>
            </div>
            <div className="text-center">
              <p className="font-serif text-3xl font-semibold text-foreground">{guestbook.length}</p>
              <p className="text-xs text-muted-foreground">Messaggi</p>
            </div>
          </div>
        </section>

        {/* Virtual Tributes */}
        <section className="bg-card py-10 md:py-14">
          <div className="container mx-auto max-w-3xl px-4">
            <h2 className="mb-2 text-center font-serif text-2xl font-semibold text-foreground">
              Tributi Virtuali
            </h2>
            <p className="mb-6 text-center text-sm text-muted-foreground">
              Lascia un dono simbolico in memoria di {memorial.firstName}
            </p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {virtualTributes.map((tribute) => (
                <button
                  key={tribute.id}
                  onClick={() => setSelectedTribute(selectedTribute === tribute.id ? null : tribute.id)}
                  className={`relative rounded-lg border p-4 text-center transition-all ${
                    selectedTribute === tribute.id
                      ? "border-primary bg-primary/5 shadow-soft"
                      : "border-border bg-background hover:border-primary/30"
                  }`}
                >
                  <span className={`mb-1 inline-block text-2xl ${tribute.animated ? "animate-candle-flicker" : ""}`}>
                    {tribute.icon}
                  </span>
                  <p className="text-xs font-medium text-foreground">{tribute.name}</p>
                  <p className="text-xs text-muted-foreground">€{tribute.price.toFixed(2)}</p>
                  {tribute.animated && (
                    <span className="absolute right-1.5 top-1.5 rounded-full bg-warm-gold px-1.5 py-0.5 text-[10px] text-accent-foreground">
                      ✨
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Guestbook */}
        <section className="py-10 md:py-14">
          <div className="container mx-auto max-w-3xl px-4">
            <h2 className="mb-6 text-center font-serif text-2xl font-semibold text-foreground">
              <MessageSquare className="mr-2 inline h-5 w-5" />
              Libro delle Condoglianze
            </h2>

            <form onSubmit={handleSubmitMessage} className="mb-8 rounded-lg border border-border bg-card p-4 shadow-soft">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Scrivi un messaggio di condoglianze..."
                rows={3}
                className="mb-3 w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {selectedTribute && `Tributo selezionato: ${virtualTributes.find(t => t.id === selectedTribute)?.name}`}
                </p>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <Send className="h-3.5 w-3.5" /> Invia
                </button>
              </div>
            </form>

            <div className="space-y-4">
              {guestbook.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-lg border border-border bg-card p-4 shadow-soft"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{entry.authorName}</span>
                    <span className="text-xs text-muted-foreground">{entry.createdAt}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{entry.message}</p>
                  {entry.tribute && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-warm-gold">
                      <span>{entry.tribute.icon}</span>
                      <span>Ha lasciato un tributo: {entry.tribute.name}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default MemorialDetail;
