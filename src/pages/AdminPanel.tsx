import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  Shield,
  MessageSquare,
  Settings,
  Trash2,
  CheckCircle,
  BookOpen,
} from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";

const AdminPanel = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [adsenseCode, setAdsenseCode] = useState("");

  // Fetch all profiles
  const { data: profiles = [], isLoading: profilesLoading } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch all tributes for moderation
  const { data: tributes = [], isLoading: tributesLoading } = useQuery({
    queryKey: ["admin-tributes"],
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

  // Stats
  const { data: memorialCount = 0 } = useQuery({
    queryKey: ["admin-memorial-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("memorials")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  // Change user role
  const changeRoleMutation = useMutation({
    mutationFn: async ({
      userId,
      newRole,
    }: {
      userId: string;
      newRole: string;
    }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole as any })
        .eq("id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-profiles"] });
      toast({ title: "Ruolo aggiornato" });
    },
    onError: (err: any) => {
      toast({ title: "Errore", description: err.message, variant: "destructive" });
    },
  });

  // Delete tribute
  const deleteTributeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tributes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tributes"] });
      toast({ title: "Tributo eliminato" });
    },
  });

  const handleSaveAdsense = () => {
    localStorage.setItem("adsense_code", adsenseCode);
    toast({ title: "Codice AdSense salvato" });
  };

  return (
    <Layout>
      <Helmet>
        <title>Admin Panel — Eternal Memory</title>
      </Helmet>

      <div className="container mx-auto py-10 px-4 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Pannello Super Admin
          </h1>
          <p className="text-muted-foreground font-sans">
            Gestione globale della piattaforma
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-sans font-medium text-muted-foreground">
                Utenti
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {profiles.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-sans font-medium text-muted-foreground">
                Memoriali
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {memorialCount}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-sans font-medium text-muted-foreground">
                Tributi
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {tributes.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-sans font-medium text-muted-foreground">
                Admin
              </CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {profiles.filter((p) => p.role === "admin").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">
              <Users className="mr-2 h-4 w-4" />
              Utenti
            </TabsTrigger>
            <TabsTrigger value="moderation">
              <MessageSquare className="mr-2 h-4 w-4" />
              Moderazione
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="mr-2 h-4 w-4" />
              Impostazioni
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-sans">
                  Gestione Utenti
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profilesLoading ? (
                  <p className="text-muted-foreground py-8 text-center">
                    Caricamento...
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Ruolo</TableHead>
                          <TableHead>Registrato</TableHead>
                          <TableHead className="text-right">Azioni</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {profiles.map((p) => (
                          <TableRow key={p.id}>
                            <TableCell className="font-medium">
                              {p.full_name || "—"}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  p.role === "admin"
                                    ? "default"
                                    : p.role === "b2b_partner"
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                {p.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {format(new Date(p.created_at), "dd MMM yyyy", {
                                locale: it,
                              })}
                            </TableCell>
                            <TableCell className="text-right">
                              <Select
                                defaultValue={p.role}
                                onValueChange={(val) =>
                                  changeRoleMutation.mutate({
                                    userId: p.id,
                                    newRole: val,
                                  })
                                }
                              >
                                <SelectTrigger className="w-[140px] inline-flex">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="registered">
                                    Registered
                                  </SelectItem>
                                  <SelectItem value="b2b_partner">
                                    B2B Partner
                                  </SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Moderation Tab */}
          <TabsContent value="moderation">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-sans">
                  Coda di Moderazione Tributi
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tributesLoading ? (
                  <p className="text-muted-foreground py-8 text-center">
                    Caricamento...
                  </p>
                ) : tributes.length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center">
                    Nessun tributo da moderare.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Mittente</TableHead>
                          <TableHead>Memoriale</TableHead>
                          <TableHead>Messaggio</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead className="text-right">Azioni</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tributes.map((t: any) => (
                          <TableRow key={t.id}>
                            <TableCell className="font-medium">
                              {t.sender_name}
                            </TableCell>
                            <TableCell>
                              {t.memorials
                                ? `${t.memorials.first_name} ${t.memorials.last_name}`
                                : "—"}
                            </TableCell>
                            <TableCell className="max-w-[300px] truncate">
                              {t.message || "—"}
                            </TableCell>
                            <TableCell>
                              {format(new Date(t.created_at), "dd MMM yyyy", {
                                locale: it,
                              })}
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() =>
                                  deleteTributeMutation.mutate(t.id)
                                }
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
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-sans">
                  Google AdSense
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Codice AdSense</Label>
                  <Input
                    value={adsenseCode}
                    onChange={(e) => setAdsenseCode(e.target.value)}
                    placeholder='<script async src="https://pagead2.googlesyndication.com/..."></script>'
                    className="font-mono text-xs"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Incolla il codice fornito da Google AdSense. Verrà
                    attivato globalmente.
                  </p>
                </div>
                <Button onClick={handleSaveAdsense}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Salva
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminPanel;
