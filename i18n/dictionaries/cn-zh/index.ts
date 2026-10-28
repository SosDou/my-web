import type { Dictionary } from "../types";
import articles from "./articles.json";
import eegToHypnogram from "./eegToHypnogram.json";
import footer from "./footer.json";
import home from "./home.json";
import languageSwitcher from "./languageSwitcher.json";
import metadata from "./metadata.json";
import navbar from "./navbar.json";
import themeSwitcher from "./themeSwitcher.json";
import tools from "./tools.json";

export const cnZhDictionary = {
  metadata,
  eegToHypnogram,
  navbar,
  languageSwitcher,
  themeSwitcher,
  footer,
  home,
  tools,
  articles,
} satisfies Dictionary;

export default cnZhDictionary;
