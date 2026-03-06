import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSiteSettings = () => {
  const { data: settings } = useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings" as any).select("key, value");
      const map: Record<string, string> = {};
      (data as any[])?.forEach((row: any) => { map[row.key] = row.value; });
      return map;
    },
    staleTime: 60_000,
  });

  return {
    adsEnabled: settings?.ads_enabled === "true",
    adsenseCode: settings?.adsense_code || "",
  };
};
