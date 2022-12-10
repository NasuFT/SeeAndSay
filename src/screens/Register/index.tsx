import { useFormState } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';

import { Button, ScrollingScreen } from '@/components';
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
    <>
      <ScrollingScreen
        contentContainerStyle={{
          alignItems: 'stretch',
          justifyContent: 'space-between',
          flexGrow: 1,
        }}
        style={{ flexGrow: 1 }}>
        <RegisterForm control={control} onSubmit={handleRegisterPress} />
        <Button
          disabled={isSubmitting}
          mode="contained-tonal"
          style={{ marginVertical: 16 }}
          onPress={handleLoginPress}>
          Login Instead
        </Button>
      </ScrollingScreen>
    </>
  );
};

export default Register;
