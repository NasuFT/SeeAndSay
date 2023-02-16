import { createModel } from '@rematch/core';
import { RootModel } from '.';

interface State {
  didFinishGame: boolean;
}

export const screen = createModel<RootModel>()({
  state: {
    didFinishGame: false,
  } as State,
  reducers: {
    setDidFinishGame(state, payload: boolean) {
      return {
        ...state,
        didFinishGame: payload,
      };
    },
  },
});
