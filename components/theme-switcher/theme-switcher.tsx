import type { PageProps } from "@/i18n/config";
import { translation } from "@/i18n/translation";
import ThemeSwitcherClient from "./theme-switcher-client";

/* 定义主题选择器的服务端组件。 */
export default async function ThemeSwitcher({ params }: PageProps) {
  /* 在服务端异步获取当前语言的翻译字典。 */
  const t = await translation(params);

  /* 将翻译后的普通字符串传递给客户端组件。 */
  return (
    <ThemeSwitcherClient
      labels={{
        trigger: t.navbar.themeswitcher.trigger,
        menu: t.navbar.themeswitcher.menu,
        light: t.navbar.themeswitcher.light,
        dark: t.navbar.themeswitcher.dark,
      }}
    />
  );
}