import { defineStore } from 'pinia'

interface PromptState {
  basicPrompt: string
  variables: Array<{ key: string; value: string }>
  styles: Array<{ key: string; value: string }>
  outputRequirement: string
  output: string
  outputFormat: 'text' | 'json' | 'yaml'
}

export const usePromptStore = defineStore('prompt', {
  state: (): PromptState => ({
    basicPrompt: '',
    variables: [],
    styles: [],
    outputRequirement: '',
    output: '',
    outputFormat: 'text'
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
    }
  }
})