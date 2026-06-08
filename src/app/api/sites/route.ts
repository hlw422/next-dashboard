import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { SITES_TABLE } from '@/lib/supabase'

// GET - 获取所有网站
export async function GET() {
  try {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from(SITES_TABLE)
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching sites:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sites' },
      { status: 500 }
    )
  }
}

// POST - 创建新网站
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const body = await request.json()
    const { name, url, description, icon } = body

    // 验证必填字段
    if (!name || !url || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 确保 URL 有协议前缀
    let formattedUrl = url
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl
    }

    const { data, error } = await supabase
      .from(SITES_TABLE)
      .insert([
        {
          name,
          url: formattedUrl,
          description,
          icon: icon || null,
        },
      ])
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating site:', error)
    return NextResponse.json(
      { error: 'Failed to create site' },
      { status: 500 }
    )
  }
}
