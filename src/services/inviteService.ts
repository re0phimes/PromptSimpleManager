import { supabase } from '@/lib/supabase'

class InviteService {
  // 验证邀请码
  async validateInviteCode(code: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('invite_codes')
        .select('id, is_used, max_uses, current_uses')
        .eq('code', code)
        .eq('is_used', false)
        .single()

      if (error || !data) {
        return false
      }

      // 检查使用次数限制
      if (data.current_uses >= data.max_uses) {
        return false
      }

      return true
    } catch (error) {
      console.error('验证邀请码失败:', error)
      return false
    }
  }

  // 使用邀请码（注册成功后调用）
  async useInviteCode(code: string, userId: string): Promise<boolean> {
    try {
      const { data: inviteData, error: selectError } = await supabase
        .from('invite_codes')
        .select('id, current_uses, max_uses')
        .eq('code', code)
        .single()

      if (selectError || !inviteData) {
        return false
      }

      const newUseCount = inviteData.current_uses + 1
      const shouldMarkUsed = newUseCount >= inviteData.max_uses

      const { error } = await supabase
        .from('invite_codes')
        .update({
          current_uses: newUseCount,
          is_used: shouldMarkUsed,
          used_by: shouldMarkUsed ? userId : inviteData.current_uses === 0 ? userId : undefined,
          used_at: shouldMarkUsed ? new Date().toISOString() : undefined
        })
        .eq('code', code)

      return !error
    } catch (error) {
      console.error('使用邀请码失败:', error)
      return false
    }
  }

  // 创建邀请码（管理员功能）
  async createInviteCode(code: string, maxUses: number = 1): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('invite_codes')
        .insert({
          code,
          max_uses: maxUses,
          current_uses: 0,
          is_used: false
        })

      return !error
    } catch (error) {
      console.error('创建邀请码失败:', error)
      return false
    }
  }

  // 获取邀请码列表（管理员功能）
  async getInviteCodes() {
    try {
      const { data, error } = await supabase
        .from('invite_codes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('获取邀请码列表失败:', error)
      return []
    }
  }
}

export const inviteService = new InviteService() 