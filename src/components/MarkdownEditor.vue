<template>
  <div class="markdown-editor">
    <v-md-editor
      v-model="modelValue"
      height="100%"
      :disabled-menus="[]"
      @change="handleChange"
      :toolbar="toolbar"
      @upload-image="handleUploadImage"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}>()

const toolbar = [
  'bold',
  'italic',
  'strikethrough',
  'header',
  'quote',
  'code',
  'link',
  'image',
  'table',
  'list',
  'ordered-list',
  'hr',
  'undo',
  'redo',
  'preview',
  'fullscreen'
]

const handleChange = (text: string) => {
  emit('update:modelValue', text)
  emit('change', text)
}

const handleUploadImage = async (event: any, insertImage: Function) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    // TODO: 实现图片上传逻辑
    const imageUrl = await uploadImage(file)
    insertImage({
      url: imageUrl,
      desc: file.name
    })
  } catch (error) {
    console.error('图片上传失败:', error)
  }
}

// 模拟图片上传
const uploadImage = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      resolve(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  })
}
</script>

<style scoped>
.markdown-editor {
  height: 100%;
}

:deep(.v-md-editor) {
  height: 100% !important;
}

:deep(.v-md-editor__toolbar) {
  border-bottom: 1px solid #dcdfe6;
}
</style> 