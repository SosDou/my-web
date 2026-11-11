import type { Map } from 'maplibre-gl';

const MAP_STYLE_URLS = {
    light: 'https://tiles.openfreemap.org/styles/positron',
    dark: 'https://tiles.openfreemap.org/styles/dark',
} as const satisfies Record<string, string>;

type MapTheme = keyof typeof MAP_STYLE_URLS;

const DEFAULT_MAP_THEME: MapTheme = 'light';

function isMapTheme(theme: string | undefined): theme is MapTheme {
    return theme !== undefined
        && Object.prototype.hasOwnProperty.call(MAP_STYLE_URLS, theme);
}

function getMapTheme(): MapTheme {
    const theme = document.documentElement.dataset.theme;

    return isMapTheme(theme) ? theme : DEFAULT_MAP_THEME;
}

export function getMapStyleUrl(): string {
    return MAP_STYLE_URLS[getMapTheme()];
}

export function observeMapTheme(map: Map): () => void {
    let currentTheme = getMapTheme();

    const themeObserver = new MutationObserver(() => {
        const nextTheme = getMapTheme();

        if (nextTheme === currentTheme) return;

        currentTheme = nextTheme;
        map.setStyle(MAP_STYLE_URLS[nextTheme]);
    });

    themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
    });

    return () => {
        themeObserver.disconnect();
    };
}
