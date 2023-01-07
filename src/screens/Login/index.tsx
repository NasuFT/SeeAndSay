import { useFormState } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';

import { Button, ScrollingScreen } from '@/components';
import { RootStackScreenProps } from '@/navigators/types';

import useLoginContainer from './useLoginContainer';
import LoginForm from './LoginForm';
import SpeechToTextSuggest from '../Game/components/SpeechToTextSuggest';

const Login = () => {
  const { control, handleLoginPress } = useLoginContainer();
  const { isSubmitting } = useFormState({ control });

  const navigation = useNavigation<RootStackScreenProps<'Login'>['navigation']>();
  const handleRegisterPress = () => {
    navigation.replace('Register');
  };

  return (
    <ScrollingScreen
      contentContainerStyle={{
        alignItems: 'stretch',
        justifyContent: 'space-between',
        flexGrow: 1,
      }}
      style={{ flexGrow: 1 }}>
      <LoginForm control={control} onSubmit={handleLoginPress} />
      <Button
        disabled={isSubmitting}
        mode="contained-tonal"
        style={{ marginVertical: 16 }}
        onPress={handleRegisterPress}>
        Register Instead
      </Button>
    </ScrollingScreen>
  );
};

export default Login;
