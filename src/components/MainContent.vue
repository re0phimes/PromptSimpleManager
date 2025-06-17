<template>
  <div class="flex h-full w-full text-gray-900 dark:text-gray-100">
    <template v-if="activeConversation">
      <!-- Left Column - Input Area -->
      <div class="w-1/2 flex flex-col border-r border-gray-200 dark:border-gray-700">
        <!-- Variables Section with Scroll -->
        <div class="flex-none p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="block text-sm font-medium">变量</label>
              <button 
                @click="store.addVariable" 
                class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                + 添加变量
              </button>
            </div>
            
            <!-- Variables Container with Max Height and Scroll -->
            <div class="max-h-60 overflow-y-auto space-y-3 pr-2">
              <div v-for="(variable, index) in activeConversation.variables" :key="index" class="flex gap-3 items-center">
                <input 
                  :value="variable.key" 
                  class="flex-1 border border-gray-300 dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-800 text-sm"
                  placeholder="变量名" 
                  @input="updateVariableKey(index, $event.target.value)" 
                />
                <input 
                  :value="variable.value" 
                  class="flex-1 border border-gray-300 dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-800 text-sm"
                  placeholder="变量值" 
                  @input="updateVariableValue(index, $event.target.value)" 
                />
                <button
                  v-if="index > 1" 
                  @click="store.removeVariable(index)" 
                  class="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Instruction Section - Always Visible -->
        <div class="flex-1 p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="space-y-2 h-full flex flex-col">
            <label class="block text-sm font-medium">Instruction</label>
            <textarea 
              :value="activeConversation.instruction" 
              @input="updateInstruction($event.target.value)"
              class="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg p-3 resize-none bg-white dark:bg-gray-800 min-h-[120px]" 
              placeholder="输入指令..." 
            />
          </div>
        </div>

        <!-- Input Content Section -->
        <div class="flex-1 p-6">
          <div class="space-y-2 h-full flex flex-col">
            <label class="block text-sm font-medium">Input Content</label>
            <textarea 
              :value="activeConversation.inputContent" 
              @input="updateInputContent($event.target.value)"
              class="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg p-3 resize-none bg-white dark:bg-gray-800 min-h-[100px]" 
              placeholder="输入内容..." 
            />
          </div>
        </div>
      </div>

      <!-- Right Column - Output Area -->
      <div class="w-1/2 flex flex-col">
        <div class="p-6 h-full flex flex-col">
          <label class="block text-sm font-medium mb-2">输出</label>

          <div class="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 flex flex-col">
            <!-- Output Format Controls -->
            <div class="border-b border-gray-300 dark:border-gray-600 p-3 flex justify-between items-center bg-gray-50 dark:bg-gray-700 rounded-t-lg">
              <div class="flex space-x-2">
                <button 
                  v-for="format in ['text', 'json', 'yaml']" 
                  :key="format" 
                  @click="convertAndSetFormat(format)"
                  class="px-3 py-1 rounded text-sm transition-colors"
                  :class="store.outputFormat === format 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'"
                >
                  {{ format.toUpperCase() }}
                </button>
              </div>
              <button 
                @click="copyToClipboard" 
                class="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
              >
                复制
              </button>
            </div>
            
            <!-- Output Content -->
            <div class="flex-1 p-4 overflow-auto">
              <pre class="whitespace-pre-wrap text-sm leading-relaxed">{{ convertedPrompt }}</pre>
            </div>
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
/* 自定义滚动条 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.dark .overflow-y-auto::-webkit-scrollbar-track {
  background: #374151;
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background: #6b7280;
}

/* 确保输入框宽度 */
textarea,
input {
  width: 100%;
  box-sizing: border-box;
}
</style>

