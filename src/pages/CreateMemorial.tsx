import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Upload, Save, Eye } from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CreateMemorial = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState({
    type: "human" as "human" | "pet",
    first_name: "",
    last_name: "",
    bio: "",
    birth_date: "",
    death_date: "",
    location: "",
    visibility: "public",
    tags: "",
    video_url: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (isDraft: boolean) => {
    if (!user) return;
    setSubmitting(true);

    try {
      let image_url = "";

      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("memorial-images")
          .upload(path, imageFile);
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("memorial-images")
          .getPublicUrl(path);
        image_url = urlData.publicUrl;
      }

      const { error } = await supabase.from("memorials").insert({
        user_id: user.id,
        type: form.type,
        first_name: form.first_name,
        last_name: form.last_name,
        bio: form.bio,
        birth_date: form.birth_date || null,
        death_date: form.death_date || null,
        location: form.location,
        image_url,
        video_url: form.video_url || "",
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
        is_draft: isDraft,
        visibility: form.visibility,
      });

      if (error) throw error;

      toast({
        title: isDraft ? "Bozza salvata" : "Memoriale pubblicato",
        description: isDraft
          ? "Il memoriale è stato salvato come bozza."
          : "Il memoriale è ora visibile al pubblico.",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error.message || "Impossibile salvare il memoriale.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <>
      <Helmet>
        <title>Crea Memoriale – Memoria Eterna</title>
      </Helmet>
      <Layout>
        <div className="container mx-auto max-w-2xl px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="mb-2 font-serif text-3xl font-semibold text-foreground">
              Crea un Memoriale
            </h1>
            <p className="mb-8 text-sm text-muted-foreground">
              Compila i dettagli per creare un tributo duraturo
            </p>

            <div className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-soft">
              {/* Type */}
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Tipo</label>
                <div className="flex gap-3">
                  {(["human", "pet"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => updateField("type", t)}
                      className={`rounded-md border px-4 py-2 text-sm transition-colors ${
                        form.type === t
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      {t === "human" ? "👤 Umano" : "🐾 Animale"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Names */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Nome *</label>
                  <input
                    value={form.first_name}
                    onChange={(e) => updateField("first_name", e.target.value)}
                    required
                    className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Cognome</label>
                  <input
                    value={form.last_name}
                    onChange={(e) => updateField("last_name", e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Data di nascita</label>
                  <input
                    type="date"
                    value={form.birth_date}
                    onChange={(e) => updateField("birth_date", e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Data di morte</label>
                  <input
                    type="date"
                    value={form.death_date}
                    onChange={(e) => updateField("death_date", e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Luogo</label>
                <input
                  value={form.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  placeholder="es. Roma, Italia"
                  className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Biografia</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => updateField("bio", e.target.value)}
                  rows={4}
                  placeholder="Racconta la storia di questa persona..."
                  className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {/* Image */}
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Foto</label>
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                  )}
                  <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-secondary">
                    <Upload className="h-4 w-4" />
                    Carica immagine
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Video URL */}
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Video (YouTube / Vimeo)</label>
                <input
                  value={form.video_url}
                  onChange={(e) => updateField("video_url", e.target.value)}
                  placeholder="es. https://www.youtube.com/watch?v=..."
                  className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Tag</label>
                <input
                  value={form.tags}
                  onChange={(e) => updateField("tags", e.target.value)}
                  placeholder="es. nonno, veterano, musicista (separati da virgola)"
                  className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {/* Visibility */}
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Visibilità</label>
                <div className="flex gap-3">
                  {[
                    { value: "public", label: "Pubblico" },
                    { value: "unlisted", label: "Non elencato" },
                    { value: "password", label: "Protetto" },
                  ].map((v) => (
                    <button
                      key={v.value}
                      type="button"
                      onClick={() => updateField("visibility", v.value)}
                      className={`rounded-md border px-4 py-2 text-sm transition-colors ${
                        form.visibility === v.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button
                  onClick={() => handleSubmit(true)}
                  disabled={submitting || !form.first_name}
                  className="flex items-center justify-center gap-2 rounded-md border border-border px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  Salva come bozza
                </button>
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={submitting || !form.first_name}
                  className="flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  <Eye className="h-4 w-4" />
                  Pubblica memoriale
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </Layout>
    </>
  );
};

export default CreateMemorial;
