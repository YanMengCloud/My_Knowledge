import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { useArticleStore } from '@/stores/article'
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
  }
})

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

// 初始化 store
const store = useArticleStore()
store.initializeStore()

app.use(router)
app.use(ElementPlus)
app.use(VueMarkdownEditor)

app.mount('#app') 