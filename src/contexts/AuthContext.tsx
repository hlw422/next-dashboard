'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { createBrowserClient } from '@/lib/supabase/client'
import { AuthContextType, UserProfile } from '@/types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient()

  // 获取用户配置
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      // 先检查用户是否已认证
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        console.warn('No authenticated user when fetching profile')
        return null
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.error('Error fetching profile:', JSON.stringify(error, null, 2))
        return null
      }

      // 如果配置文件不存在（触发器可能未执行），尝试创建
      if (!data) {
        console.log('Profile not found, creating new profile for:', userId)
        const email = authUser.email ?? ''

        const { data: newProfile, error: insertError } = await supabase
          .from('user_profiles')
          .insert({ id: userId, email, role: 'editor' })
          .select()
          .single()

        if (insertError) {
          console.error('Error creating profile:', JSON.stringify(insertError, null, 2))
          return null
        }

        return newProfile as UserProfile
      }

      return data as UserProfile
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  }, [supabase])

  // 刷新用户配置
  const refreshProfile = useCallback(async () => {
    if (user) {
      const newProfile = await fetchProfile(user.id)
      setProfile(newProfile)
    }
  }, [user, fetchProfile])

  // 初始化认证状态
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user: initialUser } } = await supabase.auth.getUser()
        setUser(initialUser)

        if (initialUser) {
          const userProfile = await fetchProfile(initialUser.id)
          setProfile(userProfile)
        }
      } catch (error) {
        console.error('Error getting user:', error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null
        setUser(currentUser)

        if (currentUser) {
          const userProfile = await fetchProfile(currentUser.id)
          setProfile(userProfile)
        } else {
          setProfile(null)
        }

        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth, fetchProfile])

  // 邮箱密码登录
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error) {
      return { error: '登录失败，请重试' }
    }
  }

  // 邮箱密码注册
  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error) {
      return { error: '注册失败，请重试' }
    }
  }

  // 登出
  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  // 第三方 OAuth 登录
  const signInWithOAuth = async (provider: 'github' | 'google') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  // 重置密码
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error) {
      return { error: '重置密码失败，请重试' }
    }
  }

  const value: AuthContextType = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithOAuth,
    resetPassword,
    refreshProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
