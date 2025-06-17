<template>
  <div class="p-6">
    <!-- 标题和收藏 -->
    <div class="flex justify-between items-start mb-3">
      <div class="flex-1 min-w-0">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 truncate">
          {{ prompt.title }}
        </h3>
        <span v-if="prompt.version" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 mt-1">
          v{{ prompt.version }}
        </span>
      </div>
      <button
        @click.stop="$emit('toggle-favorite', prompt.id)"
        class="ml-2 text-gray-400 hover:text-yellow-500 transition-colors duration-200"
        :class="{ 'text-yellow-500': prompt.isFavorite }"
      >
        <svg class="w-5 h-5" :fill="prompt.isFavorite ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
        </svg>
      </button>
    </div>

    <!-- 变量预览 -->
    <div v-if="prompt.variables.length > 0" class="mb-3">
      <div class="flex flex-wrap gap-1">
        <span
          v-for="variable in prompt.variables.slice(0, 3)"
          :key="variable.key"
          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
        >
          {{ variable.key }}
        </span>
        <span
          v-if="prompt.variables.length > 3"
          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
        >
          +{{ prompt.variables.length - 3 }}
        </span>
      </div>
    </div>

    <!-- 指令预览 -->
    <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
      {{ prompt.instruction || '暂无指令内容' }}
    </p>

    <!-- 底部信息 -->
    <div class="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
      <div class="flex items-center">
        <span class="capitalize">{{ prompt.outputFormat || 'text' }}</span>
        <span v-if="prompt.isPublic" class="ml-2 text-green-600 dark:text-green-400">公开</span>
      </div>
      <div v-if="prompt.updatedAt">
        {{ formatDate(prompt.updatedAt) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

// 定义 props
defineProps<{
  prompt: any
}>()

// 定义 emits
defineEmits<{
  'toggle-favorite': [id: string]
}>()

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
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 