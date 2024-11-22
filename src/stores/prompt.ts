import { defineStore } from 'pinia'

interface Conversation {
  id: string
  title: string
  isModified: boolean
}

interface PromptState {
  basicPrompt: string
  variables: Array<{ key: string; value: string }>
  styles: Array<{ key: string; value: string }>
  outputRequirement: string
  output: string
  outputFormat: 'text' | 'json' | 'yaml'
  conversations: Conversation[]
  activeConversationId: string | null
}


export const usePromptStore = defineStore('prompt', {
  state: (): PromptState => ({
    basicPrompt: '',
    variables: [],
    styles: [],
    outputRequirement: '',
    output: '',
    outputFormat: 'text',
    conversations: [] as Conversation[],
    activeConversationId: null
  }),

  actions: {
    setBasicPrompt(prompt: string) {
      this.basicPrompt = prompt
    },
    addVariable(key: string, value: string) {
      this.variables.push({ key, value })
    },
    addStyle(key: string, value: string) {
      this.styles.push({ key, value })
    },
    setOutputRequirement(requirement: string) {
      this.outputRequirement = requirement
    },
    setOutput(output: string) {
      this.output = output
    },
    setOutputFormat(format: 'text' | 'json' | 'yaml') {
      this.outputFormat = format
    },
    addConversation() {
      if (this.activeConversationId && !this.getActiveConversation?.isModified) {
        return // 如果当前会话未修改，则不创建新会话
      }
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: `新会话 ${this.conversations.length + 1}`,
        isModified: false
      }
      this.conversations.push(newConversation)
      this.activeConversationId = newConversation.id
    },

    deleteConversation(id: string) {
      this.conversations = this.conversations.filter(conv => conv.id !== id)
      if (this.activeConversationId === id) {
        this.activeConversationId = this.conversations[0]?.id || null
      }
    },

    setActiveConversation(id: string) {
      this.activeConversationId = id
    },

    modifyActiveConversation() {
      const activeConversation = this.conversations.find(conv => conv.id === this.activeConversationId)
      if (activeConversation) {
        activeConversation.isModified = true
      }
    }
  },
  getters: {
    getActiveConversation(): Conversation | undefined {
      return this.conversations.find(conv => conv.id === this.activeConversationId)
    }
  }
})