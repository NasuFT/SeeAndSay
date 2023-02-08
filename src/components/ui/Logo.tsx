import { Image, ViewProps, View } from 'react-native';

interface Props extends ViewProps {}

const Logo = ({ style, ...rest }: Props) => {
  return (
    <View {...rest} style={[{ alignItems: 'stretch', height: 300 }, style]}>
      <Image
        source={require('@/../assets/ui/logo.png')}
        resizeMode="contain"
        style={{ flex: 1, width: undefined }}
      />
    </View>
  );
};

export default Logo;
