<template>
  <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 max-w-sm mx-4">
      <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        {{ isLogin ? '登录' : '注册' }}
      </h2>
      
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            邮箱
          </label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            placeholder="输入你的邮箱"
          />
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            密码
          </label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            placeholder="输入你的密码"
          />
        </div>

        <!-- 注册时显示邀请码输入框 -->
        <div v-if="!isLogin" class="mb-4">
          <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            邀请码 *
          </label>
          <input
            v-model="inviteCode"
            type="text"
            required
            class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            placeholder="请输入邀请码"
          />
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            注册需要有效的邀请码
          </p>
        </div>
        
        <div v-if="error" class="mb-4 text-red-500 text-sm">
          {{ error }}
        </div>
        
        <!-- 登录时显示忘记密码链接 -->
        <div v-if="isLogin" class="mb-4 text-center">
          <button
            type="button"
            @click="handleForgotPassword"
            class="text-blue-500 hover:text-blue-600 text-sm underline mr-4"
          >
            忘记密码？点击重置
          </button>
          <button
            type="button"
            @click="checkUserStatus"
            class="text-green-500 hover:text-green-600 text-sm underline"
          >
            检查用户状态
          </button>
        </div>
        
        <div class="flex gap-2">
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {{ loading ? '处理中...' : (isLogin ? '登录' : '注册') }}
          </button>
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600"
          >
            取消
          </button>
        </div>
      </form>
      
      <div class="mt-4 text-center">
        <button
          @click="isLogin = !isLogin"
          class="text-blue-500 hover:text-blue-600 text-sm"
        >
          {{ isLogin ? '没有账号？点击注册' : '已有账号？点击登录' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{
  showModal: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const authStore = useAuthStore()

const isLogin = ref(true)
const email = ref('')
const password = ref('')
const inviteCode = ref('')
const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''
    
    if (isLogin.value) {
      await authStore.signIn(email.value, password.value)
    } else {
      // 注册时验证邀请码
      if (!inviteCode.value.trim()) {
        throw new Error('请输入邀请码')
      }
      
      // 验证邀请码
      console.log('正在验证邀请码:', inviteCode.value.trim())
      const isValidInvite = await authStore.validateInviteCode(inviteCode.value.trim())
      console.log('邀请码验证结果:', isValidInvite)
      
      if (!isValidInvite) {
        throw new Error('邀请码无效或已被使用')
      }
      
      console.log('开始注册用户...')
      await authStore.signUp(email.value, password.value, inviteCode.value.trim())
      console.log('注册完成')
    }
    
    // 清空表单
    email.value = ''
    password.value = ''
    inviteCode.value = ''
    
    emit('close')
  } catch (err: any) {
    error.value = err.message || '操作失败'
  } finally {
    loading.value = false
  }
}

const handleForgotPassword = async () => {
  if (!email.value.trim()) {
    error.value = '请先输入邮箱地址'
    return
  }
  
  try {
    loading.value = true
    error.value = ''
    
    console.log('🔄 发送密码重置邮件到:', email.value)
    await authStore.resetPassword(email.value)
    
    alert('密码重置邮件已发送，请检查您的邮箱！')
  } catch (err: any) {
    error.value = err.message || '发送重置邮件失败'
    console.error('密码重置失败:', err)
  } finally {
    loading.value = false
  }
}

const checkUserStatus = async () => {
  try {
    loading.value = true
    error.value = ''
    
    console.log('检查用户状态...')
    const userStatus = await authStore.checkUserStatus()
    console.log('用户状态:', userStatus)
    
    if (userStatus === 'active') {
      alert('用户状态正常')
    } else {
      alert('用户状态异常')
    }
  } catch (err: any) {
    error.value = err.message || '检查用户状态失败'
    console.error('检查用户状态失败:', err)
  } finally {
    loading.value = false
  }
}
</script> 