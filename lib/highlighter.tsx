import type { CSSProperties, ReactNode } from "react"
import { createHighlighterCore } from "@shikijs/core"
import { createJavaScriptRegexEngine } from "@shikijs/engine-javascript"

const languageLoaders = {
  bash: () => import("@shikijs/langs/bash").then((module) => module.default),
  c: () => import("@shikijs/langs/c").then((module) => module.default),
  cpp: () => import("@shikijs/langs/cpp").then((module) => module.default),
  css: () => import("@shikijs/langs/css").then((module) => module.default),
  dart: () => import("@shikijs/langs/dart").then((module) => module.default),
  diff: () => import("@shikijs/langs/diff").then((module) => module.default),
  html: () => import("@shikijs/langs/html").then((module) => module.default),
  java: () => import("@shikijs/langs/java").then((module) => module.default),
  javascript: () => import("@shikijs/langs/javascript").then((module) => module.default),
  json: () => import("@shikijs/langs/json").then((module) => module.default),
  jsx: () => import("@shikijs/langs/jsx").then((module) => module.default),
  latex: () => import("@shikijs/langs/latex").then((module) => module.default),
  markdown: () => import("@shikijs/langs/markdown").then((module) => module.default),
  python: () => import("@shikijs/langs/python").then((module) => module.default),
  sql: () => import("@shikijs/langs/sql").then((module) => module.default),
  tsx: () => import("@shikijs/langs/tsx").then((module) => module.default),
  typescript: () => import("@shikijs/langs/typescript").then((module) => module.default),
  yaml: () => import("@shikijs/langs/yaml").then((module) => module.default),
} as const

type SupportedLanguage = keyof typeof languageLoaders

const languageAliases: Record<string, SupportedLanguage> = {
  bash: "bash",
  c: "c",
  cpp: "cpp",
  css: "css",
  dart: "dart",
  diff: "diff",
  html: "html",
  java: "java",
  javascript: "javascript",
  js: "javascript",
  json: "json",
  jsx: "jsx",
  latex: "latex",
  md: "markdown",
  markdown: "markdown",
  py: "python",
  python: "python",
  sh: "bash",
  shell: "bash",
  sql: "sql",
  tex: "latex",
  ts: "typescript",
  tsx: "tsx",
  typescript: "typescript",
  yaml: "yaml",
  yml: "yaml",
}

const highlighterPromise = createHighlighterCore({
  themes: [
    import("@shikijs/themes/github-light"),
    import("@shikijs/themes/github-dark"),
  ],
  langs: [],
  engine: createJavaScriptRegexEngine(),
})

const languageLoadingPromises = new Map<SupportedLanguage, Promise<void>>()

async function loadLanguage(language: SupportedLanguage) {
  const highlighter = await highlighterPromise

  if (highlighter.getLoadedLanguages().includes(language)) {
    return highlighter
  }

  let loadingPromise = languageLoadingPromises.get(language)

  if (!loadingPromise) {
    loadingPromise = languageLoaders[language]()
      .then((languageRegistration) => highlighter.loadLanguage(languageRegistration))
      .finally(() => languageLoadingPromises.delete(language))

    languageLoadingPromises.set(language, loadingPromise)
  }

  await loadingPromise
  return highlighter
}

export async function highlightCode(
  code: string,
  language: string
): Promise<ReactNode[] | null> {
  const normalizedLanguage = languageAliases[language.toLowerCase()]

  if (!normalizedLanguage) {
    return null
  }

  const highlighter = await loadLanguage(normalizedLanguage)
  const tokenLines = highlighter.codeToTokensWithThemes(code.replace(/\n$/, ""), {
    lang: normalizedLanguage,
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
  })

  return tokenLines.map((tokens, lineIndex) => (
    <span className="contents" key={lineIndex}>
      {tokens.map((token, tokenIndex) => {
        const style = {
          "--shiki-light": token.variants.light?.color ?? "inherit",
          "--shiki-dark": token.variants.dark?.color ?? "inherit",
        } as CSSProperties

        return (
          <span
            className="shiki-token"
            key={`${lineIndex}-${tokenIndex}`}
            style={style}
          >
            {token.content}
          </span>
        )
      })}
    </span>
  ))
}
