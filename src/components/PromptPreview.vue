<template>
  <div class="h-full flex flex-col">
    <!-- 头部信息 -->
    <div class="p-6 border-b border-gray-200 dark:border-gray-700">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {{ prompt.title }}
            <span v-if="prompt.version" class="ml-2 text-sm text-gray-500 dark:text-gray-400">
              v{{ prompt.version }}
            </span>
          </h2>
          <div class="flex items-center space-x-2 mt-2">
            <!-- 收藏状态 -->
            <span
              v-if="prompt.isFavorite"
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
            >
              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              已收藏
            </span>
            
            <!-- 公开状态 -->
            <span
              v-if="prompt.isPublic"
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
            >
              公开
            </span>
            
            <!-- 创建时间 -->
            <span v-if="prompt.createdAt" class="text-xs text-gray-500 dark:text-gray-400">
              {{ formatDate(prompt.createdAt) }}
            </span>
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="flex items-center space-x-2">
          <button
            @click="copyToClipboard"
            class="flex items-center px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
            复制
          </button>
          
          <button
            @click="customModify"
            class="flex items-center px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            自定义修改
          </button>
        </div>
      </div>
    </div>

    <!-- 完整内容显示 -->
    <div class="flex-1 p-6 overflow-y-auto">
      <div class="space-y-6">
        <!-- 指令内容 -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">指令内容</h3>
          <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <pre class="whitespace-pre-wrap text-sm text-gray-900 dark:text-gray-100">{{ prompt.instruction || '暂无指令内容' }}</pre>
          </div>
        </div>

        <!-- 变量信息 -->
        <div v-if="prompt.variables && prompt.variables.length > 0">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">变量定义</h3>
          <div class="space-y-3">
            <div
              v-for="variable in prompt.variables"
              :key="variable.key"
              class="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
            >
              <div class="flex-1">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400">
                  {{"{"}}{{ variable.key }}{{"}"}}}
                </span>
                <span v-if="variable.value" class="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  默认值: {{ variable.value }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 输入内容 -->
        <div v-if="prompt.inputContent">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">输入内容</h3>
          <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <pre class="whitespace-pre-wrap text-sm text-gray-900 dark:text-gray-100">{{ prompt.inputContent }}</pre>
          </div>
        </div>

        <!-- 完整提示词预览 -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">完整提示词</h3>
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <pre class="whitespace-pre-wrap text-sm text-gray-900 dark:text-gray-100">{{ fullPromptPreview }}</pre>
          </div>
        </div>

        <!-- 元数据 -->
        <div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">输出格式</h4>
            <p class="text-sm text-gray-900 dark:text-gray-100 mt-1">
              {{ formatOutputType(prompt.outputFormat) }}
            </p>
          </div>
          <div>
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">状态</h4>
            <p class="text-sm text-gray-900 dark:text-gray-100 mt-1">
              {{ prompt.isPublic ? '公开' : '私有' }}
            </p>
          </div>
          <div v-if="prompt.updatedAt">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">最后更新</h4>
            <p class="text-sm text-gray-900 dark:text-gray-100 mt-1">
              {{ formatDate(prompt.updatedAt) }}
            </p>
          </div>
          <div>
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">变量数量</h4>
            <p class="text-sm text-gray-900 dark:text-gray-100 mt-1">
              {{ prompt.variables?.length || 0 }} 个
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 复制成功提示 -->
    <div
      v-if="showCopySuccess"
      class="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 transition-opacity duration-300"
      :class="{ 'opacity-0': !showCopySuccess }"
    >
      已复制到剪贴板
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePromptStore } from '@/stores/prompt'

// 定义 props 和 emits
const props = defineProps<{
  prompt: any
}>()

const emit = defineEmits<{
  newVersion: [originalPrompt: any]
}>()

const router = useRouter()
const promptStore = usePromptStore()

const showCopySuccess = ref(false)

// 计算完整提示词预览
const fullPromptPreview = computed(() => {
  let preview = props.prompt.instruction || ''
  
  // 如果有输入内容，添加到预览中
  if (props.prompt.inputContent) {
    preview += '\n\n' + props.prompt.inputContent
  }
  
  return preview || '暂无内容'
})

// 复制到剪贴板
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(fullPromptPreview.value)
    showCopySuccess.value = true
    setTimeout(() => {
      showCopySuccess.value = false
    }, 2000)
  } catch (error) {
    console.error('复制失败:', error)
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = fullPromptPreview.value
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    
    showCopySuccess.value = true
    setTimeout(() => {
      showCopySuccess.value = false
    }, 2000)
  }
}

// 自定义修改 - 创建新版本
const customModify = () => {
  // 创建新版本的提示词
  const currentVersion = props.prompt.version || 1
  const newVersion = currentVersion + 1
  
  const newPrompt = {
    ...props.prompt,
    id: Date.now().toString(),
    title: props.prompt.title + ` v${newVersion}`,
    version: newVersion,
    basePromptId: props.prompt.basePromptId || props.prompt.id,
    originalTitle: props.prompt.originalTitle || props.prompt.title,
    isModified: true,
    createdAt: undefined, // 让 saveConversation 创建新时间戳
    updatedAt: undefined
  }
  
  // 保存新版本并添加到列表
  promptStore.conversations.push(newPrompt)
  
  // 发送事件通知父组件
  emit('newVersion', newPrompt)
  
  // 跳转到编辑器编辑新版本
  promptStore.setActiveConversation(newPrompt.id)
  router.push('/editor')
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return '今天'
  if (diffDays === 2) return '昨天'
  if (diffDays <= 7) return `${diffDays} 天前`
  
  return date.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

// 格式化输出类型
const formatOutputType = (type: string) => {
  const types: Record<string, string> = {
    'text': '纯文本',
    'markdown': 'Markdown',
    'json': 'JSON',
    'yaml': 'YAML',
    'code': '代码'
  }
  return types[type] || '纯文本'
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

/* 代码块样式 */
pre {
  line-height: 1.5;
  word-break: break-word;
}
</style> 