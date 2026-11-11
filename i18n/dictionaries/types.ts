import type articles from "./us-en/articles.json";
import type eegToHypnogram from "./us-en/eegToHypnogram.json";
import type footer from "./us-en/footer.json";
import type home from "./us-en/home.json";
import type languageSwitcher from "./us-en/languageSwitcher.json";
import type map from "./us-en/map.json";
import type metadata from "./us-en/metadata.json";
import type navbar from "./us-en/navbar.json";
import type themeSwitcher from "./us-en/themeSwitcher.json";
import type tools from "./us-en/tools.json";
import type visualizationWindow from "./us-en/visualizationWindow.json";
import type wgs84Gcj02 from "./us-en/wgs84Gcj02.json";

export type Dictionary = {
  articles: typeof articles;
  eegToHypnogram: typeof eegToHypnogram;
  footer: typeof footer;
  home: typeof home;
  languageSwitcher: typeof languageSwitcher;
  map: typeof map;
  metadata: typeof metadata;
  navbar: typeof navbar;
  themeSwitcher: typeof themeSwitcher;
  tools: typeof tools;
  visualizationWindow: typeof visualizationWindow;
  wgs84Gcj02: typeof wgs84Gcj02;
};

export type DictionaryNamespace = keyof Dictionary;
