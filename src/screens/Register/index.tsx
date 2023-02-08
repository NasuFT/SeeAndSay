import { useFormState } from 'react-hook-form';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Button, Screen, ScrollingScreen, StatusBar } from '@/components';
import { RootStackScreenProps } from '@/navigators/types';

import RegisterForm from './RegisterForm';
import useRegisterContainer from './useRegisterContainer';

const Register = () => {
  const { control, handleRegisterPress } = useRegisterContainer();
  const { isSubmitting } = useFormState({ control });

  const navigation = useNavigation<RootStackScreenProps<'Register'>['navigation']>();
  const handleLoginPress = () => {
    navigation.replace('Login');
  };

  return (
    <Screen>
      <StatusBar color="dark" />
      <View style={{ flex: 1, paddingHorizontal: 16, paddingBottom: 16 }}>
        <RegisterForm control={control} onSubmit={handleRegisterPress} />
        <Button
          disabled={isSubmitting}
          mode="contained-tonal"
          style={{ marginVertical: 16 }}
          onPress={handleLoginPress}>
          Login Instead
        </Button>
      </View>
    </Screen>
  );
};

export default Register;
