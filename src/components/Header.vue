<template>
  <header class="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between bg-background text-foreground">
    <div class="flex items-center space-x-4">
      <h2 class="text-lg font-semibold">基本 Prompt</h2>
    </div>
    <div class="flex items-center space-x-4">
      <ThemeSwitcher />
      <button class="rounded border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
        保存
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import ThemeSwitcher from './ThemeSwitcher.vue'
</script>
