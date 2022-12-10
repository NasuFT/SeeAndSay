import { View } from 'react-native';
import { upperFirst } from 'lodash';
import { Control, Controller, useFormState } from 'react-hook-form';

import { Button, TextField } from '@/components';
import { LoginFormData } from '@/types';

interface Props {
  control: Control<LoginFormData>;
  onSubmit?: () => void;
}

const LoginForm = ({ control, onSubmit }: Props) => {
  const { isSubmitting } = useFormState({ control });

  return (
    <View style={{ justifyContent: 'center', flex: 1, marginVertical: 16 }}>
      <Controller
        control={control}
        name="email"
        render={({ field: { value, onChange, name }, fieldState: { error } }) => (
          <TextField
            label={upperFirst(name)}
            value={value}
            onChangeText={onChange}
            error={!!error}
            errorMsg={error?.message}
            keyboardType="email-address"
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { value, onChange, name }, fieldState: { error } }) => (
          <TextField
            label={upperFirst(name)}
            value={value}
            onChangeText={onChange}
            error={!!error}
            errorMsg={error?.message}
            secureTextEntry
          />
        )}
      />
      <Button
        loading={isSubmitting}
        disabled={isSubmitting}
        onPress={onSubmit}
        mode="contained"
        style={{ marginTop: 16 }}>
        Login
      </Button>
    </View>
  );
};

export default LoginForm;
