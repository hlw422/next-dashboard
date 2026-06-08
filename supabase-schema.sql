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

CREATE TRIGGER update_sites_updated_at
  BEFORE UPDATE ON sites
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 插入默认数据（可选）
INSERT INTO sites (name, url, description, icon) VALUES
  ('GitHub', 'https://github.com', '全球最大的代码托管平台，用于版本控制和协作开发', '🐙'),
  ('Stack Overflow', 'https://stackoverflow.com', '程序员问答社区，解决编程问题的首选平台', '📚'),
  ('MDN Web Docs', 'https://developer.mozilla.org', 'Web 开发技术的权威文档和学习资源', '📖'),
  ('Vercel', 'https://vercel.com', '现代前端部署平台，支持 Next.js 等框架的一键部署', '▲'),
  ('Tailwind CSS', 'https://tailwindcss.com', '实用优先的 CSS 框架，快速构建现代化用户界面', '🎨'),
  ('shadcn/ui', 'https://ui.shadcn.com', '可复用的组件库，基于 Radix UI 和 Tailwind CSS', '🧩')
ON CONFLICT DO NOTHING;

-- 启用行级安全策略（RLS）
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许所有操作（根据需要调整）
CREATE POLICY "Allow all operations" ON sites
  FOR ALL
  USING (true)
  WITH CHECK (true);