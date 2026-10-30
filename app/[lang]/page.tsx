import { PageProps } from "@/i18n/config";
import { translation } from "@/i18n/translation";
import { Metadata } from "next";

// 生成页面的元数据
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  // 获取当前语言的翻译内容
  const [home, metadata] = await Promise.all([
    translation(params, "home"),
    translation(params, "metadata"),
  ]);

  // 获取 params 中的语言环境
  const { lang } = await params;

  // 返回页面的元数据
  return {
    title: { absolute: home.title + ' | ' + metadata.siteName },
    description: home.description,
    alternates: {
      canonical: `/${lang}`,
    },
  };
}

export default async function Home(_props: PageProps) {

  return (

    <>

    </>
  );
}
