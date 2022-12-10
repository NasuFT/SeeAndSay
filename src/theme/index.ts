import { MD3LightTheme, MD3DarkTheme, MD3Theme, adaptNavigationTheme } from 'react-native-paper';
import { DefaultTheme, DarkTheme, Theme as NavigationTheme } from '@react-navigation/native';
import { lightColors, darkColors } from './color';

export const PaperLightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: lightColors,
};

export const PaperDarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: darkColors,
};

export const NavigationLightTheme: NavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: PaperLightTheme.colors.primary,
    background: PaperLightTheme.colors.background,
    card: PaperLightTheme.colors.elevation.level2,
    text: PaperLightTheme.colors.onSurface,
    border: PaperLightTheme.colors.outline,
    notification: PaperLightTheme.colors.error,
  },
};

export const NavigationDarkTheme: NavigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: PaperDarkTheme.colors.primary,
    background: PaperDarkTheme.colors.background,
    card: PaperDarkTheme.colors.elevation.level2,
    text: PaperDarkTheme.colors.onSurface,
    border: PaperDarkTheme.colors.outline,
    notification: PaperDarkTheme.colors.error,
  },
};
