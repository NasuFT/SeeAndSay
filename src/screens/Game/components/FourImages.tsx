import { View, StyleProp, ViewStyle } from 'react-native';
import React from 'react';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { Image } from '@rneui/base';

interface Props {
  sources: string[];
  style?: StyleProp<ViewStyle>;
}

const FourImages = ({ sources, style }: Props) => {
  if (sources.length !== 4) {
    throw new Error('sources.length should be 4!');
  }

  const theme = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.primaryContainer,
          marginHorizontal: 16,
        },
        style,
      ]}>
      <View
        style={{
          flexDirection: 'row',
          flexGrow: 1,
          padding: 8,
          paddingBottom: 4,
        }}>
        <Image
          source={{ uri: sources[0] }}
          containerStyle={{ flex: 1, aspectRatio: 1, marginRight: 4 }}
          resizeMode="contain"
          PlaceholderContent={<ActivityIndicator />}
          placeholderStyle={{ backgroundColor: 'transparent', justifyContent: 'center', flex: 1 }}
        />
        <Image
          source={{ uri: sources[1] }}
          containerStyle={{ flex: 1, aspectRatio: 1, marginLeft: 4 }}
          resizeMode="contain"
          PlaceholderContent={<ActivityIndicator />}
          placeholderStyle={{ backgroundColor: 'transparent', justifyContent: 'center', flex: 1 }}
        />
      </View>
      <View style={{ flexDirection: 'row', flexGrow: 1, padding: 8, paddingTop: 4 }}>
        <Image
          source={{ uri: sources[2] }}
          containerStyle={{ flex: 1, aspectRatio: 1, marginRight: 4 }}
          resizeMode="contain"
          PlaceholderContent={<ActivityIndicator />}
          placeholderStyle={{ backgroundColor: 'transparent', justifyContent: 'center', flex: 1 }}
        />
        <Image
          source={{ uri: sources[3] }}
          containerStyle={{ flex: 1, aspectRatio: 1, marginLeft: 4 }}
          resizeMode="contain"
          PlaceholderContent={<ActivityIndicator />}
          placeholderStyle={{ backgroundColor: 'transparent', justifyContent: 'center', flex: 1 }}
        />
      </View>
    </View>
  );
};

export default FourImages;
