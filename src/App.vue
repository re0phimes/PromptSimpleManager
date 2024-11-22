<template>
  <div class="flex h-screen bg-gray-900 text-white">
    <Sidebar />
    <main class="flex-1 flex flex-col overflow-hidden">
      <Header />
      <div class="flex-1 overflow-auto p-6">
        <MainContent />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'
import MainContent from './components/MainContent.vue'


console.log('Sidebar imported:', Sidebar);
console.log('Header imported:', Header);
console.log('MainContent imported:', MainContent);
</script>