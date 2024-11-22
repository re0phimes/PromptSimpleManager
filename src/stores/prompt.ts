import { defineStore } from 'pinia'

interface Conversation {
  id: string
  title: string
  isModified: boolean
  variables: Array<{ key: string; value: string }>
  instruction: string
  inputContent: string
}

interface PromptState {
  conversations: Conversation[]
  activeConversationId: string | null
  outputFormat: 'text' | 'json' | 'yaml'
}

export const usePromptStore = defineStore('prompt', {
  state: (): PromptState => ({
    conversations: [],
    activeConversationId: null,
    outputFormat: 'text'
  }),

  actions: {
    addConversation() {
      if (this.activeConversationId && !this.getActiveConversation?.isModified) {
        return // If the current conversation is not modified, don't create a new one
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
        inputContent: ''
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
        prompt += `${variable.key}: ${variable.value}\n`
      })
      prompt += `\nInstruction: ${activeConversation.instruction}\n`
      if (activeConversation.inputContent) {
        prompt += `\nInput Content:\n\`\`\`${activeConversation.inputContent}\`\`\`\n`
      }

      
      return prompt
    }
  }
})
