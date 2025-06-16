import { supabase, type Prompt } from '@/lib/supabase'

class PromptService {
  // 获取用户的所有提示词
  async getUserPrompts(userId: string): Promise<Prompt[]> {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // 创建新提示词
  async createPrompt(prompt: Omit<Prompt, 'id' | 'created_at' | 'updated_at'>): Promise<Prompt> {
    const { data, error } = await supabase
      .from('prompts')
      .insert(prompt)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // 更新提示词
  async updatePrompt(id: string, updates: Partial<Prompt>): Promise<Prompt> {
    const { data, error } = await supabase
      .from('prompts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // 删除提示词
  async deletePrompt(id: string): Promise<void> {
    const { error } = await supabase
      .from('prompts')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // 获取收藏的提示词
  async getFavoritePrompts(userId: string): Promise<Prompt[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        prompts (
          id,
          user_id,
          title,
          variables,
          instruction,
          input_content,
          output_format,
          is_public,
          created_at,
          updated_at
        )
      `)
      .eq('user_id', userId)

    if (error) throw error
    return data?.map((item: any) => item.prompts).filter(Boolean) || []
  }

  // 添加到收藏
  async addToFavorites(userId: string, promptId: string): Promise<void> {
    const { error } = await supabase
      .from('favorites')
      .insert({ user_id: userId, prompt_id: promptId })

    if (error) throw error
  }

  // 从收藏中移除
  async removeFromFavorites(userId: string, promptId: string): Promise<void> {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('prompt_id', promptId)

    if (error) throw error
  }

  // 检查是否已收藏
  async isFavorite(userId: string, promptId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('prompt_id', promptId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return !!data
  }

  // 获取公开的提示词
  async getPublicPrompts(): Promise<Prompt[]> {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }
}

export const promptService = new PromptService() 