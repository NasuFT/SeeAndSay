import { View, StyleProp, ViewStyle } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { intervalToDuration } from 'date-fns';

interface Props {
  seconds: number;
  style?: StyleProp<ViewStyle>;
}

const Timer = ({ seconds, style }: Props) => {
  const theme = useTheme();
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
  const zeroPad = (num: number) => String(num).padStart(2, '0');
  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.secondary,
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 12,
        },
        style,
      ]}>
      <Text variant="headlineLarge" style={{ color: theme.colors.onSecondary }}>{`${zeroPad(
        duration.minutes ?? 0
      )}:${zeroPad(duration.seconds ?? 0)}`}</Text>
    </View>
  );
};

export default Timer;
