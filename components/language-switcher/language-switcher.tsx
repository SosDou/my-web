import { PageProps, localeConfig } from "@/i18n/config";
import { translation } from "@/i18n/translation";
import { LanguageSwitcherClient } from "./language-switcher-client";

// 服务端组件负责读取翻译
export async function LanguageSwitcher({ params }: PageProps) {
    const translations = await translation(params, "languageSwitcher");

    return (
        <LanguageSwitcherClient
            localeConfig={localeConfig}
            triggerLabel={translations.trigger}
            menuLabel={translations.menu}
        />
    );
}
