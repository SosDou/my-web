"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import styles from "./theme-switcher.module.css";
import { LuPalette } from "react-icons/lu";

/* 定义网站支持的主题类型。 */
type Theme = "light" | "dark" | "system";

/* 定义最终应用到页面的明暗主题类型。 */
type ResolvedTheme = Exclude<Theme, "system">;

/* 定义服务端传递给客户端的翻译文本。 */
type ThemeSwitcherLabels = {
  trigger: string;
  menu: string;
  light: string;
  dark: string;
  system: string;
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
  return savedTheme === "dark" || savedTheme === "system"
    ? savedTheme
    : "light";
}

/* 定义服务端渲染期间使用的默认主题。 */
function getServerThemeSnapshot(): Theme {
  return "light";
}

/* 根据系统配色偏好获取最终使用的明暗主题。 */
function getSystemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
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
      {
        value: "system",
        label: labels.system,
      },
    ];

  /* 从浏览器存储中读取并订阅当前主题。 */
  const currentTheme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  /* 当当前主题变化时，将最终的明暗主题同步到 html 根元素。 */
  useEffect(() => {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

    /* 应用用户指定的主题，或跟随当前系统配色。 */
    function applyTheme() {
      document.documentElement.dataset.theme =
        currentTheme === "system" ? getSystemTheme() : currentTheme;
    }

    applyTheme();

    /* 仅在跟随系统时监听系统配色变化。 */
    if (currentTheme === "system") {
      systemTheme.addEventListener("change", applyTheme);
    }

    /* 主题变化或组件卸载时移除系统配色监听。 */
    return () => {
      systemTheme.removeEventListener("change", applyTheme);
    };
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
          <LuPalette size={20} aria-hidden="true"/>
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
              {/* 显示主题对应的浅色、深色或跟随系统图标。 */}
              <span
                className={`${styles.themeIcon} ${theme.value === "dark"
                  ? styles.themeIconDark
                  : theme.value === "system"
                    ? styles.themeIconSystem
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
