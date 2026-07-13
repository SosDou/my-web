// 插值变量支持字符串和数字
export type InterpolationValue = string | number;

export type InterpolationValues =
  Record<string, InterpolationValue>;

/**
 * 将文本中的 {{variable}} 替换为对应值。
 */
export function interpolate(
  text: string,
  values: InterpolationValues,
): string {
  return text.replace(
    /\{\{(\w+)\}\}/g,
    (placeholder, key: string) => {
      const value = values[key];

      return value === undefined
        ? placeholder
        : String(value);
    },
  );
}

/**
 * 描述字典经过插值后的类型。
 */
export type Interpolated<T> =
  T extends string
    ? string
    : T extends readonly unknown[]
      ? { [K in keyof T]: Interpolated<T[K]> }
      : T extends object
        ? { [K in keyof T]: Interpolated<T[K]> }
        : T;

/**
 * 递归处理整个字典中的字符串。
 */
export function interpolateDictionary<T>(
  value: T,
  values: InterpolationValues,
): Interpolated<T> {
  // 当前值是字符串时，直接替换占位符。
  if (typeof value === "string") {
    return interpolate(
      value,
      values,
    ) as Interpolated<T>;
  }

  // 当前值是数组时，递归处理数组中的每一项。
  if (Array.isArray(value)) {
    return value.map((item) =>
      interpolateDictionary(item, values),
    ) as Interpolated<T>;
  }

  // 当前值是对象时，递归处理每一个属性。
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(
        value as Record<string, unknown>,
      ).map(([key, item]) => [
        key,
        interpolateDictionary(item, values),
      ]),
    ) as Interpolated<T>;
  }

  // 数字、布尔值和 null 保持不变。
  return value as Interpolated<T>;
}