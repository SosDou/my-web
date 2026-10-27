import { EdfOfflineTool } from "@/components/eeg-to-hypnogram/EdfOfflineTool";
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
    title: t.eegToHypnogram.title,
    description: t.eegToHypnogram.description,
    alternates: {
      canonical: `/${lang}/tools/eeg-to-hypnogram`,
    },
  };
}

export default async function EegToHypnogram({ params }: PageProps) {
    const t = await translation(params);

    return (
        <EdfOfflineTool translations={t.eegToHypnogram} />
    );
}
