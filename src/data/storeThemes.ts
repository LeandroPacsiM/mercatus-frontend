import type { StoreTheme } from '../types/store';

/** Tema base de plataforma. Si Store.theme es undefined, se hereda este. */
export const DEFAULT_STORE_THEME: Required<Pick<StoreTheme, 'primary' | 'accent'>> &
  Pick<StoreTheme, 'surface'> = {
  primary: '#000000',
  accent: '#c1fbd4',
  surface: '#ffffff',
};

export interface StoreThemePreset {
  id: string;
  label: string;
  theme: StoreTheme;
}

export const STORE_THEME_PRESETS: StoreThemePreset[] = [
  { id: 'base', label: 'Shopify minimal', theme: { primary: '#000000', accent: '#c1fbd4' } },
  { id: 'indigo', label: 'Índigo moderno', theme: { primary: '#312e81', accent: '#5856d6' } },
  { id: 'esmeralda', label: 'Esmeralda ops', theme: { primary: '#0c3b2e', accent: '#00755a' } },
  { id: 'indice', label: 'Índice editorial', theme: { templateId: 'indice', primary: '#1b4cff', accent: '#ffd23f', surface: '#ffffff' } },
  { id: 'orbe', label: 'Orbe nocturno', theme: { templateId: 'orbe', primary: '#12141c', accent: '#ff6b5b', surface: '#1b1e2a' } },
  { id: 'ficha', label: 'Ficha técnica', theme: { templateId: 'ficha', primary: '#17180f', accent: '#ff6a1a', surface: '#fafaf6' } },
  { id: 'pop', label: 'Morado pop', theme: { primary: '#4c1d95', accent: '#7c3aed' } },
  { id: 'premium', label: 'Negro premium', theme: { primary: '#111827', accent: '#b45309' } },
];

export function resolveStoreTheme(theme?: StoreTheme): StoreTheme {
  return {
    primary: theme?.primary ?? DEFAULT_STORE_THEME.primary,
    accent: theme?.accent ?? DEFAULT_STORE_THEME.accent,
    surface: theme?.surface ?? DEFAULT_STORE_THEME.surface,
  };
}

/** Elige texto blanco u oscuro sobre un fondo, por contraste WCAG. */
export function getOnColor(bgHex: string): string {
  const h = bgHex.replace('#', '');
  const rgb = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const lin = rgb.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  const lum = 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
  const whiteContrast = 1.05 / (lum + 0.05);
  const darkContrast = (lum + 0.05) / 0.0672; // vs #0d1117 (lum ~0.0172)
  return darkContrast >= whiteContrast ? '#0d1117' : '#ffffff';
}
