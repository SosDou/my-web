import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/navbar";
import { htmlLangMap, PageParams, PageProps } from "@/i18n/config";
import "@/app/global.css";
import { translation } from "@/i18n/translation";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";

type RootLayoutProps = {
  children: React.ReactNode,
  params: Promise<PageParams>
}

// 生成页面元数据的函数
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  // 获取当前语言的翻译内容
  const t = await translation(params);

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: t.metadata.title,
      template: `%s | ${t.metadata.siteName}`,
    },
    description: t.metadata.description,
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
    <html lang={htmlLang}>
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
