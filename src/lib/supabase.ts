import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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