<template>
    <div class="grid grid-cols-2 gap-6 h-full">
      <div class="space-y-6">
        <!-- Basic Prompt -->
        <div class="space-y-2">
          <label class="block text-sm font-medium">基本 prompt</label>
          <textarea
            v-model="store.basicPrompt"
            class="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white"
            placeholder="输入基本 prompt..."
          />
        </div>
  
        <!-- Variables -->
        <div class="space-y-2">
          <label class="block text-sm font-medium">变量</label>
          <div v-for="(variable, index) in store.variables" :key="index" class="flex gap-2">
            <input
              v-model="variable.key"
              class="flex-1 bg-gray-800 border border-gray-700 rounded p-2"
              placeholder="变量名"
            />
            <input
              v-model="variable.value"
              class="flex-1 bg-gray-800 border border-gray-700 rounded p-2"
              placeholder="变量值"
            />
          </div>
          <button
            @click="addVariable"
            class="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            添加变量
          </button>
        </div>
  
        <!-- Output Requirements -->
        <div class="space-y-2">
          <label class="block text-sm font-medium">输出要求</label>
          <textarea
            v-model="store.outputRequirement"
            class="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg p-3"
            placeholder="输入输出要求..."
          />
        </div>
      </div>
  
      <!-- Output Section -->
      <div class="border border-gray-700 rounded-lg">
        <div class="border-b border-gray-700 p-4 flex justify-between items-center">
          <div class="flex space-x-2">
            <!-- <button
              v-for="format in ['text', 'json', 'yaml']"
              :key="format"
              @click="store.setOutputFormat(format)"
              class="px-3 py-1 rounded"
              :class="store.outputFormat === format ? 'bg-gray-700' : 'hover:bg-gray-800'"
            >
              {{ format }}
            </button> -->
          </div>
          <button class="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600">
            复制
          </button>
        </div>
        <div class="p-4">
          <pre class="whitespace-pre-wrap">{{ store.output }}</pre>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { usePromptStore } from '../stores/prompt'
  
  const store = usePromptStore()
  
  const addVariable = () => {
    store.addVariable('', '')
  }
  </script>