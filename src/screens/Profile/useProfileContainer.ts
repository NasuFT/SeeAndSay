import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Dispatch, RootState } from '@/store';

const useProfileContainer = () => {
  const dispatch = useDispatch<Dispatch>();
  const theme = useSelector((state: RootState) => state.users.theme);
  const user = useSelector((state: RootState) => state.users.user);

  const isDarkTheme = React.useMemo(() => theme === 'dark', [theme]);
  const toggleDarkTheme = dispatch.users.toggleDarkTheme;
  const signOut = dispatch.users.signOut;
  const isSigningOut = useSelector((state: RootState) => state.loading.effects.users.signOut);

  return { isDarkTheme, toggleDarkTheme, user, signOut, isSigningOut };
};

export default useProfileContainer;
