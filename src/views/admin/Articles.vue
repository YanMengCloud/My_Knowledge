<template>
  <div class="articles-manager">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>文章管理</span>
          <el-button type="primary" @click="$router.push('/admin/editor')">写文章</el-button>
        </div>
      </template>
      
      <el-table :data="articles" style="width: 100%">
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="category" label="分类">
          <template #default="scope">
            {{ getCategoryName(scope.row.category) }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.updateTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button 
              type="primary" 
              link
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button 
              type="danger" 
              link
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useArticleStore } from '@/stores/article'
import { format } from 'date-fns'
import { ElMessageBox } from 'element-plus'

const router = useRouter()
const store = useArticleStore()

const articles = computed(() => store.articles)

const getCategoryName = (categoryId: string) => {
  const category = store.categories.find(c => c.id === categoryId)
  return category?.name || '未分类'
}

const formatDate = (date: string) => {
  return format(new Date(date), 'yyyy-MM-dd HH:mm')
}

const handleEdit = (article: any) => {
  router.push(`/admin/editor?id=${article.id}`)
}

const handleDelete = async (article: any) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这篇文章吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    // TODO: 实现删除功能
    const index = store.articles.findIndex(a => a.id === article.id)
    if (index !== -1) {
      store.articles.splice(index, 1)
    }
  } catch {
    // 用户取消删除
  }
}
</script>

<style scoped>
.articles-manager {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
