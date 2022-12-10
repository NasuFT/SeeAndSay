import { View } from 'react-native';
import { HelperText, SegmentedButtons, SegmentedButtonsProps } from 'react-native-paper';

type Props = SegmentedButtonsProps & {
  errorMsg?: string;
  error?: boolean;
};

const SegmentedButtonField = ({ errorMsg, error, ...rest }: Props) => {
  return (
    <View>
      <SegmentedButtons {...rest} />
      <HelperText visible={!!error} type="error">
        {errorMsg ?? null}
      </HelperText>
    </View>
  );
};

export default SegmentedButtonField;
