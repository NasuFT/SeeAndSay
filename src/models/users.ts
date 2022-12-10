import api from '@/services';
import { LoginFormData, RegisterFormData, User } from '@/types';
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
      try {
        const { email, password } = data;
        const id = await api.auth.signIn(email, password);
        const user = await api.firestore.getUserData(id);
        dispatch.users.setUser(user);
      } catch (error) {
        alert(error);
      }
    },
    async signUp(data: RegisterFormData) {
      try {
        const { email, password } = data;
        const id = await api.auth.signUp(email, password);

        const newUser: User = {
          id,
          email,
          firstName: data.firstName,
          lastName: data.lastName,
          type: data.type,
        };
        await api.firestore.addUserData(newUser);
        dispatch.users.setUser(newUser);
      } catch (error) {
        alert(error);
      }
    },
    async signOut() {
      try {
        await api.auth.signOut();
        dispatch.users.setUser(null);
      } catch (error) {
        alert(error);
      }
    },
    toggleDarkTheme(_: any, state) {
      const theme = state.users.theme;

      dispatch.users.setTheme(theme === 'light' ? 'dark' : 'light');
    },
  }),
});
