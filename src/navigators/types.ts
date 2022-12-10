import { StackScreenProps } from '@react-navigation/stack';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Profile: undefined;
  Classroom: undefined;
  Game: undefined;
  GamePrepare: undefined;
  SubmissionInfo: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = StackScreenProps<
  RootStackParamList,
  T
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
