import { useMemo } from 'react';
import Color from 'color';
import { StatusBar as ExpoStatusBar, StatusBarProps } from 'expo-status-bar';
import { useTheme } from '@react-navigation/native';

interface Props {
  color?: 'light' | 'dark';
}

const StatusBar = ({ color }: Props) => {
  const theme = useTheme();

  const config = useMemo<StatusBarProps>(
    () => ({
      style: color ?? 'light',
    }),
    [theme]
  );

  return <ExpoStatusBar animated={true} {...config} />;
};

export default StatusBar;
