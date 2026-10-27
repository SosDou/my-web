import { readFileSync, readdirSync } from "node:fs";
import { dirname, extname, join, parse } from "node:path";
import { fileURLToPath } from "node:url";

const defaultLocale = "us-en";
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const dictionariesDirectory = join(scriptDirectory, "..", "i18n", "dictionaries");

function readLocaleDictionary(locale) {
  const localeDirectory = join(dictionariesDirectory, locale);
  const files = readdirSync(localeDirectory)
    .filter((file) => extname(file) === ".json")
    .sort();

  return files.reduce((dictionary, file) => {
    const moduleName = parse(file).name;
    const contents = JSON.parse(readFileSync(join(localeDirectory, file), "utf8"));

    if (moduleName === "common") {
      for (const key of Object.keys(contents)) {
        if (Object.hasOwn(dictionary, key)) {
          throw new Error(`${locale}: duplicate top-level key "${key}"`);
        }
      }

      return { ...dictionary, ...contents };
    }

    if (Object.hasOwn(dictionary, moduleName)) {
      throw new Error(`${locale}: duplicate namespace "${moduleName}"`);
    }

    return { ...dictionary, [moduleName]: contents };
  }, {});
}

function collectLeaves(value, path = "", leaves = new Map()) {
  if (typeof value === "string") {
    const placeholders = [...value.matchAll(/\{\{(\w+)\}\}/g)]
      .map((match) => match[1])
      .sort();

    leaves.set(path, placeholders);
    return leaves;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => collectLeaves(item, `${path}.${index}`, leaves));
    return leaves;
  }

  if (value !== null && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      collectLeaves(item, path ? `${path}.${key}` : key, leaves);
    }

    return leaves;
  }

  leaves.set(path, []);
  return leaves;
}

const locales = readdirSync(dictionariesDirectory, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

if (!locales.includes(defaultLocale)) {
  throw new Error(`Default locale directory "${defaultLocale}" does not exist.`);
}

const referenceLeaves = collectLeaves(readLocaleDictionary(defaultLocale));
const referenceKeys = [...referenceLeaves.keys()].sort();
const errors = [];

for (const locale of locales) {
  if (locale === defaultLocale) {
    continue;
  }

  const localeLeaves = collectLeaves(readLocaleDictionary(locale));
  const localeKeys = [...localeLeaves.keys()].sort();

  for (const key of referenceKeys) {
    if (!localeLeaves.has(key)) {
      errors.push(`${locale}: missing key "${key}"`);
      continue;
    }

    const expected = referenceLeaves.get(key).join(",");
    const actual = localeLeaves.get(key).join(",");

    if (expected !== actual) {
      errors.push(
        `${locale}: placeholders for "${key}" differ ` +
        `(expected [${expected}], received [${actual}])`,
      );
    }
  }

  for (const key of localeKeys) {
    if (!referenceLeaves.has(key)) {
      errors.push(`${locale}: extra key "${key}"`);
    }
  }
}

if (errors.length > 0) {
  console.error("i18n validation failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(
    `i18n validation passed for ${locales.length} locales and ${referenceKeys.length} keys.`,
  );
}
