<template>
  <nav class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
    <div class="w-full px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100">
              Prompt Manager
            </h1>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <router-link
              to="/gallery"
              class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
              :class="$route.name === 'Gallery' 
                ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
              Prompt Gallery
            </router-link>
            <router-link
              to="/editor"
              class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
              :class="$route.name === 'Editor' 
                ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              Prompt Editor
            </router-link>
          </div>
        </div>
        
        <!-- 右侧认证相关 -->
        <div class="flex items-center space-x-4">
          <ThemeSwitcher />
          
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
      </div>
      
      <!-- 移动端菜单 -->
      <div class="sm:hidden">
        <div class="pt-2 pb-3 space-y-1">
          <router-link
            to="/gallery"
            class="block pl-3 pr-4 py-2 text-base font-medium transition-colors duration-200"
            :class="$route.name === 'Gallery' 
              ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 text-blue-700 dark:text-blue-300' 
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'"
          >
            Prompt Gallery
          </router-link>
          <router-link
            to="/editor"
            class="block pl-3 pr-4 py-2 text-base font-medium transition-colors duration-200"
            :class="$route.name === 'Editor' 
              ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 text-blue-700 dark:text-blue-300' 
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'"
          >
            Prompt Editor
          </router-link>
        </div>
      </div>
    </div>
    
    <!-- 登录弹窗 -->
    <LoginModal 
      :show-modal="showLoginModal" 
      @close="showLoginModal = false" 
    />
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ThemeSwitcher from './ThemeSwitcher.vue'
import LoginModal from './LoginModal.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const showLoginModal = ref(false)
</script> 