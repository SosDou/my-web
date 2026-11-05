// 中国最小经度
export const minLongitudeString = String.raw`\lambda_{min} = 72.004`;

// 中国最大经度
export const maxLongitudeString = String.raw`\lambda_{max} = 137.8347`;

// 中国最小纬度
export const minLatitudeString = String.raw`\varphi_{min} = 0.8293`;

// 中国最大纬度
export const maxLatitudeString = String.raw`\varphi_{max} = 55.8271`;

// 中国境内的经纬度范围
export const chinaBoundsString = String.raw`
\begin{aligned}
\lambda_{min} \leq \lambda \leq \lambda_{max} \\
\varphi_{min} \leq \varphi \leq \varphi_{max}
\end{aligned}
`;

// 地球椭球体长半轴
export const aString = String.raw`a = 6378245`;

// 地球椭球体偏心率平方
export const e2String = String.raw`e^2 = 0.006693421622965943`;

// 经度相对于参考点的偏移量
export const longitudeToReferencePointOffsetString = String.raw`x = \lambda - 105`;

// 纬度相对于参考点的偏移量
export const latitudeToReferencePointOffsetString = String.raw`y = \varphi - 35`;

// 经度偏移函数
export const longitudeOffsetFunctionString = String.raw`
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
export const latitudeOffsetFunctionString = String.raw`
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
export const initialLongitudeOffsetString = String.raw`\Delta\varphi_0 = T_{\varphi}(x,y)`;

// 初始纬度偏移量
export const initialLatitudeOffsetString = String.raw`\Delta\lambda_0 = T_{\lambda}(x,y)`;

// 纬度的弧度值
export const latitudeRadiansString = String.raw`\varphi_r = \frac{\varphi\pi}{180}`;

// 椭球修正因子
export const ellipsoidCorrectionFactorString = String.raw`M = 1-e^2\sin^2(\varphi_r)`;

// 椭球修正因子的平方根
export const ellipsoidCorrectionFactorRootString = String.raw`S = \sqrt{M}`;

// 经度偏移量
export const longitudeOffsetString = String.raw`
\Delta\lambda =
\frac{
180\Delta\lambda_0\sqrt{M}
}{
\pi a\cos(\varphi_r)
}
`;

// 纬度偏移量
export const latitudeOffsetString = String.raw`
\Delta\varphi =
\frac{
180\Delta\varphi_0 M^{\frac{3}{2}}
}{
\pi a(1-e^2)
}
`;

// WGS84 to GCJ02 经度
export const wgs84ToGcj02LongitudeString = String.raw`\lambda_{GCJ} = \lambda_{WGS}+\Delta\lambda`;

// WGS84 to GCJ02 纬度
export const wgs84ToGcj02LatitudeString = String.raw`\varphi_{GCJ} = \varphi_{WGS}+\Delta\varphi`;

// ====== GCJ02 to WGS84 ======

// GCJ-02 原始坐标
export const gcj02OriginalCoordinatesString = String.raw`(\varphi_{GCJ},\lambda_{GCJ})`;

// 初始化待求解的 WGS-84 经度
export const initialWgs84LongitudeString = String.raw`\lambda_{WGS}^{(0)} = \lambda_{GCJ}`;

// 初始化待求解的 WGS-84 纬度
export const initialWgs84LatitudeString = String.raw`\varphi_{WGS}^{(0)} = \varphi_{GCJ}`;

// WGS-84 到 GCJ-02 的正向转换函数
export const wgs84ToGcj02FunctionString = String.raw` (\varphi'_k,\lambda'_k) = F(\varphi_k,\lambda_k) `;

// 经度误差
export const longitudeErrorString = String.raw`\varepsilon_{\lambda}=\lambda'_k-\lambda_{GCJ}`;

// 维度误差
export const latitudeErrorString = String.raw`\varepsilon_{\varphi}=\varphi'_k-\varphi_{GCJ}`;

// 经度误差修正
export const longitudeCorrectionString = String.raw`\lambda_{k+1}=\lambda_k-\varepsilon_{\lambda}`;

// 纬度误差修正
export const latitudeCorrectionString = String.raw`\varphi_{k+1}=\varphi_k-\varepsilon_{\varphi}`;

// 迭代终止条件
export const iterationTerminationConditionString = String.raw`
|\varepsilon_{\lambda}| < \varepsilon
\quad \land \quad
|\varepsilon_{\varphi}| < \varepsilon
`;

// GCJ-02 to WGS-84 经度
export const gcj02ToWgs84LongitudeString = String.raw`\lambda_{WGS} = \lambda_k`;

// GCJ-02 to WGS-84 纬度
export const gcj02ToWgs84LatitudeString = String.raw`\varphi_{WGS} = \varphi_k`;