import { defineStore } from 'pinia'

export interface Article {
  id: string
  title: string
  content: string
  category: string
  createTime: string
  updateTime: string
  isDraft?: boolean
}

interface ArticleState {
  articles: Article[]
  currentArticle: Article | null
  categories: Array<{
    id: string
    name: string
  }>
  drafts: Map<string, Partial<Article>>
}

export const useArticleStore = defineStore('article', {
  state: (): ArticleState => ({
    articles: [],
    currentArticle: null,
    categories: [
      { id: '1', name: '前端开发' },
      { id: '2', name: '后端开发' },
      { id: '3', name: '数据库' }
    ],
    drafts: new Map()
  }),

  getters: {
    getArticleById: (state) => {
      return (id: string) => state.articles.find(article => article.id === id)
    },
    
    getArticlesByCategory: (state) => {
      return (categoryId: string) => 
        state.articles.filter(article => article.category === categoryId)
    }
  },

  actions: {
    // 初始化时从 localStorage 加载数据
    initializeStore() {
      const savedArticles = localStorage.getItem('articles')
      if (savedArticles) {
        this.articles = JSON.parse(savedArticles)
      }
      const savedCategories = localStorage.getItem('categories')
      if (savedCategories) {
        this.categories = JSON.parse(savedCategories)
      }
      // 初始化草稿数据
      const draftsStr = localStorage.getItem('article_drafts')
      if (draftsStr) {
        const draftsObj = JSON.parse(draftsStr)
        this.drafts = new Map(Object.entries(draftsObj))
      }
    },

    // 保存数据到 localStorage
    persistData() {
      localStorage.setItem('articles', JSON.stringify(this.articles))
      localStorage.setItem('categories', JSON.stringify(this.categories))
    },

    async fetchArticles() {
      // 直接返回本地数据
      return this.articles
    },

    async saveArticle(article: Partial<Article>) {
      try {
        const savedArticle: Article = {
          id: article.id || Date.now().toString(),
          title: article.title || '',
          content: article.content || '',
          category: article.category || '',
          createTime: article.id ? (this.articles.find(a => a.id === article.id)?.createTime || new Date().toISOString()) : new Date().toISOString(),
          updateTime: new Date().toISOString()
        }
        
        if (article.id) {
          const index = this.articles.findIndex(a => a.id === article.id)
          if (index !== -1) {
            this.articles[index] = savedArticle
          }
        } else {
          this.articles.push(savedArticle)
        }
        
        // 保存到 localStorage
        this.persistData()
        return savedArticle
      } catch (error) {
        console.error('保存文章失败:', error)
        throw error
      }
    },

    // 保存草稿
    saveDraft(articleId: string, draftData: Partial<Article>) {
      this.drafts.set(articleId, {
        ...this.drafts.get(articleId),
        ...draftData,
        updateTime: new Date().toISOString()
      })

      // 保存到 localStorage
      this.persistDrafts()
    },

    // 获取草稿
    getDraft(articleId: string): Partial<Article> | undefined {
      return this.drafts.get(articleId)
    },

    // 删除草稿
    deleteDraft(articleId: string) {
      this.drafts.delete(articleId)
      this.persistDrafts()
    },

    // 持久化草稿到 localStorage
    persistDrafts() {
      const draftsObj = Object.fromEntries(this.drafts)
      localStorage.setItem('article_drafts', JSON.stringify(draftsObj))
    }
  }
}) 