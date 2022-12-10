import { useEffect } from 'react';
import { useTheme } from '@react-navigation/native';
import * as ExpoNavigationBar from 'expo-navigation-bar';

const NavigationBar = () => {
  const theme = useTheme();
  useEffect(() => {
    ExpoNavigationBar.setBackgroundColorAsync(theme.colors.background);
  }, [theme]);

  return null;
};

export default NavigationBar;
