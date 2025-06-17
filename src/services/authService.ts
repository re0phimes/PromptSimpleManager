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

  // 密码重置
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    
    if (error) throw error
  }

  // 检查用户是否存在
  async checkUserExists(email: string) {
    // 这是一个尝试登录的方法来检查用户是否存在
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: 'dummy_password_check_only'
      })
      
      // 如果错误是 Invalid login credentials，说明用户存在但密码错误
      // 如果错误是 Email not confirmed，说明用户存在但未确认邮箱
      if (error?.message === 'Invalid login credentials') {
        return true
      }
      if (error?.message === 'Email not confirmed') {
        return { exists: true, confirmed: false }
      }
      return false
    } catch (error) {
      return false
    }
  }
}

export const authService = new AuthService() 