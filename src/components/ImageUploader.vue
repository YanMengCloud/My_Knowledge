<template>
  <div class="image-uploader">
    <el-upload
      class="upload-component"
      drag
      action="#"
      :auto-upload="false"
      :show-file-list="false"
      :on-change="handleChange"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        拖拽图片到此处或 <em>点击上传</em>
      </div>
    </el-upload>
  </div>
</template>

<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue'
import type { UploadFile } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useImageStore } from '@/stores/image'

const imageStore = useImageStore()
const emit = defineEmits<{
  (e: 'uploaded', imageId: string): void
}>()

const handleChange = async (file: UploadFile) => {
  if (!file.raw) return
  
  // 检查文件类型
  if (!file.raw.type.startsWith('image/')) {
    ElMessage.error('请上传图片文件！')
    return
  }

  // 检查文件大小（限制为 5MB）
  if (file.raw.size > 5 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过 5MB！')
    return
  }

  try {
    // 将文件转换为 Base64
    const reader = new FileReader()
    reader.readAsDataURL(file.raw)
    reader.onload = () => {
      const base64Url = reader.result as string
      // 保存图片并获取ID
      const imageId = imageStore.saveImage(base64Url)
      emit('uploaded', imageId)
    }
  } catch (error) {
    console.error('图片处理失败:', error)
    ElMessage.error('图片处理失败，请重试')
  }
}
</script>

<style scoped>
.image-uploader {
  margin: 10px 0;
}

.upload-component {
  width: 100%;
}

:deep(.el-upload-dragger) {
  width: 100%;
  height: 180px;
}

:deep(.el-icon--upload) {
  margin-top: 40px;
}
</style> 