import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

export default defineConfig([
  // Next.js、React、React Hooks、Core Web Vitals
  ...nextVitals,

  // TypeScript 推荐规则
  ...nextTypeScript,

  // 项目自定义规则
  {
    rules: {
      // 未使用变量显示警告
      // 允许以下划线开头的参数暂时不使用
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // 可以使用 const 时给出警告
      "prefer-const": "warn",

      // 禁止提交 debugger
      "no-debugger": "error",
    },
  },

  // 不参与检查的文件
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "dist/**",
    "coverage/**",
    "node_modules/**",
    "next-env.d.ts",
  ]),
]);