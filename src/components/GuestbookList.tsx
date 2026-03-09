import { motion } from "framer-motion";
import { tributeTiers } from "@/data/tributeTiers";
import { Badge } from "@/components/ui/badge";
import OwnerTributeActions from "@/components/OwnerTributeActions";

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
  isOwner?: boolean;
  onTributeModerated?: () => void;
}

const tierIcon = (itemType: string | null): string | null => {
  if (!itemType || itemType === "message" || itemType === "Message") return null;
  const found = tributeTiers.find((t) => t.name === itemType);
  return found?.icon || null;
};

const GuestbookList = ({ tributes, isOwner = false, onTributeModerated }: GuestbookListProps) => {
  const now = new Date();
  // Owners see all tributes; guests don't see flagged or pending
  const visible = isOwner ? tributes : tributes.filter((t) => t.status !== "flagged" && t.status !== "pending");
  
  const pendingTributes = isOwner ? tributes.filter((t) => t.status === "pending") : [];
  const nonPending = visible.filter((t) => t.status !== "pending");
  
  const sorted = [...nonPending].sort((a, b) => {
    const aPremium = a.tier === "premium" && a.is_paid && (!a.expires_at || new Date(a.expires_at) > now);
    const bPremium = b.tier === "premium" && b.is_paid && (!b.expires_at || new Date(b.expires_at) > now);
    if (aPremium && !bPremium) return -1;
    if (!aPremium && bPremium) return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const flaggedCount = tributes.filter((t) => t.status === "flagged").length;

  if (sorted.length === 0 && pendingTributes.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No messages yet. Be the first to leave a tribute.
      </p>
    );
  }

  const renderTribute = (entry: TributeEntry, i: number) => {
    const icon = tierIcon(entry.item_type);
    const isPremiumActive = entry.tier === "premium" && entry.is_paid && (!entry.expires_at || new Date(entry.expires_at) > now);
    const isFlagged = entry.status === "flagged";
    const isPending = entry.status === "pending";

    return (
      <motion.div
        key={entry.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.04 }}
        className={`rounded-lg border p-4 shadow-soft ${
          isFlagged
            ? "border-yellow-300 bg-yellow-50/50 dark:border-yellow-700 dark:bg-yellow-950/20"
            : isPending
              ? "border-blue-300 bg-blue-50/50 dark:border-blue-700 dark:bg-blue-950/20"
              : isPremiumActive
                ? "border-accent/30 bg-accent/5"
                : "border-border bg-card"
        }`}
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            {icon && <span className={isPremiumActive ? "animate-candle-flicker text-lg" : "text-lg"}>{icon}</span>}
            {entry.sender_name}
            {isPremiumActive && (
              <span className="ml-1 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-accent-foreground">⭐ Premium</span>
            )}
            {isFlagged && isOwner && (
              <Badge variant="outline" className="ml-1 border-yellow-400 text-yellow-700 text-[10px]">Flagged</Badge>
            )}
            {isPending && isOwner && (
              <Badge variant="outline" className="ml-1 border-blue-400 text-blue-700 text-[10px]">Pending</Badge>
            )}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {new Date(entry.created_at).toLocaleDateString("en-US")}
            </span>
            {isOwner && onTributeModerated && (
              <OwnerTributeActions
                tributeId={entry.id}
                status={entry.status || "approved"}
                onActionComplete={onTributeModerated}
              />
            )}
          </div>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{entry.message}</p>
      </motion.div>
    );
  };

  return (
    <div className="space-y-4">
      {isOwner && flaggedCount > 0 && (
        <div className="flex items-center gap-2 rounded-md border border-yellow-300 bg-yellow-50 px-4 py-2 dark:border-yellow-700 dark:bg-yellow-950/30">
          <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            ⚠️ {flaggedCount} tribute{flaggedCount > 1 ? "s" : ""} pending review
          </span>
        </div>
      )}
      {isOwner && pendingTributes.length > 0 && (
        <>
          <div className="flex items-center gap-2 rounded-md border border-blue-300 bg-blue-50 px-4 py-2 dark:border-blue-700 dark:bg-blue-950/30">
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
              🕐 {pendingTributes.length} tribute{pendingTributes.length > 1 ? "s" : ""} awaiting your approval
            </span>
          </div>
          {pendingTributes.map((entry, i) => renderTribute(entry, i))}
        </>
      )}
      {sorted.map((entry, i) => renderTribute(entry, i))}
    </div>
  );
};

export default GuestbookList;
