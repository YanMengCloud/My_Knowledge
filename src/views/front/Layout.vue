<template>
  <el-container class="layout-container">
    <el-header class="main-header">
      <nav class="nav-header">
        <router-link to="/" class="logo">个人知识库</router-link>
        <div class="nav-right">
          <el-input
            v-model="searchText"
            placeholder="搜索文章..."
            :prefix-icon="Search"
            @input="handleSearch"
            clearable
          />
          <router-link to="/admin">
            <el-button type="primary">后台管理</el-button>
          </router-link>
        </div>
      </nav>
    </el-header>
    
    <el-container>
      <el-aside width="250px">
        <el-menu
          :default-active="activeCategory"
          class="category-menu"
          @select="handleCategorySelect"
        >
          <el-menu-item index="">全部文章</el-menu-item>
          <el-menu-item 
            v-for="category in categories" 
            :key="category.id"
            :index="category.id"
          >
            {{ category.name }}
          </el-menu-item>
        </el-menu>
      </el-aside>
      
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useArticleStore } from '@/stores/article'
import { Search } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const store = useArticleStore()

const searchText = ref('')
const activeCategory = computed(() => route.query.category as string || '')

const categories = computed(() => store.categories)

let searchTimeout: number | null = null
const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  searchTimeout = window.setTimeout(() => {
    router.push({
      path: '/',
      query: { 
        search: searchText.value.trim(),
        category: activeCategory.value
      }
    })
  }, 300)
}

const handleCategorySelect = (categoryId: string) => {
  router.push({
    path: '/',
    query: { 
      category: categoryId,
      search: searchText.value.trim()
    }
  })
}

const initSearchText = () => {
  const routeSearch = route.query.search as string
  if (routeSearch !== searchText.value) {
    searchText.value = routeSearch || ''
  }
}

initSearchText()

router.afterEach(() => {
  initSearchText()
})
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.main-header {
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  padding: 0 20px;
}

.nav-header {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: #409EFF;
  text-decoration: none;
}

.nav-right {
  display: flex;
  gap: 16px;
  align-items: center;
}

.nav-right .el-input {
  width: 300px;
}

.category-menu {
  height: 100%;
  border-right: 1px solid #dcdfe6;
}

.el-aside {
  background-color: #fff;
}

.el-main {
  background-color: #f5f7fa;
  padding: 20px;
}
</style> 