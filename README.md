## 我的个人网站

这是我的个人网站，使用 Next.js 搭建。

## 项目结构

```text
my-web/
├─ app/                                      # Next.js App Router 页面目录
│  ├─ global.css                             # 全局公共样式
│  ├─ robots.ts                              # 动态生成 robots.txt
│  ├─ sitemap.ts                             # 动态生成 sitemap.xml
│  │
│  └─ [lang]/                                # 动态语言路由目录
│     ├─ layout.tsx                          # 多语言页面根布局
│     ├─ page.tsx                            # 多语言首页
│     │
│     ├─ about/                              # 关于页面目录
│     │  └─ page.tsx                         # 关于页面
│     │
│     ├─ tools/                              # 工具页面目录
│     │  └─ page.tsx                         # 工具列表页面
│     │
│     └─ articles/                           # 文章页面目录
│        └─ page.tsx                         # 文章列表页面
│
├─ components/                               # 公共组件目录
│  ├─ navbar/                                # 顶部导航栏组件
│  │  ├─ navbar.tsx                          # 导航栏结构与逻辑
│  │  └─ navbar.module.css                   # 导航栏局部样式
│  │
│  ├─ language-switcher/                     # 语言选择器组件
│  │  ├─ language-switcher.tsx               # 语言切换结构与逻辑
│  │  └─ language-switcher.module.css        # 语言选择器局部样式
│  │
│  └─ footer/                                # 页面底部组件
│     ├─ footer.tsx                          # Footer 结构与逻辑
│     └─ footer.module.css                   # Footer 局部样式
│
├─ config/                                   # 网站公共配置目录
│  └─ site.ts                                # 网站名称、正式域名和完整 URL 配置
│
├─ i18n/                                     # 多语言功能目录
│  ├─ config.ts                              # 语言列表、类型和映射配置
│  ├─ translation.ts                         # 加载当前语言翻译内容
│  ├─ utils/                                 # 多语言相关工具函数
│  │  ├─ get-locale.ts                       # 获取本地语言函数
│  │  └─ interpolate.ts                      # 文本替换函数
│  │
│  └─ dictionaries/                          # 各语言翻译文件目录
│     ├─ cn-zh.json                          # 简体中文翻译内容
│     └─ us-en.json                          # 美式英语翻译内容
│
├─ public/                                   # 静态资源目录
│  ├─ favicon.ico                            # 网站浏览器图标
│  └─ _headers                               # Cloudflare 静态资源响应头配置
│
├─ .dev.vars                                 # Cloudflare 本地开发环境变量
├─ .gitignore                                # Git 忽略文件配置
├─ eslint.config.mjs                         # ESLint 代码检查配置
├─ middleware.ts                             # Edge Middleware 语言路由处理
├─ next.config.ts                            # Next.js 项目配置
├─ open-next.config.ts                       # OpenNext Cloudflare 适配配置
├─ wrangler.jsonc                            # Cloudflare Workers 部署配置
├─ cloudflare-env.d.ts                       # Cloudflare 环境绑定类型定义
├─ package.json                              # 项目依赖和运行脚本
├─ pnpm-lock.yaml                            # pnpm 依赖版本锁定文件
├─ pnpm-workspace.yaml                       # pnpm 工作区及构建权限配置
├─ postcss.config.js                         # PostCSS 配置
├─ tailwind.config.ts                        # Tailwind CSS 配置
├─ tsconfig.json                             # TypeScript 配置
└─ README.md                                 # 项目说明文档
```