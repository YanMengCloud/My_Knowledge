import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/front/Layout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/front/Home.vue')
      },
      {
        path: 'article/:id',
        name: 'Article',
        component: () => import('@/views/front/Article.vue')
      }
    ]
  },
  {
    path: '/admin',
    component: () => import('@/views/admin/Layout.vue'),
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/admin/Dashboard.vue')
      },
      {
        path: 'editor',
        name: 'Editor',
        component: () => import('@/views/admin/Editor.vue')
      },
      {
        path: 'articles',
        name: 'Articles',
        component: () => import('@/views/admin/Articles.vue')
      },
      {
        path: 'categories',
        name: 'Categories',
        component: () => import('@/views/admin/Categories.vue')
      }
    ]
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
}) 