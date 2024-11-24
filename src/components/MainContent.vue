<template>
  <div class="flex flex-col lg:flex-row gap-6 h-full w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <template v-if="activeConversation">
      <!-- Left Column -->
      <div class="w-full lg:w-1/2 space-y-6">
        <!-- Variables -->
        <div class="space-y-2 w-full">
          <label class="block text-sm font-medium">变量</label>
          <div v-for="(variable, index) in activeConversation.variables" :key="index" class="flex gap-4">
            <input :value="variable.key" class="flex-1 w-full md:w-1/3 border border-gray-300 dark:border-gray-700 rounded p-2 bg-white dark:bg-gray-800"
              placeholder="变量名" @input="updateVariableKey(index, $event.target.value)" />
            <input :value="variable.value" class="flex-1 w-full md:w-2/3 border border-gray-300 dark:border-gray-700 rounded p-2 bg-white dark:bg-gray-800"
              placeholder="变量值" @input="updateVariableValue(index, $event.target.value)" />
            <Button v-if="index > 1" @click="store.removeVariable(index)" class="hover:text-white dark:hover:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd" />
              </svg>
            </Button>
          </div>
          <Button @click="store.addVariable" class="rounded hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors">
            添加变量
          </Button>
        </div>

        <!-- Instruction -->
        <div class="space-y-2 w-full">
          <label class="block text-sm font-medium">Instruction</label>
          <textarea :value="activeConversation.instruction" @input="updateInstruction($event.target.value)"
            class="w-full h-32 border border-gray-300 dark:border-gray-700 rounded-lg p-3 resize-none bg-white dark:bg-gray-800" placeholder="输入指令..." />
        </div>

        <!-- Input Content -->
        <div class="space-y-2 w-full">
          <label class="block text-sm font-medium">Input Content</label>
          <textarea :value="activeConversation.inputContent" @input="updateInputContent($event.target.value)"
            class="w-full h-32 border border-gray-300 dark:border-gray-700 rounded-lg p-3 resize-none bg-white dark:bg-gray-800" placeholder="输入内容..." />
        </div>
      </div>

      <!-- Right Column -->
      <div class="flex-1">
        <label class="block text-sm font-medium">输出</label>

        <div class="w-full mt-2 border border-gray-300 dark:border-gray-700 rounded-lg h-full bg-white dark:bg-gray-800">
          <div class="border-b border-gray-300 dark:border-gray-700 p-2 flex justify-between items-center">
            <div class="flex space-x-2">
              <button v-for="format in ['text', 'json', 'yaml']" :key="format" @click="convertAndSetFormat(format)"
                class="px-3 py-1 rounded"
                :class="store.outputFormat === format ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-600'">
                {{ format }}
              </button>
            </div>
            <Button class="rounded" @click="copyToClipboard">复制</Button>
          </div>
          <div class="p-4 h-[calc(100%-4rem)] overflow-auto w-full">
            <pre class="whitespace-pre-wrap">{{ convertedPrompt }}</pre>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="w-full h-full flex items-center justify-center">
        <p class="text-gray-500 dark:text-gray-400">请选择或创建一个会话</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { usePromptStore } from '../stores/prompt'
import { computed } from 'vue'
import { convertPromptStructure, serializePromptStructure, PromptStructure } from '../utils/promptConversions'
import { BasePromptStructure } from '../models/promptStructures'
// shadcn ui
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ThemeSwitcher from './ThemeSwitcher.vue'

const store = usePromptStore()
const activeConversation = computed(() => store.getActiveConversation)

const updateVariableKey = (index: number, value: string) => {
  if (activeConversation.value) {
    store.updateVariable(index, value, activeConversation.value.variables[index].value)
  }
}

const updateVariableValue = (index: number, value: string) => {
  if (activeConversation.value) {
    store.updateVariable(index, activeConversation.value.variables[index].key, value)
  }
}

const updateInstruction = (value: string) => {
  store.updateInstruction(value)
}

const updateInputContent = (value: string) => {
  store.updateInputContent(value)
}

const convertedPrompt = computed(() => {
  if (!activeConversation.value) return ''

  const baseStructure: BasePromptStructure = {
    variables: Object.fromEntries(
      activeConversation.value.variables
        .filter(v => v.value.trim() !== '')
        .map(v => [v.key, v.value.trim()])
    ),
    instruction: activeConversation.value.instruction,
    inputContent: activeConversation.value.inputContent || undefined
  }

  const promptStructure: PromptStructure = {
    ...baseStructure,
    format: store.outputFormat
  }

  return serializePromptStructure(promptStructure)
})

const convertAndSetFormat = (format: 'text' | 'json' | 'yaml') => {
  store.setOutputFormat(format)
}

const copyToClipboard = () => {
  navigator.clipboard.writeText(convertedPrompt.value)
    .then(() => {
      console.log('Copied to clipboard')
    })
    .catch(err => {
      console.error('Failed to copy: ', err)
    })
}
</script>

<style scoped>
textarea,
input {
  width: 100%;
  box-sizing: border-box;
}
</style>

