# Vue 3 + TypeScript + Vite + Tailwind css

## 一个基础开发仓库

- 包含了 Vue3, TS, Vite, Tailwind css，支持容器创建。
- 包含了.vscode下的默认devcontianer.json
- 删除了vite创建后`style.css`中对#app容器的大小限制
- 在`App.vue`中国增加了一个基础左右导航的布局。


## 项目结构

```tree
.
├── docker-compose.yml
├── Dockerfile
├── Dockerfile.prod
├── index.html
├── LICENSE
├── package.json
├── package-lock.json
├── public
│   └── vite.svg
├── README.md
├── src
│   ├── App.vue
│   ├── assets
│   │   └── vue.svg
│   ├── components
│   │   └── HelloWorld.vue
│   ├── index.css
│   ├── layout
│   │   └── basic_layout.vue
│   ├── main.ts
│   ├── style.css
│   └── vite-env.d.ts
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.app.tsbuildinfo
├── tsconfig.json
├── tsconfig.node.json
├── tsconfig.node.tsbuildinfo
└── vite.config.ts
```

