-- ============================================
-- 网站导航门户数据库架构
-- ============================================

-- 创建网站信息表
CREATE TABLE IF NOT EXISTS sites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_sites_updated_at ON sites;
CREATE TRIGGER update_sites_updated_at
  BEFORE UPDATE ON sites
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 用户认证相关表
-- ============================================

-- 创建用户角色枚举类型
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'editor', 'viewer');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 创建用户配置表（关联 Supabase Auth）
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  role user_role DEFAULT 'viewer' NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建用户配置更新时间触发器
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 创建函数：新用户注册时自动创建配置
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'editor');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器：新用户注册时自动创建配置
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 插入默认数据
-- ============================================

INSERT INTO sites (name, url, description, icon) VALUES
  ('GitHub', 'https://github.com', '全球最大的代码托管平台，用于版本控制和协作开发', '🐙'),
  ('Stack Overflow', 'https://stackoverflow.com', '程序员问答社区，解决编程问题的首选平台', '📚'),
  ('MDN Web Docs', 'https://developer.mozilla.org', 'Web 开发技术的权威文档和学习资源', '📖'),
  ('Vercel', 'https://vercel.com', '现代前端部署平台，支持 Next.js 等框架的一键部署', '▲'),
  ('Tailwind CSS', 'https://tailwindcss.com', '实用优先的 CSS 框架，快速构建现代化用户界面', '🎨'),
  ('shadcn/ui', 'https://ui.shadcn.com', '可复用的组件库，基于 Radix UI 和 Tailwind CSS', '🧩')
ON CONFLICT DO NOTHING;

-- ============================================
-- 行级安全策略 (RLS)
-- ============================================

-- 创建安全函数：获取当前用户角色（避免 RLS 递归）
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM user_profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 启用 RLS
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Sites 表策略
-- 读取：所有人可访问
DROP POLICY IF EXISTS "Allow public read on sites" ON sites;
CREATE POLICY "Allow public read on sites" ON sites
  FOR SELECT USING (true);

-- 写入：仅认证用户
DROP POLICY IF EXISTS "Allow authenticated insert on sites" ON sites;
CREATE POLICY "Allow authenticated insert on sites" ON sites
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated update on sites" ON sites;
CREATE POLICY "Allow authenticated update on sites" ON sites
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated delete on sites" ON sites;
CREATE POLICY "Allow authenticated delete on sites" ON sites
  FOR DELETE USING (auth.role() = 'authenticated');

-- User Profiles 表策略
-- 用户可以查看自己的配置
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

-- 用户可以插入自己的配置（用于触发器未执行时的兜底）
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 用户可以更新自己的配置
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- 管理员可以查看所有用户配置
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (
    get_user_role() = 'admin'
  );

-- 管理员可以更新所有用户配置
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;
CREATE POLICY "Admins can update all profiles" ON user_profiles
  FOR UPDATE USING (
    get_user_role() = 'admin'
  );

-- ============================================
-- 启用实时订阅（可选）
-- ============================================

-- 如果需要实时更新，取消注释以下行
-- ALTER PUBLICATION supabase_realtime ADD TABLE sites;
