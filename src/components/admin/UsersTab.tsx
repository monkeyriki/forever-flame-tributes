import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Ban, Shield, Users } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { useState } from "react";

const UsersTab = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [banDialog, setBanDialog] = useState<{ open: boolean; email: string }>({ open: false, email: "" });
  const [banReason, setBanReason] = useState("");

  const { data: profiles = [], isLoading } = useQuery({
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

  const { data: bannedUsers = [] } = useQuery({
    queryKey: ["banned_users"],
    queryFn: async () => {
      const { data } = await supabase.from("banned_users" as any).select("*").order("created_at", { ascending: false });
      return (data as any[]) || [];
    },
  });

  const changeRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: string }) => {
      const { error } = await supabase.from("profiles").update({ role: newRole as any }).eq("id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-profiles"] });
      toast({ title: "Ruolo aggiornato" });
    },
    onError: (err: any) => toast({ title: "Errore", description: err.message, variant: "destructive" }),
  });

  const banMutation = useMutation({
    mutationFn: async ({ email, reason }: { email: string; reason: string }) => {
      const { error } = await supabase.from("banned_users" as any).insert({ email, reason } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["banned_users"] });
      setBanDialog({ open: false, email: "" });
      setBanReason("");
      toast({ title: "Utente bannato" });
    },
    onError: (e: any) => toast({ title: "Errore", description: e.message, variant: "destructive" }),
  });

  const unbanMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("banned_users" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["banned_users"] });
      toast({ title: "Ban rimosso" });
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-sans">
            <Users className="mr-2 inline h-5 w-5" />
            Gestione Utenti
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">Caricamento...</p>
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
                      <TableCell className="font-medium">{p.full_name || "—"}</TableCell>
                      <TableCell>
                        <Badge variant={p.role === "admin" ? "default" : p.role === "b2b_partner" ? "secondary" : "outline"}>
                          {p.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(p.created_at), "dd MMM yyyy", { locale: it })}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Select defaultValue={p.role} onValueChange={(val) => changeRoleMutation.mutate({ userId: p.id, newRole: val })}>
                          <SelectTrigger className="w-[140px] inline-flex">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="registered">Registered</SelectItem>
                            <SelectItem value="b2b_partner">B2B Partner</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setBanDialog({ open: true, email: p.full_name || p.id })}
                        >
                          <Ban className="mr-1 h-3 w-3" /> Ban
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

      {/* Banned users */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-sans">
            <Shield className="mr-2 inline h-5 w-5 text-destructive" />
            Utenti Bannati ({bannedUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bannedUsers.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">Nessun utente bannato</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bannedUsers.map((b: any) => (
                    <TableRow key={b.id}>
                      <TableCell className="font-medium">{b.email}</TableCell>
                      <TableCell>{b.reason || "—"}</TableCell>
                      <TableCell>{format(new Date(b.created_at), "dd MMM yyyy", { locale: it })}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => unbanMutation.mutate(b.id)}>
                          Rimuovi Ban
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

      <Dialog open={banDialog.open} onOpenChange={(o) => setBanDialog({ ...banDialog, open: o })}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Banna Utente</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Email da bannare</label>
              <Input
                value={banDialog.email}
                onChange={(e) => setBanDialog((d) => ({ ...d, email: e.target.value }))}
                placeholder="email@esempio.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Motivo</label>
              <Input value={banReason} onChange={(e) => setBanReason(e.target.value)} placeholder="Motivo del ban..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBanDialog({ open: false, email: "" })}>Annulla</Button>
            <Button
              variant="destructive"
              onClick={() => banDialog.email && banMutation.mutate({ email: banDialog.email, reason: banReason })}
            >
              Conferma Ban
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersTab;
