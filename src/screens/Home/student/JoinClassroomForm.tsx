import { View } from 'react-native';
import { Controller, Control } from 'react-hook-form';

import { JoinClassroomFormData } from '@/types';
import { TextField } from '@/components';

interface Props {
  control: Control<JoinClassroomFormData>;
}

const JoinClassroomForm = ({ control }: Props) => {
  return (
    <View>
      <Controller
        control={control}
        name="code"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <TextField
            label="Classroom Code"
            value={value}
            onChangeText={onChange}
            error={!!error}
            errorMsg={error?.message}
          />
        )}
      />
    </View>
  );
};

export default JoinClassroomForm;
