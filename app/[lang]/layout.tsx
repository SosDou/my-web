import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/navbar";
import { htmlLangMap, PageParams, PageProps } from "@/i18n/config";
import "@/app/global.css";
import "katex/dist/katex.min.css";
import { translation } from "@/i18n/translation";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";

const themeInitializationScript = `
  (() => {
    try {
      const savedTheme = window.localStorage.getItem("theme");
      const theme = savedTheme === "light" || savedTheme === "dark"
        ? savedTheme
        : "system";
      const resolvedTheme = theme === "system"
        ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        : theme;

      document.documentElement.dataset.theme = resolvedTheme;
    } catch {
      document.documentElement.dataset.theme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
  })();
`;

type RootLayoutProps = {
  children: React.ReactNode,
  params: Promise<PageParams>
}

// 生成页面元数据的函数
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  // 获取当前语言的翻译内容
  const metadata = await translation(params, "metadata");

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: metadata.title,
      template: `%s | ${metadata.siteName}`,
    },
    description: metadata.description,
  };
}

// 根布局组件
export default async function RootLayout({
  children,
  params
}: RootLayoutProps) {
  // 获取 params 中的语言环境
  const { lang } = await params;

  // 将 params 中的语言环境映射为 HTML 语言环境
  const htmlLang = htmlLangMap[lang as keyof typeof htmlLangMap];

  return (
    <html lang={htmlLang} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitializationScript }} />
      </head>
      <body>
        <Navbar params={params} />

        <main className="site-main">
          {children}
        </main>

        <Footer params={params} />
      </body>
    </html>
  );
}
