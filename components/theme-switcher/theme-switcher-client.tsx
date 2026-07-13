"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import styles from "./theme-switcher.module.css";
import { Palette } from "lucide-react";

/* 定义网站支持的主题类型。 */
type Theme = "light" | "dark";

/* 定义服务端传递给客户端的翻译文本。 */
type ThemeSwitcherLabels = {
  trigger: string;
  menu: string;
  light: string;
  dark: string;
};

/* 定义客户端组件接收的参数。 */
type ThemeSwitcherClientProps = {
  labels: ThemeSwitcherLabels;
};

/* 定义保存主题设置时使用的浏览器存储键。 */
const themeStorageKey = "theme";

/* 定义当前页面内部使用的主题变化事件名称。 */
const themeChangeEvent = "theme-change";

/* 从浏览器本地存储中读取当前主题。 */
function getThemeSnapshot(): Theme {
  /* 服务端环境无法访问 localStorage，返回默认浅色主题。 */
  if (typeof window === "undefined") {
    return "light";
  }

  /* 读取用户之前保存的主题。 */
  const savedTheme = window.localStorage.getItem(themeStorageKey);

  /* 只接受有效的主题值。 */
  return savedTheme === "dark" ? "dark" : "light";
}

/* 定义服务端渲染期间使用的默认主题。 */
function getServerThemeSnapshot(): Theme {
  return "light";
}

/* 订阅主题变化。 */
function subscribeTheme(onStoreChange: () => void) {
  /* 处理当前页面主动触发的主题变化。 */
  function handleThemeChange() {
    onStoreChange();
  }

  /* 处理其他浏览器标签页触发的主题变化。 */
  function handleStorageChange(event: StorageEvent) {
    /* 只处理主题存储对应的变化。 */
    if (event.key === themeStorageKey) {
      onStoreChange();
    }
  }

  /* 监听当前标签页中的主题变化。 */
  window.addEventListener(themeChangeEvent, handleThemeChange);

  /* 监听其他标签页中的主题变化。 */
  window.addEventListener("storage", handleStorageChange);

  /* 组件卸载时移除事件监听。 */
  return () => {
    window.removeEventListener(themeChangeEvent, handleThemeChange);
    window.removeEventListener("storage", handleStorageChange);
  };
}

/* 定义主题选择器的客户端组件。 */
export default function ThemeSwitcherClient({
  labels,
}: ThemeSwitcherClientProps) {
  /* 保存 details 元素的引用，用于选择主题后关闭菜单。 */
  const detailsRef = useRef<HTMLDetailsElement>(null);

  /* 使用翻译后的文本生成主题菜单。 */
  const themes: {
    value: Theme;
    label: string;
  }[] = [
      {
        value: "light",
        label: labels.light,
      },
      {
        value: "dark",
        label: labels.dark,
      },
    ];

  /* 从浏览器存储中读取并订阅当前主题。 */
  const currentTheme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  /* 当当前主题变化时，将主题同步到 html 根元素。 */
  useEffect(() => {
    document.documentElement.dataset.theme = currentTheme;
  }, [currentTheme]);

  /* 切换并保存用户选择的主题。 */
  function changeTheme(theme: Theme) {
    /* 将用户选择保存到浏览器本地存储中。 */
    window.localStorage.setItem(themeStorageKey, theme);

    /* 通知当前页面中的组件主题已经变化。 */
    window.dispatchEvent(new Event(themeChangeEvent));

    /* 用户完成选择后关闭主题菜单。 */
    if (detailsRef.current) {
      detailsRef.current.open = false;
    }
  }

  return (
    <details ref={detailsRef} className={styles.root} name="navbar-menu">
      {/* 使用当前主题对应的圆形图标作为菜单触发器。 */}
      <summary
        className={styles.trigger}
        aria-label={labels.trigger}
        title={labels.trigger}
      >
        <span className={styles.trigger}>
          <Palette
            size={20}
            strokeWidth={2}
            aria-hidden="true"
          />
        </span>
      </summary>

      {/* 定义展开后的主题菜单。 */}
      <div
        className={styles.menu}
        role="menu"
        aria-label={labels.menu}
      >
        {themes.map((theme) => {
          return (
            <button
              key={theme.value}
              type="button"
              className={styles.item}
              role="menuitemradio"
              aria-checked={currentTheme === theme.value}
              onClick={() => changeTheme(theme.value)}
            >
              {/* 显示主题对应的白色或黑色圆形图标。 */}
              <span
                className={`${styles.themeIcon} ${theme.value === "dark"
                  ? styles.themeIconDark
                  : styles.themeIconLight
                  }`}
              />

              {/* 显示翻译后的主题名称。 */}
              <span>{theme.label}</span>
            </button>
          );
        })}
      </div>
    </details>
  );
}