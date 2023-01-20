import React from 'react';
import { View, StyleProp, ViewStyle, Pressable } from 'react-native';
import { format } from 'date-fns';
import { Text } from 'react-native-paper';

import { Task } from '@/types';

interface Props {
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  subtitleDisabled?: string;
  task?: Task | null;
}

const TaskOfTheDay = ({
  disabled = false,
  style,
  onPress = () => {},
  subtitleDisabled = '',
  task,
}: Props) => {
  return (
    <View style={[{ alignSelf: 'stretch' }, style]}>
      <Pressable disabled={disabled} onPress={onPress}>
        <View
          style={{
            paddingVertical: 8,
            borderWidth: 2,
            borderRadius: 8,
            borderStyle: 'dashed',
            borderColor: 'gray',
          }}>
          <Text
            variant="titleLarge"
            numberOfLines={1}
            style={{ textAlign: 'center', color: '#ffffff' }}>
            {task?.game.title ?? subtitleDisabled}
          </Text>
          <Text
            variant="labelLarge"
            style={{ textAlign: 'center', color: '#ffffff', marginTop: 4 }}>
            {task && format(task.submissionDate, 'MMMM d, yyyy')}
          </Text>
        </View>
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: disabled ? 'rgba(127, 127, 127, 0.65)' : 'transparent',
          }}
        />
      </Pressable>
    </View>
  );
};

export default TaskOfTheDay;
