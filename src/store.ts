import { init, RematchDispatch, RematchRootState } from '@rematch/core';
import loadingPlugin, { ExtraModelsFromLoading } from '@rematch/loading';
import { models, RootModel } from '@/models';
import Reactotron from 'reactotron-react-native';

type FullModel = ExtraModelsFromLoading<RootModel>;

export const store = init<RootModel, FullModel>({
  models,
  plugins: [loadingPlugin()],
  redux: {
    enhancers: [Reactotron.createEnhancer!()],
  },
});

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;
