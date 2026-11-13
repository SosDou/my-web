// 中国境内的经纬度范围
const chinaBoundsString = String.raw`
\begin{aligned}
72.004 \leq \lambda \leq 137.8347 \\
0.8293 \leq \varphi \leq 55.8271
\end{aligned}
`;

// 地球椭球体长半轴
const aString = String.raw`a = 6378245`;

// 地球椭球体偏心率平方
const e2String = String.raw`e^2 = 0.006693421622965943`;

// 经纬度相对于参考点的偏移量
const longitudeAndLatitudeToReferencePointOffsetString = String.raw`
\begin{aligned}
x = \lambda - 105 \\
y = \varphi - 35
\end{aligned}
`;

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
&+ \frac{2}{3}\left[
150\sin\left(\frac{\pi x}{12}\right)
+ 300\sin\left(\frac{\pi x}{30}\right)
\right]
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
&+ \frac{2}{3}\left[
160\sin\left(\frac{\pi y}{12}\right)
+ 320\sin\left(\frac{\pi y}{30}\right)
\right]
\end{aligned}
`;

// ====== WGS84 to GCJ02 ======

// 初始经纬度偏移量
const initialLongitudeAndLatitudeOffsetString = String.raw`
\begin{aligned}
\Delta\lambda_0 = T_{\lambda}(x,y) \\
\Delta\varphi_0 = T_{\varphi}(x,y)
\end{aligned}
`;

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

// WGS84 to GCJ02 经纬度
const wgs84ToGcj02LongitudeAndLatitudeString = String.raw`
\begin{aligned}
\lambda_{GCJ} = \lambda_{WGS}+\Delta\lambda \\
\varphi_{GCJ} = \varphi_{WGS}+\Delta\varphi
\end{aligned}
`;

// ====== GCJ02 to WGS84 ======

// GCJ-02 原始坐标
const gcj02OriginalCoordinatesString = String.raw`(\varphi_{GCJ},\lambda_{GCJ})`;

// 初始化待求解的 WGS-84 经纬度
const initialWgs84LongitudeAndLatitudeString = String.raw`
\begin{aligned}
\lambda_{WGS}^{(0)} = \lambda_{GCJ} \\
\varphi_{WGS}^{(0)} = \varphi_{GCJ}
\end{aligned}
`;

// WGS-84 到 GCJ-02 的正向转换函数
const wgs84ToGcj02FunctionString = String.raw` (\varphi'_k,\lambda'_k) = F(\varphi_k,\lambda_k) `;

// 经纬度误差
const longitudeAndLatitudeErrorString = String.raw`
\begin{aligned}
\varepsilon_{\lambda} = \lambda'_k - \lambda_{GCJ} \\
\varepsilon_{\varphi} = \varphi'_k - \varphi_{GCJ}
\end{aligned}
`;

// 经纬度误差修正
const longitudeAndLatitudeCorrectionString = String.raw`
\begin{aligned}
\lambda_{k+1} = \lambda_k - \varepsilon_{\lambda} \\
\varphi_{k+1} = \varphi_k - \varepsilon_{\varphi}
\end{aligned}
`;

// 迭代终止条件
const iterationTerminationConditionString = String.raw`
|\varepsilon_{\lambda}| < \varepsilon
\quad \land \quad
|\varepsilon_{\varphi}| < \varepsilon
`;

// GCJ-02 to WGS-84 经纬度
const gcj02ToWgs84LongitudeAndLatitudeString = String.raw`
\begin{aligned}
\lambda_{WGS} = \lambda_k \\
\varphi_{WGS} = \varphi_k
\end{aligned}
`;

// 非线性坐标扰动模型
const disturbanceModelString = String.raw`T(x,y) = P(x,y) + R(x) + S(x,y)`;

// 经度偏移函数描述
const longitudeOffsetFunctionDescriptionString = String.raw`
\begin{aligned}
T_{\lambda}(x,y)
= {}&P_{\lambda}(x,y) + R_{\lambda}(x) + S_{\lambda}(x)
\\[12pt]
P_{\lambda}(x,y)
= {}&300 + x + 2y + 0.1x^2 + 0.1xy
\\[8pt]
R_{\lambda}(x)
= {}&0.1\sqrt{|x|}
\\[8pt]
S_{\lambda}(x)
= {}&\frac{40}{3}\left[\sin(6\pi x) + \sin(2\pi x)\right]
\\
&+ \frac{40}{3}\sin(\pi x)
\\
&+ \frac{80}{3}\sin\left(\frac{\pi x}{3}\right)
\\
&+ \frac{2}{3}\left[
150\sin\left(\frac{\pi x}{12}\right)
+ 300\sin\left(\frac{\pi x}{30}\right)
\right]
\end{aligned}
`;

// 经度偏移函数多项式部分
const longitudeOffsetFunctionPolynomialPartString = String.raw`
P_{\lambda}(x,y) = 300 + x + 2y + 0.1x^2 + 0.1xy
`;
// 经度偏移函数平方根部分
const longitudeOffsetFunctionSquareRootPartString = String.raw`
R_{\lambda}(x) = 0.1\sqrt{|x|}
`;

// 经度偏移函数正弦扰动部分
const longitudeOffsetFunctionSineDisturbancePartString = String.raw`
\begin{aligned}
S_{\lambda}(x)
= {}&\frac{40}{3}\left[
\sin(6\pi x)+\sin(2\pi x)
\right]\\[6pt]
&+ \frac{40}{3}\sin(\pi x)\\[6pt]
&+ \frac{80}{3}\sin\left(\frac{\pi x}{3}\right)\\[6pt]
&+ \frac{2}{3}\left[150\sin\left(\frac{\pi x}{12}\right) + 300\sin\left(\frac{\pi x}{30}\right)\right]
\end{aligned}
`;

// 正弦函数的周期及示例
const sineFunctionPeriodString = String.raw`
\sin(\omega x), \qquad T = \frac{2\pi}{|\omega|}
`;

const sineFunctionPeriodExampleString = String.raw`
\sin(6\pi x), \qquad T = \frac{2\pi}{6\pi} = \frac{1}{3}
`;

/** WGS84 与 GCJ02 转换文章中使用的 LaTeX 公式。 */
export class WGS84GCJ02Formulas {
    private constructor() { }

    static readonly chinaBoundsString = chinaBoundsString;
    static readonly aString = aString;
    static readonly e2String = e2String;
    static readonly longitudeAndLatitudeToReferencePointOffsetString = longitudeAndLatitudeToReferencePointOffsetString;
    static readonly longitudeOffsetFunctionString = longitudeOffsetFunctionString;
    static readonly latitudeOffsetFunctionString = latitudeOffsetFunctionString;
    static readonly initialLongitudeAndLatitudeOffsetString = initialLongitudeAndLatitudeOffsetString;
    static readonly latitudeRadiansString = latitudeRadiansString;
    static readonly ellipsoidCorrectionFactorString = ellipsoidCorrectionFactorString;
    static readonly ellipsoidCorrectionFactorRootString = ellipsoidCorrectionFactorRootString;
    static readonly longitudeOffsetString = longitudeOffsetString;
    static readonly latitudeOffsetString = latitudeOffsetString;
    static readonly wgs84ToGcj02LongitudeAndLatitudeString = wgs84ToGcj02LongitudeAndLatitudeString;
    static readonly gcj02OriginalCoordinatesString = gcj02OriginalCoordinatesString;
    static readonly initialWgs84LongitudeAndLatitudeString = initialWgs84LongitudeAndLatitudeString;
    static readonly wgs84ToGcj02FunctionString = wgs84ToGcj02FunctionString;
    static readonly longitudeAndLatitudeErrorString = longitudeAndLatitudeErrorString;
    static readonly longitudeAndLatitudeCorrectionString = longitudeAndLatitudeCorrectionString;
    static readonly iterationTerminationConditionString = iterationTerminationConditionString;
    static readonly gcj02ToWgs84LongitudeAndLatitudeString = gcj02ToWgs84LongitudeAndLatitudeString;
    static readonly disturbanceModelString = disturbanceModelString;
    static readonly longitudeOffsetFunctionDescriptionString = longitudeOffsetFunctionDescriptionString;
    static readonly longitudeOffsetFunctionPolynomialPartString = longitudeOffsetFunctionPolynomialPartString;
    static readonly longitudeOffsetFunctionSquareRootPartString = longitudeOffsetFunctionSquareRootPartString;
    static readonly longitudeOffsetFunctionSineDisturbancePartString = longitudeOffsetFunctionSineDisturbancePartString;
    static readonly sineFunctionPeriodString = sineFunctionPeriodString;
    static readonly sineFunctionPeriodExampleString = sineFunctionPeriodExampleString;
}
