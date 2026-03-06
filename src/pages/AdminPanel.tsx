import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, MessageSquare, Settings, Package, BarChart3, Shield, BookOpen } from "lucide-react";
import UsersTab from "@/components/admin/UsersTab";
import StoreItemsTab from "@/components/admin/StoreItemsTab";
import ModerationTab from "@/components/admin/ModerationTab";
import PlansSettingsTab from "@/components/admin/PlansSettingsTab";
import RevenueTab from "@/components/admin/RevenueTab";

const AdminPanel = () => {
  const { data: profiles = [] } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: memorialCount = 0 } = useQuery({
    queryKey: ["admin-memorial-count"],
    queryFn: async () => {
      const { count, error } = await supabase.from("memorials").select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: tributeCount = 0 } = useQuery({
    queryKey: ["admin-tribute-count"],
    queryFn: async () => {
      const { count, error } = await supabase.from("tributes").select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: flaggedCount = 0 } = useQuery({
    queryKey: ["admin-flagged-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("tributes")
        .select("*", { count: "exact", head: true })
        .eq("status", "flagged" as any);
      if (error) throw error;
      return count || 0;
    },
  });

  return (
    <Layout>
      <Helmet>
        <title>Admin Panel — Eternal Memory</title>
      </Helmet>

      <div className="container mx-auto py-10 px-4 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pannello Super Admin</h1>
          <p className="text-muted-foreground font-sans">Gestione globale della piattaforma</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-sans font-medium text-muted-foreground">Utenti</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-3xl font-bold text-foreground">{profiles.length}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-sans font-medium text-muted-foreground">Memoriali</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-3xl font-bold text-foreground">{memorialCount}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-sans font-medium text-muted-foreground">Tributi</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-3xl font-bold text-foreground">{tributeCount}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-sans font-medium text-muted-foreground">Segnalati</CardTitle>
              <Shield className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent><div className="text-3xl font-bold text-destructive">{flaggedCount}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-sans font-medium text-muted-foreground">Admin</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-3xl font-bold text-foreground">{profiles.filter((p) => p.role === "admin").length}</div></CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="users"><Users className="mr-1 h-4 w-4" />Utenti</TabsTrigger>
            <TabsTrigger value="store"><Package className="mr-1 h-4 w-4" />Store</TabsTrigger>
            <TabsTrigger value="moderation"><MessageSquare className="mr-1 h-4 w-4" />Moderazione</TabsTrigger>
            <TabsTrigger value="settings"><Settings className="mr-1 h-4 w-4" />Piani & Ads</TabsTrigger>
            <TabsTrigger value="revenue"><BarChart3 className="mr-1 h-4 w-4" />Ricavi</TabsTrigger>
          </TabsList>

          <TabsContent value="users"><UsersTab /></TabsContent>
          <TabsContent value="store"><StoreItemsTab /></TabsContent>
          <TabsContent value="moderation"><ModerationTab /></TabsContent>
          <TabsContent value="settings"><PlansSettingsTab /></TabsContent>
          <TabsContent value="revenue"><RevenueTab /></TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminPanel;
