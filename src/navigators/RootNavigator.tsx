import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';

import {
  Login,
  Register,
  Home,
  Profile,
  Classroom,
  Game,
  GamePrepare,
  SubmissionInfo,
} from '@/screens';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const user = useSelector((state: RootState) => state.users.user);
  const isSignOut = useSelector((state: RootState) => state.users.isSignOut);

  return (
    <Stack.Navigator>
      {!user ? (
        <Stack.Group screenOptions={{ animationTypeForReplace: isSignOut ? 'pop' : 'push' }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen name="Home" component={Home} options={{ headerTitle: 'Classrooms' }} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Classroom" component={Classroom} />
          <Stack.Screen name="Game" component={Game} />
          <Stack.Screen name="GamePrepare" component={GamePrepare} />
          <Stack.Screen name="SubmissionInfo" component={SubmissionInfo} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
