import { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Eye, Heart, Plus, Upload, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";

const B2BDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [csvData, setCsvData] = useState("");

  const { data: memorials = [], isLoading } = useQuery({
    queryKey: ["b2b-memorials", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("memorials").select("*").eq("user_id", user!.id).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: tributeCounts = {} } = useQuery({
    queryKey: ["b2b-tribute-counts", user?.id],
    queryFn: async () => {
      const ids = memorials.map((m) => m.id);
      if (ids.length === 0) return {};
      const { data, error } = await supabase.from("tributes").select("memorial_id").in("memorial_id", ids);
      if (error) throw error;
      const counts: Record<string, number> = {};
      data.forEach((t) => { counts[t.memorial_id] = (counts[t.memorial_id] || 0) + 1; });
      return counts;
    },
    enabled: memorials.length > 0,
  });

  const totalMemorials = memorials.length;
  const totalTributes = Object.values(tributeCounts).reduce((sum, c) => sum + c, 0);
  const publishedCount = memorials.filter((m) => !m.is_draft).length;

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("memorials").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["b2b-memorials"] });
      toast({ title: "Memorial deleted" });
    },
  });

  const handleImport = async () => {
    const lines = csvData.trim().split("\n");
    if (lines.length < 2) {
      toast({ title: "Empty or invalid CSV format", variant: "destructive" });
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
        first_name: record["first_name"] || record["nome"] || "",
        last_name: record["last_name"] || record["cognome"] || "",
        birth_date: record["birth_date"] || record["data_nascita"] || null,
        death_date: record["death_date"] || record["data_morte"] || null,
        bio: record["bio"] || "",
        type: record["type"] || record["tipo"] || "human",
        is_draft: true,
        visibility: "public",
      });
      if (!error) imported++;
    }
    toast({ title: `${imported} memorials imported as drafts` });
    setCsvData("");
    setImportDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ["b2b-memorials"] });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setCsvData(ev.target?.result as string); };
    reader.readAsText(file);
  };

  return (
    <Layout>
      <Helmet><title>B2B Dashboard — Eternal Memory</title></Helmet>
      <div className="container mx-auto py-10 px-4 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Partner Dashboard</h1>
            <p className="text-muted-foreground font-sans">Manage your agency's memorials</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setImportDialogOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />Import CSV
            </Button>
            <Button onClick={() => (window.location.href = "/create")}>
              <Plus className="mr-2 h-4 w-4" />New Memorial
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-sans font-medium text-muted-foreground">Total Memorials</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{totalMemorials}</div>
              <p className="text-xs text-muted-foreground mt-1">{publishedCount} published</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-sans font-medium text-muted-foreground">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">—</div>
              <p className="text-xs text-muted-foreground mt-1">Coming soon</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-sans font-medium text-muted-foreground">Tributes Received</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{totalTributes}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-sans">Your Memorials</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground py-8 text-center">Loading...</p>
            ) : memorials.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">
                No memorials created. Use the "New Memorial" button or import a CSV.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tributes</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {memorials.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell className="font-medium">{m.first_name} {m.last_name}</TableCell>
                        <TableCell><Badge variant="secondary">{m.type}</Badge></TableCell>
                        <TableCell>
                          {m.is_draft ? (
                            <Badge variant="outline">Draft</Badge>
                          ) : (
                            <Badge className="bg-primary text-primary-foreground">Published</Badge>
                          )}
                        </TableCell>
                        <TableCell>{tributeCounts[m.id] || 0}</TableCell>
                        <TableCell>{format(new Date(m.created_at), "dd MMM yyyy", { locale: enUS })}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button size="icon" variant="ghost" onClick={() => (window.location.href = `/memorial/${m.id}`)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(m.id)}>
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

      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Import Memorials from CSV</DialogTitle>
            <DialogDescription>
              Upload a CSV file with columns: first_name, last_name, birth_date (YYYY-MM-DD), death_date, bio, type
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>CSV File</Label>
              <Input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileUpload} />
            </div>
            <div>
              <Label>Or paste CSV content</Label>
              <Textarea value={csvData} onChange={(e) => setCsvData(e.target.value)}
                placeholder="first_name,last_name,birth_date,death_date,bio,type" rows={6} />
            </div>
            <Button onClick={handleImport} disabled={!csvData.trim()}>Import</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default B2BDashboard;
