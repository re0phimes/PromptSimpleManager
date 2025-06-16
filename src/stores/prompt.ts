import { defineStore } from 'pinia'
import { promptService } from '@/services/promptService'
import { useAuthStore } from './auth'
import type { Prompt } from '@/lib/supabase'

interface Conversation {
  id: string
  title: string
  isModified: boolean
  variables: Array<{ key: string; value: string }>
  instruction: string
  inputContent: string
  isFavorite?: boolean
  isPublic?: boolean
  createdAt?: string
  updatedAt?: string
}

interface PromptState {
  conversations: Conversation[]
  favoritePrompts: Conversation[]
  activeConversationId: string | null
  outputFormat: 'text' | 'json' | 'yaml'
  loading: boolean
  syncEnabled: boolean
}

export const usePromptStore = defineStore('prompt', {
  state: (): PromptState => ({
    conversations: [],
    favoritePrompts: [],
    activeConversationId: null,
    outputFormat: 'text',
    loading: false,
    syncEnabled: false
  }),

  actions: {
    // 初始化Store
    async initializeStore() {
      const authStore = useAuthStore()
      
      if (authStore.isAuthenticated) {
        this.syncEnabled = true
        await this.loadFromServer()
      } else {
        this.loadFromLocal()
      }

      if (this.conversations.length === 0) {
        this.addConversation()
      }
    },

    // 从服务器加载数据
    async loadFromServer() {
      if (!this.syncEnabled) return
      
      try {
        this.loading = true
        const authStore = useAuthStore()
        
        if (authStore.userId) {
          const [prompts, favorites] = await Promise.all([
            promptService.getUserPrompts(authStore.userId),
            promptService.getFavoritePrompts(authStore.userId)
          ])
          
          this.conversations = prompts.map(this.convertPromptToConversation)
          this.favoritePrompts = favorites.map(this.convertPromptToConversation)
        }
      } catch (error) {
        console.error('Failed to load from server:', error)
        this.loadFromLocal()
      } finally {
        this.loading = false
      }
    },

    // 从本地存储加载数据
    loadFromLocal() {
      const saved = localStorage.getItem('prompt-manager-conversations')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          this.conversations = data.conversations || []
          this.activeConversationId = data.activeConversationId
          this.outputFormat = data.outputFormat || 'text'
        } catch (error) {
          console.error('Failed to load from local storage:', error)
        }
      }
    },

    // 保存到本地存储
    saveToLocal() {
      const data = {
        conversations: this.conversations,
        activeConversationId: this.activeConversationId,
        outputFormat: this.outputFormat
      }
      localStorage.setItem('prompt-manager-conversations', JSON.stringify(data))
    },

    // 添加新会话
    async addConversation() {
      if (this.activeConversationId && !this.getActiveConversation?.isModified) {
        return
      }

      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: `新会话 ${this.conversations.length + 1}`,
        isModified: false,
        variables: [
          { key: 'role', value: '' },
          { key: 'style', value: '' }
        ],
        instruction: '',
        inputContent: '',
        isPublic: false
      }

      this.conversations.push(newConversation)
      this.activeConversationId = newConversation.id

      if (!this.syncEnabled) {
        this.saveToLocal()
      }
    },

    // 保存会话到服务器
    async saveConversation(conversation: Conversation) {
      if (!this.syncEnabled) {
        this.saveToLocal()
        return
      }

      try {
        const authStore = useAuthStore()
        if (!authStore.userId) return

        const promptData = this.convertConversationToPrompt(conversation, authStore.userId)
        
        if (conversation.createdAt) {
          // 更新现有提示词
          await promptService.updatePrompt(conversation.id, promptData)
        } else {
          // 创建新提示词
          const saved = await promptService.createPrompt(promptData)
          conversation.createdAt = saved.created_at
          conversation.updatedAt = saved.updated_at
        }
        
        conversation.isModified = false
      } catch (error) {
        console.error('Failed to save conversation:', error)
        // fallback to local storage
        this.saveToLocal()
      }
    },

    // 删除会话
    async deleteConversation(id: string) {
      if (this.syncEnabled) {
        try {
          await promptService.deletePrompt(id)
        } catch (error) {
          console.error('Failed to delete from server:', error)
        }
      }

      this.conversations = this.conversations.filter(conv => conv.id !== id)
      if (this.activeConversationId === id) {
        this.activeConversationId = this.conversations[0]?.id || null
      }

      if (!this.syncEnabled) {
        this.saveToLocal()
      }
    },

    // 收藏相关方法
    async toggleFavorite(conversationId: string) {
      if (!this.syncEnabled) return

      try {
        const authStore = useAuthStore()
        if (!authStore.userId) return

        const conversation = this.conversations.find(c => c.id === conversationId)
        if (!conversation) return

        if (conversation.isFavorite) {
          await promptService.removeFromFavorites(authStore.userId, conversationId)
          conversation.isFavorite = false
          this.favoritePrompts = this.favoritePrompts.filter(p => p.id !== conversationId)
        } else {
          await promptService.addToFavorites(authStore.userId, conversationId)
          conversation.isFavorite = true
          this.favoritePrompts.push(conversation)
        }
      } catch (error) {
        console.error('Failed to toggle favorite:', error)
      }
    },

    // 工具方法：将Prompt转换为Conversation
    convertPromptToConversation(prompt: Prompt): Conversation {
      return {
        id: prompt.id,
        title: prompt.title,
        isModified: false,
        variables: prompt.variables,
        instruction: prompt.instruction,
        inputContent: prompt.input_content || '',
        isPublic: prompt.is_public,
        createdAt: prompt.created_at,
        updatedAt: prompt.updated_at
      }
    },

    // 工具方法：将Conversation转换为Prompt
    convertConversationToPrompt(conversation: Conversation, userId: string): Omit<Prompt, 'id' | 'created_at' | 'updated_at'> {
      return {
        user_id: userId,
        title: conversation.title,
        variables: conversation.variables,
        instruction: conversation.instruction,
        input_content: conversation.inputContent,
        output_format: this.outputFormat,
        is_public: conversation.isPublic || false
      }
    },

    setActiveConversation(id: string) {
      this.activeConversationId = id
    },

    modifyActiveConversation() {
      const activeConversation = this.getActiveConversation
      if (activeConversation) {
        activeConversation.isModified = true
      }
    },

    updateVariable(index: number, key: string, value: string) {
      const activeConversation = this.getActiveConversation
      if (activeConversation) {
        activeConversation.variables[index] = { key, value }
        this.modifyActiveConversation()
      }
    },

    addVariable() {
      const activeConversation = this.getActiveConversation
      if (activeConversation) {
        activeConversation.variables.push({ key: '', value: '' })
        this.modifyActiveConversation()
      }
    },

    removeVariable(index: number) {
      const activeConversation = this.getActiveConversation
      if (activeConversation) {
        activeConversation.variables.splice(index, 1)
        this.modifyActiveConversation()
      }
    },

    updateInstruction(value: string) {
      const activeConversation = this.getActiveConversation
      if (activeConversation) {
        activeConversation.instruction = value
        this.modifyActiveConversation()
      }
    },

    updateInputContent(value: string) {
      const activeConversation = this.getActiveConversation
      if (activeConversation) {
        activeConversation.inputContent = value
        this.modifyActiveConversation()
      }
    },

    setOutputFormat(format: 'text' | 'json' | 'yaml') {
      this.outputFormat = format
      if (!this.syncEnabled) {
        this.saveToLocal()
      }
    }
  },

  getters: {
    getActiveConversation(): Conversation | undefined {
      return this.conversations.find(conv => conv.id === this.activeConversationId)
    },
    
    compiledPrompt(): string {
      const activeConversation = this.getActiveConversation
      if (!activeConversation) return ''

      let prompt = ''

      activeConversation.variables.forEach(variable => {
        if (variable.value !== '') {
          prompt += `${variable.key}: ${variable.value}\n`
        }
      })

      if (activeConversation.instruction) {
        prompt += `\nInstruction: ${activeConversation.instruction}\n`
      }
      if (activeConversation.inputContent) {
        prompt += `\nInput Content:\n\`\`\`\n${activeConversation.inputContent}\n\`\`\`\n`
      }

      return prompt.trim()
    }
  }
}) 