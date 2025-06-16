<template>
  <!-- 弹窗遮罩 -->
  <div
    v-if="showModal"
    class="fixed inset-0 z-50 overflow-y-auto"
    @click.self="$emit('close')"
  >
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" @click="$emit('close')">
        <div class="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
      </div>

      <!-- 弹窗内容 -->
      <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
        <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <!-- 头部 -->
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
              导入 Prompt
            </h3>
            <button
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

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

          <!-- 主体内容 -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        </div>

        <!-- 底部按钮 -->
        <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            @click="importPrompt"
            :disabled="!canImport || importing"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="importing" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle>
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" class="opacity-75"></path>
            </svg>
            {{ importing ? '导入中...' : '导入 Prompt' }}
          </button>
          <button
            @click="$emit('close')"
            type="button"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { usePromptStore } from '@/stores/prompt'

// 定义 props 和 emits
const props = defineProps<{
  showModal: boolean
}>()

const emit = defineEmits<{
  close: []
  imported: [prompt: any]
}>()

// 使用 stores
const authStore = useAuthStore()
const promptStore = usePromptStore()

// 响应式数据
const promptText = ref('')
const promptTitle = ref('')
const outputFormat = ref('text')
const isPublic = ref(false)
const detectedVariables = ref<string[]>([])
const importing = ref(false)

// 计算属性
const canImport = computed(() => {
  return authStore.isAuthenticated && promptText.value.trim() !== '' && promptTitle.value.trim() !== ''
})

// 分析Prompt，提取变量
const analyzePrompt = () => {
  const text = promptText.value
  const variableRegex = /\{([^}]+)\}/g
  const variables = new Set<string>()
  
  let match
  while ((match = variableRegex.exec(text)) !== null) {
    variables.add(match[1])
  }
  
  detectedVariables.value = Array.from(variables)
  
  // 如果没有标题，尝试从内容生成一个
  if (!promptTitle.value && text.trim()) {
    const firstLine = text.split('\n')[0].trim()
    if (firstLine.length > 0 && firstLine.length <= 50) {
      promptTitle.value = firstLine
    } else {
      promptTitle.value = '导入的 Prompt'
    }
  }
}

// 移除变量
const removeVariable = (index: number) => {
  detectedVariables.value.splice(index, 1)
}

// 导入Prompt
const importPrompt = async () => {
  if (!canImport.value) return
  
  importing.value = true
  
  try {
    // 构建变量数组
    const variables = detectedVariables.value.map(varName => ({
      key: varName,
      description: '',
      placeholder: `请输入${varName}`
    }))
    
    // 创建新的Prompt对象
    const newPrompt = {
      id: Date.now().toString(),
      title: promptTitle.value.trim(),
      variables,
      instruction: promptText.value.trim(),
      inputContent: '',
      outputFormat: outputFormat.value,
      isPublic: isPublic.value,
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // 保存到store
    await promptStore.saveConversation(newPrompt)
    
    // 通知父组件导入成功
    emit('imported', newPrompt)
    
    // 重置表单
    resetForm()
    
  } catch (error) {
    console.error('导入Prompt失败:', error)
    alert('导入失败，请重试')
  } finally {
    importing.value = false
  }
}

// 重置表单
const resetForm = () => {
  promptText.value = ''
  promptTitle.value = ''
  outputFormat.value = 'text'
  isPublic.value = false
  detectedVariables.value = []
}

// 监听弹窗关闭，重置表单
watch(() => props.showModal, (newVal) => {
  if (!newVal) {
    resetForm()
  }
})
</script>

<style scoped>
/* 自定义滚动条样式 */
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