import { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  BookOpen,
  Eye,
  Heart,
  Plus,
  Upload,
  Pencil,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";

const B2BDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [csvData, setCsvData] = useState("");

  // Fetch memorials for this B2B partner
  const { data: memorials = [], isLoading } = useQuery({
    queryKey: ["b2b-memorials", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("memorials")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch tribute counts per memorial
  const { data: tributeCounts = {} } = useQuery({
    queryKey: ["b2b-tribute-counts", user?.id],
    queryFn: async () => {
      const ids = memorials.map((m) => m.id);
      if (ids.length === 0) return {};
      const { data, error } = await supabase
        .from("tributes")
        .select("memorial_id")
        .in("memorial_id", ids);
      if (error) throw error;
      const counts: Record<string, number> = {};
      data.forEach((t) => {
        counts[t.memorial_id] = (counts[t.memorial_id] || 0) + 1;
      });
      return counts;
    },
    enabled: memorials.length > 0,
  });

  const totalMemorials = memorials.length;
  const totalTributes = Object.values(tributeCounts).reduce(
    (sum, c) => sum + c,
    0
  );
  const publishedCount = memorials.filter((m) => !m.is_draft).length;

  // Delete memorial
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("memorials").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["b2b-memorials"] });
      toast({ title: "Memoriale eliminato" });
    },
  });

  // CSV Import
  const handleImport = async () => {
    const lines = csvData.trim().split("\n");
    if (lines.length < 2) {
      toast({ title: "CSV vuoto o formato non valido", variant: "destructive" });
      return;
    }

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const rows = lines.slice(1);

    let imported = 0;
    for (const row of rows) {
      const cols = row.split(",").map((c) => c.trim());
      const record: Record<string, string> = {};
      headers.forEach((h, i) => (record[h] = cols[i] || ""));

      const { error } = await supabase.from("memorials").insert({
        user_id: user!.id,
        first_name: record["nome"] || record["first_name"] || "",
        last_name: record["cognome"] || record["last_name"] || "",
        birth_date: record["data_nascita"] || record["birth_date"] || null,
        death_date: record["data_morte"] || record["death_date"] || null,
        bio: record["bio"] || "",
        type: record["tipo"] || record["type"] || "human",
        is_draft: true,
        visibility: "public",
      });

      if (!error) imported++;
    }

    toast({ title: `${imported} memoriali importati come bozza` });
    setCsvData("");
    setImportDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ["b2b-memorials"] });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCsvData(ev.target?.result as string);
    };
    reader.readAsText(file);
  };

  return (
    <Layout>
      <Helmet>
        <title>Dashboard B2B — Eternal Memory</title>
      </Helmet>

      <div className="container mx-auto py-10 px-4 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Dashboard Partner
            </h1>
            <p className="text-muted-foreground font-sans">
              Gestisci i memoriali della tua agenzia
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setImportDialogOpen(true)}
            >
              <Upload className="mr-2 h-4 w-4" />
              Importa CSV
            </Button>
            <Button
              onClick={() => (window.location.href = "/create")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuovo Memoriale
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-sans font-medium text-muted-foreground">
                Totale Memoriali
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {totalMemorials}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {publishedCount} pubblicati
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-sans font-medium text-muted-foreground">
                Visualizzazioni Totali
              </CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">—</div>
              <p className="text-xs text-muted-foreground mt-1">
                Prossimamente
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-sans font-medium text-muted-foreground">
                Tributi Ricevuti
              </CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {totalTributes}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Memorial Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-sans">I tuoi Memoriali</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground py-8 text-center">
                Caricamento...
              </p>
            ) : memorials.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">
                Nessun memoriale creato. Usa il pulsante "Nuovo Memoriale" o
                importa un CSV.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Stato</TableHead>
                      <TableHead>Tributi</TableHead>
                      <TableHead>Creato</TableHead>
                      <TableHead className="text-right">Azioni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {memorials.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell className="font-medium">
                          {m.first_name} {m.last_name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{m.type}</Badge>
                        </TableCell>
                        <TableCell>
                          {m.is_draft ? (
                            <Badge variant="outline">Bozza</Badge>
                          ) : (
                            <Badge className="bg-primary text-primary-foreground">
                              Pubblicato
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{tributeCounts[m.id] || 0}</TableCell>
                        <TableCell>
                          {format(new Date(m.created_at), "dd MMM yyyy", {
                            locale: it,
                          })}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              (window.location.href = `/memorial/${m.id}`)
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteMutation.mutate(m.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Importa Memoriali da CSV</DialogTitle>
            <DialogDescription>
              Carica un file CSV con le colonne: nome, cognome, data_nascita
              (YYYY-MM-DD), data_morte, bio, tipo
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>File CSV</Label>
              <Input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
              />
            </div>
            <div>
              <Label>Oppure incolla il contenuto CSV</Label>
              <Textarea
                value={csvData}
                onChange={(e) => setCsvData(e.target.value)}
                placeholder="nome,cognome,data_nascita,data_morte,bio,tipo"
                rows={6}
              />
            </div>
            <Button onClick={handleImport} disabled={!csvData.trim()}>
              Importa
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default B2BDashboard;
