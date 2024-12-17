import { defineStore } from 'pinia'

interface ImageState {
  images: Map<string, string> // imageId -> base64Url
}

export const useImageStore = defineStore('image', {
  state: (): ImageState => ({
    images: new Map()
  }),

  actions: {
    // 初始化时从 localStorage 加载图片数据
    initializeStore() {
      const savedImages = localStorage.getItem('images')
      if (savedImages) {
        this.images = new Map(Object.entries(JSON.parse(savedImages)))
      }
    },

    // 保存图片数据到 localStorage
    persistData() {
      localStorage.setItem('images', JSON.stringify(Object.fromEntries(this.images)))
    },

    // 保存图片并返回图片ID
    saveImage(base64Url: string): string {
      const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      this.images.set(imageId, base64Url)
      this.persistData()
      return imageId
    },

    // 获取图片
    getImage(imageId: string): string | undefined {
      return this.images.get(imageId)
    },

    // 删除图片
    deleteImage(imageId: string) {
      this.images.delete(imageId)
      this.persistData()
    }
  }
}) 