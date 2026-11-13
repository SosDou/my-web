import { PageProps } from "@/i18n/config";
import { translation } from "@/i18n/translation";
import { Metadata } from "next";
import { WGS84GCJ02Article } from "@/components/wgs84-gcj02/wgs84-gcj02";

// 生成页面的元数据
export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    // 获取当前语言的翻译内容
    const wgs84Gcj02 = await translation(params, "wgs84Gcj02");

    // 获取 params 中的语言环境
    const { lang } = await params;

    // 返回页面的元数据
    return {
        title: wgs84Gcj02.title,
        description: wgs84Gcj02.description,
        alternates: {
            canonical: `/${lang}/articles/wgs84-gcj02`,
        },
    };
}

export default async function Wgs84Gcj02({ params }: PageProps) {
    const [wgs84Gcj02, map, visualizationWindow] = await Promise.all([
        translation(params, "wgs84Gcj02"),
        translation(params, "map"),
        translation(params, "visualizationWindow"),
    ]);

    return (
        <WGS84GCJ02Article
            mapTranslations={map}
            translations={wgs84Gcj02}
            visualizationTranslations={visualizationWindow}
        />
    );
}
