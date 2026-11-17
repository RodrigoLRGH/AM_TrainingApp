import { MD3LightTheme } from 'react-native-paper';

// Paleta neutra (negro / blanco / grises). Se sobrescriben también los
// tokens de contenedores, superficies y elevación, que en MD3 vienen teñidos de morado.
export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#111111',
    onPrimary: '#FFFFFF',
    primaryContainer: '#E5E5E5',
    onPrimaryContainer: '#111111',

    secondary: '#525252',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#E5E5E5',
    onSecondaryContainer: '#171717',

    tertiary: '#737373',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#F0F0F0',
    onTertiaryContainer: '#171717',

    background: '#FFFFFF',
    onBackground: '#111111',
    surface: '#FFFFFF',
    onSurface: '#111111',
    surfaceVariant: '#F0F0F0',
    onSurfaceVariant: '#525252',
    surfaceDisabled: 'rgba(17, 17, 17, 0.12)',
    onSurfaceDisabled: 'rgba(17, 17, 17, 0.38)',

    outline: '#A3A3A3',
    outlineVariant: '#D4D4D4',

    inverseSurface: '#262626',
    inverseOnSurface: '#F5F5F5',
    inversePrimary: '#D4D4D4',

    backdrop: 'rgba(0, 0, 0, 0.4)',

    elevation: {
      level0: 'transparent',
      level1: '#F7F7F7',
      level2: '#F2F2F2',
      level3: '#EDEDED',
      level4: '#EBEBEB',
      level5: '#E8E8E8',
    },
  },
};
