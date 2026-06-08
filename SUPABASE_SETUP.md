# Supabase 数据库和认证设置指南

## 1. 获取 Supabase 凭证

1. 访问 [Supabase 控制台](https://app.supabase.com)
2. 选择您的项目（或创建一个新项目）
3. 进入 **Settings** -> **API**
4. 复制以下信息：
   - **Project URL** (格式: `https://xxxxx.supabase.co`)
   - **anon public** key (以 `eyJ` 开头的长字符串)
   - **service_role** key (仅服务端使用，不要暴露给客户端)

## 2. 配置环境变量

编辑项目根目录下的 `.env.local` 文件：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=您的项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=您的anon_key
SUPABASE_SERVICE_ROLE_KEY=您的service_role_key
```

## 3. 创建数据库表

### 方法一：使用 SQL 编辑器（推荐）

1. 在 Supabase 控制台中，进入 **SQL Editor**
2. 点击 **New query**
3. 复制并执行 `supabase-schema.sql` 文件中的内容

### 方法二：使用 Table Editor

1. 在 Supabase 控制台中，进入 **Table Editor**
2. 创建 `sites` 表：

| 列名 | 类型 | 默认值 | 可空 |
|------|------|--------|------|
| id | uuid | gen_random_uuid() | 否 |
| name | varchar(255) | - | 否 |
| url | text | - | 否 |
| description | text | - | 否 |
| icon | varchar(10) | - | 是 |
| created_at | timestamptz | now() | 否 |
| updated_at | timestamptz | now() | 否 |

3. 创建 `user_profiles` 表：

| 列名 | 类型 | 默认值 | 可空 |
|------|------|--------|------|
| id | uuid | - | 否 |
| email | text | - | 否 |
| role | user_role | 'viewer' | 否 |
| display_name | text | - | 是 |
| avatar_url | text | - | 是 |
| created_at | timestamptz | now() | 否 |
| updated_at | timestamptz | now() | 否 |

4. 创建 `user_role` 枚举类型：
   ```sql
   CREATE TYPE user_role AS ENUM ('admin', 'editor', 'viewer');
   ```

## 4. 配置行级安全策略 (RLS)

在 SQL Editor 中执行以下 SQL：

```sql
-- 启用 RLS
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Sites 表策略
-- 读取：所有人可访问
CREATE POLICY "Allow public read on sites" ON sites
  FOR SELECT USING (true);

-- 写入：仅认证用户
CREATE POLICY "Allow authenticated insert on sites" ON sites
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on sites" ON sites
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete on sites" ON sites
  FOR DELETE USING (auth.role() = 'authenticated');

-- User Profiles 表策略
-- 用户可以查看自己的配置
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

-- 用户可以更新自己的配置
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- 管理员可以查看所有用户配置
CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 管理员可以更新所有用户配置
CREATE POLICY "Admins can update all profiles" ON user_profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

## 5. 配置认证服务

### 启用邮箱密码认证

1. 进入 **Authentication** -> **Providers**
2. 确保 **Email** 已启用
3. 配置选项：
   - **Confirm email**: 建议启用
   - **Secure email change**: 建议启用

### 配置 GitHub OAuth（可选）

1. 在 GitHub 中创建 OAuth App：
   - 进入 GitHub -> Settings -> Developer settings -> OAuth Apps
   - 点击 **New OAuth App**
   - 填写信息：
     - **Application name**: Website Portal
     - **Homepage URL**: `http://localhost:3000`（开发）或您的生产域名
     - **Authorization callback URL**: `https://your-project-id.supabase.co/auth/v1/callback`
   - 点击 **Register application**
   - 复制 **Client ID** 和 **Client Secret**

2. 在 Supabase 中配置：
   - 进入 **Authentication** -> **Providers**
   - 找到 **GitHub** 并启用
   - 填入 **Client ID** 和 **Client Secret**
   - 保存

### 配置 Google OAuth（可选）

1. 在 Google Cloud Console 中创建 OAuth 2.0 客户端：
   - 进入 [Google Cloud Console](https://console.cloud.google.com)
   - 创建项目或选择现有项目
   - 进入 **APIs & Services** -> **Credentials**
   - 点击 **Create Credentials** -> **OAuth client ID**
   - 选择 **Web application**
   - 添加 **Authorized redirect URIs**: `https://your-project-id.supabase.co/auth/v1/callback`
   - 复制 **Client ID** 和 **Client Secret**

2. 在 Supabase 中配置：
   - 进入 **Authentication** -> **Providers**
   - 找到 **Google** 并启用
   - 填入 **Client ID** 和 **Client Secret**
   - 保存

## 6. 创建第一个管理员用户

1. 启动应用并注册一个账户
2. 在 Supabase 控制台中，进入 **SQL Editor**
3. 执行以下 SQL 将用户设置为管理员：

```sql
UPDATE user_profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

## 7. 测试连接

1. 启动开发服务器：
   ```bash
   pnpm dev
   ```

2. 访问 http://localhost:3000

3. 测试功能：
   - 浏览网站列表（无需登录）
   - 点击登录按钮
   - 使用邮箱注册或第三方登录
   - 尝试添加、编辑、删除网站

## 8. 故障排除

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
- 检查表名是否正确（应为 `sites` 和 `user_profiles`）

### 问题：OAuth 登录失败

- 检查 OAuth 应用的回调 URL 是否正确
- 确保 Client ID 和 Client Secret 正确
- 检查 Supabase 项目是否启用了对应的 Provider

### 问题：用户注册后没有创建 profile

- 检查是否创建了 `handle_new_user` 函数和触发器
- 在 SQL Editor 中执行：

```sql
-- 创建函数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'viewer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 9. 生产环境建议

1. **限制 API 访问**：使用 RLS 策略保护数据
2. **添加索引**：为常用查询字段添加索引
3. **备份数据**：定期备份数据库
4. **监控使用情况**：查看 Supabase 控制台中的使用统计
5. **配置自定义域名**：为 Supabase 项目配置自定义域名
6. **启用 MFA**：为管理员账户启用多因素认证

## 10. 数据库架构

```
sites 表结构：
├── id (UUID, 主键)
├── name (VARCHAR 255, 网站名称)
├── URL (TEXT, 网站地址)
├── description (TEXT, 网站描述)
├── icon (VARCHAR 10, 可选图标)
├── created_at (TIMESTAMPTZ, 创建时间)
└── updated_at (TIMESTAMPTZ, 更新时间)

user_profiles 表结构：
├── id (UUID, 主键, 关联 auth.users)
├── email (TEXT, 用户邮箱)
├── role (ENUM: admin/editor/viewer, 用户角色)
├── display_name (TEXT, 显示名称)
├── avatar_url (TEXT, 头像 URL)
├── created_at (TIMESTAMPTZ, 创建时间)
└── updated_at (TIMESTAMPTZ, 更新时间)
```

## 11. API 端点

| 方法 | 端点 | 描述 | 认证要求 |
|------|------|------|----------|
| GET | /api/sites | 获取所有网站 | 无 |
| POST | /api/sites | 创建新网站 | 需要认证 |
| GET | /api/sites/[id] | 获取单个网站 | 无 |
| PUT | /api/sites/[id] | 更新网站 | 需要认证 |
| DELETE | /api/sites/[id] | 删除网站 | 需要认证 |

## 12. 下一步

- ✅ 用户认证系统
- 实现数据分页
- 添加搜索功能
- 优化查询性能
- 添加网站分类功能
