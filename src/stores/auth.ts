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
      const { user } = await authService.signInWithEmail(email, password)
      this.user = user
    },

    async signUp(email: string, password: string, inviteCode: string) {
      const { user } = await authService.signUpWithEmail(email, password)
      
      // 注册成功后，标记邀请码为已使用
      if (user) {
        await inviteService.useInviteCode(inviteCode, user.id)
      }
      
      this.user = user
    },

    async validateInviteCode(code: string): Promise<boolean> {
      return await inviteService.validateInviteCode(code)
    },

    async signOut() {
      await authService.signOut()
      this.user = null
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.user,
    userId: (state) => state.user?.id
  }
}) 