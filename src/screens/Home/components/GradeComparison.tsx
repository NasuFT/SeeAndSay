import { StyleProp, ViewStyle, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, useTheme } from 'react-native-paper';
import { useMemo } from 'react';
import { round } from 'lodash';

interface Props {
  previousGrade?: number | null;
  currentGrade?: number | null;
  style?: StyleProp<ViewStyle>;
}

const GradeComparison = ({ previousGrade, currentGrade, style }: Props) => {
  const status = useMemo(
    () =>
      previousGrade === undefined ||
      previousGrade === null ||
      currentGrade === undefined ||
      currentGrade === null ||
      previousGrade === currentGrade
        ? 'equal'
        : previousGrade < currentGrade
        ? 'increase'
        : 'decrease',
    [previousGrade, currentGrade]
  );

  const theme = useTheme();

  return (
    <View style={[{ alignSelf: 'stretch', flexDirection: 'row' }, style]}>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text variant="titleLarge" style={{ textAlign: 'center', color: '#ffffff' }}>
          {`Yesterday: ${previousGrade ? round(previousGrade).toString() : '--'}`}
        </Text>
      </View>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text variant="titleLarge" style={{ textAlign: 'center', color: '#ffffff' }}>
          {`Today: ${currentGrade ? round(currentGrade).toString() : '--'}`}
        </Text>
      </View>
      <View style={{ flex: 0.25, justifyContent: 'center' }}>
        <Ionicons
          name={
            status === 'increase'
              ? 'md-caret-up'
              : status === 'decrease'
              ? 'md-caret-down'
              : 'reorder-two'
          }
          color={
            status === 'decrease'
              ? theme.colors.error
              : status === 'increase'
              ? theme.dark
                ? '#81c784'
                : '#388e3c'
              : '#ffffff'
          }
          size={22}
        />
      </View>
    </View>
  );
};

export default GradeComparison;
