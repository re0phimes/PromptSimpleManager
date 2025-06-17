-- 添加邀请码表到现有数据库
-- 执行此脚本前请确保已连接到正确的 Supabase 项目

-- 创建邀请码表
CREATE TABLE IF NOT EXISTS public.invite_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  max_uses INTEGER DEFAULT 1,
  current_uses INTEGER DEFAULT 0,
  is_used BOOLEAN DEFAULT FALSE,
  used_by UUID REFERENCES auth.users(id),
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_invite_codes_code ON public.invite_codes(code);
CREATE INDEX IF NOT EXISTS idx_invite_codes_used ON public.invite_codes(is_used);

-- 启用行级安全策略 (RLS)
ALTER TABLE public.invite_codes ENABLE ROW LEVEL SECURITY;

-- 创建安全策略：所有人都可以读取和验证邀请码
CREATE POLICY "Anyone can view invite codes" ON public.invite_codes
  FOR SELECT USING (true);

CREATE POLICY "Anyone can update invite codes" ON public.invite_codes
  FOR UPDATE USING (true);

-- 创建更新时间自动更新的触发器
CREATE TRIGGER update_invite_codes_updated_at 
    BEFORE UPDATE ON public.invite_codes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 插入一些初始邀请码供测试使用
INSERT INTO public.invite_codes (code, max_uses, current_uses, is_used) VALUES
('WELCOME2024', 10, 0, false),
('BETA001', 5, 0, false),
('TESTCODE', 1, 0, false),
('DEMO123', 3, 0, false)
ON CONFLICT (code) DO NOTHING;

-- 验证表创建成功
SELECT 'invite_codes table created successfully' as result; 