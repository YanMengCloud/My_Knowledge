<template>
  <div class="home-container">
    <el-row :gutter="20">
      <el-col 
        v-for="article in filteredArticles" 
        :key="article.id" 
        :span="8"
      >
        <el-card class="article-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <el-button link @click="viewArticle(article.id)">
                {{ article.title }}
              </el-button>
              <el-tag size="small">
                {{ getCategoryName(article.category) }}
              </el-tag>
            </div>
          </template>
          <div class="card-content">
            <div class="preview-text">
              {{ getPreviewText(article.content) }}
            </div>
          </div>
          <div class="card-footer">
            <span class="time">{{ formatDate(article.updateTime) }}</span>
            <el-button 
              type="primary" 
              link
              @click="viewArticle(article.id)"
            >
              阅读全文
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <div v-if="filteredArticles.length === 0" class="no-data">
      <el-empty description="暂无文章" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useArticleStore } from '@/stores/article'
import { format } from 'date-fns'

const route = useRoute()
const router = useRouter()
const store = useArticleStore()

// 根据路由参数过滤文章
const filteredArticles = computed(() => {
  let result = store.articles

  // 按分类筛选
  const categoryId = route.query.category as string
  if (categoryId) {
    result = result.filter(article => article.category === categoryId)
  }

  // 按搜索文本筛选
  const searchText = route.query.search as string
  if (searchText) {
    const searchLower = searchText.toLowerCase()
    result = result.filter(article => 
      article.title.toLowerCase().includes(searchLower) ||
      article.content.toLowerCase().includes(searchLower)
    )
  }

  return result
})

const getCategoryName = (categoryId: string) => {
  const category = store.categories.find(c => c.id === categoryId)
  return category?.name || '未分类'
}

const formatDate = (date: string) => {
  return format(new Date(date), 'yyyy-MM-dd HH:mm')
}

const viewArticle = (id: string) => {
  router.push(`/article/${id}`)
}

// 获取纯文本预览（去除 Markdown 标记）
const getPreviewText = (content: string) => {
  // 移除 Markdown 标记
  const plainText = content
    .replace(/!\[.*?\]\(.*?\)/g, '') // 移除图片
    .replace(/\[.*?\]\(.*?\)/g, '$1') // 保留链接文字
    .replace(/#{1,6}\s/g, '') // 移除标题标记
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // 移除加粗
    .replace(/(\*|_)(.*?)\1/g, '$2') // 移除斜体
    .replace(/`{1,3}[^`]*`{1,3}/g, '') // 移除代码块
    .replace(/^\s*[-+*]\s/gm, '') // 移除列表标记
    .replace(/^\s*\d+\.\s/gm, '') // 移除有序列表标记
    .replace(/\n{2,}/g, '\n') // 将多个换行替换为单个换行
    .trim()

  const previewLength = 100
  if (plainText.length <= previewLength) return plainText
  
  // 找到最后一个完整的句子或段落
  const truncated = plainText.substring(0, previewLength)
  const lastPeriod = truncated.lastIndexOf('。')
  const lastNewline = truncated.lastIndexOf('\n')
  const endPos = Math.max(lastPeriod, lastNewline)
  
  return endPos > 0 ? plainText.substring(0, endPos + 1) + '...' : truncated + '...'
}
</script>

<style scoped>
.home-container {
  padding: 20px;
}

.article-card {
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.article-card:hover {
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header :deep(button) {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  max-width: 70%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}

.card-content {
  min-height: 100px;
}

.preview-text {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.time {
  font-size: 13px;
  color: #999;
}

.no-data {
  margin-top: 40px;
  text-align: center;
}
</style> 