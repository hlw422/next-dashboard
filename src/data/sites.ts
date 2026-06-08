// 网站信息类型定义
export interface SiteInfo {
  id: string
  name: string
  url: string
  description: string
  icon?: string
  created_at?: string
  updated_at?: string
}

// API 基础 URL
const API_BASE = '/api/sites'

// 获取所有网站
export async function fetchSites(): Promise<SiteInfo[]> {
  const response = await fetch(API_BASE)
  if (!response.ok) {
    throw new Error('Failed to fetch sites')
  }
  return response.json()
}

// 创建新网站
export async function createSite(site: Omit<SiteInfo, 'id' | 'created_at' | 'updated_at'>): Promise<SiteInfo> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(site),
  })
  if (!response.ok) {
    throw new Error('Failed to create site')
  }
  return response.json()
}

// 更新网站
export async function updateSite(id: string, site: Omit<SiteInfo, 'id' | 'created_at' | 'updated_at'>): Promise<SiteInfo> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(site),
  })
  if (!response.ok) {
    throw new Error('Failed to update site')
  }
  return response.json()
}

// 删除网站
export async function deleteSite(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Failed to delete site')
  }
}

// 生成唯一 ID（用于本地生成，实际由数据库生成）
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}