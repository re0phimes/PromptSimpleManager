import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

class AuthService {
  // 获取当前用户
  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }

  // 邮箱登录
  async signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  }

  // 邮箱注册
  async signUpWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
    
    if (error) throw error
    return data
  }

  // 登出
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  // 监听认证状态变化
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null)
    })
  }
}

export const authService = new AuthService() 