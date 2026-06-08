"use client";

import { useState, useEffect, useRef } from "react";
import { SiteCard } from "@/components/site-card";
import { SiteDialogTrigger } from "@/components/site-dialog";
import { Button } from "@/components/ui/button";
import { SiteInfo, fetchSites, createSite, updateSite, deleteSite } from "@/data/sites";
import { useAuth } from "@/contexts/AuthContext";
import { UserMenu } from "@/components/auth/UserMenu";
import { Plus, Loader2, GitBranch, ExternalLink, LogIn } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [sites, setSites] = useState<SiteInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const { user, profile } = useAuth();

  // 鼠标跟踪效果
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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

  // 检查用户是否有管理权限
  const canManage = user && profile && ['admin', 'editor'].includes(profile.role);
  const canDelete = user && profile && profile.role === 'admin';
  
  // 未登录只显示3个网站
  const GUEST_LIMIT = 3;
  const displayedSites = user ? sites : sites.slice(0, GUEST_LIMIT);
  const hasMoreSites = !user && sites.length > GUEST_LIMIT;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
        {/* 背景动画 */}
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="relative z-10 text-center">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-purple-500 mx-auto" />
            <div className="absolute inset-0 h-12 w-12 bg-purple-500/30 rounded-full blur-xl animate-pulse" />
          </div>
          <p className="mt-6 text-lg text-white/60 font-light tracking-wider">
            LOADING...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      {/* 背景效果 */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute inset-0 noise" />
      
      {/* 动态背景光效 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl animate-float delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* 导航栏 */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="text-white/80 font-mono text-sm font-semibold">WEBSITE PORTAL</span>
          </Link>

          {/* 用户菜单 */}
          <UserMenu />
        </div>
      </nav>

      {/* Hero 区域 */}
      <div 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center px-4 pt-16"
      >
        {/* 鼠标跟随光效 */}
        <div
          className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.15), transparent 50%)`,
            transform: 'translate(-50%, -50%)',
            left: mousePosition.x,
            top: mousePosition.y,
          }}
        />
        
        <div className="relative z-10 text-center max-w-6xl mx-auto">
          {/* 装饰元素 */}
          <div className="absolute -top-20 -left-20 w-40 h-40 border border-white/10 rounded-full animate-spin-slow" />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 border border-purple-500/20 rounded-full animate-spin-slow-reverse" />
          
          {/* 主标题 */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-white/60 font-mono">SYSTEM ONLINE</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-none mb-6">
              <span className="block text-white">WEBSITE</span>
              <span className="block animate-text-gradient">PORTAL</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/40 font-light max-w-2xl mx-auto leading-relaxed">
              集中管理和快速访问您常用的开发资源和工具网站
            </p>
          </div>

          {/* 统计信息 */}
          <div className="flex justify-center gap-12 mb-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">{sites.length}</div>
              <div className="text-sm text-white/40 uppercase tracking-wider">Websites</div>
            </div>
            <div className="w-px h-16 bg-white/10" />
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">∞</div>
              <div className="text-sm text-white/40 uppercase tracking-wider">Possibilities</div>
            </div>
            <div className="w-px h-16 bg-white/10" />
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-sm text-white/40 uppercase tracking-wider">Access</div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-center gap-4">
            {canManage ? (
              <SiteDialogTrigger mode="add" onSave={handleAddSite}>
                <Button 
                  variant="outline" 
                  className="gap-2 px-8 py-6 text-lg bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-300 group"
                >
                  <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-30" />
                  添加网站
                </Button>
              </SiteDialogTrigger>
            ) : (
              <Link href="/auth/login">
                <Button 
                  variant="outline" 
                  className="gap-2 px-8 py-6 text-lg bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-300 group"
                >
                  <LogIn className="h-5 w-5" />
                  登录以管理
                </Button>
              </Link>
            )}
            
            <Button 
              variant="ghost" 
              className="gap-2 px-8 py-6 text-lg text-white/60 hover:text-white hover:bg-white/5 transition-all duration-300"
              onClick={() => {
                const element = document.getElementById('sites-grid');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <ExternalLink className="h-5 w-5" />
              浏览全部
            </Button>
          </div>

          {/* 滚动提示 */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/40 rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* 网站网格区域 */}
      <div id="sites-grid" className="relative z-10 px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* 区域标题 */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6">
              <span className="text-sm text-white/60 font-mono">COLLECTION</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              网站收藏
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto">
              精心挑选的开发资源和工具，提升您的工作效率
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center backdrop-blur-sm">
              {error}
            </div>
          )}

          {/* 网站网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedSites.map((site, index) => (
              <div 
                key={site.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <SiteCard
                  site={site}
                  onDelete={canDelete ? handleDeleteSite : undefined}
                  onEdit={canManage ? handleEditSite : undefined}
                />
              </div>
            ))}
            
            {/* 未登录时显示登录提示卡片 */}
            {hasMoreSites && (
              <div className="animate-fade-in-up" style={{ animationDelay: `${displayedSites.length * 100}ms` }}>
                <Link href="/auth/login">
                  <div className="h-full min-h-[200px] rounded-xl border-2 border-dashed border-white/20 bg-white/5 backdrop-blur-sm flex flex-col items-center justify-center gap-4 hover:border-white/40 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                      <LogIn className="h-6 w-6 text-white/60 group-hover:text-white transition-colors" />
                    </div>
                    <div className="text-center">
                      <p className="text-white/60 font-medium mb-1">登录查看更多</p>
                      <p className="text-white/40 text-sm">还有 {sites.length - GUEST_LIMIT} 个网站</p>
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* 空状态 */}
          {sites.length === 0 && !error && (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                <Plus className="h-12 w-12 text-white/20" />
              </div>
              <h3 className="text-xl text-white/60 mb-2">暂无网站</h3>
              <p className="text-white/40 mb-6">
                {canManage ? '点击上方按钮添加您的第一个网站' : '登录后即可添加网站'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 页脚 */}
      <footer className="relative z-10 border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="text-white/60 font-mono text-sm">WEBSITE PORTAL</span>
            </div>
            
            <div className="flex items-center gap-6">
              <a 
                href="https://github.com/hlw422/next-dashboard" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors"
              >
                <GitBranch className="h-5 w-5" />
              </a>
              <span className="text-white/20">|</span>
              <span className="text-white/40 text-sm">
                &copy; {new Date().getFullYear()} Website Portal
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
