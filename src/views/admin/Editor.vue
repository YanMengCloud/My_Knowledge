<template>
  <div class="editor-container">
    <div class="editor-header">
      <el-input
        v-model="articleTitle"
        placeholder="请输入文章标题"
        class="title-input"
        size="large"
      />
      <div class="header-right">
        <el-button @click="showImageLibrary = true">
          图片库
        </el-button>
        <el-select v-model="selectedCategory" placeholder="选择分类" size="default">
          <el-option
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          />
        </el-select>
        <el-button-group>
          <el-button type="primary" @click="handleSave">保存文章</el-button>
        </el-button-group>
        <span class="auto-save-status">{{ lastSaveTime ? `上次保存：${lastSaveTime}` : '' }}</span>
      </div>
    </div>

    <div class="editor-main">
      <div class="editor-wrapper">
        <v-md-editor
          v-model="content"
          height="100%"
          @change="handleContentChange"
          @upload-image="handleUploadImage"
        />
      </div>
    </div>

    <ImageLibrary
      v-model:visible="showImageLibrary"
      @select="handleImageSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useArticleStore } from '@/stores/article'
import { useImageStore } from '@/stores/image'
import { ElMessage } from 'element-plus'
import { format } from 'date-fns'
import ImageLibrary from '@/components/ImageLibrary.vue'
import VueMarkdownEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'
import Prism from 'prismjs'

// 配置编辑器
VueMarkdownEditor.use(githubTheme, {
  Prism,
  codeHighlightExtensionMap: {
    vue: 'html'
  },
  markdownParser: (content) => {
    // 处理本地图片链接
    const processedContent = content.replace(/!\[(.*?)\]\(local:(.*?)\)/g, (match, alt, imageId) => {
      const imageUrl = imageStore.getImage(imageId)
      return imageUrl ? `![${alt}](${imageUrl})` : match
    })
    return processedContent
  }
})

const route = useRoute()
const router = useRouter()
const store = useArticleStore()
const imageStore = useImageStore()

const articleTitle = ref('')
const content = ref('')
const selectedCategory = ref('')
const autoSaveInterval = ref<number | null>(null)
const lastSaveTime = ref<string>('')

const categories = store.categories

// 添加图片库状态
const showImageLibrary = ref(false)

// 自动保存函数
const autoSave = () => {
  const articleId = route.query.id as string || 'new'
  const draftData = {
    title: articleTitle.value,
    content: content.value,
    category: selectedCategory.value
  }

  if (draftData.title || draftData.content || draftData.category) {
    store.saveDraft(articleId, draftData)
    const now = new Date()
    lastSaveTime.value = format(now, 'HH:mm:ss')
    console.log('自动保存成功:', lastSaveTime.value)
  }
}

// 开始自动保存
const startAutoSave = () => {
  autoSaveInterval.value = window.setInterval(autoSave, 30000) // 每30秒自动保存一次
}

// 停止自动保存
const stopAutoSave = () => {
  if (autoSaveInterval.value) {
    clearInterval(autoSaveInterval.value)
    autoSaveInterval.value = null
  }
}

// 加载草稿
const loadDraft = () => {
  const articleId = route.query.id as string || 'new'
  const draft = store.getDraft(articleId)
  if (draft) {
    ElMessage.info('检测到未保存的草稿，已恢复编辑状态')
    articleTitle.value = draft.title || ''
    content.value = draft.content || ''
    selectedCategory.value = draft.category || ''
  }
}

// 保存文章时清除草稿
const handleSave = async () => {
  if (!articleTitle.value.trim()) {
    ElMessage.warning('请输入文章标题')
    return
  }

  if (!content.value.trim()) {
    ElMessage.warning('请输入文章内容')
    return
  }

  if (!selectedCategory.value) {
    ElMessage.warning('请选择文章分类')
    return
  }

  try {
    const articleData = {
      id: route.query.id as string,
      title: articleTitle.value,
      content: content.value,
      category: selectedCategory.value,
      updateTime: new Date().toISOString()
    }

    await store.saveArticle(articleData)
    // 保存成功后清除草稿
    store.deleteDraft(route.query.id as string || 'new')
    ElMessage.success('保存成功')
    router.push('/admin')
  } catch (error) {
    ElMessage.error('保存失败')
    console.error('保存文章失败:', error)
  }
}

// 监听内容变化
const handleContentChange = () => {
  autoSave()
}

// 获取分类名称
const getCategoryName = computed(() => {
  const category = categories.find(c => c.id === selectedCategory.value)
  return category?.name || '未分类'
})

// 格式化日期
const formatDate = (date: string) => {
  return format(new Date(date), 'yyyy-MM-dd HH:mm')
}

// 添加图片上传处理函数
const handleUploadImage = async (event: any, insertImage: any) => {
  const file = event.files[0]
  if (!file) return
  
  if (!file.type.startsWith('image/')) {
    ElMessage.error('请上传图片文件！')
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过 5MB！')
    return
  }

  try {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const base64Url = reader.result as string
      const imageId = imageStore.saveImage(base64Url)
      insertImage({
        url: base64Url,
        desc: `local:${imageId}`
      })
    }
  } catch (error) {
    console.error('图片处理失败:', error)
    ElMessage.error('图片处理失败，请重试')
  }
}

// 添加图片库选择处理函数
const handleImageSelect = (imageId: string, url: string) => {
  const imageMarkdown = `![image](local:${imageId})\n`
  content.value += imageMarkdown
  handleContentChange()
}

onMounted(() => {
  imageStore.initializeStore()
  // 加载文章或草稿
  const articleId = route.query.id as string
  if (articleId) {
    const article = store.getArticleById(articleId)
    if (article) {
      articleTitle.value = article.title
      content.value = article.content
      selectedCategory.value = article.category
    }
  }
  
  // 检查是否有草稿
  loadDraft()
  
  // 启动自动保存
  startAutoSave()
})

onBeforeUnmount(() => {
  // 组件卸载前停止自动保存
  stopAutoSave()
})
</script>

<style scoped>
/* 基础布局 */
.editor-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  padding: 20px;
}

.editor-header {
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-input {
  width: 500px;
}

.header-right {
  display: flex;
  gap: 16px;
  align-items: center;
}

.editor-main {
  flex: 1;
  display: flex;
  gap: 20px;
  min-height: 0;
}

.editor-wrapper {
  flex: 1;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

/* 编辑器样式覆盖 */
:deep(.v-md-editor) {
  border: none !important;
  height: 100% !important;
}

:deep(.v-md-editor__menu-bar) {
  border-bottom: 1px solid #eee !important;
}

:deep(.v-md-editor__editor-wrapper) {
  flex: 1 !important;
  height: auto !important;
}

:deep(.v-md-editor__preview) {
  padding: 20px !important;
  border-left: 1px solid #eee !important;
}

/* 图片样式 */
:deep(.v-md-editor__preview img) {
  max-width: 100% !important;
  height: auto !important;
  margin: 16px 0 !important;
  border-radius: 4px !important;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1) !important;
}

.auto-save-status {
  color: #909399;
  font-size: 13px;
  margin-left: 16px;
  white-space: nowrap;
}
</style> 