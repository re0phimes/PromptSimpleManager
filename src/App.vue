<template>
  <div class="flex h-full bg-gray-900 text-white">
    <Sidebar />
    <main class="flex-1 flex flex-col">
      <Header />
      <div class="flex-1 overflow-auto p-6 w-full">
        <MainContent />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'
import MainContent from './components/MainContent.vue'
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html, body, #app {
    @apply h-full w-full m-0 p-0;
  }
}
</style>