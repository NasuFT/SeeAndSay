import { RootStackScreenProps } from '@/navigators/types';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import useStart from './useStart';

const Start = () => {
  const { getLoggedInUser, loadUser } = useStart();
  const navigation = useNavigation<RootStackScreenProps<'Start'>['navigation']>();

  useEffect(() => {
    const cb = async () => {
      const user = await getLoggedInUser();

      if (user) {
        loadUser(user);
      } else {
        navigation.replace('Login');
      }
    };

    cb();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator />
      <Text>Loading...</Text>
    </View>
  );
};

export default Start;
