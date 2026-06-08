import { SiteInfo } from "@/data/sites";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { SiteDialogTrigger } from "./site-dialog";

interface SiteCardProps {
  site: SiteInfo;
  onDelete?: (id: string) => void;
  onEdit?: (site: SiteInfo) => void;
}

export function SiteCard({ site, onDelete, onEdit }: SiteCardProps) {
  return (
    <div className="block group relative">
      <a
        href={site.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/20 cursor-pointer">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              {site.icon && (
                <span className="text-2xl">{site.icon}</span>
              )}
              <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                {site.name}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <CardDescription className="text-sm text-muted-foreground leading-relaxed">
              {site.description}
            </CardDescription>
            <div className="mt-4">
              <Badge variant="secondary" className="font-mono text-xs">
                {site.url}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </a>
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onEdit && (
          <SiteDialogTrigger
            mode="edit"
            site={site}
            onSave={onEdit}
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
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
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(site.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}