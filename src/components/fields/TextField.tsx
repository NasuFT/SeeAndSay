import { View } from 'react-native';
import { HelperText, TextInput, TextInputProps, withTheme } from 'react-native-paper';

interface Props extends TextInputProps {
  errorMsg?: string;
}

const TextField = ({ errorMsg, error, ...rest }: Props) => {
  return (
    <View>
      <TextInput mode="outlined" error={error} {...rest} />
      <HelperText visible={error ?? false} type="error">
        {errorMsg ?? null}
      </HelperText>
    </View>
  );
};

export default withTheme(TextField);
