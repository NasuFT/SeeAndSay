import { View, StyleProp, ViewStyle } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

interface Props {
  values: string[];
  value: string[];
  onValueChange?: (data: string[]) => void;
  style?: StyleProp<ViewStyle>;
}

const FourChoices = ({ values, value, onValueChange, style }: Props) => {
  if (values.length !== 4) {
    throw new Error('Values array length must be 4!');
  }

  const handleButtonPress = (val: string) => {
    if (!onValueChange) {
      return;
    }

    if (value.includes(val)) {
      onValueChange(value.filter((value) => value !== val));
      return;
    }

    onValueChange(value.concat([val]));
  };

  const theme = useTheme();

  return (
    <View style={[{ flex: 1, flexDirection: 'row' }, style]}>
      <View
        style={{
          alignItems: 'stretch',
          padding: 16,
          flex: 1,
          justifyContent: 'space-around',
        }}>
        <Button
          mode="contained"
          icon={value.includes(values[0]) ? 'check' : undefined}
          onPress={() => handleButtonPress(values[0])}
          buttonColor={theme.colors.tertiary}
          textColor={theme.colors.onTertiary}>
          {values[0]}
        </Button>
        <Button
          mode="contained"
          icon={value.includes(values[2]) ? 'check' : undefined}
          onPress={() => handleButtonPress(values[2])}
          buttonColor={theme.colors.tertiary}
          textColor={theme.colors.onTertiary}>
          {values[2]}
        </Button>
      </View>
      <View
        style={{
          alignItems: 'stretch',
          padding: 16,
          flex: 1,
          justifyContent: 'space-around',
        }}>
        <Button
          mode="contained"
          icon={value.includes(values[1]) ? 'check' : undefined}
          onPress={() => handleButtonPress(values[1])}
          buttonColor={theme.colors.tertiary}
          textColor={theme.colors.onTertiary}>
          {values[1]}
        </Button>
        <Button
          mode="contained"
          icon={value.includes(values[3]) ? 'check' : undefined}
          onPress={() => handleButtonPress(values[3])}
          buttonColor={theme.colors.tertiary}
          textColor={theme.colors.onTertiary}>
          {values[3]}
        </Button>
      </View>
    </View>
  );
};

export default FourChoices;
