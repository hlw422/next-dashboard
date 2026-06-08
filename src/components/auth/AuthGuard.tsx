'use client'

import { useAuth } from '@/contexts/AuthContext'
import { UserRole } from '@/types/auth'
import { Loader2 } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  requiredRole?: UserRole
  showLoading?: boolean
}

export function AuthGuard({
  children,
  fallback = null,
  requiredRole,
  showLoading = true,
}: AuthGuardProps) {
  const { user, profile, loading } = useAuth()

  // 加载状态
  if (loading) {
    if (!showLoading) return null
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
      </div>
    )
  }

  // 未登录
  if (!user) {
    return <>{fallback}</>
  }

  // 需要特定角色
  if (requiredRole && profile?.role !== requiredRole) {
    // 管理员可以访问所有内容
    if (profile?.role === 'admin') {
      return <>{children}</>
    }
    return <>{fallback}</>
  }

  return <>{children}</>
}

// 便捷的角色守卫组件
export function AdminGuard({
  children,
  fallback = null,
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  return (
    <AuthGuard requiredRole="admin" fallback={fallback}>
      {children}
    </AuthGuard>
  )
}

export function EditorGuard({
  children,
  fallback = null,
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  return (
    <AuthGuard requiredRole="editor" fallback={fallback}>
      {children}
    </AuthGuard>
  )
}
