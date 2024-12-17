<template>
  <div class="markdown-preview" v-html="processedContent"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import { useImageStore } from '@/stores/image'

const props = defineProps<{
  content: string
}>()

const imageStore = useImageStore()

// 处理本地图片链接
const processLocalImages = (content: string) => {
  return content.replace(/!\[(.*?)\]\(local:(.*?)\)/g, (match, alt, imageId) => {
    const imageUrl = imageStore.getImage(imageId)
    if (imageUrl) {
      return `<img src="${imageUrl}" alt="${alt || 'image'}" />`
    }
    return match
  })
}

const processedContent = computed(() => {
  const processedMarkdown = processLocalImages(props.content)
  const html = marked(processedMarkdown, {
    breaks: true,
    gfm: true
  })
  return html
})
</script>

<style>
.markdown-preview {
  font-size: 16px;
  line-height: 1.6;
  color: #2c3e50;
}

.markdown-preview img {
  max-width: 100%;
  height: auto;
  margin: 16px 0;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.markdown-preview h1,
.markdown-preview h2,
.markdown-preview h3,
.markdown-preview h4,
.markdown-preview h5,
.markdown-preview h6 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-preview h1 {
  font-size: 2em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid #eaecef;
}

.markdown-preview h2 {
  font-size: 1.5em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid #eaecef;
}

.markdown-preview p {
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-preview code {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: rgba(27, 31, 35, 0.05);
  border-radius: 3px;
}

.markdown-preview pre {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 3px;
}

.markdown-preview pre code {
  display: inline;
  padding: 0;
  margin: 0;
  overflow: visible;
  line-height: inherit;
  word-wrap: normal;
  background-color: transparent;
  border: 0;
}

.markdown-preview blockquote {
  margin: 0;
  padding: 0 1em;
  color: #6a737d;
  border-left: 0.25em solid #dfe2e5;
}

.markdown-preview ul,
.markdown-preview ol {
  padding-left: 2em;
  margin-top: 0;
  margin-bottom: 16px;
}
</style> 