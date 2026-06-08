// 认证相关类型定义

import { User } from '@supabase/supabase-js'

// 用户角色类型
export type UserRole = 'admin' | 'editor' | 'viewer'

// 用户配置接口
export interface UserProfile {
  id: string
  email: string
  role: UserRole
  display_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

// 认证上下文类型
export interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  signInWithOAuth: (provider: 'github' | 'google') => Promise<void>
  resetPassword: (email: string) => Promise<{ error?: string }>
  refreshProfile: () => Promise<void>
}

// API 认证响应类型
export interface AuthApiResponse {
  success: boolean
  error?: string
  user?: User
  profile?: UserProfile
}
