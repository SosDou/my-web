# 我的个人网站

这是我的个人网站，使用 Next.js 搭建。

## 项目结构

```text
my-web/
├─ app/                                      # Next.js App Router 页面目录
│  ├─ global.css                             # 全局公共样式
│  ├─ robots.ts                              # 动态生成 robots.txt
│  ├─ sitemap.ts                             # 动态生成 sitemap.xml
│  └─ [lang]/                                # 动态语言路由目录
│     ├─ layout.tsx                          # 多语言页面根布局
│     ├─ page.tsx                            # 多语言首页
│     │
│     ├─ articles/                           # 文章页面目录
│     │  └─ page.tsx                         # 文章列表页面
│     │
│     └─ tools/                              # 工具页面目录
│        ├─ page.tsx                         # 工具列表页面
│        │
│        └─ eeg-to-hypnogram/                # eeg-to-hypnogram 页面目录
│           └─ page.tsx                      # eeg-to-hypnogram 页面
│
├─ components/                               # 公共组件目录
│  ├─ eeg-to-hypnogram/                      # eeg-to-hypnogram 组件
│  │  └─ EdfOfflineTool.tsx                  # edf 离线工具
│  │
│  ├─ footer/                                # 页面底部组件
│  │  ├─ footer.module.css                   # Footer 局部样式
│  │  └─ footer.tsx                          # Footer 结构与逻辑
│  │
│  ├─ language-switcher/                     # 语言选择器组件
│  │  ├─ language-switcher.module.css        # 语言选择器局部样式
│  │  └─ language-switcher.tsx               # 语言切换结构与逻辑
│  │
│  ├─ navbar/                                # 顶部导航栏组件
│  │  ├─ navbar.module.css                   # 导航栏局部样式
│  │  └─ navbar.tsx                          # 导航栏结构与逻辑
│  │
│  ├─ theme-switcher
│  │  ├─ theme-switcher-client.tsx           # 主题切换结构与逻辑
│  │  ├─ theme-switcher.module.css           # 主题切换器局部样式
│  │  └─ theme-switcher.tsx                  # 主题切换器
│  │
│  └─ tools/                                 # 工具组件
│     ├─ tools.css                           # 工具局部样式
│     └─ tools.tsx                           # 工具
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
│     ├─ zn-zh/                              # 简体中文翻译内容
│     └─ us-en/                              # 美式英语翻译内容
│
├─ public/                                   # 静态资源目录
│  ├─ favicon.ico                            # 网站浏览器图标
│  └─ _headers                               # Cloudflare 静态资源响应头配置
│
└─ README.md                                 # 项目说明文档
```
