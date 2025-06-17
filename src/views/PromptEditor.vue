<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="w-full px-4 sm:px-6 lg:px-8 py-8">
      <!-- 编辑器头部 -->
      <div class="mb-6">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-4">
            <router-link
              to="/gallery"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
            </router-link>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {{ activeConversation?.title || 'Prompt Editor' }}
            </h1>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- 收藏按钮 -->
            <button 
              v-if="authStore.isAuthenticated && activeConversation"
              @click="promptStore.toggleFavorite(activeConversation.id)"
              class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              :class="{ 'text-yellow-500 border-yellow-300': activeConversation.isFavorite }"
            >
              {{ activeConversation.isFavorite ? '★' : '☆' }} 收藏
            </button>
            
            <!-- 保存按钮 -->
            <button 
              v-if="authStore.isAuthenticated && activeConversation?.isModified"
              @click="saveCurrentPrompt"
              :disabled="loading"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors duration-200"
            >
              {{ loading ? '保存中...' : '保存' }}
            </button>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <!-- 侧边栏和主内容区域 -->
        <div class="flex h-[calc(100vh-12rem)]">
          <!-- 左侧边栏 -->
          <div class="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            <div class="p-4 border-b border-gray-200 dark:border-gray-700">
              <button 
                @click="promptStore.addConversation()"
                class="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                + 新建Prompt
              </button>
            </div>
            
            <!-- 会话列表 -->
            <div class="flex-1 overflow-y-auto">
              <div v-if="promptStore.conversations.length === 0" class="p-4 text-center text-gray-500 dark:text-gray-400">
                暂无保存的提示词
              </div>
              <div v-else class="p-2">
                <div
                  v-for="conversation in promptStore.conversations"
                  :key="conversation.id"
                  @click="promptStore.setActiveConversation(conversation.id)"
                  class="p-3 rounded-lg cursor-pointer transition-colors duration-200 group"
                  :class="conversation.id === promptStore.activeConversationId 
                    ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'"
                >
                  <div class="flex justify-between items-start">
                    <div class="flex-1 min-w-0">
                      <h3 class="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {{ conversation.title }}
                        <span v-if="conversation.isModified" class="text-orange-500">*</span>
                      </h3>
                      <p class="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                        {{ conversation.instruction || '暂无内容' }}
                      </p>
                    </div>
                    <div class="flex items-center space-x-1 ml-2">
                      <!-- 收藏状态 -->
                      <span v-if="conversation.isFavorite" class="text-yellow-500">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      </span>
                      <!-- 删除按钮 -->
                      <button
                        @click.stop="deleteConversation(conversation.id)"
                        class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all duration-200"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 主编辑区域 -->
          <div class="flex-1 flex flex-col">
            <template v-if="activeConversation">
              <div class="flex-1 overflow-hidden">
                <MainContent />
              </div>
            </template>
            <template v-else>
              <div class="flex-1 flex items-center justify-center">
                <div class="text-center">
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">开始编辑</h3>
                  <p class="mt-2 text-gray-500 dark:text-gray-400">选择一个提示词进行编辑，或创建新的提示词</p>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import MainContent from '@/components/MainContent.vue'

import { usePromptStore } from '@/stores/prompt'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const promptStore = usePromptStore()
const authStore = useAuthStore()

const loading = ref(false)

const activeConversation = computed(() => promptStore.getActiveConversation)

const saveCurrentPrompt = async () => {
  const conversation = activeConversation.value
  if (!conversation) return
  
  try {
    loading.value = true
    await promptStore.saveConversation(conversation)
  } catch (error) {
    console.error('保存失败:', error)
  } finally {
    loading.value = false
  }
}

const deleteConversation = async (id: string) => {
  if (confirm('确定要删除这个提示词吗？')) {
    await promptStore.deleteConversation(id)
  }
}
</script> 