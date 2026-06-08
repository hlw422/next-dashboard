'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const result = await resetPassword(email)

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {success ? (
          /* 成功状态 */
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>

            <h1 className="text-xl font-semibold text-white mb-2">邮件已发送</h1>
            <p className="text-sm text-white/50 mb-6">
              已向 <span className="text-white/70">{email}</span> 发送重置链接
            </p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setSuccess(false)
                  setEmail('')
                }}
                className="w-full py-2.5 bg-white/5 border border-white/10 rounded text-white text-sm hover:bg-white/10 transition-colors"
              >
                重新发送
              </button>

              <Link
                href="/auth/login"
                className="block w-full py-2.5 text-center text-white/40 text-sm hover:text-white/60 transition-colors"
              >
                返回登录
              </Link>
            </div>
          </div>
        ) : (
          /* 表单状态 */
          <>
            <div className="text-center mb-8">
              <Link href="/" className="text-2xl font-bold text-white">
                WebVault
              </Link>
              <p className="mt-2 text-sm text-white/50">重置密码</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm text-white/60 mb-1.5">
                    邮箱地址
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-white text-black text-sm font-medium rounded hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      发送中...
                    </span>
                  ) : (
                    '发送重置链接'
                  )}
                </button>
              </form>
            </div>

            <p className="mt-6 text-center text-sm text-white/40">
              <Link href="/auth/login" className="text-white/60 hover:text-white transition-colors">
                返回登录
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
