import { defineStore } from 'pinia'
import { authService } from '@/services/authService'
import { inviteService } from '@/services/inviteService'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  loading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    loading: true
  }),

  actions: {
    async initialize() {
      try {
        this.user = await authService.getCurrentUser()
        
        // 监听认证状态变化
        authService.onAuthStateChange((user) => {
          this.user = user
        })
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        this.loading = false
      }
    },

    async signIn(email: string, password: string) {
      console.log('🔐 开始登录流程...')
      console.log('📧 尝试登录邮箱:', email)
      
      try {
        const result = await authService.signInWithEmail(email, password)
        console.log('✅ Supabase 登录响应:', result)
        
        const { user, session } = result
        
        if (user) {
          console.log('👤 登录用户信息:', {
            id: user.id,
            email: user.email,
            emailConfirmed: user.email_confirmed_at,
            lastSignIn: user.last_sign_in_at,
            createdAt: user.created_at
          })
          
          this.user = user
          console.log('✅ 登录成功')
        } else {
          console.log('❌ 登录失败 - 没有返回用户信息')
        }
        
        if (session) {
          console.log('🔑 会话信息:', {
            hasAccessToken: !!session.access_token,
            expiresAt: session.expires_at,
            tokenType: session.token_type
          })
        } else {
          console.log('⚠️  没有创建会话')
        }
        
      } catch (error: any) {
        console.error('❌ 登录过程出错:', error)
        console.error('错误详情:', {
          message: error.message,
          status: error.status,
          statusCode: error.statusCode
        })
        throw error
      }
    },

    async signUp(email: string, password: string, inviteCode: string) {
      console.log('🚀 开始注册流程...')
      console.log('📧 邮箱:', email)
      console.log('🎫 邀请码:', inviteCode)
      
      try {
        const result = await authService.signUpWithEmail(email, password)
        console.log('✅ Supabase 注册响应:', result)
        
        const { user, session } = result
        
        if (user) {
          console.log('👤 用户创建成功:', {
            id: user.id,
            email: user.email,
            emailConfirmed: user.email_confirmed_at,
            confirmationSentAt: user.confirmation_sent_at
          })
          
          // 注册成功后，标记邀请码为已使用
          console.log('🎫 标记邀请码已使用...')
          await inviteService.useInviteCode(inviteCode, user.id)
          console.log('✅ 邀请码使用成功')
          
          this.user = user
          
          if (!user.email_confirmed_at) {
            console.log('⚠️  用户需要确认邮箱才能完成注册')
            console.log('📬 请检查邮箱中的确认邮件')
          }
        } else {
          console.log('❌ 用户创建失败 - 没有返回用户信息')
        }
        
        if (session) {
          console.log('🔑 会话创建成功:', session.access_token ? '已获取访问令牌' : '未获取访问令牌')
        } else {
          console.log('⚠️  没有创建会话 - 可能需要邮箱确认')
        }
        
      } catch (error) {
        console.error('❌ 注册过程出错:', error)
        throw error
      }
    },

    async validateInviteCode(code: string): Promise<boolean> {
      return await inviteService.validateInviteCode(code)
    },

    async signOut() {
      await authService.signOut()
      this.user = null
    },

    async resetPassword(email: string) {
      console.log('🔄 请求密码重置:', email)
      await authService.resetPassword(email)
      console.log('✅ 密码重置邮件已发送')
    },

    async checkUserStatus() {
      console.log('🔍 检查当前用户状态...')
      
      try {
        const currentUser = await authService.getCurrentUser()
        console.log('当前用户信息:', currentUser)
        
        if (currentUser) {
          console.log('✅ 用户已登录:', {
            id: currentUser.id,
            email: currentUser.email,
            emailConfirmed: currentUser.email_confirmed_at,
            lastSignIn: currentUser.last_sign_in_at
          })
          return 'active'
        } else {
          console.log('❌ 用户未登录')
          return 'not_logged_in'
        }
      } catch (error) {
        console.error('❌ 检查用户状态失败:', error)
        return 'error'
      }
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.user,
    userId: (state) => state.user?.id
  }
}) 