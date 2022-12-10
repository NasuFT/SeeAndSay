import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { format } from 'date-fns';
import { Surface, TouchableRipple, Text, useTheme } from 'react-native-paper';

import { Task } from '@/types';

interface Props {
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  title?: string;
  task?: Task | null;
}

const TaskOfTheDay = ({
  disabled = false,
  style,
  onPress = () => {},
  title = 'TASK OF THE DAY',
  task,
}: Props) => {
  const theme = useTheme();

  return (
    <View style={[{ alignSelf: 'stretch' }, style]}>
      <View style={{ marginHorizontal: 24 }}>
        <Text
          variant="headlineLarge"
          adjustsFontSizeToFit
          numberOfLines={1}
          style={{ textAlign: 'center' }}>
          {title}
        </Text>
      </View>
      <Surface
        style={{
          marginHorizontal: 16,
          marginTop: 16,
          backgroundColor: theme.colors.primaryContainer,
          borderRadius: 16,
          overflow: 'hidden',
        }}>
        <TouchableRipple disabled={disabled} onPress={onPress} borderless>
          <View style={{ paddingVertical: 16 }}>
            <Text
              variant="titleLarge"
              style={{ textAlign: 'center', color: theme.colors.onPrimaryContainer }}
              numberOfLines={1}>
              {task?.title}
            </Text>
            <Text
              variant="labelLarge"
              style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
              {task?.submissionDate && format(task?.submissionDate, 'MMMM d, yyyy')}
            </Text>
          </View>
        </TouchableRipple>
      </Surface>
    </View>
  );
};

export default TaskOfTheDay;
