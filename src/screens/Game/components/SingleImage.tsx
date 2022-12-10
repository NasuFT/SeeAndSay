import { View, StyleProp, ViewStyle, Image } from 'react-native';
import { useTheme } from 'react-native-paper';

interface Props {
  source: string;
  style?: StyleProp<ViewStyle>;
}

const SingleImage = ({ source, style }: Props) => {
  const theme = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.primaryContainer,
          marginHorizontal: 16,
          flexDirection: 'row',
          padding: 8,
        },
        style,
      ]}>
      <Image source={{ uri: source }} style={{ flex: 1, aspectRatio: 1 }} resizeMode="contain" />
    </View>
  );
};

export default SingleImage;
