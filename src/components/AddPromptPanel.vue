<template>
  <div class="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
    <!-- 头部 -->
    <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-4">
        <h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {{ isImportMode ? '导入 Prompt' : '创建 Prompt' }}
        </h3>
        
        <!-- 模式切换开关 -->
        <div class="flex items-center space-x-3 ml-6">
          <span class="text-sm text-gray-700 dark:text-gray-300" :class="{ 'font-medium': !isImportMode }">
            模板
          </span>
          <button
            @click="toggleMode"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            :class="isImportMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'"
          >
            <span
              class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              :class="isImportMode ? 'translate-x-6' : 'translate-x-1'"
            ></span>
          </button>
          <span class="text-sm text-gray-700 dark:text-gray-300" :class="{ 'font-medium': isImportMode }">
            导入
          </span>
        </div>
      </div>
      
      <button
        @click="$emit('close')"
        class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- 主体内容 -->
    <div class="flex-1 overflow-y-auto p-6">
      <!-- 登录提醒 -->
      <div v-if="!authStore.isAuthenticated" class="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <div class="flex">
          <svg class="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          <div>
            <h4 class="text-sm font-medium text-yellow-800 dark:text-yellow-200">需要登录</h4>
            <p class="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              保存 Prompt 需要登录账户。请先登录后再继续。
            </p>
          </div>
        </div>
      </div>

      <!-- 导入模式 -->
      <div v-if="isImportMode" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 左侧：输入区域 -->
        <div>
          <h4 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            粘贴你的 Prompt
          </h4>
          
          <!-- Prompt文本输入 -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Prompt 内容 *
            </label>
            <textarea
              v-model="promptText"
              placeholder="在这里粘贴你的完整 Prompt 内容..."
              class="w-full h-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 resize-none"
              @input="analyzePrompt"
            ></textarea>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              系统会自动识别 {变量名} 格式的变量
            </p>
          </div>

          <!-- 基本信息 -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                标题 *
              </label>
              <input
                v-model="promptTitle"
                type="text"
                placeholder="为你的 Prompt 起个名字"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                输出格式
              </label>
              <select
                v-model="outputFormat"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="text">文本</option>
                <option value="markdown">Markdown</option>
                <option value="json">JSON</option>
                <option value="code">代码</option>
              </select>
            </div>

            <div class="flex items-center">
              <input
                v-model="isPublic"
                type="checkbox"
                id="isPublic"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="isPublic" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                公开此 Prompt
              </label>
            </div>
          </div>
        </div>

        <!-- 右侧：预览区域 -->
        <div>
          <h4 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            解析预览
          </h4>
          
          <!-- 检测到的变量 -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              检测到的变量 ({{ detectedVariables.length }})
            </label>
            <div v-if="detectedVariables.length === 0" class="text-sm text-gray-500 dark:text-gray-400 italic">
              暂未检测到变量
            </div>
            <div v-else class="space-y-2 max-h-32 overflow-y-auto">
              <div
                v-for="(variable, index) in detectedVariables"
                :key="index"
                class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
              >
                <span class="text-sm font-mono text-blue-600 dark:text-blue-400">
                  {{ '{' + variable + '}' }}
                </span>
                <button
                  @click="removeVariable(index)"
                  class="text-red-500 hover:text-red-700 text-xs"
                >
                  移除
                </button>
              </div>
            </div>
          </div>

          <!-- Prompt预览 -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Prompt 预览
            </label>
            <div class="h-48 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-md overflow-y-auto">
              <pre class="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ promptText || '暂无内容' }}</pre>
            </div>
          </div>

          <!-- 统计信息 -->
          <div class="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <div>字符数：{{ promptText.length }}</div>
            <div>变量数：{{ detectedVariables.length }}</div>
          </div>
        </div>
      </div>

      <!-- 模板模式 -->
      <div v-else class="max-w-2xl mx-auto">
        <h4 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">
          使用模板创建 Prompt
        </h4>
        
        <!-- 基本信息 -->
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              标题 *
            </label>
            <input
              v-model="templateTitle"
              type="text"
              placeholder="为你的 Prompt 起个名字"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          <!-- 变量设置 -->
          <div>
            <div class="flex justify-between items-center mb-3">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                变量设置
              </label>
              <button
                @click="addTemplateVariable"
                class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                + 添加变量
              </button>
            </div>
            
            <div class="space-y-3">
              <div
                v-for="(variable, index) in templateVariables"
                :key="index"
                class="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
              >
                <input
                  v-model="variable.key"
                  type="text"
                  placeholder="变量名"
                  class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-gray-100"
                />
                <input
                  v-model="variable.value"
                  type="text"
                  placeholder="默认值（可选）"
                  class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-gray-100"
                />
                <button
                  @click="removeTemplateVariable(index)"
                  class="text-red-500 hover:text-red-700 p-1"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- 指令内容 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              指令内容
            </label>
            <textarea
              v-model="templateInstruction"
              placeholder="输入你的指令内容..."
              class="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 resize-none"
            ></textarea>
          </div>

          <!-- 输出格式 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              输出格式
            </label>
            <select
              v-model="templateOutputFormat"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="text">文本</option>
              <option value="markdown">Markdown</option>
              <option value="json">JSON</option>
              <option value="code">代码</option>
            </select>
          </div>

          <!-- 公开设置 -->
          <div class="flex items-center">
            <input
              v-model="templateIsPublic"
              type="checkbox"
              id="templateIsPublic"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="templateIsPublic" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              公开此 Prompt
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="p-6 border-t border-gray-200 dark:border-gray-700">
      <div class="flex justify-end space-x-3">
        <button
          @click="$emit('close')"
          type="button"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          取消
        </button>
        <button
          @click="handleSubmit"
          :disabled="!canSubmit || submitting"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <svg v-if="submitting" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle>
            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" class="opacity-75"></path>
          </svg>
          {{ submitting ? (isImportMode ? '导入中...' : '创建中...') : (isImportMode ? '导入 Prompt' : '创建 Prompt') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { usePromptStore } from '@/stores/prompt'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  close: []
  imported: [prompt: any]
  created: [prompt: any]
}>()

const authStore = useAuthStore()
const promptStore = usePromptStore()

const isImportMode = ref(true)

// 导入模式的响应式数据
const promptText = ref('')
const promptTitle = ref('')
const outputFormat = ref('text')
const isPublic = ref(false)
const detectedVariables = ref<string[]>([])

// 模板模式的响应式数据
const templateTitle = ref('')
const templateVariables = ref([
  { key: 'role', value: '' },
  { key: 'style', value: '' }
])
const templateInstruction = ref('')
const templateOutputFormat = ref('text')
const templateIsPublic = ref(false)

const submitting = ref(false)

const canSubmit = computed(() => {
  if (!authStore.isAuthenticated) return false
  
  if (isImportMode.value) {
    return promptText.value.trim() !== '' && promptTitle.value.trim() !== ''
  } else {
    return templateTitle.value.trim() !== ''
  }
})

const toggleMode = () => {
  isImportMode.value = !isImportMode.value
}

const analyzePrompt = () => {
  const text = promptText.value
  const variableRegex = /\{([^}]+)\}/g
  const variables = new Set<string>()
  
  let match
  while ((match = variableRegex.exec(text)) !== null) {
    variables.add(match[1])
  }
  
  detectedVariables.value = Array.from(variables)
  
  if (!promptTitle.value && text.trim()) {
    const firstLine = text.split('\n')[0].trim()
    if (firstLine.length > 0 && firstLine.length <= 50) {
      promptTitle.value = firstLine
    } else {
      promptTitle.value = '导入的 Prompt'
    }
  }
}

const removeVariable = (index: number) => {
  detectedVariables.value.splice(index, 1)
}

const addTemplateVariable = () => {
  templateVariables.value.push({ key: '', value: '' })
}

const removeTemplateVariable = (index: number) => {
  templateVariables.value.splice(index, 1)
}

const handleSubmit = async () => {
  if (!canSubmit.value) return
  
  submitting.value = true
  
  try {
    if (isImportMode.value) {
      await handleImport()
    } else {
      await handleCreate()
    }
  } catch (error) {
    console.error('提交失败:', error)
    alert('操作失败，请重试')
  } finally {
    submitting.value = false
  }
}

const handleImport = async () => {
  const variables = detectedVariables.value.map(varName => ({
    key: varName,
    value: ''
  }))
  
  const newPrompt = {
    id: Date.now().toString(),
    title: promptTitle.value.trim(),
    isModified: false,
    variables,
    instruction: promptText.value.trim(),
    inputContent: '',
    isPublic: isPublic.value,
    isFavorite: false
  }
  
  await promptStore.saveConversation(newPrompt)
  // 保存成功后，更新时间戳
  newPrompt.createdAt = new Date().toISOString()
  newPrompt.updatedAt = new Date().toISOString()
  
  emit('imported', newPrompt)
  resetImportForm()
}

const handleCreate = async () => {
  const variables = templateVariables.value
    .filter(v => v.key.trim() !== '')
    .map(v => ({ key: v.key.trim(), value: v.value.trim() }))
  
  const newPrompt = {
    id: Date.now().toString(),
    title: templateTitle.value.trim(),
    isModified: false,
    variables,
    instruction: templateInstruction.value.trim(),
    inputContent: '',
    isPublic: templateIsPublic.value,
    isFavorite: false
  }
  
  await promptStore.saveConversation(newPrompt)
  // 保存成功后，更新时间戳  
  newPrompt.createdAt = new Date().toISOString()
  newPrompt.updatedAt = new Date().toISOString()
  
  emit('created', newPrompt)
  resetTemplateForm()
}

const resetImportForm = () => {
  promptText.value = ''
  promptTitle.value = ''
  outputFormat.value = 'text'
  isPublic.value = false
  detectedVariables.value = []
}

const resetTemplateForm = () => {
  templateTitle.value = ''
  templateVariables.value = [
    { key: 'role', value: '' },
    { key: 'style', value: '' }
  ]
  templateInstruction.value = ''
  templateOutputFormat.value = 'text'
  templateIsPublic.value = false
}

watch(() => props.show, (newVal) => {
  if (!newVal) {
    resetImportForm()
    resetTemplateForm()
    isImportMode.value = true
  }
})
</script>

<style scoped>
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.dark .overflow-y-auto::-webkit-scrollbar-track {
  background: #374151;
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background: #6b7280;
}
</style> 