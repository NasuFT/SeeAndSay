import { useFormState } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';

import { Button, Logo, Screen, ScrollingScreen } from '@/components';
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

  // return (
  //   <ScrollingScreen
  //     contentContainerStyle={{
  //       alignItems: 'stretch',
  //       justifyContent: 'space-between',
  //       flexGrow: 1,
  //     }}
  //     style={{ flexGrow: 1 }}>
  //     <LoginForm control={control} onSubmit={handleLoginPress} />
  //     <Button
  //       disabled={isSubmitting}
  //       mode="contained-tonal"
  //       style={{ marginVertical: 16 }}
  //       onPress={handleRegisterPress}>
  //       Register Instead
  //     </Button>
  //   </ScrollingScreen>
  // );
  return (
    <Screen withBackground source={require('@/../assets/ui/background.png')} style={{ flex: 1 }}>
      <Logo />
      <LoginForm control={control} onSubmit={handleLoginPress} style={{ marginHorizontal: 16 }} />
    </Screen>
  );
};

export default Login;
