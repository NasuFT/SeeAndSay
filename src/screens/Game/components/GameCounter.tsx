import React from 'react';
import { Surface, Text, useTheme } from 'react-native-paper';
import { StyleProp, ViewStyle } from 'react-native';

interface Props {
  style?: StyleProp<ViewStyle>;
  currentRound: number;
  totalRounds: number;
}

const GameCounter = ({ style, currentRound, totalRounds }: Props) => {
  const theme = useTheme();

  return (
    <Surface
      style={[
        {
          paddingHorizontal: 16,
          paddingVertical: 4,
          borderRadius: 8,
          backgroundColor: theme.colors.primary,
        },
        style,
      ]}
      onLayout={(e) => console.log(e.nativeEvent.layout.height)}
      elevation={1}>
      <Text
        variant="bodyLarge"
        style={{ color: theme.colors.onPrimary }}>{`${currentRound}/${totalRounds}`}</Text>
    </Surface>
  );
};

export default GameCounter;
