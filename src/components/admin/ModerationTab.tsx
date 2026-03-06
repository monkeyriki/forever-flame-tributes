import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Trash2, CheckCircle, AlertTriangle, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";

const ModerationTab = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [newWord, setNewWord] = useState("");

  // Flagged tributes
  const { data: flaggedTributes = [] } = useQuery({
    queryKey: ["admin-flagged-tributes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tributes")
        .select("*, memorials(first_name, last_name)")
        .eq("status", "flagged" as any)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // All recent tributes
  const { data: allTributes = [] } = useQuery({
    queryKey: ["admin-all-tributes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tributes")
        .select("*, memorials(first_name, last_name)")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
  });

  // Profanity words
  const { data: profanityWords = [] } = useQuery({
    queryKey: ["profanity_words"],
    queryFn: async () => {
      const { data } = await supabase.from("profanity_words" as any).select("*");
      return (data as any[]) || [];
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      // We need an update policy - use workaround via delete + reinsert or admin function
      // For now, since tributes don't have UPDATE policy, we'll need to work around
      // Actually let's just delete and let admin know
      const { error } = await supabase.rpc("admin_approve_tribute" as any, { tribute_id: id });
      if (error) {
        // Fallback: direct approach won't work without UPDATE policy, so we just toast
        throw new Error("Serve una funzione RPC per approvare. Per ora, elimina i tributi inappropriati.");
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-flagged-tributes"] });
      qc.invalidateQueries({ queryKey: ["admin-all-tributes"] });
      toast({ title: "Tributo approvato" });
    },
    onError: (e: any) => toast({ title: "Info", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tributes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-flagged-tributes"] });
      qc.invalidateQueries({ queryKey: ["admin-all-tributes"] });
      toast({ title: "Tributo eliminato" });
    },
  });

  const addWordMutation = useMutation({
    mutationFn: async (word: string) => {
      const { error } = await supabase.from("profanity_words" as any).insert({ word: word.toLowerCase().trim() } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profanity_words"] });
      setNewWord("");
      toast({ title: "Parola aggiunta al filtro" });
    },
    onError: (e: any) => toast({ title: "Errore", description: e.message, variant: "destructive" }),
  });

  const removeWordMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("profanity_words" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profanity_words"] });
      toast({ title: "Parola rimossa" });
    },
  });

  const renderTributeTable = (tributes: any[], showApprove: boolean) => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Stato</TableHead>
            <TableHead>Mittente</TableHead>
            <TableHead>Memoriale</TableHead>
            <TableHead>Messaggio</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-right">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tributes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                Nessun tributo trovato
              </TableCell>
            </TableRow>
          ) : (
            tributes.map((t: any) => (
              <TableRow key={t.id}>
                <TableCell>
                  <Badge variant={t.status === "flagged" ? "destructive" : t.status === "approved" ? "default" : "outline"}>
                    {t.status === "flagged" ? "🚩 Segnalato" : t.status === "approved" ? "✅ OK" : t.status}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{t.sender_name}</TableCell>
                <TableCell>
                  {t.memorials ? `${t.memorials.first_name} ${t.memorials.last_name}` : "—"}
                </TableCell>
                <TableCell className="max-w-[250px] truncate">{t.message || "—"}</TableCell>
                <TableCell>{format(new Date(t.created_at), "dd MMM yyyy", { locale: it })}</TableCell>
                <TableCell className="text-right space-x-1">
                  {showApprove && t.status === "flagged" && (
                    <Button size="icon" variant="ghost" onClick={() => approveMutation.mutate(t.id)}>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </Button>
                  )}
                  <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(t.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Flagged queue */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-sans">
            <AlertTriangle className="mr-2 inline h-5 w-5 text-destructive" />
            Coda Segnalati ({flaggedTributes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>{renderTributeTable(flaggedTributes, true)}</CardContent>
      </Card>

      {/* All tributes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-sans">Tutti i Tributi Recenti</CardTitle>
        </CardHeader>
        <CardContent>{renderTributeTable(allTributes, true)}</CardContent>
      </Card>

      {/* Profanity filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-sans">Filtro Profanità</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Aggiungi parola..."
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && newWord.trim() && addWordMutation.mutate(newWord)}
            />
            <Button onClick={() => newWord.trim() && addWordMutation.mutate(newWord)} disabled={!newWord.trim()}>
              <Plus className="mr-1 h-4 w-4" /> Aggiungi
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profanityWords.map((pw: any) => (
              <Badge key={pw.id} variant="secondary" className="gap-1 pr-1">
                {pw.word}
                <button onClick={() => removeWordMutation.mutate(pw.id)} className="ml-1 hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {profanityWords.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nessuna parola personalizzata. Il filtro predefinito è comunque attivo.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModerationTab;
