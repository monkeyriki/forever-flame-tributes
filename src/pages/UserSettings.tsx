import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { User, Trash2, Shield, BookOpen, Eye } from "lucide-react";

const UserSettings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deletingMemorialId, setDeletingMemorialId] = useState<string | null>(null);

  const { data: memorials = [], isLoading: memorialsLoading } = useQuery({
    queryKey: ["user-memorials", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("memorials")
        .select("id, first_name, last_name, type, created_at, is_draft, visibility")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const handleDeleteMemorial = async (memorialId: string) => {
    setDeletingMemorialId(memorialId);
    try {
      await supabase.from("tributes").delete().eq("memorial_id", memorialId);
      await supabase.from("memorial_images").delete().eq("memorial_id", memorialId);
      const { error } = await supabase.from("memorials").delete().eq("id", memorialId);
      if (error) throw error;
      sonnerToast.success("Memorial deleted");
      queryClient.invalidateQueries({ queryKey: ["user-memorials"] });
    } catch {
      sonnerToast.error("Failed to delete memorial");
    } finally {
      setDeletingMemorialId(null);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE") return;
    if (!user) return;

    setDeleting(true);
    try {
      const { error } = await supabase.rpc("delete_user_account", {
        target_user_id: user.id,
      } as any);

      if (error) throw error;

      await signOut();
      toast({ title: "Account deleted", description: "All your data has been removed." });
      navigate("/");
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">You must sign in to view settings.</p>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Helmet>
        <title>Account Settings – Eternal Memory</title>
      </Helmet>
      <Layout>
        <div className="container mx-auto max-w-2xl px-4 py-12">
          <h1 className="mb-8 font-serif text-3xl font-semibold text-foreground">
            Account Settings
          </h1>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-sans">
                  <User className="mr-2 inline h-5 w-5" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Email</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">User ID</p>
                  <p className="text-xs text-muted-foreground font-mono">{user.id}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-sans">
                  <Shield className="mr-2 inline h-5 w-5" />
                  Privacy & Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  You can request complete deletion of your account and all associated data
                  (memorials, tributes, profile). This action is irreversible.
                </p>
              </CardContent>
            </Card>

            <Card className="border-destructive/30">
              <CardHeader>
                <CardTitle className="text-lg font-sans text-destructive">
                  <Trash2 className="mr-2 inline h-5 w-5" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  Account deletion is permanent. All memorials, received tributes, profile data,
                  and any other associated data will be deleted.
                </p>
                <Button variant="destructive" onClick={() => setDeleteDialog(true)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-destructive">Confirm Deletion</DialogTitle>
              <DialogDescription>
                This action is irreversible. All your data will be permanently deleted.
              </DialogDescription>
            </DialogHeader>
            <div>
              <p className="mb-2 text-sm text-foreground">
                Type <strong>DELETE</strong> to confirm:
              </p>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE"
                className="font-mono"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialog(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={confirmText !== "DELETE" || deleting}
              >
                {deleting ? "Deleting..." : "Delete permanently"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Layout>
    </>
  );
};

export default UserSettings;
