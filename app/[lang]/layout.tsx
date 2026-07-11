import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/navbar";
import { htmlLangMap, PageParams } from "@/i18n/config";
import "@/app/global.css";

type RootLayoutProps = {
  children: React.ReactNode,
  params: Promise<PageParams>
}

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
