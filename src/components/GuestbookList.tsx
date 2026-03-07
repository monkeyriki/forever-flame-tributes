import { motion } from "framer-motion";
import { tributeTiers } from "@/data/tributeTiers";

interface TributeEntry {
  id: string;
  sender_name: string;
  message: string | null;
  item_type: string | null;
  tier: string;
  is_paid: boolean;
  created_at: string;
  expires_at: string | null;
  status?: string;
}

interface GuestbookListProps {
  tributes: TributeEntry[];
}

const tierIcon = (itemType: string | null): string | null => {
  if (!itemType || itemType === "message" || itemType === "Message") return null;
  const found = tributeTiers.find((t) => t.name === itemType);
  return found?.icon || null;
};

const GuestbookList = ({ tributes }: GuestbookListProps) => {
  const now = new Date();
  const visible = tributes.filter((t) => t.status !== "flagged");
  const sorted = [...visible].sort((a, b) => {
    const aPremium = a.tier === "premium" && a.is_paid && (!a.expires_at || new Date(a.expires_at) > now);
    const bPremium = b.tier === "premium" && b.is_paid && (!b.expires_at || new Date(b.expires_at) > now);
    if (aPremium && !bPremium) return -1;
    if (!aPremium && bPremium) return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  if (sorted.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No messages yet. Be the first to leave a tribute.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {sorted.map((entry, i) => {
        const icon = tierIcon(entry.item_type);
        const isPremiumActive = entry.tier === "premium" && entry.is_paid && (!entry.expires_at || new Date(entry.expires_at) > now);

        return (
          <motion.div
            key={entry.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className={`rounded-lg border p-4 shadow-soft ${isPremiumActive ? "border-accent/30 bg-accent/5" : "border-border bg-card"}`}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                {icon && <span className={isPremiumActive ? "animate-candle-flicker text-lg" : "text-lg"}>{icon}</span>}
                {entry.sender_name}
                {isPremiumActive && (
                  <span className="ml-1 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-accent-foreground">⭐ Premium</span>
                )}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(entry.created_at).toLocaleDateString("en-US")}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{entry.message}</p>
          </motion.div>
        );
      })}
    </div>
  );
};

export default GuestbookList;
