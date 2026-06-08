'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Loader2, User, LogOut, Settings, ChevronDown, Shield } from 'lucide-react'

export function UserMenu() {
  const { user, profile, loading, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await signOut()
    setIsSigningOut(false)
    setIsOpen(false)
  }

  // 获取用户头像或首字母
  const getUserAvatar = () => {
    if (user?.user_metadata?.avatar_url) {
      return (
        <img
          src={user.user_metadata.avatar_url}
          alt="用户头像"
          className="w-8 h-8 rounded-full object-cover"
        />
      )
    }

    const initial = user?.email?.charAt(0).toUpperCase() || 'U'
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
        <span className="text-white text-sm font-bold">{initial}</span>
      </div>
    )
  }

  // 获取角色显示
  const getRoleBadge = () => {
    if (!profile?.role) return null

    const roleColors = {
      admin: 'bg-red-500/20 text-red-400 border-red-500/30',
      editor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      viewer: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    }

    const roleLabels = {
      admin: '管理员',
      editor: '编辑者',
      viewer: '查看者',
    }

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${roleColors[profile.role]}`}>
        <Shield className="h-3 w-3" />
        {roleLabels[profile.role]}
      </span>
    )
  }

  // 加载状态
  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
    )
  }

  // 未登录状态
  if (!user) {
    return (
      <Link href="/auth/login">
        <Button
          variant="outline"
          className="gap-2 px-4 py-2 bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-300"
        >
          <User className="h-4 w-4" />
          登录
        </Button>
      </Link>
    )
  }

  // 已登录状态
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
      >
        {getUserAvatar()}
        <div className="hidden md:block text-left">
          <div className="text-sm text-white font-medium truncate max-w-[100px]">
            {profile?.display_name || user.email?.split('@')[0]}
          </div>
          {getRoleBadge()}
        </div>
        <ChevronDown className={`h-4 w-4 text-white/40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 glass-strong rounded-xl border border-white/10 shadow-xl shadow-black/50 z-50">
          {/* 用户信息 */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              {getUserAvatar()}
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white font-medium truncate">
                  {profile?.display_name || user.email?.split('@')[0]}
                </div>
                <div className="text-xs text-white/40 truncate">
                  {user.email}
                </div>
                {getRoleBadge()}
              </div>
            </div>
          </div>

          {/* 菜单选项 */}
          <div className="p-2">
            {profile?.role === 'admin' && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span className="text-sm">管理后台</span>
              </Link>
            )}

            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors disabled:opacity-50"
            >
              {isSigningOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              <span className="text-sm">退出登录</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
