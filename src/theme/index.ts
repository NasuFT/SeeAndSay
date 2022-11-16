import { MD3LightTheme, MD3DarkTheme, MD3Theme, adaptNavigationTheme } from 'react-native-paper';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { lightColors, darkColors } from './color';

export const PaperLightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: lightColors,
};

export const PaperDarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: darkColors,
};

export const { LightTheme: NavigationLightTheme, DarkTheme: NavigationDarkTheme } =
  adaptNavigationTheme({
    light: DefaultTheme,
    dark: DarkTheme,
  });
