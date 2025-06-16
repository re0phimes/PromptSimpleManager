<template>
  <header class="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between bg-background text-foreground">
    <div class="flex items-center space-x-4">
      <h2 class="text-lg font-semibold">Prompt Manager</h2>
    </div>
    <div class="flex items-center space-x-4">
      <ThemeSwitcher />
      
      <!-- 收藏按钮 -->
      <button 
        v-if="authStore.isAuthenticated && promptStore.getActiveConversation"
        @click="promptStore.toggleFavorite(promptStore.getActiveConversation!.id)"
        class="px-3 py-1 rounded border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
        :class="{ 'text-yellow-500': promptStore.getActiveConversation?.isFavorite }"
      >
        {{ promptStore.getActiveConversation?.isFavorite ? '★' : '☆' }}
      </button>
      
      <!-- 保存按钮 -->
      <button 
        v-if="authStore.isAuthenticated && promptStore.getActiveConversation?.isModified"
        @click="saveCurrentPrompt"
        :disabled="loading"
        class="px-4 py-1 rounded border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
      >
        {{ loading ? '保存中...' : '保存' }}
      </button>
      
      <!-- 认证相关按钮 -->
      <div v-if="authStore.isAuthenticated" class="flex items-center space-x-2">
        <span class="text-sm text-gray-600 dark:text-gray-400">
          {{ authStore.user?.email }}
        </span>
        <button 
          @click="authStore.signOut"
          class="px-3 py-1 text-sm rounded border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
        >
          登出
        </button>
      </div>
      <button 
        v-else
        @click="showLoginModal = true"
        class="px-4 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
      >
        登录
      </button>
    </div>
    
    <!-- 登录弹窗 -->
    <LoginModal 
      :show-modal="showLoginModal" 
      @close="showLoginModal = false" 
    />
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ThemeSwitcher from './ThemeSwitcher.vue'
import LoginModal from './LoginModal.vue'
import { useAuthStore } from '@/stores/auth'
import { usePromptStore } from '@/stores/prompt'

const authStore = useAuthStore()
const promptStore = usePromptStore()

const showLoginModal = ref(false)
const loading = ref(false)

const saveCurrentPrompt = async () => {
  const activeConversation = promptStore.getActiveConversation
  if (!activeConversation) return
  
  try {
    loading.value = true
    await promptStore.saveConversation(activeConversation)
  } catch (error) {
    console.error('保存失败:', error)
  } finally {
    loading.value = false
  }
}
</script>
