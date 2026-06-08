'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createBrowserClient } from '@/lib/supabase/client'
import { UserProfile, UserRole } from '@/types/auth'
import { canManageUsers, getRoleDisplayName, getRoleColor } from '@/lib/permissions'
import { Button } from '@/components/ui/button'
import { Loader2, Users, Shield, ArrowLeft, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function AdminPage() {
  const { user, profile, loading: authLoading } = useAuth()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createBrowserClient()

  // 检查权限
  useEffect(() => {
    if (!authLoading && (!user || !canManageUsers(profile?.role))) {
      router.push('/')
    }
  }, [user, profile, authLoading, router])

  // 加载用户列表
  useEffect(() => {
    if (user && canManageUsers(profile?.role)) {
      loadUsers()
    }
  }, [user, profile])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await (supabase
        .from('user_profiles') as any)
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) {
        throw fetchError
      }

      setUsers(data || [])
    } catch (err) {
      console.error('Error loading users:', err)
      setError('加载用户列表失败')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const { error: updateError } = await (supabase
        .from('user_profiles') as any)
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', userId)

      if (updateError) {
        throw updateError
      }

      // 更新本地状态
      setUsers(prev =>
        prev.map(u =>
          u.id === userId ? { ...u, role: newRole } : u
        )
      )
    } catch (err) {
      console.error('Error updating role:', err)
      setError('更新角色失败')
    }
  }

  // 加载中
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  // 无权限
  if (!user || !canManageUsers(profile?.role)) {
    return null
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
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* 头部 */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-4">
                <Shield className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-white/60 font-mono">ADMIN PANEL</span>
              </div>

              <h1 className="text-3xl font-bold text-white mb-2">用户管理</h1>
              <p className="text-white/40">管理系统用户和角色权限</p>
            </div>

            <Button
              onClick={loadUsers}
              variant="outline"
              className="gap-2 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
            >
              <RefreshCw className="h-4 w-4" />
              刷新
            </Button>
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center">
            {error}
          </div>
        )}

        {/* 用户统计 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glass-strong rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-white">{users.length}</div>
                <div className="text-sm text-white/40">总用户数</div>
              </div>
            </div>
          </div>

          <div className="glass-strong rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-red-400" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {users.filter(u => u.role === 'admin').length}
                </div>
                <div className="text-sm text-white/40">管理员</div>
              </div>
            </div>
          </div>

          <div className="glass-strong rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {users.filter(u => u.role === 'editor').length}
                </div>
                <div className="text-sm text-white/40">编辑者</div>
              </div>
            </div>
          </div>
        </div>

        {/* 用户列表 */}
        <div className="glass-strong rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white">用户列表</h2>
          </div>

          <div className="divide-y divide-white/10">
            {users.map(userItem => (
              <div
                key={userItem.id}
                className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* 头像 */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {userItem.email.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* 用户信息 */}
                  <div>
                    <div className="text-white font-medium">
                      {userItem.display_name || userItem.email.split('@')[0]}
                    </div>
                    <div className="text-sm text-white/40">{userItem.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* 角色标签 */}
                  <span className={`text-sm font-medium ${getRoleColor(userItem.role)}`}>
                    {getRoleDisplayName(userItem.role)}
                  </span>

                  {/* 角色选择器 */}
                  <select
                    value={userItem.role}
                    onChange={(e) => handleRoleChange(userItem.id, e.target.value as UserRole)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-purple-500/50"
                  >
                    <option value="viewer">查看者</option>
                    <option value="editor">编辑者</option>
                    <option value="admin">管理员</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* 空状态 */}
          {users.length === 0 && (
            <div className="p-8 text-center text-white/40">
              暂无用户
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
