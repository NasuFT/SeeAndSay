import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  NavigationDarkTheme,
  NavigationLightTheme,
  PaperDarkTheme,
  PaperLightTheme,
} from '@/theme';

const useTheme = () => {
  const theme = useSelector((state: RootState) => state.users.theme);

  const paperTheme = useMemo(() => (theme === 'light' ? PaperLightTheme : PaperDarkTheme), [theme]);
  const navigationTheme = useMemo(
    () => (theme === 'light' ? NavigationLightTheme : NavigationDarkTheme),
    [theme]
  );

  return { paperTheme, navigationTheme };
};

export default useTheme;
