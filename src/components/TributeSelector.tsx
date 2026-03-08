import { useState, useEffect } from "react";
import { Send, Mail } from "lucide-react";
import { tributeTiers, TributeTier } from "@/data/tributeTiers";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { loadProfanityWords, checkProfanity } from "@/lib/profanityFilter";
import { Input } from "@/components/ui/input";

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
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
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

    if (selected.tier !== "base") {
      toast.info("Stripe payment coming soon!", {
        description: `The "${selected.name}" tribute at $${selected.price.toFixed(2)} requires payment. Stripe integration will be available shortly.`,
      });
      return;
    }

    setSending(true);
    const isFlagged = checkProfanity(message, profanityWords);

    const { error } = await supabase.from("tributes").insert({
      memorial_id: memorialId,
      sender_name: senderName.trim() || "Anonymous",
      message,
      item_type: selected.name,
      tier: selected.tier,
      is_paid: false,
      status: isFlagged ? "flagged" : "approved",
      sender_email: senderEmail.trim() || null,
    });

    if (error) {
      toast.error("Error sending tribute");
    } else {
      if (isFlagged) {
        toast.info("Your tribute is pending review by a moderator.");
      } else {
        toast.success("Tribute sent!");
      }

      // Fire-and-forget email notification to memorial owner
      supabase.functions.invoke("notify-tribute", {
        body: {
          tribute_id: null,
          memorial_id: memorialId,
          sender_name: senderName.trim() || "Anonymous",
          message,
          tier: selected.tier,
          is_flagged: isFlagged,
        },
      }).catch((err) => console.error("notify-tribute error:", err));

      // Fire-and-forget receipt email to guest
      if (senderEmail.trim()) {
        supabase.functions.invoke("send-receipt", {
          body: {
            sender_email: senderEmail.trim(),
            sender_name: senderName.trim() || "Anonymous",
            memorial_name: firstName,
            item_type: selected.name,
            tier: selected.tier,
            price: selected.price,
            message,
          },
        }).catch((err) => console.error("send-receipt error:", err));
      }

      setMessage("");
      setSenderName("");
      setSenderEmail("");
      setSelected(tributeTiers[0]);
      onTributeAdded();
    }
    setSending(false);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
      <h3 className="mb-1 font-serif text-lg font-semibold text-foreground">
        Leave a tribute for {firstName}
      </h3>
      <p className="mb-5 text-xs text-muted-foreground">Choose the type of tribute — no account required</p>

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tributeTiers.map((tier) => {
          const isSelected = selected.id === tier.id;
          return (
            <button
              key={tier.id} type="button" onClick={() => setSelected(tier)}
              className={`relative rounded-lg border p-3.5 text-center transition-all ${isSelected ? tierSelectedColors[tier.tier] : tierColors[tier.tier]}`}
            >
              {tier.tier === "premium" && (
                <span className="absolute -right-1 -top-1 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-accent-foreground">TOP</span>
              )}
              <span className={`mb-1 inline-block text-2xl ${tier.animated ? "animate-candle-flicker" : ""}`}>{tier.icon}</span>
              <p className="text-xs font-medium text-foreground">{tier.name}</p>
              <p className="text-[11px] text-muted-foreground">
                {tier.price === 0 ? "Free" : `$${tier.price.toFixed(2)}`}
              </p>
              {tier.duration && <p className="mt-0.5 text-[10px] text-accent">{tier.duration}</p>}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
          placeholder="Your name (optional)"
          className="text-sm"
        />
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="email"
            value={senderEmail}
            onChange={(e) => setSenderEmail(e.target.value)}
            placeholder="Your email for receipt (optional)"
            className="pl-9 text-sm"
          />
        </div>
        <textarea
          value={message} onChange={(e) => setMessage(e.target.value)}
          placeholder="Write a condolence message..." rows={3}
          className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {selected.tier !== "base" && (
              <><span className="mr-1">{selected.icon}</span>{selected.name} – €{selected.price.toFixed(2)}</>
            )}
          </p>
          <button
            type="submit" disabled={sending || !message.trim()}
            className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" />
            {selected.tier === "base" ? "Send" : `Pay €${selected.price.toFixed(2)}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TributeSelector;
