<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="w-full px-4 sm:px-6 lg:px-8 py-8">
      <!-- 页面头部 -->
      <div class="mb-8">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Prompt Gallery
            </h1>
            <p class="mt-2 text-gray-600 dark:text-gray-400">
              管理和浏览你保存的提示词
            </p>
          </div>
          <div class="flex space-x-4">
            <!-- 关闭预览/添加按钮 -->
            <button
              v-if="selectedPrompt || showAddPanel"
              @click="closeAll"
              class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              {{ showAddPanel ? '关闭添加' : '关闭预览' }}
            </button>
            
            <!-- 收藏筛选 -->
            <button
              @click="showFavoritesOnly = !showFavoritesOnly"
              class="px-4 py-2 rounded-lg border transition-colors duration-200"
              :class="showFavoritesOnly 
                ? 'bg-yellow-100 border-yellow-300 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-600 dark:text-yellow-400' 
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'"
            >
              <svg class="w-4 h-4 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              {{ showFavoritesOnly ? '显示全部' : '只显示收藏' }}
            </button>
            
            <!-- 添加Prompt按钮 -->
            <button
              @click="toggleAddPanel"
              class="px-4 py-2 rounded-lg transition-colors duration-200"
              :class="showAddPanel 
                ? 'bg-blue-600 text-white' 
                : 'bg-blue-500 text-white hover:bg-blue-600'"
            >
              <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              {{ showAddPanel ? '关闭添加' : '添加Prompt' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="promptStore.loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>

      <!-- 添加面板（占满整个页面）-->
      <div v-if="showAddPanel" class="h-[calc(100vh-12rem)]">
        <AddPromptPanel 
          :show="showAddPanel"
          @close="closeAddPanel"
          @imported="onPromptImported"
          @created="onPromptCreated"
        />
      </div>

      <!-- 空状态 -->
      <div v-else-if="filteredPrompts.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
          {{ showFavoritesOnly ? '暂无收藏的提示词' : '暂无保存的提示词' }}
        </h3>
        <p class="mt-2 text-gray-500 dark:text-gray-400">
          {{ showFavoritesOnly ? '你还没有收藏任何提示词' : '开始创建你的第一个提示词吧' }}
        </p>
        <button
          @click="toggleAddPanel"
          class="mt-4 inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          添加Prompt
        </button>
      </div>

      <!-- 主要内容区域 -->
      <div v-else class="flex gap-6 h-[calc(100vh-12rem)]">
        <!-- 左侧：提示词列表 -->
        <div :class="getLeftPanelClass()">
          <!-- 网格视图（无选中时）-->
          <div v-if="!selectedPrompt" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div
              v-for="prompt in filteredPrompts"
              :key="prompt.id"
              class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 cursor-pointer"
              @click="selectPrompt(prompt)"
            >
              <PromptCard :prompt="prompt" @toggle-favorite="toggleFavorite" />
            </div>
          </div>

          <!-- 列表视图（有选中时）-->
          <div v-else class="space-y-3 h-full overflow-y-auto">
            <div
              v-for="prompt in filteredPrompts"
              :key="prompt.id"
              class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border transition-all duration-200 cursor-pointer p-4"
              :class="prompt.id === selectedPrompt.id 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-200 dark:border-gray-700 hover:shadow-md'"
              @click="selectPrompt(prompt)"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1 min-w-0">
                  <h3 class="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {{ prompt.title }}
                  </h3>
                  <div class="flex items-center space-x-2 mt-1">
                    <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {{ prompt.instruction || '暂无指令内容' }}
                    </p>
                    <span v-if="prompt.version" class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      v{{ prompt.version }}
                    </span>
                  </div>
                  <!-- 变量标签 -->
                  <div v-if="prompt.variables.length > 0" class="flex flex-wrap gap-1 mt-2">
                    <span
                      v-for="variable in prompt.variables.slice(0, 2)"
                      :key="variable.key"
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                    >
                      {{ variable.key }}
                    </span>
                    <span
                      v-if="prompt.variables.length > 2"
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                    >
                      +{{ prompt.variables.length - 2 }}
                    </span>
                  </div>
                </div>
                <div class="flex items-center space-x-2 ml-3">
                  <!-- 收藏按钮 -->
                  <button
                    @click.stop="toggleFavorite(prompt.id)"
                    class="text-gray-400 hover:text-yellow-500 transition-colors duration-200"
                    :class="{ 'text-yellow-500': prompt.isFavorite }"
                  >
                    <svg class="w-4 h-4" :fill="prompt.isFavorite ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                    </svg>
                  </button>
                  <!-- 编辑按钮 -->
                  <button
                    @click.stop="openPrompt(prompt)"
                    class="text-gray-400 hover:text-blue-500 transition-colors duration-200"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：预览区域 -->
        <div v-if="selectedPrompt" class="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <PromptPreview :prompt="selectedPrompt" @new-version="onNewVersion" />
        </div>
      </div>
    </div>
    

  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePromptStore } from '@/stores/prompt'
import PromptCard from '@/components/PromptCard.vue'
import PromptPreview from '@/components/PromptPreview.vue'
import AddPromptPanel from '@/components/AddPromptPanel.vue'


const router = useRouter()
const route = useRoute()
const promptStore = usePromptStore()

const showFavoritesOnly = ref(false)
const selectedPrompt = ref<any>(null)
const showAddPanel = ref(false)


// 计算过滤后的提示词
const filteredPrompts = computed(() => {
  if (showFavoritesOnly.value) {
    return promptStore.favoritePrompts
  }
  return promptStore.conversations
})

// 选中提示词进行预览
const selectPrompt = (prompt: any) => {
  // 关闭添加面板，显示预览
  showAddPanel.value = false
  selectedPrompt.value = prompt
  promptStore.setActiveConversation(prompt.id)
}

// 关闭预览
const closePreview = () => {
  selectedPrompt.value = null
}

// 关闭所有面板
const closeAll = () => {
  selectedPrompt.value = null
  showAddPanel.value = false
}

// 切换添加面板
const toggleAddPanel = () => {
  if (showAddPanel.value) {
    showAddPanel.value = false
  } else {
    // 关闭预览，显示添加面板
    selectedPrompt.value = null
    showAddPanel.value = true
  }
}

// 打开提示词进行编辑
const openPrompt = (prompt: any) => {
  promptStore.setActiveConversation(prompt.id)
  router.push('/editor')
}

// 切换收藏状态
const toggleFavorite = (promptId: string) => {
  promptStore.toggleFavorite(promptId)
}

// 获取左侧面板的CSS类
const getLeftPanelClass = () => {
  if (selectedPrompt.value) {
    return 'w-1/3 pr-6 border-r border-gray-200 dark:border-gray-700'
  }
  return 'w-full'
}

// 关闭添加面板
const closeAddPanel = () => {
  showAddPanel.value = false
}

// 处理导入的Prompt
const onPromptImported = (prompt: any) => {
  showAddPanel.value = false
  // 直接将新 prompt 添加到 conversations 列表
  promptStore.conversations.push(prompt)
}

// 处理创建的Prompt  
const onPromptCreated = (prompt: any) => {
  showAddPanel.value = false
  // 直接将新 prompt 添加到 conversations 列表
  promptStore.conversations.push(prompt)
}

// 处理新版本创建
const onNewVersion = (newPrompt: any) => {
  // 新版本已经在PreviewComponent中添加到conversations了
  // 这里可以做一些额外的处理，比如显示提示
  console.log('创建了新版本:', newPrompt.title)
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
  
  return date.toLocaleDateString('zh-CN')
}

onMounted(() => {
  promptStore.initializeStore()
  
  // 检查URL参数，如果有import=true，自动打开添加面板
  if (route.query.import === 'true') {
    showAddPanel.value = true
    selectedPrompt.value = null
    // 清除URL参数，避免刷新时重复打开
    router.replace('/gallery')
  }
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 