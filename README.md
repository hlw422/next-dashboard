# Website Portal - 网站导航门户

一个基于 **Next.js 16 + Supabase** 构建的现代化网站导航门户，采用 **Awwwards 风格** 设计，具有炫酷的视觉效果和流畅的用户体验。

## ✨ 特性

- 🎨 **Awwwards 风格设计** - 深色主题、玻璃态效果、渐变动画
- 🖱️ **鼠标跟随光效** - 动态光标追踪效果
- 🌊 **流畅动画** - 卡片悬停、渐入、浮动粒子等动画
- 📱 **响应式布局** - 适配各种屏幕尺寸
- 🚀 **高性能** - Next.js 16 + Turbopack 构建
- 💾 **数据持久化** - Supabase PostgreSQL 数据库
- 🔒 **用户认证** - Supabase Auth 支持邮箱密码 + 第三方登录
- 👥 **角色系统** - 管理员、编辑者、查看者三级权限
- 🛡️ **API 保护** - 所有写操作需要认证

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| **前端框架** | Next.js 16.2.7 (Turbopack) |
| **UI 组件** | shadcn/ui + Tailwind CSS |
| **数据库** | Supabase (PostgreSQL) |
| **认证服务** | Supabase Auth |
| **图标库** | Lucide React |
| **字体** | Inter + JetBrains Mono |
| **包管理器** | pnpm |

## 📦 项目结构

```
react-dashboard/
├── src/
│   ├── app/
│   │   ├── admin/              # 管理员页面
│   │   ├── api/sites/          # API 路由 (CRUD)
│   │   ├── auth/               # 认证页面
│   │   │   ├── login/          # 登录页面
│   │   │   ├── signup/         # 注册页面
│   │   │   ├── reset-password/ # 密码重置
│   │   │   └── callback/       # OAuth 回调
│   │   ├── globals.css         # 全局样式 (Awwwards 风格)
│   │   ├── layout.tsx          # 根布局
│   │   └── page.tsx            # 主页面
│   ├── components/
│   │   ├── auth/               # 认证组件
│   │   │   ├── AuthGuard.tsx   # 权限守卫
│   │   │   ├── AuthModal.tsx   # 登录弹窗
│   │   │   └── UserMenu.tsx    # 用户菜单
│   │   ├── site-card.tsx       # 网站卡片组件
│   │   ├── site-dialog.tsx     # 添加/编辑对话框
│   │   └── ui/                 # shadcn/ui 组件
│   ├── contexts/
│   │   └── AuthContext.tsx      # 认证上下文
│   ├── data/
│   │   └── sites.ts            # 数据操作函数
│   ├── lib/
│   │   ├── supabase/           # Supabase 客户端
│   │   │   ├── server.ts       # 服务端客户端
│   │   │   ├── client.ts       # 浏览器端客户端
│   │   │   └── middleware.ts   # 中间件辅助
│   │   ├── permissions.ts      # 权限检查工具
│   │   └── supabase.ts         # 兼容性导出
│   ├── types/
│   │   └── auth.ts             # 认证类型定义
│   └── middleware.ts           # Next.js 中间件
├── public/                     # 静态资源
├── .env.local                  # 环境变量 (不提交到 Git)
├── .gitignore                  # Git 忽略规则
├── package.json                # 项目依赖
├── supabase-schema.sql         # 数据库建表脚本
└── tailwind.config.ts          # Tailwind 配置
```

## 🚀 快速开始

### 前置要求

- Node.js 18+ 
- pnpm (推荐) 或 npm/yarn
- Supabase 账号

### 1. 克隆项目

```bash
git clone http://localhost:3001/hlw/react-dashboard.git
cd react-dashboard
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 配置 Supabase

1. 访问 [Supabase 控制台](https://app.supabase.com) 创建项目
2. 在 SQL Editor 中执行 `supabase-schema.sql` 创建数据表
3. 获取项目 URL、Anon Key 和 Service Role Key

### 4. 设置环境变量

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 5. 配置第三方登录（可选）

在 Supabase 控制台中配置 OAuth 提供商：

1. 进入 **Authentication** -> **Providers**
2. 启用 GitHub 和/或 Google
3. 配置 OAuth 应用的 Client ID 和 Client Secret
4. 设置回调 URL：`https://your-domain.com/auth/callback`

### 6. 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000 查看效果。

## 📝 可用脚本

```bash
pnpm dev      # 启动开发服务器
pnpm build    # 构建生产版本
pnpm start    # 启动生产服务器
pnpm lint     # 运行 ESLint 检查
```

## 🗄️ 数据库结构

### sites 表

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | UUID | 主键，自动生成 |
| `name` | VARCHAR(255) | 网站名称 |
| `url` | VARCHAR(500) | 网站 URL |
| `description` | TEXT | 网站描述 |
| `icon` | VARCHAR(50) | 网站图标 (Emoji) |
| `created_at` | TIMESTAMP | 创建时间 |
| `updated_at` | TIMESTAMP | 更新时间 |

### user_profiles 表

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | UUID | 主键，关联 auth.users |
| `email` | TEXT | 用户邮箱 |
| `role` | ENUM | 用户角色 (admin/editor/viewer) |
| `display_name` | TEXT | 显示名称 |
| `avatar_url` | TEXT | 头像 URL |
| `created_at` | TIMESTAMP | 创建时间 |
| `updated_at` | TIMESTAMP | 更新时间 |

## 🔐 认证系统

### 认证方式

- **邮箱密码** - 传统注册登录
- **GitHub OAuth** - 第三方登录
- **Google OAuth** - 第三方登录

### 角色权限

| 操作 | admin | editor | viewer |
|------|-------|--------|--------|
| 浏览网站 | ✅ | ✅ | ✅ |
| 添加网站 | ✅ | ✅ | ❌ |
| 编辑网站 | ✅ | ✅ | ❌ |
| 删除网站 | ✅ | ❌ | ❌ |
| 管理用户 | ✅ | ❌ | ❌ |

### 页面路由

| 路径 | 说明 | 访问权限 |
|------|------|----------|
| `/` | 主页面 | 所有人 |
| `/auth/login` | 登录页面 | 未登录 |
| `/auth/signup` | 注册页面 | 未登录 |
| `/auth/reset-password` | 密码重置 | 未登录 |
| `/admin` | 管理后台 | 管理员 |

## 🎨 设计特点

### 玻璃态效果
```css
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### 渐变动画
```css
.gradient-border {
  position: relative;
}
.gradient-border::before {
  background: linear-gradient(45deg, #6366f1, #8b5cf6, #a855f7);
  /* 旋转渐变边框动画 */
}
```

### 鼠标跟随光效
```typescript
const handleMouseMove = (e: React.MouseEvent) => {
  setMousePosition({ x: e.clientX, y: e.clientY });
};
```

## 🔧 API 端点

| 方法 | 路径 | 说明 | 认证要求 |
|------|------|------|----------|
| `GET` | `/api/sites` | 获取所有网站 | 无 |
| `POST` | `/api/sites` | 创建新网站 | 需要认证 |
| `GET` | `/api/sites/[id]` | 获取单个网站 | 无 |
| `PUT` | `/api/sites/[id]` | 更新网站 | 需要认证 |
| `DELETE` | `/api/sites/[id]` | 删除网站 | 需要认证 |

## 📦 部署

### Vercel 部署

1. Fork 本仓库
2. 在 Vercel 中导入项目
3. 配置环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. 部署

### Docker 部署

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔒 安全说明

- `.env.local` 文件已被 `.gitignore` 排除，不会提交到 Git
- Supabase Anon Key 是公开密钥，仅用于客户端访问
- Service Role Key 仅在服务端使用，不会暴露给浏览器
- 所有写操作 API 都需要认证
- 使用 Row Level Security (RLS) 保护数据

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🔗 相关链接

- [Next.js 文档](https://nextjs.org/docs)
- [Supabase 文档](https://supabase.com/docs)
- [shadcn/ui 文档](https://ui.shadcn.com)
- [Tailwind CSS 文档](https://tailwindcss.com)

---

**作者**: hlw42  
**仓库**: 
- Gitea: http://localhost:3001/hlw/react-dashboard
- GitHub: https://github.com/hlw422/next-dashboard
