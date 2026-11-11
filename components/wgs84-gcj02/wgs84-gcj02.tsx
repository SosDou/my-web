import type { Dictionary } from "@/i18n/dictionaries/types";
import { ArticleCodeBlock } from "@/components/wgs84-gcj02/codes";
import { TableOfContents } from "@/components/wgs84-gcj02/table-of-contents";
import { WGS84GCJ02Formulas } from "@/components/wgs84-gcj02/formulas";
import { CoordinateComparisonMap } from "@/components/wgs84-gcj02/coordinate-comparison-map";
import { MathBlock } from "../ui/math-block";

type WGS84GCJ02ArticleProps = {
    mapTranslations: Dictionary["map"];
    translations: Dictionary["wgs84Gcj02"];
};

export function WGS84GCJ02Article({
    mapTranslations,
    translations,
}: WGS84GCJ02ArticleProps) {
    return (
        <article className="page-container page-shell">
            <TableOfContents translations={translations} />

            <div className="article-body mt-[var(--ds-gap-stack-lg)] w-full text-left text-[var(--ds-color-foreground)]">
                <h1 id="article-title" className="scroll-mt-6">{translations.title}</h1>
                <p>阅读时长：约 10 分钟 发布时间：2026 年 11 月 11 日</p>

                <hr className="my-6 border-t border-[var(--color-border)] max-sm:my-5" />

                <h2 id="what-is-wgs84-gcj02" className="scroll-mt-6">什么是 WGS84 和 GCJ02</h2>
                <p>WGS84（World Geodetic System 1984）是一种全球通用的地理坐标系统，用于表示地球表面的地理位置。它是 GPS 使用的坐标系统，广泛应用于导航、测绘和地理信息系统中。</p>
                <p>GCJ02（国测局坐标系）是中国国家测绘局制定的一种地理坐标系统，也称为“火星坐标系”。由于中国政府对地图数据的安全性要求，GCJ02 对 WGS84 坐标进行了加密和偏移处理，使得在中国境内使用的地图服务采用了 GCJ02 坐标系。</p>

                <h2 id="wgs84-gcj02-differences" className="scroll-mt-6">WGS84 与 GCJ02 的区别</h2>
                <p>WGS84 是全球通用的坐标系统，而 GCJ02 是中国特有的坐标系统。两者之间的主要区别在于坐标的偏移和加密处理。GCJ02 对 WGS84 坐标进行了加密和偏移，使得在中国境内使用的地图服务显示的位置与实际位置存在一定的偏差。</p>
                <p>因此，在中国境内使用地图服务时，需要将 WGS84 坐标转换为 GCJ02 坐标，以确保位置的准确性。</p>
                <CoordinateComparisonMap labels={translations.map} mapLabels={mapTranslations} />

                <h2 id="wgs84-gcj02-conversion" className="scroll-mt-6">WGS84 与 GCJ02 的转换</h2>
                <p>在中国境内使用地图服务时，通常需要将 WGS84 坐标转换为 GCJ02 坐标。以下是一些常用编程语言中的转换方法。</p>
                <ArticleCodeBlock />

                <h2 id="conversion-explanation" className="scroll-mt-6">转换方法详细解释</h2>
                <p>WGS-84 与 GCJ-02 之间不存在统一的固定偏移量。实际偏移会随坐标位置变化，需要依次经过区域判断、非线性偏移计算和地球椭球体修正。下面按照程序的实际执行顺序拆解这一过程。</p>

                <h3 id="conversion-constants" className="scroll-mt-6">一、常量</h3>
                <p className="font-semibold">1. 中国区域判断范围</p>
                <p>GCJ-02 转换只对中国境内的坐标生效。工程实现通常先使用以下四个边界常量进行快速判断，决定输入坐标是否需要继续转换：</p>

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

                {/* 经纬度相对于参考点的偏移量 */}
                <MathBlock>{WGS84GCJ02Formulas.longitudeAndLatitudeToReferencePointOffsetString}</MathBlock>


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

                {/* 初始经纬度偏移量 */}
                <MathBlock>{WGS84GCJ02Formulas.initialLongitudeAndLatitudeOffsetString}</MathBlock>

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

                {/* WGS84 to GCJ02 经纬度 */}
                <MathBlock>{WGS84GCJ02Formulas.wgs84ToGcj02LongitudeAndLatitudeString}</MathBlock>

                <p>其中，下标 <span className="whitespace-nowrap">WGS</span> 表示原始 WGS-84 坐标，下标 <span className="whitespace-nowrap">GCJ</span> 表示转换后的 GCJ-02 坐标。</p>

                <h3 id="gcj02-to-wgs84" className="scroll-mt-6">四、GCJ-02 反算为 WGS-84</h3>
                <p>这里采用迭代方式近似求解 GCJ-02 到 WGS-84 的逆变换：反复调用前面的正向转换函数，并用预测结果与目标坐标之间的误差修正当前估计值，直至结果收敛。</p>

                <p className="font-semibold">1. 初始化坐标</p>
                <p>设输入的 GCJ-02 坐标为：</p>

                {/* GCJ-02 原始坐标 */}
                <MathBlock>{WGS84GCJ02Formulas.gcj02OriginalCoordinatesString}</MathBlock>

                <p>由于两套坐标通常相距不远，可以直接以输入的 GCJ-02 坐标作为待求 WGS-84 坐标的初始估计：</p>

                {/* 初始化待求解的 WGS-84 经纬度 */}
                <MathBlock>{WGS84GCJ02Formulas.initialWgs84LongitudeAndLatitudeString}</MathBlock>

                <p className="font-semibold">2. 正向转换与误差计算</p>
                <p>第 <span className="whitespace-nowrap">k</span> 次迭代时，将当前 WGS-84 估计值传入正向转换函数 <span className="whitespace-nowrap">F</span>，得到相应的 GCJ-02 预测坐标：</p>

                {/* WGS-84 到 GCJ-02 的正向转换函数 */}
                <MathBlock>{WGS84GCJ02Formulas.wgs84ToGcj02FunctionString}</MathBlock>

                <p>预测坐标与目标 GCJ-02 坐标之差，就是本轮迭代需要消除的纬度误差和经度误差：</p>

                {/* 经纬度误差 */}
                <MathBlock>{WGS84GCJ02Formulas.longitudeAndLatitudeErrorString}</MathBlock>

                <p className="font-semibold">3. 迭代修正</p>
                <p>从当前估计值中减去对应方向的误差，得到下一轮估计值。若迭代收敛，其正向转换结果会逐步逼近目标 GCJ-02 坐标：</p>

                {/* 经纬度误差修正 */}
                <MathBlock>{WGS84GCJ02Formulas.longitudeAndLatitudeCorrectionString}</MathBlock>

                <p className="font-semibold">4. 迭代终止条件</p>
                <p>设置最大迭代次数 <span className="whitespace-nowrap">N</span> 和误差阈值 <span className="whitespace-nowrap">ε</span>。当两个方向的误差都小于阈值时终止迭代：</p>

                {/* 迭代终止条件 */}
                <MathBlock>{WGS84GCJ02Formulas.iterationTerminationConditionString}</MathBlock>

                <p>最大迭代次数用于提供安全上限。如果达到上限后仍未满足误差阈值，程序应停止计算，并根据业务需求返回当前近似结果或报告未收敛。</p>

                <p className="font-semibold">5. 得到 WGS-84 坐标</p>
                <p>满足终止条件后，当前估计值即作为反算得到的 WGS-84 坐标：</p>

                {/* GCJ-02 to WGS-84 经纬度 */}
                <MathBlock>{WGS84GCJ02Formulas.gcj02ToWgs84LongitudeAndLatitudeString}</MathBlock>

                <h2 id="wait-why" className="scroll-mt-6">等一下！这些公式是怎么来的？</h2>
                <p>你肯定想问：</p>

                <p className="font-semibold">1. 经度偏移计算函数</p>
                <MathBlock>{WGS84GCJ02Formulas.longitudeOffsetFunctionString}</MathBlock>

                <p className="font-semibold">2. 纬度偏移计算函数</p>
                <MathBlock>{WGS84GCJ02Formulas.latitudeOffsetFunctionString}</MathBlock>

                <p>这两个奇怪的公式是怎么得到的？</p>
                <p>GCJ-02 的坐标偏移函数并不是通过地球几何或地球物理定律直接推导出来的，而是一套人为构造的非线性坐标扰动模型，由多项式、平方根函数和多组正弦函数组合而成，可以将两个偏移函数统一表示为：</p>

                {/* 非线性坐标扰动模型 */}
                <MathBlock>{WGS84GCJ02Formulas.disturbanceModelString}</MathBlock>

                <p>其中 <span className="whitespace-nowrap">P(x,y)</span> 为多项式部分，用于构建基础偏移变化；<span className="whitespace-nowrap">R(x,y)</span> 为平方根部分，用于引入非线性变化；<span className="whitespace-nowrap">S(x,y)</span> 为正弦扰动部分，用于构建多尺度周期性扰动。</p>
                <p>以经度偏移函数为例：</p>

                {/* 经度偏移函数描述 */}
                <MathBlock>{WGS84GCJ02Formulas.longitudeOffsetFunctionDescriptionString}</MathBlock>

                <h3 id="part-polynomial" className="scroll-mt-6">一、多项式部分</h3>
                <MathBlock>{WGS84GCJ02Formulas.longitudeOffsetFunctionPolynomialPartString}</MathBlock>
                <p>多项式负责描述随位置平滑变化的基础偏移。从数学效果看，常数项 <span className="whitespace-nowrap">300</span> 给出经度方向的基准量；<span className="whitespace-nowrap">x</span> 与 <span className="whitespace-nowrap">2y</span> 控制偏移随经度、纬度变化的一阶趋势；<span className="whitespace-nowrap">0.1x²</span> 引入经度方向的曲率；<span className="whitespace-nowrap">0.1xy</span> 则使经度和纬度不再彼此独立，让同一经度变化在不同纬度上产生不同影响。</p>
                <p>这些系数决定各项在总偏移中的相对权重：常数项确定整体基线，一次项控制变化方向和斜率，二次项与交叉项控制弯曲程度及两个方向的耦合强度。先使用 <span className="whitespace-nowrap">x = λ - 105</span>、<span className="whitespace-nowrap">y = φ - 35</span> 将坐标平移到参考点附近，也能避免直接代入较大的经纬度数值，使各项的量级更容易控制。</p>

                <h3 id="part-square-root" className="scroll-mt-6">二、平方根部分</h3>
                <MathBlock>{WGS84GCJ02Formulas.longitudeOffsetFunctionSquareRootPartString}</MathBlock>
                <p>平方根项补充了多项式难以用少量项表达的非线性变化。绝对值保证 <span className="whitespace-nowrap">x</span> 为负数时仍能得到实数结果；平方根会随 <span className="whitespace-nowrap">|x|</span> 增大而增长，但增长速度逐渐放缓，因此它会在参考经线两侧引入对称、幅度受控的弯曲变化。</p>
                <p>系数 <span className="whitespace-nowrap">0.1</span> 用于压低这一非线性项的权重。在前述矩形筛选范围内，<span className="whitespace-nowrap">0.1√|x|</span> 的值不足约 <span className="whitespace-nowrap">0.58</span>，说明它主要用于细调函数形状，而不是决定偏移的主体大小。这里的数值仍是椭球体修正前的中间量，不能直接理解为米或最终的经度差。</p>

                <h3 id="part-sine-disturbance" className="scroll-mt-6">三、正弦扰动部分</h3>
                <MathBlock>{WGS84GCJ02Formulas.longitudeOffsetFunctionSineDisturbancePartString}</MathBlock>
                <p>正弦函数是这套模型的重要组成部分。叠加不同周期、不同振幅的正弦项，可以让偏移量同时在多个空间尺度上产生平滑的周期性变化。对于一般形式 <span className="whitespace-nowrap">sin(ωx)</span>，周期由角频率 <span className="whitespace-nowrap">ω</span> 决定：</p>
                <MathBlock>{WGS84GCJ02Formulas.sineFunctionPeriodString}</MathBlock>
                <p>例如：</p>
                <MathBlock>{WGS84GCJ02Formulas.sineFunctionPeriodExampleString}</MathBlock>
                <p>经度偏移函数中各正弦项的实际振幅和周期如下。由于 <span className="whitespace-nowrap">x = λ - 105</span>，平移不会改变周期，因此表中的周期单位为经度的度。</p>

                <table>
                    <thead>
                        <tr>
                            <th scope="col">正弦函数</th>
                            <th scope="col">实际振幅</th>
                            <th scope="col">周期</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><span className="whitespace-nowrap">sin(6πx)</span></td>
                            <td><span className="whitespace-nowrap">40/3</span></td>
                            <td><span className="whitespace-nowrap">1/3°</span></td>
                        </tr>
                        <tr>
                            <td><span className="whitespace-nowrap">sin(2πx)</span></td>
                            <td><span className="whitespace-nowrap">40/3</span></td>
                            <td><span className="whitespace-nowrap">1°</span></td>
                        </tr>
                        <tr>
                            <td><span className="whitespace-nowrap">sin(πx)</span></td>
                            <td><span className="whitespace-nowrap">40/3</span></td>
                            <td><span className="whitespace-nowrap">2°</span></td>
                        </tr>
                        <tr>
                            <td><span className="whitespace-nowrap">sin(πx/3)</span></td>
                            <td><span className="whitespace-nowrap">80/3</span></td>
                            <td><span className="whitespace-nowrap">6°</span></td>
                        </tr>
                        <tr>
                            <td><span className="whitespace-nowrap">sin(πx/12)</span></td>
                            <td><span className="whitespace-nowrap">100</span></td>
                            <td><span className="whitespace-nowrap">24°</span></td>
                        </tr>
                        <tr>
                            <td><span className="whitespace-nowrap">sin(πx/30)</span></td>
                            <td><span className="whitespace-nowrap">200</span></td>
                            <td><span className="whitespace-nowrap">60°</span></td>
                        </tr>
                    </tbody>
                </table>

                <p>正弦项前的系数控制振幅：系数的绝对值越大，该项对中间偏移量的最大贡献越大；正弦函数内部乘在 <span className="whitespace-nowrap">x</span> 前的系数控制周期。这里较短周期的项振幅较小，用于叠加局部、细尺度起伏；较长周期的项振幅较大，用于形成更宽缓的区域变化。所有正弦项相加后，会得到比单一周期更复杂、但仍保持连续的空间扰动。</p>
                <p>这种构造在形式上与傅里叶级数使用不同频率的三角函数描述复杂信号相似，但这只能解释各项的数学作用，不能据此认定 GCJ-02 的具体系数是通过傅里叶分析或某种公开拟合过程得到的。现有公开实现并未给出这些常数的权威推导依据，因此无法严格回答为什么恰好选择 <span className="whitespace-nowrap">300</span>、<span className="whitespace-nowrap">0.1</span>、<span className="whitespace-nowrap">40/3</span> 或 <span className="whitespace-nowrap">200</span>；能够确定的是，它们共同定义了该经验模型的基线、趋势、非线性强度、振幅和空间尺度。为了与常见 GCJ-02 转换实现保持一致，工程中应将它们视为固定模型参数，而不应自行调整。</p>

            </div>
        </article>
    );
}
