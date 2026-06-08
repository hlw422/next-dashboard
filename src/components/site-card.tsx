import { SiteInfo } from "@/data/sites";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink } from "lucide-react";
import { SiteDialogTrigger } from "./site-dialog";

interface SiteCardProps {
  site: SiteInfo;
  onDelete?: (id: string) => void;
  onEdit?: (site: SiteInfo) => void;
}

export function SiteCard({ site, onDelete, onEdit }: SiteCardProps) {
  return (
    <div className="group relative">
      <a
        href={site.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <Card className="h-full bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.15] transition-all duration-500 ease-out overflow-hidden relative">
          {/* 悬停时的渐变背景 */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* 顶部装饰线 */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader className="pb-4 relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {site.icon && (
                  <div className="text-3xl p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors duration-300">
                    {site.icon}
                  </div>
                )}
                <div>
                  <CardTitle className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors duration-300">
                    {site.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge 
                      variant="secondary" 
                      className="font-mono text-xs bg-white/5 text-white/50 border-white/10 group-hover:bg-white/10 group-hover:text-white/70 transition-colors duration-300"
                    >
                      {new URL(site.url).hostname}
                    </Badge>
                    <ExternalLink className="h-3 w-3 text-white/20 group-hover:text-white/40 transition-colors duration-300" />
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pb-6 relative z-10">
            <CardDescription className="text-sm text-white/40 leading-relaxed group-hover:text-white/60 transition-colors duration-300">
              {site.description}
            </CardDescription>
            
            {/* 底部装饰 */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500/50 group-hover:bg-green-500 transition-colors duration-300" />
                <span className="text-xs text-white/30 group-hover:text-white/50 transition-colors duration-300">
                  Active
                </span>
              </div>
              <div className="text-xs text-white/20 group-hover:text-white/40 transition-colors duration-300 font-mono">
                {site.url.split('//')[1]?.split('/')[0]}
              </div>
            </div>
          </CardContent>
          
          {/* 悬停时的光效 */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        </Card>
      </a>
      
      {/* 操作按钮 */}
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        {onEdit && (
          <SiteDialogTrigger
            mode="edit"
            site={site}
            onSave={onEdit}
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-black/50 backdrop-blur-sm text-white/60 hover:text-white hover:bg-white/20 border border-white/10"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
            </Button>
          </SiteDialogTrigger>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-black/50 backdrop-blur-sm text-white/60 hover:text-red-400 hover:bg-red-500/20 border border-white/10"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(site.id);
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}