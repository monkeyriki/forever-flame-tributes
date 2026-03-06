import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, Trash2, Shield } from "lucide-react";

const UserSettings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (confirmText !== "ELIMINA") return;
    if (!user) return;

    setDeleting(true);
    try {
      const { error } = await supabase.rpc("delete_user_account", {
        target_user_id: user.id,
      } as any);

      if (error) throw error;

      await signOut();
      toast({ title: "Account eliminato", description: "Tutti i tuoi dati sono stati cancellati." });
      navigate("/");
    } catch (e: any) {
      toast({ title: "Errore", description: e.message, variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Devi accedere per vedere le impostazioni.</p>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Helmet>
        <title>Impostazioni Account – Memoria Eterna</title>
      </Helmet>
      <Layout>
        <div className="container mx-auto max-w-2xl px-4 py-12">
          <h1 className="mb-8 font-serif text-3xl font-semibold text-foreground">
            Impostazioni Account
          </h1>

          <div className="space-y-6">
            {/* Account info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-sans">
                  <User className="mr-2 inline h-5 w-5" />
                  Informazioni Account
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Email</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">ID Utente</p>
                  <p className="text-xs text-muted-foreground font-mono">{user.id}</p>
                </div>
              </CardContent>
            </Card>

            {/* Privacy */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-sans">
                  <Shield className="mr-2 inline h-5 w-5" />
                  Privacy e Dati
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Puoi richiedere l'eliminazione completa del tuo account e di tutti i dati associati
                  (memoriali, tributi, profilo). Questa azione è irreversibile.
                </p>
              </CardContent>
            </Card>

            {/* Danger zone */}
            <Card className="border-destructive/30">
              <CardHeader>
                <CardTitle className="text-lg font-sans text-destructive">
                  <Trash2 className="mr-2 inline h-5 w-5" />
                  Zona Pericolosa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  L'eliminazione dell'account è permanente. Verranno cancellati tutti i memoriali,
                  tributi ricevuti, dati del profilo e ogni altro dato associato.
                </p>
                <Button
                  variant="destructive"
                  onClick={() => setDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Elimina Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-destructive">Conferma Eliminazione</DialogTitle>
              <DialogDescription>
                Questa azione è irreversibile. Tutti i tuoi dati verranno eliminati permanentemente.
              </DialogDescription>
            </DialogHeader>
            <div>
              <p className="mb-2 text-sm text-foreground">
                Digita <strong>ELIMINA</strong> per confermare:
              </p>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="ELIMINA"
                className="font-mono"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialog(false)}>
                Annulla
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={confirmText !== "ELIMINA" || deleting}
              >
                {deleting ? "Eliminazione..." : "Elimina definitivamente"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Layout>
    </>
  );
};

export default UserSettings;
