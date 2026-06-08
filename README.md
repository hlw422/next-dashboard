# Website Portal - 网站导航门户

一个基于 **Next.js 16 + Supabase** 构建的现代化网站导航门户，采用 **Awwwards 风格** 设计，具有炫酷的视觉效果和流畅的用户体验。

## ✨ 特性

- 🎨 **Awwwards 风格设计** - 深色主题、玻璃态效果、渐变动画
- 🖱️ **鼠标跟随光效** - 动态光标追踪效果
- 🌊 **流畅动画** - 卡片悬停、渐入、浮动粒子等动画
- 📱 **响应式布局** - 适配各种屏幕尺寸
- 🚀 **高性能** - Next.js 16 + Turbopack 构建
- 💾 **数据持久化** - Supabase PostgreSQL 数据库
- 🔒 **安全可靠** - 环境变量管理敏感配置

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| **前端框架** | Next.js 16.2.7 (Turbopack) |
| **UI 组件** | shadcn/ui + Tailwind CSS |
| **数据库** | Supabase (PostgreSQL) |
| **图标库** | Lucide React |
| **字体** | Inter + JetBrains Mono |
| **包管理器** | pnpm |

## 📦 项目结构

```
react-dashboard/
├── src/
│   ├── app/
│   │   ├── api/sites/          # API 路由 (CRUD)
│   │   ├── globals.css         # 全局样式 (Awwwards 风格)
│   │   ├── layout.tsx          # 根布局
│   │   └── page.tsx            # 主页面
│   ├── components/
│   │   ├── site-card.tsx       # 网站卡片组件
│   │   ├── site-dialog.tsx     # 添加/编辑对话框
│   │   └── ui/                 # shadcn/ui 组件
│   ├── data/
│   │   └── sites.ts            # 数据操作函数
│   └── lib/
│       └── supabase.ts         # Supabase 客户端配置
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
3. 获取项目 URL 和 Anon Key

### 4. 设置环境变量

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 5. 启动开发服务器

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

`sites` 表包含以下字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | UUID | 主键，自动生成 |
| `name` | VARCHAR(255) | 网站名称 |
| `url` | VARCHAR(500) | 网站 URL |
| `description` | TEXT | 网站描述 |
| `icon` | VARCHAR(50) | 网站图标 (Emoji) |
| `created_at` | TIMESTAMP | 创建时间 |
| `updated_at` | TIMESTAMP | 更新时间 |

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

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/api/sites` | 获取所有网站 |
| `POST` | `/api/sites` | 创建新网站 |
| `GET` | `/api/sites/[id]` | 获取单个网站 |
| `PUT` | `/api/sites/[id]` | 更新网站 |
| `DELETE` | `/api/sites/[id]` | 删除网站 |

## 📦 部署

### Vercel 部署

1. Fork 本仓库
2. 在 Vercel 中导入项目
3. 配置环境变量
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
- 敏感操作需要配置 Row Level Security (RLS)

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
