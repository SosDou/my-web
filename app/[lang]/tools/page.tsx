import { PageProps } from "@/i18n/config";
import { translation } from "@/i18n/translation";
import { Metadata } from "next";

// 生成页面的元数据
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  // 获取当前语言的翻译内容
  const t = await translation(params);

  // 获取 params 中的语言环境
  const { lang } = await params;

  // 返回页面的元数据
  return {
    title: t.tools.title,
    description: t.tools.description,
    alternates: {
      canonical: `/${lang}/tools`,
    },
  };
}

export default async function Tools({ params }: PageProps) {
    return (
        <>

        </>
    );
}
