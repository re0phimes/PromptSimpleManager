<template>
    <aside class="w-64 border-r border-gray-700 flex flex-col">
      <div class="p-4 border-b border-gray-700">
        <h1 class="text-xl font-bold">提示工程</h1>
      </div>
      <nav class="flex-1 overflow-auto p-4">
        <div class="space-y-2">
          <button
            class="w-full text-left px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            :class="{ 'bg-gray-700': isActive }"
          >
            我用过的 prompt
          </button>
          <!-- Add more navigation items as needed -->
        </div>
      </nav>
    </aside>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  const isActive = ref(true)
  </script>