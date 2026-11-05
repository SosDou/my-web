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
│     │  ├─ page.tsx                         # 文章列表页面
│     │  └─ wgs84-gcj02/page.tsx             # wgs84-gcj02 页面
│     │
│     └─ tools/                              # 工具页面目录
│        ├─ page.tsx                         # 工具列表页面
│        └─ eeg-to-hypnogram/page.tsx        # eeg-to-hypnogram 页面                  
│
├─ components/                               # 公共组件目录
│  ├─ articles/articles.tsx                  # 文章列表
│  │
│  ├─ eeg-to-hypnogram/                      # eeg-to-hypnogram 组件
│  │  ├─ EdfOfflineTool.tsx                  # edf 离线工具
│  │  ├─ HypnogramPainter.css                # hypnogram 绘图工具局部样式
│  │  └─ HypnogramPainter.tsx                # hypnogram 绘图工具
│  │
│  ├─ footer/footer.tsx                        # 页脚
│  ├─ language-switcher/language-switcher.tsx  # 语言选择器
│  ├─ navbar/navbar.tsx                        # 顶部导航栏
│  │
│  ├─ theme-switcher
│  │  ├─ theme-switcher-client.tsx           # 主题切换结构与逻辑
│  │  └─ theme-switcher.tsx                  # 主题切换器
│  │
│  ├─ tools/tools.tsx                        # 工具列表
│  ├─ ui/                                    # shadcn ui
│  └─ wgs84-gcj02/wgs84-gcj02.tsx            # wgs84-gcj02 组件
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
└─ public/                                   # 静态资源目录
   ├─ favicon.ico                            # 网站浏览器图标
   ├─ _headers                               # Cloudflare 静态资源响应头配置
   └─ eeg-to-hypnogram/                      # eeg-to-hypnogram 浏览器端推理资源
      ├─ eeg_inference.js                    # 自动生成的 WASM 加载器/胶水代码
      ├─ eeg_inference.wasm                  # EDF 解析、EEG 特征处理和睡眠分期预测的 WebAssembly 二进制程序
      ├─ eeg-inference.worker.js             # 推理流程控制器
      └─ sleep_rf.srf.gz.bin                 # 睡眠分期模型
```
