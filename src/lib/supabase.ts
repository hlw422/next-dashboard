// Supabase 客户端配置
// 保留此文件以保持向后兼容性
// 新代码请使用 @/lib/supabase/server 或 @/lib/supabase/client

export { createServerClient } from './supabase/server'
export { createBrowserClient } from './supabase/client'

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

// 数据库表名
export const SITES_TABLE = 'sites'
export const USER_PROFILES_TABLE = 'user_profiles'
