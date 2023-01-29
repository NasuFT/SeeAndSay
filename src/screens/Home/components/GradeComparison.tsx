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

const getGradeStatus = (grade?: number | null) => {
  if (!grade) {
    return '';
  }

  if (grade >= 100) {
    return 'PERFECT!';
  }
  if (grade >= 90) {
    return 'WELL DONE!';
  }
  if (grade >= 75) {
    return 'GOOD JOB!';
  }
  if (grade >= 40) {
    return 'NICE TRY!';
  }

  return 'NICE TRY!';
};

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
    <View style={[{ alignSelf: 'stretch' }, style]}>
      <View style={[{ alignSelf: 'stretch', flexDirection: 'row' }]}>
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
      <View style={{ marginTop: 4 }}>
        <Text
          variant="titleLarge"
          style={{
            textAlign: 'center',
            includeFontPadding: false,
            textAlignVertical: 'center',
            color: '#ffffff',
          }}>
          {getGradeStatus(currentGrade)}
        </Text>
      </View>
    </View>
  );
};

export default GradeComparison;
