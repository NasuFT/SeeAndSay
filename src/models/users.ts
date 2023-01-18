import { signIn, signOut, signUp } from '@/api';
import { KEY_STORAGE_LOGGED_IN_USER } from '@/constants';
import { LoginFormData, RegisterFormData, User } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createModel } from '@rematch/core';
import { RootModel } from '.';

interface State {
  user: User | null;
  isSignOut: boolean;
  theme: 'light' | 'dark';
}

export const users = createModel<RootModel>()({
  state: {
    user: null,
    isSignOut: false,
    theme: 'light',
  } as State,
  reducers: {
    setUser(state, payload: User | null) {
      return {
        ...state,
        user: payload,
        isSignOut: payload === null,
      };
    },
    setTheme(state, payload: State['theme']) {
      return {
        ...state,
        theme: payload,
      };
    },
  },
  effects: (dispatch) => ({
    async signIn(data: LoginFormData) {
      const { email, password } = data;
      try {
        const user = await signIn(email, password);
        await AsyncStorage.setItem(KEY_STORAGE_LOGGED_IN_USER, JSON.stringify(user));
        dispatch.users.setUser(user);
      } catch (error) {
        if (__DEV__) {
          console.log(error);
        }
        alert(error);
      }
    },
    async signUp(data: RegisterFormData) {
      try {
        const user = await signUp(data);
        await AsyncStorage.setItem(KEY_STORAGE_LOGGED_IN_USER, JSON.stringify(user));
        dispatch.users.setUser(user);
      } catch (error) {
        if (__DEV__) {
          console.log(error);
        }
        alert(error);
      }
    },
    async signOut() {
      try {
        await signOut();
        await AsyncStorage.removeItem(KEY_STORAGE_LOGGED_IN_USER);
        dispatch.users.setUser(null);
      } catch (error) {
        if (__DEV__) {
          console.log(error);
        }
        alert(error);
      }
    },
    toggleTheme(_: void, state) {
      const theme = state.users.theme;

      dispatch.users.setTheme(theme === 'light' ? 'dark' : 'light');
    },
  }),
});
