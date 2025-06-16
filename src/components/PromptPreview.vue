<template>
  <div class="h-full flex flex-col">
    <!-- 头部信息 -->
    <div class="p-6 border-b border-gray-200 dark:border-gray-700">
      <div class="flex justify-between items-start mb-2">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {{ prompt.title }}
        </h2>
        <div class="flex items-center space-x-2">
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
          <!-- 输出格式 -->
          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
            {{ prompt.outputFormat || 'text' }}
          </span>
        </div>
      </div>
      
      <!-- 指令显示 -->
      <div class="text-sm text-gray-600 dark:text-gray-400">
        <p class="font-medium mb-1">指令内容:</p>
        <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 max-h-24 overflow-y-auto">
          <pre class="whitespace-pre-wrap text-xs">{{ prompt.instruction || '暂无指令内容' }}</pre>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="flex-1 flex overflow-hidden">
      <!-- 左侧：变量输入区 -->
      <div class="w-1/2 p-6 border-r border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">变量输入</h3>
        
        <div v-if="prompt.variables.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
          <svg class="mx-auto h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <p class="text-sm">此提示词没有变量</p>
        </div>
        
        <div v-else class="space-y-4">
          <div
            v-for="variable in prompt.variables"
            :key="variable.key"
            class="space-y-2"
          >
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ variable.key }}
              <span v-if="variable.description" class="text-gray-500 font-normal">
                ({{ variable.description }})
              </span>
            </label>
            <textarea
              v-model="variableValues[variable.key]"
              :placeholder="variable.placeholder || `请输入${variable.key}`"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 resize-none"
              rows="3"
              @input="updatePreview"
            ></textarea>
          </div>
        </div>

        <!-- 输入内容 -->
        <div v-if="prompt.inputContent" class="mt-6">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">输入内容</h4>
          <textarea
            v-model="inputContent"
            placeholder="请输入内容..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 resize-none"
            rows="4"
            @input="updatePreview"
          ></textarea>
        </div>
      </div>

      <!-- 右侧：输出预览区 -->
      <div class="w-1/2 p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">输出预览</h3>
          <button
            @click="generatePreview"
            class="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors duration-200"
            :disabled="generating"
          >
            <svg v-if="generating" class="w-4 h-4 animate-spin mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            {{ generating ? '生成中...' : '生成预览' }}
          </button>
        </div>

        <div class="h-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <!-- 预览内容 -->
          <div v-if="previewContent" class="h-full p-4 overflow-y-auto">
            <div
              v-if="prompt.outputFormat === 'markdown'"
              class="prose prose-sm dark:prose-invert max-w-none"
              v-html="renderedMarkdown"
            ></div>
            <pre v-else class="whitespace-pre-wrap text-sm text-gray-900 dark:text-gray-100">{{ previewContent }}</pre>
          </div>
          
          <!-- 空状态 -->
          <div v-else class="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div class="text-center">
              <svg class="mx-auto h-12 w-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <p class="text-sm">点击"生成预览"查看输出效果</p>
              <p class="text-xs text-gray-400 mt-1">
                {{ prompt.variables.length > 0 ? '请先填写变量值' : '当前提示词无需变量输入' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { marked } from 'marked'

// 定义 props
const props = defineProps<{
  prompt: any
}>()

// 响应式数据
const variableValues = reactive<Record<string, string>>({})
const inputContent = ref('')
const previewContent = ref('')
const generating = ref(false)

// 初始化变量值
const initializeVariables = () => {
  props.prompt.variables.forEach((variable: any) => {
    if (!variableValues[variable.key]) {
      variableValues[variable.key] = ''
    }
  })
}

// 渲染 Markdown
const renderedMarkdown = computed(() => {
  if (props.prompt.outputFormat === 'markdown' && previewContent.value) {
    return marked(previewContent.value)
  }
  return ''
})

// 替换变量的函数
const replaceVariables = (text: string) => {
  let result = text
  props.prompt.variables.forEach((variable: any) => {
    const value = variableValues[variable.key] || `{${variable.key}}`
    result = result.replace(new RegExp(`{${variable.key}}`, 'g'), value)
  })
  return result
}

// 生成完整的提示词
const generateFullPrompt = () => {
  let fullPrompt = props.prompt.instruction || ''
  
  // 替换变量
  fullPrompt = replaceVariables(fullPrompt)
  
  // 添加输入内容
  if (inputContent.value.trim()) {
    fullPrompt += '\n\n' + inputContent.value.trim()
  }
  
  return fullPrompt
}

// 更新预览（实时）
const updatePreview = () => {
  // 这里可以实现实时预览逻辑
  // 目前只是生成完整的提示词作为预览
  const fullPrompt = generateFullPrompt()
  
  // 简单的预览，显示完整的提示词
  previewContent.value = `完整提示词：\n\n${fullPrompt}`
}

// 生成预览（模拟API调用）
const generatePreview = async () => {
  generating.value = true
  
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const fullPrompt = generateFullPrompt()
    
    // 这里应该调用实际的AI API
    // 现在只是模拟返回
    const mockResponse = `基于以下提示词生成的模拟响应：

提示词：
${fullPrompt}

---

模拟AI响应：
这是一个基于您的提示词生成的示例响应。在实际应用中，这里会显示AI模型的真实输出结果。

您可以根据需要调整变量值来获得不同的输出效果。`

    previewContent.value = mockResponse
  } catch (error) {
    previewContent.value = `生成预览时出错：${error}`
  } finally {
    generating.value = false
  }
}

// 监听 prompt 变化，重新初始化
watch(() => props.prompt, () => {
  initializeVariables()
  previewContent.value = ''
  inputContent.value = ''
}, { immediate: true })
</script>

<style scoped>
/* 自定义样式 */
.prose {
  max-width: none;
}

.prose pre {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 0.375rem;
  padding: 1rem;
  overflow-x: auto;
}

.dark .prose pre {
  background-color: #1f2937;
  border-color: #374151;
}
</style> 