// 中国最小经度
const minLongitudeString = String.raw`\lambda_{min} = 72.004`;

// 中国最大经度
const maxLongitudeString = String.raw`\lambda_{max} = 137.8347`;

// 中国最小纬度
const minLatitudeString = String.raw`\varphi_{min} = 0.8293`;

// 中国最大纬度
const maxLatitudeString = String.raw`\varphi_{max} = 55.8271`;

// 中国境内的经纬度范围
const chinaBoundsString = String.raw`
\begin{aligned}
\lambda_{min} \leq \lambda \leq \lambda_{max} \\
\varphi_{min} \leq \varphi \leq \varphi_{max}
\end{aligned}
`;

// 地球椭球体长半轴
const aString = String.raw`a = 6378245`;

// 地球椭球体偏心率平方
const e2String = String.raw`e^2 = 0.006693421622965943`;

// 经度相对于参考点的偏移量
const longitudeToReferencePointOffsetString = String.raw`x = \lambda - 105`;

// 纬度相对于参考点的偏移量
const latitudeToReferencePointOffsetString = String.raw`y = \varphi - 35`;

// 经度偏移函数
const longitudeOffsetFunctionString = String.raw`
\begin{aligned}
T_{\lambda}(x,y) =\;&
300 + x + 2y + 0.1x^2 + 0.1xy \\
&+ 0.1\sqrt{|x|} \\
&+ \frac{40}{3}
\left[\sin(6\pi x)+\sin(2\pi x)\right] \\
&+ \frac{40}{3}\sin(\pi x)
+ \frac{80}{3}\sin\left(\frac{\pi x}{3}\right) \\
&+ 150\sin\left(\frac{\pi x}{12}\right)
+ 300\sin\left(\frac{\pi x}{30}\right)
\end{aligned}
`;

// 纬度偏移函数
const latitudeOffsetFunctionString = String.raw`
\begin{aligned}
T_{\varphi}(x,y) =\;&
-100 + 2x + 3y + 0.2y^2 + 0.1xy \\
&+ 0.2\sqrt{|x|} \\
&+ \frac{40}{3}
\left[\sin(6\pi x)+\sin(2\pi x)\right] \\
&+ \frac{40}{3}\sin(\pi y)
+ \frac{80}{3}\sin\left(\frac{\pi y}{3}\right) \\
&+ 160\sin\left(\frac{\pi y}{12}\right)
+ 320\sin\left(\frac{\pi y}{30}\right)
\end{aligned}
`;

// ====== WGS84 to GCJ02 ======

// 初始经度偏移量
const initialLongitudeOffsetString = String.raw`\Delta\varphi_0 = T_{\varphi}(x,y)`;

// 初始纬度偏移量
const initialLatitudeOffsetString = String.raw`\Delta\lambda_0 = T_{\lambda}(x,y)`;

// 纬度的弧度值
const latitudeRadiansString = String.raw`\varphi_r = \frac{\varphi\pi}{180}`;

// 椭球修正因子
const ellipsoidCorrectionFactorString = String.raw`M = 1-e^2\sin^2(\varphi_r)`;

// 椭球修正因子的平方根
const ellipsoidCorrectionFactorRootString = String.raw`S = \sqrt{M}`;

// 经度偏移量
const longitudeOffsetString = String.raw`
\Delta\lambda =
\frac{
180\Delta\lambda_0\sqrt{M}
}{
\pi a\cos(\varphi_r)
}
`;

// 纬度偏移量
const latitudeOffsetString = String.raw`
\Delta\varphi =
\frac{
180\Delta\varphi_0 M^{\frac{3}{2}}
}{
\pi a(1-e^2)
}
`;

// WGS84 to GCJ02 经度
const wgs84ToGcj02LongitudeString = String.raw`\lambda_{GCJ} = \lambda_{WGS}+\Delta\lambda`;

// WGS84 to GCJ02 纬度
const wgs84ToGcj02LatitudeString = String.raw`\varphi_{GCJ} = \varphi_{WGS}+\Delta\varphi`;

// ====== GCJ02 to WGS84 ======

// GCJ-02 原始坐标
const gcj02OriginalCoordinatesString = String.raw`(\varphi_{GCJ},\lambda_{GCJ})`;

// 初始化待求解的 WGS-84 经度
const initialWgs84LongitudeString = String.raw`\lambda_{WGS}^{(0)} = \lambda_{GCJ}`;

// 初始化待求解的 WGS-84 纬度
const initialWgs84LatitudeString = String.raw`\varphi_{WGS}^{(0)} = \varphi_{GCJ}`;

// WGS-84 到 GCJ-02 的正向转换函数
const wgs84ToGcj02FunctionString = String.raw` (\varphi'_k,\lambda'_k) = F(\varphi_k,\lambda_k) `;

// 经度误差
const longitudeErrorString = String.raw`\varepsilon_{\lambda}=\lambda'_k-\lambda_{GCJ}`;

// 维度误差
const latitudeErrorString = String.raw`\varepsilon_{\varphi}=\varphi'_k-\varphi_{GCJ}`;

// 经度误差修正
const longitudeCorrectionString = String.raw`\lambda_{k+1}=\lambda_k-\varepsilon_{\lambda}`;

// 纬度误差修正
const latitudeCorrectionString = String.raw`\varphi_{k+1}=\varphi_k-\varepsilon_{\varphi}`;

// 迭代终止条件
const iterationTerminationConditionString = String.raw`
|\varepsilon_{\lambda}| < \varepsilon
\quad \land \quad
|\varepsilon_{\varphi}| < \varepsilon
`;

// GCJ-02 to WGS-84 经度
const gcj02ToWgs84LongitudeString = String.raw`\lambda_{WGS} = \lambda_k`;

// GCJ-02 to WGS-84 纬度
const gcj02ToWgs84LatitudeString = String.raw`\varphi_{WGS} = \varphi_k`;

/** WGS84 与 GCJ02 转换文章中使用的 LaTeX 公式。 */
export class WGS84GCJ02Formulas {
    private constructor() { }

    static readonly minLongitudeString = minLongitudeString;
    static readonly maxLongitudeString = maxLongitudeString;
    static readonly minLatitudeString = minLatitudeString;
    static readonly maxLatitudeString = maxLatitudeString;
    static readonly chinaBoundsString = chinaBoundsString;
    static readonly aString = aString;
    static readonly e2String = e2String;
    static readonly longitudeToReferencePointOffsetString = longitudeToReferencePointOffsetString;
    static readonly latitudeToReferencePointOffsetString = latitudeToReferencePointOffsetString;
    static readonly longitudeOffsetFunctionString = longitudeOffsetFunctionString;
    static readonly latitudeOffsetFunctionString = latitudeOffsetFunctionString;
    static readonly initialLongitudeOffsetString = initialLongitudeOffsetString;
    static readonly initialLatitudeOffsetString = initialLatitudeOffsetString;
    static readonly latitudeRadiansString = latitudeRadiansString;
    static readonly ellipsoidCorrectionFactorString = ellipsoidCorrectionFactorString;
    static readonly ellipsoidCorrectionFactorRootString = ellipsoidCorrectionFactorRootString;
    static readonly longitudeOffsetString = longitudeOffsetString;
    static readonly latitudeOffsetString = latitudeOffsetString;
    static readonly wgs84ToGcj02LongitudeString = wgs84ToGcj02LongitudeString;
    static readonly wgs84ToGcj02LatitudeString = wgs84ToGcj02LatitudeString;
    static readonly gcj02OriginalCoordinatesString = gcj02OriginalCoordinatesString;
    static readonly initialWgs84LongitudeString = initialWgs84LongitudeString;
    static readonly initialWgs84LatitudeString = initialWgs84LatitudeString;
    static readonly wgs84ToGcj02FunctionString = wgs84ToGcj02FunctionString;
    static readonly longitudeErrorString = longitudeErrorString;
    static readonly latitudeErrorString = latitudeErrorString;
    static readonly longitudeCorrectionString = longitudeCorrectionString;
    static readonly latitudeCorrectionString = latitudeCorrectionString;
    static readonly iterationTerminationConditionString = iterationTerminationConditionString;
    static readonly gcj02ToWgs84LongitudeString = gcj02ToWgs84LongitudeString;
    static readonly gcj02ToWgs84LatitudeString = gcj02ToWgs84LatitudeString;
}
