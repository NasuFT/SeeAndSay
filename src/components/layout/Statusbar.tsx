import { useMemo } from 'react';
import Color from 'color';
import { StatusBar as ExpoStatusBar, StatusBarProps } from 'expo-status-bar';
import { useTheme } from '@react-navigation/native';

const StatusBar = () => {
  const theme = useTheme();

  const config = useMemo<StatusBarProps>(
    () => ({
      style: Color(theme.colors.text).isDark() ? 'dark' : 'light',
    }),
    [theme]
  );

  return <ExpoStatusBar animated={true} {...config} />;
};

export default StatusBar;
