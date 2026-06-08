// 浏览器端 Supabase 客户端
// 用于 Client Components
// 使用 @supabase/ssr 的 createBrowserClient 以确保 OAuth PKCE 的 code_verifier 存储在 cookie 中

import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr'

let client: ReturnType<typeof createSupabaseBrowserClient> | null = null

export function createBrowserClient() {
  if (client) return client

  client = createSupabaseBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return client
}
