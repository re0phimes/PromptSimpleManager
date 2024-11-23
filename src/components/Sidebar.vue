<template>
  <aside class="w-64 border-r border-gray-300 flex flex-col">
    <div class="p-4">
      <h1 class="text-xl font-bold">提示工程</h1>
    </div>
    <nav class="flex-1 overflow-auto p-4">
      <div class="space-y-2">
        <div
          v-for="conversation in store.conversations"
          :key="conversation.id"
          class="flex items-center justify-between group"
        >
          <Button
            class="flex-grow text-left px-4 py-2 rounded transition-colors w-full overflow-hidden"
            :class="{ 'bg-gray-700': store.activeConversationId === conversation.id }"
            @click="store.setActiveConversation(conversation.id)"
          >
            <span class="block truncate">{{ conversation.title }}</span>
          </Button>
          <Button
            @click="store.deleteConversation(conversation.id)"
            class="p-2 m-2 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </Button>
        </div>
      </div>
    </nav>
    <div class="p-4 border-t">
      <Button
        @click="store.addConversation"
        class="w-full px-4 py-2 rounded transition-colors"
        :disabled="!canCreateNewConversation"
      >
        新会话
      </Button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePromptStore } from '../stores/prompt'
import { Button } from '@/components/ui/button'


const store = usePromptStore()

const canCreateNewConversation = computed(() => {
  if (!store.activeConversationId) return true
  const activeConversation = store.getActiveConversation
  return !activeConversation || activeConversation.isModified
})
</script>

