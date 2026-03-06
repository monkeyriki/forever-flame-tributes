import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { CheckCircle, Settings, CreditCard, Megaphone } from "lucide-react";

const PlansSettingsTab = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const { settings } = useSiteSettings();

  const [adsEnabled, setAdsEnabled] = useState(false);
  const [adsPremiumExempt, setAdsPremiumExempt] = useState(true);
  const [adsenseCode, setAdsenseCode] = useState("");
  const [premiumPrice, setPremiumPrice] = useState("49.99");
  const [lifetimePrice, setLifetimePrice] = useState("99.99");
  const [businessPrice, setBusinessPrice] = useState("199.99");
  const [freeMaxPhotos, setFreeMaxPhotos] = useState("5");

  useEffect(() => {
    if (settings) {
      setAdsEnabled(settings.ads_enabled === "true");
      setAdsPremiumExempt(settings.ads_premium_exempt === "true");
      setAdsenseCode(settings.adsense_code || "");
      setPremiumPrice(settings.plan_premium_price || "49.99");
      setLifetimePrice(settings.plan_premium_lifetime_price || "99.99");
      setBusinessPrice(settings.plan_business_price || "199.99");
      setFreeMaxPhotos(settings.plan_free_max_photos || "5");
    }
  }, [settings]);

  const saveSetting = async (key: string, value: string) => {
    const { data: existing } = await supabase
      .from("site_settings")
      .select("id")
      .eq("key", key)
      .maybeSingle();

    if (existing) {
      await supabase.from("site_settings").update({ value }).eq("key", key);
    } else {
      await supabase.from("site_settings").insert({ key, value });
    }
  };

  const saveAllMutation = useMutation({
    mutationFn: async () => {
      await Promise.all([
        saveSetting("ads_enabled", String(adsEnabled)),
        saveSetting("ads_premium_exempt", String(adsPremiumExempt)),
        saveSetting("adsense_code", adsenseCode),
        saveSetting("plan_premium_price", premiumPrice),
        saveSetting("plan_premium_lifetime_price", lifetimePrice),
        saveSetting("plan_business_price", businessPrice),
        saveSetting("plan_free_max_photos", freeMaxPhotos),
      ]);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["site_settings"] });
      toast({ title: "Impostazioni salvate con successo" });
    },
    onError: (e: any) => toast({ title: "Errore", description: e.message, variant: "destructive" }),
  });

  return (
    <div className="space-y-6">
      {/* Plans */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-sans">
            <CreditCard className="mr-2 inline h-5 w-5" />
            Piani di Abbonamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free */}
            <div className="rounded-lg border border-border p-4 space-y-3">
              <h3 className="font-serif text-lg font-semibold text-foreground">🆓 Free</h3>
              <p className="text-sm text-muted-foreground">Con pubblicità, funzionalità limitate</p>
              <div>
                <Label>Max foto</Label>
                <Input type="number" value={freeMaxPhotos} onChange={(e) => setFreeMaxPhotos(e.target.value)} />
              </div>
              <p className="text-xs text-muted-foreground">Prezzo: Gratuito</p>
            </div>
            {/* Premium */}
            <div className="rounded-lg border-2 border-primary p-4 space-y-3">
              <h3 className="font-serif text-lg font-semibold text-foreground">⭐ Premium</h3>
              <p className="text-sm text-muted-foreground">No ads, foto illimitate, video</p>
              <div>
                <Label>Prezzo annuale (€)</Label>
                <Input type="number" step="0.01" value={premiumPrice} onChange={(e) => setPremiumPrice(e.target.value)} />
              </div>
              <div>
                <Label>Prezzo Lifetime (€)</Label>
                <Input type="number" step="0.01" value={lifetimePrice} onChange={(e) => setLifetimePrice(e.target.value)} />
              </div>
            </div>
            {/* Business */}
            <div className="rounded-lg border border-border p-4 space-y-3">
              <h3 className="font-serif text-lg font-semibold text-foreground">🏢 Business</h3>
              <p className="text-sm text-muted-foreground">Per agenzie funebri / B2B</p>
              <div>
                <Label>Prezzo annuale (€)</Label>
                <Input type="number" step="0.01" value={businessPrice} onChange={(e) => setBusinessPrice(e.target.value)} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ad Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-sans">
            <Megaphone className="mr-2 inline h-5 w-5" />
            Gestione Pubblicità
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Annunci attivi globalmente</p>
              <p className="text-xs text-muted-foreground">Attiva/disattiva tutti gli annunci sul sito</p>
            </div>
            <Switch checked={adsEnabled} onCheckedChange={setAdsEnabled} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Esenzione Premium</p>
              <p className="text-xs text-muted-foreground">I memoriali Premium non mostrano annunci</p>
            </div>
            <Switch checked={adsPremiumExempt} onCheckedChange={setAdsPremiumExempt} />
          </div>
          <div>
            <Label>Codice Google AdSense</Label>
            <Textarea
              value={adsenseCode}
              onChange={(e) => setAdsenseCode(e.target.value)}
              placeholder='<script async src="https://pagead2.googlesyndication.com/..."></script>'
              className="font-mono text-xs h-24"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Incolla il codice fornito da Google AdSense.
            </p>
          </div>
        </CardContent>
      </Card>

      <Button onClick={() => saveAllMutation.mutate()} disabled={saveAllMutation.isPending} className="w-full md:w-auto">
        <CheckCircle className="mr-2 h-4 w-4" />
        Salva Tutte le Impostazioni
      </Button>
    </div>
  );
};

export default PlansSettingsTab;
