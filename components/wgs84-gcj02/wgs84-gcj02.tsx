import type { Dictionary } from "@/i18n/dictionaries/types";
import { ArticleCodeBlock } from "@/components/wgs84-gcj02/codes";
import { TableOfContents } from "@/components/wgs84-gcj02/table-of-contents";

type WGS84GCJ02ArticleProps = {
    translations: Dictionary["wgs84Gcj02"];
};

export function WGS84GCJ02Article({ translations }: WGS84GCJ02ArticleProps) {
    return (
        <article className="page-container py-10 pb-16 max-sm:py-7 max-sm:pb-12">
            <TableOfContents translations={translations} />

            <div className="mx-auto mt-10 w-full max-w-[760px] space-y-6 text-left text-base leading-8 text-[var(--color-text)] max-sm:mt-7 max-sm:space-y-5 max-sm:leading-7">
                <h1 id="article-title" className="scroll-mt-6">{translations.title}</h1>

                <h2 id="what-is-wgs84-gcj02" className="scroll-mt-6">什么是 WGS84 和 GCJ02</h2>
                <p>WGS84（World Geodetic System 1984）是一种全球通用的地理坐标系统，用于表示地球表面的地理位置。它是 GPS 使用的坐标系统，广泛应用于导航、测绘和地理信息系统中。</p>
                <p>GCJ02（国测局坐标系）是中国国家测绘局制定的一种地理坐标系统，也称为“火星坐标系”。由于中国政府对地图数据的安全性要求，GCJ02 对 WGS84 坐标进行了加密和偏移处理，使得在中国境内使用的地图服务采用了 GCJ02 坐标系。</p>

                <h2 id="wgs84-gcj02-differences" className="scroll-mt-6">WGS84 与 GCJ02 的区别</h2>
                <p>WGS84 是全球通用的坐标系统，而 GCJ02 是中国特有的坐标系统。两者之间的主要区别在于坐标的偏移和加密处理。GCJ02 对 WGS84 坐标进行了加密和偏移，使得在中国境内使用的地图服务显示的位置与实际位置存在一定的偏差。</p>
                <p>因此，在中国境内使用地图服务时，需要将 WGS84 坐标转换为 GCJ02 坐标，以确保位置的准确性。</p>

                <h2 id="wgs84-gcj02-conversion" className="scroll-mt-6">WGS84 与 GCJ02 的转换</h2>
                <p>在中国境内使用地图服务时，通常需要将 WGS84 坐标转换为 GCJ02 坐标。接下来我们来详细介绍一下这个转换过程涉及到的复杂数学计算和偏移处理。</p>
                <ArticleCodeBlock />
            </div>
        </article>
    );
}
