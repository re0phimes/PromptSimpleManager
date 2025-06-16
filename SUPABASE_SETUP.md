# Supabase配置指南

## 🚀 快速开始

### 1. 创建Supabase项目

1. 访问 [supabase.com](https://supabase.com)
2. 点击 "Start your project" 创建账号
3. 创建新项目，选择区域（建议选择距离你最近的区域）
4. 等待项目创建完成（通常需要2-3分钟）

### 2. 获取项目配置信息

1. 进入项目仪表板
2. 点击左侧菜单的 "Settings" → "API"
3. 复制以下信息：
   - **Project URL**: `https://your-project.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. 配置环境变量

1. 在项目根目录编辑 `.env.local` 文件：
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **注意：将 `your-project` 和密钥替换为你的实际值**

### 4. 创建数据库表

1. 在Supabase仪表板中，点击左侧菜单的 "SQL Editor"
2. 点击 "New query"
3. 复制 `database.sql` 文件中的所有内容并粘贴
4. 点击 "Run" 执行SQL语句

### 5. 启用认证

1. 点击左侧菜单的 "Authentication" → "Settings"
2. 确保 "Enable email confirmations" 根据需要开启/关闭
   - 开启：用户注册后需要验证邮箱
   - 关闭：用户可以直接注册使用
3. 可以配置其他认证选项（如Google、GitHub登录）

## 🛠️ 开发环境设置

### 依赖安装
```bash
npm install @supabase/supabase-js
```

### 启动开发서버
```bash
npm run dev
```

## 🔧 功能特性

### ✅ 已实现功能
- 用户注册/登录
- 提示词CRUD操作
- 收藏功能
- 本地存储fallback
- 行级安全策略
- 自动同步

### 🚧 可扩展功能
- 提示词分享
- 标签系统
- 搜索功能
- 导入/导出
- 团队协作

## 🔒 安全特性

### 行级安全策略 (RLS)
- 用户只能访问自己的提示词
- 公开提示词所有人可见
- 收藏记录严格隔离

### 数据验证
- 前端表单验证
- 后端数据类型约束
- SQL注入防护

## 📊 数据库结构

### 表结构
```sql
prompts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  title VARCHAR(255),
  variables JSONB,
  instruction TEXT,
  input_content TEXT,
  output_format VARCHAR(10),
  is_public BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

favorites (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  prompt_id UUID REFERENCES prompts(id),
  created_at TIMESTAMP,
  UNIQUE(user_id, prompt_id)
)
```

## 🐛 常见问题

### Q: 环境变量不生效？
A: 确保 `.env.local` 文件在项目根目录，且变量名以 `VITE_` 开头。重启开发服务器。

### Q: 数据库连接失败？
A: 检查 Supabase 项目状态，确认 URL 和密钥正确。检查网络连接。

### Q: 用户注册后收不到邮件？
A: 检查 Supabase 认证设置，确认邮件服务配置正确。

### Q: RLS 策略导致无法访问数据？
A: 确保用户已登录，检查 `auth.uid()` 是否正确。

## 🚀 部署到Vercel

1. 在 Vercel 项目设置中添加环境变量
2. 设置 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY`
3. 部署完成后测试功能

## 📞 技术支持

如果遇到问题：
1. 查看浏览器控制台错误信息
2. 检查 Supabase 仪表板日志
3. 确认网络连接和配置

## 🎉 完成！

配置完成后，你的应用将支持：
- 用户注册和登录
- 提示词云端同步
- 收藏功能
- 安全的数据隔离

享受你的 Prompt Manager 吧！ 