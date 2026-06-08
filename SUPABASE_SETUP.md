# Supabase 数据库设置指南

## 1. 获取 Supabase 凭证

1. 访问 [Supabase 控制台](https://app.supabase.com)
2. 选择您的项目（或创建一个新项目）
3. 进入 **Settings** -> **API**
4. 复制以下信息：
   - **Project URL** (格式: `https://xxxxx.supabase.co`)
   - **anon public** key (以 `eyJ` 开头的长字符串)

## 2. 配置环境变量

编辑项目根目录下的 `.env.local` 文件：

```env
NEXT_PUBLIC_SUPABASE_URL=您的项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=您的anon_key
```

## 3. 创建数据库表

### 方法一：使用 SQL 编辑器

1. 在 Supabase 控制台中，进入 **SQL Editor**
2. 点击 **New query**
3. 复制并执行 `supabase-schema.sql` 文件中的内容

### 方法二：使用 Table Editor

1. 在 Supabase 控制台中，进入 **Table Editor**
2. 点击 **New table**
3. 表名: `sites`
4. 添加以下列：

| 列名 | 类型 | 默认值 | 可空 |
|------|------|--------|------|
| id | uuid | gen_random_uuid() | 否 |
| name | varchar(255) | - | 否 |
| url | text | - | 否 |
| description | text | - | 否 |
| icon | varchar(10) | - | 是 |
| created_at | timestamptz | now() | 否 |
| updated_at | timestamptz | now() | 否 |

5. 设置 `id` 为主键
6. 启用 **Row Level Security (RLS)**

## 4. 配置行级安全策略 (RLS)

在 SQL Editor 中执行：

```sql
-- 启用 RLS
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许所有操作（生产环境请根据需要调整）
CREATE POLICY "Allow all operations" ON sites
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

## 5. 测试连接

1. 启动开发服务器：
   ```bash
   pnpm dev
   ```

2. 访问 http://localhost:3000

3. 尝试添加一个新网站，检查是否成功保存到数据库

## 6. 故障排除

### 问题：无法连接到数据库

- 检查 `.env.local` 文件中的凭证是否正确
- 确保 Supabase 项目处于活跃状态
- 检查网络连接

### 问题：权限错误

- 确保已启用 RLS
- 确保已创建适当的策略
- 检查 API 密钥是否正确

### 问题：表不存在

- 确保已执行 `supabase-schema.sql` 脚本
- 检查表名是否正确（应为 `sites`）

## 7. 生产环境建议

1. **限制 API 访问**：修改 RLS 策略，只允许认证用户访问
2. **添加索引**：为常用查询字段添加索引
3. **备份数据**：定期备份数据库
4. **监控使用情况**：查看 Supabase 控制台中的使用统计

## 8. 数据库架构

```
sites 表结构：
├── id (UUID, 主键)
├── name (VARCHAR 255, 网站名称)
├── URL (TEXT, 网站地址)
├── description (TEXT, 网站描述)
├── icon (VARCHAR 10, 可选图标)
├── created_at (TIMESTAMPTZ, 创建时间)
└── updated_at (TIMESTAMPTZ, 更新时间)
```

## 9. API 端点

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | /api/sites | 获取所有网站 |
| POST | /api/sites | 创建新网站 |
| GET | /api/sites/[id] | 获取单个网站 |
| PUT | /api/sites/[id] | 更新网站 |
| DELETE | /api/sites/[id] | 删除网站 |

## 10. 下一步

- 添加用户认证
- 实现数据分页
- 添加搜索功能
- 优化查询性能