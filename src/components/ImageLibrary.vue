<template>
  <div class="image-library">
    <el-dialog
      :model-value="visible"
      @update:model-value="handleVisibleChange"
      title="图片库"
      width="800px"
      :before-close="handleClose"
    >
      <div class="upload-area">
        <el-upload
          class="image-uploader"
          :show-file-list="false"
          :before-upload="beforeUpload"
          action="#"
          :http-request="customUpload"
        >
          <el-button type="primary">上传图片</el-button>
        </el-upload>
      </div>

      <div class="image-grid">
        <div v-for="(url, id) in images" :key="id" class="image-item">
          <el-image
            :src="url"
            fit="cover"
            @click="handleSelect(id, url)"
            class="preview-image"
          />
          <div class="image-actions">
            <el-button 
              type="primary" 
              link 
              @click="handleSelect(id, url)"
            >
              使用
            </el-button>
            <el-button 
              type="danger" 
              link 
              @click="handleDelete(id)"
            >
              删除
            </el-button>
          </div>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useImageStore } from '@/stores/image'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'select', imageId: string, url: string): void
}>()

const imageStore = useImageStore()

const images = computed(() => {
  const allImages: Record<string, string> = {}
  for (const [id, url] of imageStore.images.entries()) {
    allImages[id] = url
  }
  return allImages
})

const handleVisibleChange = (value: boolean) => {
  emit('update:visible', value)
}

const handleClose = () => {
  emit('update:visible', false)
}

const handleSelect = (imageId: string, url: string) => {
  emit('select', imageId, url)
  handleClose()
}

const handleDelete = async (imageId: string) => {
  try {
    imageStore.deleteImage(imageId)
    ElMessage.success('删除成功')
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('只能上传图片文件！')
    return false
  }
  
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB！')
    return false
  }
  
  return true
}

const customUpload = async (options: any) => {
  const file = options.file
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    const base64Url = reader.result as string
    const imageId = imageStore.saveImage(base64Url)
    ElMessage.success('上传成功')
  }
}

const handleUploadSuccess = (imageId: string) => {
  // 这个函数可以移除，因为 el-upload 在使用自定义上传时不会调用这个函数
}
</script>

<style scoped>
.image-library {
  display: flex;
  flex-direction: column;
}

.upload-area {
  margin-bottom: 20px;
  padding: 20px;
  border-radius: 4px;
  background-color: #f5f7fa;
  text-align: center;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 20px;
  max-height: 400px;
  overflow-y: auto;
}

.image-item {
  border: 1px solid #eee;
  border-radius: 4px;
  overflow: hidden;
  background: white;
}

.preview-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  cursor: pointer;
}

.image-actions {
  padding: 8px;
  display: flex;
  justify-content: space-around;
  background: #f8f9fa;
}
</style> 