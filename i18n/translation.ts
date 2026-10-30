import { siteConfig } from "@/config/site";
import { notFound } from "next/navigation";
import { isLocale, Locale, PageParams } from "./config";
import type { Dictionary, DictionaryNamespace } from "./dictionaries/types";
import { interpolateDictionary } from "./utils/interpolate";

type DictionaryLoaders = {
  [L in Locale]: {
    [N in DictionaryNamespace]: () => Promise<Dictionary[N]>;
  };
};

// 每种语言和命名空间都有自己的代码块，所以调用者只加载他们使用的部分
const dictionaries: DictionaryLoaders = {
  "us-en": {
    articles: () => import("./dictionaries/us-en/articles.json").then((module) => module.default),
    eegToHypnogram: () => import("./dictionaries/us-en/eegToHypnogram.json").then((module) => module.default),
    footer: () => import("./dictionaries/us-en/footer.json").then((module) => module.default),
    home: () => import("./dictionaries/us-en/home.json").then((module) => module.default),
    languageSwitcher: () => import("./dictionaries/us-en/languageSwitcher.json").then((module) => module.default),
    metadata: () => import("./dictionaries/us-en/metadata.json").then((module) => module.default),
    navbar: () => import("./dictionaries/us-en/navbar.json").then((module) => module.default),
    themeSwitcher: () => import("./dictionaries/us-en/themeSwitcher.json").then((module) => module.default),
    tools: () => import("./dictionaries/us-en/tools.json").then((module) => module.default),
  },
  "cn-zh": {
    articles: () => import("./dictionaries/cn-zh/articles.json").then((module) => module.default),
    eegToHypnogram: () => import("./dictionaries/cn-zh/eegToHypnogram.json").then((module) => module.default),
    footer: () => import("./dictionaries/cn-zh/footer.json").then((module) => module.default),
    home: () => import("./dictionaries/cn-zh/home.json").then((module) => module.default),
    languageSwitcher: () => import("./dictionaries/cn-zh/languageSwitcher.json").then((module) => module.default),
    metadata: () => import("./dictionaries/cn-zh/metadata.json").then((module) => module.default),
    navbar: () => import("./dictionaries/cn-zh/navbar.json").then((module) => module.default),
    themeSwitcher: () => import("./dictionaries/cn-zh/themeSwitcher.json").then((module) => module.default),
    tools: () => import("./dictionaries/cn-zh/tools.json").then((module) => module.default),
  },
};

export async function translation<N extends DictionaryNamespace>(
  params: Promise<PageParams>,
  namespace: N,
) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const dictionary = await dictionaries[lang][namespace]();

  return interpolateDictionary(dictionary, {
    myName: siteConfig.myName,
  });
}
