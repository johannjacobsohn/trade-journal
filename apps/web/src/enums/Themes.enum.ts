export enum Themes {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export const ThemesLabels = Object.freeze<Record<Themes, string>>({
  [Themes.LIGHT]: 'Light',
  [Themes.DARK]: 'Dark',
  [Themes.SYSTEM]: 'System',
});

export const themesLabelsOptions = Object.values(Themes).map((value) => ({
  value,
  label: ThemesLabels[value],
}));
