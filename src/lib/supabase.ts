import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('🔍 Supabase配置检查:')
console.log('URL:', supabaseUrl || '❌ 未配置')
console.log('Key:', supabaseAnonKey ? '✅ 已配置' : '❌ 未配置')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase环境变量缺失!')
  console.log('请创建 .env.local 文件并添加:')
  console.log('VITE_SUPABASE_URL=你的项目URL')
  console.log('VITE_SUPABASE_ANON_KEY=你的anon key')
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 类型定义
export interface User {
  id: string
  email: string
  username?: string
  created_at: string
  updated_at: string
}

export interface Prompt {
  id: string
  user_id: string
  title: string
  variables: Array<{ key: string; value: string }>
  instruction: string
  input_content?: string
  output_format: 'text' | 'json' | 'yaml'
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface Favorite {
  id: string
  user_id: string
  prompt_id: string
  created_at: string
} 