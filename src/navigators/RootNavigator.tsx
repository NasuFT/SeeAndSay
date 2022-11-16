import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';

import { View } from 'react-native';

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen name="Home" component={() => <View></View>} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default RootNavigator;
