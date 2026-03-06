import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { motion } from "framer-motion";
import { tributeTiers, TributeTier } from "@/data/tributeTiers";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { loadProfanityWords, checkProfanity } from "@/lib/profanityFilter";

interface TributeSelectorProps {
  memorialId: string;
  firstName: string;
  onTributeAdded: () => void;
}

const tierColors: Record<string, string> = {
  base: "border-border bg-background hover:border-muted-foreground/40",
  standard: "border-border bg-background hover:border-primary/40",
  premium: "border-border bg-background hover:border-accent/40",
};

const tierSelectedColors: Record<string, string> = {
  base: "border-muted-foreground bg-muted/30 shadow-soft",
  standard: "border-primary bg-primary/5 shadow-soft",
  premium: "border-accent bg-accent/5 shadow-soft ring-1 ring-accent/20",
};

const TributeSelector = ({ memorialId, firstName, onTributeAdded }: TributeSelectorProps) => {
  const [selected, setSelected] = useState<TributeTier>(tributeTiers[0]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [profanityWords, setProfanityWords] = useState<string[]>([]);

  useEffect(() => {
    loadProfanityWords(async () => {
      const { data } = await supabase.from("profanity_words").select("word");
      return (data || []).map((r) => r.word);
    }).then(setProfanityWords);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // For paid tiers, we'd redirect to Stripe here (coming soon)
    if (selected.tier !== "base") {
      toast.info("Pagamento Stripe in arrivo!", {
        description: `Il tributo "${selected.name}" a €${selected.price.toFixed(2)} richiede il pagamento. L'integrazione Stripe sarà attiva a breve.`,
      });
      return;
    }

    setSending(true);
    const { error } = await supabase.from("tributes").insert({
      memorial_id: memorialId,
      sender_name: "Visitatore",
      message,
      item_type: selected.name,
      tier: selected.tier,
      is_paid: false,
    });

    if (error) {
      toast.error("Errore nell'invio del tributo");
    } else {
      toast.success("Tributo inviato!");
      setMessage("");
      setSelected(tributeTiers[0]);
      onTributeAdded();
    }
    setSending(false);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
      <h3 className="mb-1 font-serif text-lg font-semibold text-foreground">
        Lascia un tributo per {firstName}
      </h3>
      <p className="mb-5 text-xs text-muted-foreground">Scegli il tipo di tributo</p>

      {/* Tier selector */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tributeTiers.map((tier) => {
          const isSelected = selected.id === tier.id;
          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => setSelected(tier)}
              className={`relative rounded-lg border p-3.5 text-center transition-all ${
                isSelected ? tierSelectedColors[tier.tier] : tierColors[tier.tier]
              }`}
            >
              {tier.tier === "premium" && (
                <span className="absolute -right-1 -top-1 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-accent-foreground">
                  TOP
                </span>
              )}
              <span
                className={`mb-1 inline-block text-2xl ${tier.animated ? "animate-candle-flicker" : ""}`}
              >
                {tier.icon}
              </span>
              <p className="text-xs font-medium text-foreground">{tier.name}</p>
              <p className="text-[11px] text-muted-foreground">
                {tier.price === 0 ? "Gratis" : `€${tier.price.toFixed(2)}`}
              </p>
              {tier.duration && (
                <p className="mt-0.5 text-[10px] text-accent">{tier.duration}</p>
              )}
            </button>
          );
        })}
      </div>

      {/* Message form */}
      <form onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Scrivi un messaggio di condoglianze..."
          rows={3}
          className="mb-3 w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {selected.tier !== "base" && (
              <>
                <span className="mr-1">{selected.icon}</span>
                {selected.name} – €{selected.price.toFixed(2)}
              </>
            )}
          </p>
          <button
            type="submit"
            disabled={sending || !message.trim()}
            className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" />
            {selected.tier === "base" ? "Invia" : `Paga €${selected.price.toFixed(2)}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TributeSelector;
