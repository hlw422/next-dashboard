"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteInfo, generateId } from "@/data/sites";
import { Plus, Pencil } from "lucide-react";

interface SiteDialogProps {
  mode: "add" | "edit";
  site?: SiteInfo;
  onSave: (site: SiteInfo) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SiteDialog({ mode, site, onSave, open: controlledOpen, onOpenChange: controlledOnOpenChange }: SiteDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    description: "",
    icon: "",
  });

  // 使用受控或非受控的 open 状态
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  // 当编辑模式且 site 变化时，初始化表单数据
  useEffect(() => {
    if (mode === "edit" && site) {
      setFormData({
        name: site.name,
        url: site.url,
        description: site.description,
        icon: site.icon || "",
      });
    } else {
      setFormData({ name: "", url: "", description: "", icon: "" });
    }
  }, [mode, site]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // 验证必填字段
    if (!formData.name || !formData.url || !formData.description) {
      return;
    }

    // 确保 URL 有协议前缀
    let url = formData.url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    // 创建或更新网站对象
    const siteData: SiteInfo = {
      id: mode === "edit" && site ? site.id : generateId(),
      name: formData.name,
      url: url,
      description: formData.description,
      icon: formData.icon || undefined,
    };

    onSave(siteData);
    setFormData({ name: "", url: "", description: "", icon: "" });
    setOpen(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {mode === "add" ? "添加新网站" : "编辑网站"}
            </DialogTitle>
            <DialogDescription>
              {mode === "add" 
                ? "填写网站信息，添加到您的导航门户中。"
                : "修改网站信息。"
              }
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                名称 *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="例如：GitHub"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right">
                URL *
              </Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => handleChange("url", e.target.value)}
                placeholder="例如：github.com"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="icon" className="text-right">
                图标
              </Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => handleChange("icon", e.target.value)}
                placeholder="可选，如 🐙"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                描述 *
              </Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="简要描述网站功能"
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              {mode === "add" ? "添加网站" : "保存修改"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// 触发器组件，用于打开对话框
export function SiteDialogTrigger({ 
  mode, 
  site, 
  onSave, 
  children 
}: SiteDialogProps & { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  };

  return (
    <>
      <div 
        onClick={handleClick} 
        className="relative z-20"
        style={{ display: 'contents' }}
      >
        {children}
      </div>
      <SiteDialog
        mode={mode}
        site={site}
        onSave={onSave}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}