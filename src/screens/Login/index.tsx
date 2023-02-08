import { useFormState } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';

import { Button, Logo, Screen, StatusBar } from '@/components';
import { RootStackScreenProps } from '@/navigators/types';

import useLoginContainer from './useLoginContainer';
import LoginForm from './LoginForm';

const Login = () => {
  const { control, handleLoginPress } = useLoginContainer();
  const { isSubmitting } = useFormState({ control });

  const navigation = useNavigation<RootStackScreenProps<'Login'>['navigation']>();
  const handleRegisterPress = () => {
    navigation.replace('Register');
  };

  return (
    <Screen withBackground source={require('@/../assets/ui/background.png')} style={{ flex: 1 }}>
      <StatusBar color="dark" />
      <Logo />
      <LoginForm control={control} onSubmit={handleLoginPress} style={{ marginHorizontal: 16 }} />
      <Button
        disabled={isSubmitting}
        mode="contained-tonal"
        style={{ margin: 16 }}
        onPress={handleRegisterPress}>
        Sign Up
      </Button>
    </Screen>
  );
};

export default Login;
