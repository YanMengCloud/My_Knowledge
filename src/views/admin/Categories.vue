<template>
  <div class="categories-manager">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>分类管理</span>
          <el-button type="primary" @click="handleAdd">添加分类</el-button>
        </div>
      </template>
      
      <el-table :data="categories" style="width: 100%">
        <el-table-column prop="name" label="分类名称" />
        <el-table-column prop="id" label="文章数量" width="180">
          <template #default="scope">
            {{ getArticleCount(scope.row.id) }}
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

    <el-dialog
      v-model="dialogVisible"
      :title="editingCategory ? '编辑分类' : '添加分类'"
      width="30%"
    >
      <el-form :model="categoryForm" label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="categoryForm.name" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useArticleStore } from '@/stores/article'
import { ElMessageBox } from 'element-plus'

const store = useArticleStore()

const categories = computed(() => store.categories)
const dialogVisible = ref(false)
const editingCategory = ref<any>(null)
const categoryForm = ref({
  name: ''
})

const getArticleCount = (categoryId: string) => {
  return store.articles.filter(article => article.category === categoryId).length
}

const handleAdd = () => {
  editingCategory.value = null
  categoryForm.value.name = ''
  dialogVisible.value = true
}

const handleEdit = (category: any) => {
  editingCategory.value = category
  categoryForm.value.name = category.name
  dialogVisible.value = true
}

const handleSave = () => {
  if (editingCategory.value) {
    // 编辑现有分类
    const index = store.categories.findIndex(c => c.id === editingCategory.value.id)
    if (index !== -1) {
      store.categories[index].name = categoryForm.value.name
    }
  } else {
    // 添加新分类
    store.categories.push({
      id: Date.now().toString(),
      name: categoryForm.value.name
    })
  }
  dialogVisible.value = false
}

const handleDelete = async (category: any) => {
  const articleCount = getArticleCount(category.id)
  if (articleCount > 0) {
    ElMessageBox.alert(
      '该分类下还有文章，无法删除',
      '警告',
      { type: 'warning' }
    )
    return
  }

  try {
    await ElMessageBox.confirm(
      '确定要删除这个分类吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    const index = store.categories.findIndex(c => c.id === category.id)
    if (index !== -1) {
      store.categories.splice(index, 1)
    }
  } catch {
    // 用户取消删除
  }
}
</script>

<style scoped>
.categories-manager {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
