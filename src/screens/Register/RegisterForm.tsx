import { View } from 'react-native';
import { upperFirst } from 'lodash';
import { Control, Controller, useFormState } from 'react-hook-form';

import { Button, TextField, SegmentedButtonField } from '@/components';
import { RegisterFormData } from '@/types';

interface Props {
  control: Control<RegisterFormData>;
  onSubmit?: () => void;
}

const RegisterForm = ({ control, onSubmit }: Props) => {
  const { isSubmitting } = useFormState({ control });

  return (
    <View style={{ justifyContent: 'center', flex: 1, marginVertical: 16 }}>
      <Controller
        control={control}
        name="firstName"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <TextField
            label="First Name"
            value={value}
            onChangeText={onChange}
            error={!!error}
            errorMsg={error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="lastName"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <TextField
            label={'Last Name'}
            value={value}
            onChangeText={onChange}
            error={!!error}
            errorMsg={error?.message}
          />
        )}
      />
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
      <Controller
        control={control}
        name="type"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <SegmentedButtonField
            value={value}
            onValueChange={onChange}
            buttons={[
              {
                value: 'student',
                label: 'Student',
                style: { flex: 1 },
                showSelectedCheck: true,
              },
              {
                value: 'teacher',
                label: 'Teacher',
                style: { flex: 1 },
                showSelectedCheck: true,
              },
            ]}
            error={!!error}
            errorMsg={error?.message}
          />
        )}
      />
      <Button
        loading={isSubmitting}
        disabled={isSubmitting}
        onPress={onSubmit}
        mode="contained"
        style={{ marginTop: 16 }}>
        Register
      </Button>
    </View>
  );
};

export default RegisterForm;
