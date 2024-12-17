<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>文章统计</span>
            </div>
          </template>
          <div class="item">
            <span>总文章数</span>
            <span>{{ articles.length }}</span>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>分类统计</span>
            </div>
          </template>
          <div class="item">
            <span>分类数量</span>
            <span>{{ categories.length }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useArticleStore } from '@/stores/article'

const store = useArticleStore()

const articles = computed(() => store.articles)
const categories = computed(() => store.categories)
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
}

.item span:last-child {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
}
</style>
