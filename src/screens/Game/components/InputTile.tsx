import { View, StyleProp, ViewStyle, Text } from 'react-native';
import React from 'react';
import { useTheme } from 'react-native-paper';

interface Props {
  value: string;
  style?: StyleProp<ViewStyle>;
}

const InputTile = ({ style, value }: Props) => {
  const theme = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.secondaryContainer,
          width: 64,
          aspectRatio: 1,
          flexShrink: 1,
          borderWidth: 2,
          borderRadius: 8,
          borderColor: theme.colors.outline,
          justifyContent: 'center',
          padding: 2,
        },
        style,
      ]}>
      <Text
        adjustsFontSizeToFit
        numberOfLines={1}
        style={{
          color: theme.colors.onSecondaryContainer,
          textAlign: 'center',
          includeFontPadding: false,
          fontSize: 128,
          textTransform: 'uppercase',
        }}>
        {value}
      </Text>
    </View>
  );
};

export default InputTile;
