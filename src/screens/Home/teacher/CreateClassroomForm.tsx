import { View } from 'react-native';
import { Controller, Control } from 'react-hook-form';
import { CreateClassroomFormData } from '@/types';
import { TextField } from '@/components';

interface Props {
  control: Control<CreateClassroomFormData>;
}

const CreateClassroomForm = ({ control }: Props) => {
  return (
    <View>
      <Controller
        control={control}
        name="name"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <TextField
            label="Classroom Name"
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

export default CreateClassroomForm;
