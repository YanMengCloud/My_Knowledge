<template>
  <div class="article-container">
    <div class="article-content">
      <h1 class="article-title">{{ article?.title }}</h1>
      <div class="article-meta">
        <span>分类：{{ getCategoryName }}</span>
        <span>{{ formatDate(article?.updateTime || '') }}</span>
      </div>
      <MarkdownPreview :content="article?.content || ''" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useArticleStore } from '@/stores/article'
import { format } from 'date-fns'
import MarkdownPreview from '@/components/MarkdownPreview.vue'

const route = useRoute()
const store = useArticleStore()

const article = computed(() => {
  const id = route.params.id as string
  return store.getArticleById(id)
})

const getCategoryName = computed(() => {
  const category = store.categories.find(c => c.id === article.value?.category)
  return category?.name || '未分类'
})

const formatDate = (date: string) => {
  return format(new Date(date), 'yyyy-MM-dd HH:mm')
}
</script>

<style scoped>
.article-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.article-content {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.article-title {
  margin: 0 0 16px;
  font-size: 2em;
  color: #2c3e50;
}

.article-meta {
  margin-bottom: 32px;
  color: #666;
  font-size: 14px;
  display: flex;
  gap: 16px;
}
</style>