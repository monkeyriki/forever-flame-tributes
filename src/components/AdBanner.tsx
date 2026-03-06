import { useSiteSettings } from "@/hooks/useSiteSettings";

interface AdBannerProps {
  position: "top" | "sidebar";
}

const AdBanner = ({ position }: AdBannerProps) => {
  const { adsEnabled, adsenseCode } = useSiteSettings();

  if (!adsEnabled) return null;

  return (
    <div
      className={`rounded-lg border border-dashed border-border bg-muted/30 flex items-center justify-center text-xs text-muted-foreground ${
        position === "top" ? "w-full py-3 mb-4" : "w-full py-12"
      }`}
    >
      {adsenseCode ? (
        <div dangerouslySetInnerHTML={{ __html: adsenseCode }} />
      ) : (
        <span>📢 Spazio pubblicitario ({position === "top" ? "Banner" : "Sidebar"})</span>
      )}
    </div>
  );
};

export default AdBanner;
