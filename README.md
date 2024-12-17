# My_Knowledge

一个基于 Vue 3 + TypeScript 的个人知识库系统。

## 功能特点

- 📝 Markdown 编辑器，支持实时预览
- 🖼️ 本地图片上传和管理
- 🏷️ 文章分类管理
- 🔍 实时搜索功能
- 📱 响应式布局设计
- 💾 本地数据持久化存储

## 技术栈

- Vue 3
- TypeScript
- Vue Router
- Pinia
- Element Plus
- Markdown Editor

## 开发环境要求

- Node.js >= 16
- npm >= 7

## 安装和运行

1. 克隆项目
```bash
git clone https://github.com/your-username/My_Knowledge.git
cd My_Knowledge
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 构建生产版本
```bash
npm run build
```

## 项目结构

```
src/
├── components/        # 公共组件
├── stores/           # 状态管理
├── views/            # 页面组件
│   ├── admin/        # 后台管理页面
│   └── front/        # 前台展示页面
├── router/           # 路由配置
└── main.ts          # 入口文件
```

## 使用说明

1. 前台页面：
   - 支持文章分���浏览
   - 实时搜索功能
   - 文章详情阅读

2. 后台管理：
   - 文章编辑和管理
   - 分类管理
   - 图片库管理

## License

[MIT](LICENSE) 