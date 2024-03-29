import React from 'react';
import { View, StyleProp, ViewStyle, Pressable } from 'react-native';
import { format } from 'date-fns';
import { Text, useTheme } from 'react-native-paper';

import { GameType, Task } from '@/types';

interface Props {
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  subtitleDisabled?: string;
  task?: Task | null;
}

const getGameTypeTitle = (type?: GameType) => {
  return type === 'classic'
    ? 'Name It!'
    : type === 'describeme'
    ? 'Describe Me'
    : type === 'fourpicsoneword'
    ? 'Four Pics One Word'
    : type === 'puzzle'
    ? 'Puzzle'
    : type === 'scavengerhunt'
    ? 'Scavenger Hunt'
    : null;
};

const TaskOfTheDay = ({
  disabled = false,
  style,
  onPress = () => {},
  subtitleDisabled = '',
  task,
}: Props) => {
  const theme = useTheme();

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
            backgroundColor: theme.colors.primaryContainer,
          }}>
          <Text variant="titleLarge" numberOfLines={1} style={{ textAlign: 'center' }}>
            {task?.game.title ?? subtitleDisabled}
          </Text>
          <Text variant="labelLarge" style={{ textAlign: 'center', marginTop: 4 }}>
            {getGameTypeTitle(task?.game.type)}
          </Text>
          <Text variant="labelLarge" style={{ textAlign: 'center', marginTop: 4 }}>
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
