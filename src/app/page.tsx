"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { SiteCard } from "@/components/site-card";
import { SiteDialogTrigger } from "@/components/site-dialog";
import { Button } from "@/components/ui/button";
import { SiteInfo, fetchSites, createSite, updateSite, deleteSite } from "@/data/sites";
import { Plus, Loader2 } from "lucide-react";

export default function Home() {
  const [sites, setSites] = useState<SiteInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 从 API 加载数据
  useEffect(() => {
    loadSites();
  }, []);

  const loadSites = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchSites();
      setSites(data);
    } catch (err) {
      console.error("Failed to load sites:", err);
      setError("加载网站列表失败，请检查数据库连接");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSite = async (newSite: SiteInfo) => {
    try {
      const created = await createSite({
        name: newSite.name,
        url: newSite.url,
        description: newSite.description,
        icon: newSite.icon,
      });
      setSites(prev => [created, ...prev]);
    } catch (err) {
      console.error("Failed to create site:", err);
      setError("添加网站失败，请重试");
    }
  };

  const handleEditSite = async (updatedSite: SiteInfo) => {
    try {
      const updated = await updateSite(updatedSite.id, {
        name: updatedSite.name,
        url: updatedSite.url,
        description: updatedSite.description,
        icon: updatedSite.icon,
      });
      setSites(prev => prev.map(site => 
        site.id === updated.id ? updated : site
      ));
    } catch (err) {
      console.error("Failed to update site:", err);
      setError("更新网站失败，请重试");
    }
  };

  const handleDeleteSite = async (id: string) => {
    try {
      await deleteSite(id);
      setSites(prev => prev.filter(site => site.id !== id));
    } catch (err) {
      console.error("Failed to delete site:", err);
      setError("删除网站失败，请重试");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>加载中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pb-12">
        {error && (
          <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-md text-sm">
            {error}
          </div>
        )}
        <div className="flex justify-end mb-6">
          <SiteDialogTrigger mode="add" onSave={handleAddSite}>
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              添加网站
            </Button>
          </SiteDialogTrigger>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((site) => (
            <SiteCard
              key={site.id}
              site={site}
              onDelete={handleDeleteSite}
              onEdit={handleEditSite}
            />
          ))}
        </div>
      </main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>网站导航门户 &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}