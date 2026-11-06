import type { Dictionary } from "@/i18n/dictionaries/types";
import { ArticleCodeBlock } from "@/components/wgs84-gcj02/codes";
import { TableOfContents } from "@/components/wgs84-gcj02/table-of-contents";
import { WGS84GCJ02Formulas } from "@/components/wgs84-gcj02/formulas";
import { MathBlock } from "../ui/math-block";

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
                <p>在中国境内使用地图服务时，通常需要将 WGS84 坐标转换为 GCJ02 坐标。以下是一些常用编程语言中的转换方法。</p>
                <ArticleCodeBlock />

                <h2 id="conversion-explanation" className="scroll-mt-6">转换方法详细解释</h2>
                <p>WGS-84 与 GCJ-02 之间不存在统一的固定偏移量。实际偏移会随坐标位置变化，需要依次经过区域判断、非线性偏移计算和地球椭球体修正。下面按照程序的实际执行顺序拆解这一过程。</p>

                <h3 id="conversion-constants" className="scroll-mt-6">一、常量</h3>
                <p className="font-semibold">1. 中国区域判断范围</p>
                <p>GCJ-02 转换只对中国境内的坐标生效。工程实现通常先使用以下四个边界常量进行快速判断，决定输入坐标是否需要继续转换：</p>

                {/* 中国最小经度 */}
                <MathBlock>{WGS84GCJ02Formulas.minLongitudeString}</MathBlock>

                {/* 中国最大经度 */}
                <MathBlock>{WGS84GCJ02Formulas.maxLongitudeString}</MathBlock>

                {/* 中国最小纬度 */}
                <MathBlock>{WGS84GCJ02Formulas.minLatitudeString}</MathBlock>

                {/* 中国最大纬度 */}
                <MathBlock>{WGS84GCJ02Formulas.maxLatitudeString}</MathBlock>

                {/* 中国境内的经纬度范围 */}
                <MathBlock>{WGS84GCJ02Formulas.chinaBoundsString}</MathBlock>

                <p>其中，<span className="whitespace-nowrap">λ</span> 表示经度，<span className="whitespace-nowrap">φ</span> 表示纬度。只有经纬度同时落入上述区间时，程序才会继续计算；否则直接返回原坐标。需要注意，这组边界描述的是用于快速筛选的矩形范围，并不是中国国界的精确几何轮廓。</p>

                <p className="font-semibold">2. 地球椭球体参数</p>
                <p>初始偏移量还需要结合地球曲率进行修正。该转换算法使用长半轴 <span className="whitespace-nowrap">a</span> 和第一偏心率平方 <span className="whitespace-nowrap">e²</span> 两个椭球体参数：</p>

                {/* 地球椭球体长半轴 */}
                <MathBlock>{WGS84GCJ02Formulas.aString}</MathBlock>

                {/* 地球椭球体偏心率平方 */}
                <MathBlock>{WGS84GCJ02Formulas.e2String}</MathBlock>

                <h3 id="coordinate-offset-formulas" className="scroll-mt-6">二、坐标偏移计算公式</h3>
                <p>正式计算前，先以 <span className="whitespace-nowrap">105°E、35°N</span> 为参考点对经纬度进行平移。这里的 <span className="whitespace-nowrap">x</span> 表示经度方向的相对量，<span className="whitespace-nowrap">y</span> 表示纬度方向的相对量：</p>

                {/* 经度相对于参考点的偏移量 */}
                <MathBlock>{WGS84GCJ02Formulas.longitudeToReferencePointOffsetString}</MathBlock>

                {/* 纬度相对于参考点的偏移量 */}
                <MathBlock>{WGS84GCJ02Formulas.latitudeToReferencePointOffsetString}</MathBlock>

                <p className="font-semibold">1. 经度偏移计算函数</p>
                <p>将 <span className="whitespace-nowrap">x</span> 和 <span className="whitespace-nowrap">y</span> 代入经度偏移函数，得到尚未经过椭球体修正的经度方向初始偏移。函数由多项式项与多组周期项共同组成：</p>

                {/* 经度偏移函数 */}
                <MathBlock>{WGS84GCJ02Formulas.longitudeOffsetFunctionString}</MathBlock>

                <p className="font-semibold">2. 纬度偏移计算函数</p>
                <p>纬度方向使用结构相近但系数不同的偏移函数。多项式项描述整体变化趋势，多组三角项则叠加不同尺度的周期变化，因此结果会随输入坐标动态改变：</p>

                {/* 纬度偏移函数 */}
                <MathBlock>{WGS84GCJ02Formulas.latitudeOffsetFunctionString}</MathBlock>

                <h3 id="wgs84-to-gcj02" className="scroll-mt-6">三、WGS-84 转换为 GCJ-02</h3>
                <p className="font-semibold">1. 计算初始偏移量</p>
                <p>分别调用纬度与经度偏移函数，得到两个方向上尚未换算为实际角度差的初始偏移量：</p>

                {/* 初始经度偏移量 */}
                <MathBlock>{WGS84GCJ02Formulas.initialLongitudeOffsetString}</MathBlock>

                {/* 初始纬度偏移量 */}
                <MathBlock>{WGS84GCJ02Formulas.initialLatitudeOffsetString}</MathBlock>

                <p className="font-semibold">2. 计算椭球体修正参数</p>
                <p>椭球体修正涉及纬度的正弦和余弦，因此先将原始纬度由角度制转换为弧度制，再计算修正因子 <span className="whitespace-nowrap">M</span> 及其平方根 <span className="whitespace-nowrap">S</span>：</p>

                {/* 纬度的弧度值 */}
                <MathBlock>{WGS84GCJ02Formulas.latitudeRadiansString}</MathBlock>

                {/* 椭球修正因子 */}
                <MathBlock>{WGS84GCJ02Formulas.ellipsoidCorrectionFactorString}</MathBlock>

                {/* 椭球修正因子的平方根 */}
                <MathBlock>{WGS84GCJ02Formulas.ellipsoidCorrectionFactorRootString}</MathBlock>

                <p className="font-semibold">3. 计算纬度偏移量</p>
                <p>将初始纬度偏移量按当前纬度处的子午圈曲率进行缩放，得到以角度表示的纬度偏移量：</p>

                {/* 纬度偏移量 */}
                <MathBlock>{WGS84GCJ02Formulas.latitudeOffsetString}</MathBlock>

                <p className="font-semibold">4. 计算经度偏移量</p>
                <p>经度方向需要按当前纬度处的纬圈半径进行缩放，因此公式中还包含 <span className="whitespace-nowrap">cos(φᵣ)</span>：</p>

                {/* 经度偏移量 */}
                <MathBlock>{WGS84GCJ02Formulas.longitudeOffsetString}</MathBlock>

                <p className="font-semibold">5. 得到 GCJ-02 坐标</p>
                <p>最后，将两个方向的偏移量分别叠加到原始 WGS-84 纬度和经度上，即可得到 GCJ-02 坐标：</p>

                {/* WGS84 to GCJ02 纬度 */}
                <MathBlock>{WGS84GCJ02Formulas.wgs84ToGcj02LatitudeString}</MathBlock>

                {/* WGS84 to GCJ02 经度 */}
                <MathBlock>{WGS84GCJ02Formulas.wgs84ToGcj02LongitudeString}</MathBlock>

                <p>其中，下标 <span className="whitespace-nowrap">WGS</span> 表示原始 WGS-84 坐标，下标 <span className="whitespace-nowrap">GCJ</span> 表示转换后的 GCJ-02 坐标。</p>

                <h3 id="gcj02-to-wgs84" className="scroll-mt-6">四、GCJ-02 反算为 WGS-84</h3>
                <p>这里采用迭代方式近似求解 GCJ-02 到 WGS-84 的逆变换：反复调用前面的正向转换函数，并用预测结果与目标坐标之间的误差修正当前估计值，直至结果收敛。</p>

                <p className="font-semibold">1. 初始化坐标</p>
                <p>设输入的 GCJ-02 坐标为：</p>

                {/* GCJ-02 原始坐标 */}
                <MathBlock>{WGS84GCJ02Formulas.gcj02OriginalCoordinatesString}</MathBlock>

                <p>由于两套坐标通常相距不远，可以直接以输入的 GCJ-02 坐标作为待求 WGS-84 坐标的初始估计：</p>

                {/* 初始化待求解的 WGS-84 纬度 */}
                <MathBlock>{WGS84GCJ02Formulas.initialWgs84LatitudeString}</MathBlock>

                {/* 初始化待求解的 WGS-84 经度 */}
                <MathBlock>{WGS84GCJ02Formulas.initialWgs84LongitudeString}</MathBlock>

                <p className="font-semibold">2. 正向转换与误差计算</p>
                <p>第 <span className="whitespace-nowrap">k</span> 次迭代时，将当前 WGS-84 估计值传入正向转换函数 <span className="whitespace-nowrap">F</span>，得到相应的 GCJ-02 预测坐标：</p>

                {/* WGS-84 到 GCJ-02 的正向转换函数 */}
                <MathBlock>{WGS84GCJ02Formulas.wgs84ToGcj02FunctionString}</MathBlock>

                <p>预测坐标与目标 GCJ-02 坐标之差，就是本轮迭代需要消除的纬度误差和经度误差：</p>

                {/* 纬度误差 */}
                <MathBlock>{WGS84GCJ02Formulas.latitudeErrorString}</MathBlock>

                {/* 经度误差 */}
                <MathBlock>{WGS84GCJ02Formulas.longitudeErrorString}</MathBlock>

                <p className="font-semibold">3. 迭代修正</p>
                <p>从当前估计值中减去对应方向的误差，得到下一轮估计值。若迭代收敛，其正向转换结果会逐步逼近目标 GCJ-02 坐标：</p>

                {/* 纬度误差修正 */}
                <MathBlock>{WGS84GCJ02Formulas.latitudeCorrectionString}</MathBlock>

                {/* 经度误差修正 */}
                <MathBlock>{WGS84GCJ02Formulas.longitudeCorrectionString}</MathBlock>

                <p className="font-semibold">4. 迭代终止条件</p>
                <p>设置最大迭代次数 <span className="whitespace-nowrap">N</span> 和误差阈值 <span className="whitespace-nowrap">ε</span>。当两个方向的误差都小于阈值时终止迭代：</p>

                {/* 迭代终止条件 */}
                <MathBlock>{WGS84GCJ02Formulas.iterationTerminationConditionString}</MathBlock>

                <p>最大迭代次数用于提供安全上限。如果达到上限后仍未满足误差阈值，程序应停止计算，并根据业务需求返回当前近似结果或报告未收敛。</p>

                <p className="font-semibold">5. 得到 WGS-84 坐标</p>
                <p>满足终止条件后，当前估计值即作为反算得到的 WGS-84 坐标：</p>

                {/* GCJ-02 to WGS-84 纬度 */}
                <MathBlock>{WGS84GCJ02Formulas.gcj02ToWgs84LatitudeString}</MathBlock>

                {/* GCJ-02 to WGS-84 经度 */}
                <MathBlock>{WGS84GCJ02Formulas.gcj02ToWgs84LongitudeString}</MathBlock>

                <h2 id="wait-why" className="scroll-mt-6">等一下！这些公式是怎么来的？</h2>
                <p>你肯定想问：</p>

                <p>1. 经度偏移计算函数</p>
                <MathBlock>{WGS84GCJ02Formulas.longitudeOffsetFunctionString}</MathBlock>

                <p>2. 纬度偏移计算函数</p>
                <MathBlock>{WGS84GCJ02Formulas.latitudeOffsetFunctionString}</MathBlock>

                <p>这两个奇怪的公式是怎么得到的？</p>
            </div>
        </article>
    );
}
