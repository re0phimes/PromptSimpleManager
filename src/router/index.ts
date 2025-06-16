import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/gallery'
  },
  {
    path: '/gallery',
    name: 'Gallery',
    component: () => import('@/views/PromptGallery.vue'),
    meta: {
      title: 'Prompt Gallery'
    }
  },
  {
    path: '/editor',
    name: 'Editor', 
    component: () => import('@/views/PromptEditor.vue'),
    meta: {
      title: 'Prompt Editor'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = `${to.meta.title} - Prompt Manager`
  next()
})

export default router 