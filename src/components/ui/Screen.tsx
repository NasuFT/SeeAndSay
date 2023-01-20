import {
  View,
  ViewProps,
  ImageBackground,
  ImageSourcePropType,
  ImageResizeMode,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props extends ViewProps {
  withBackground?: boolean;
  source?: ImageSourcePropType;
  resizeMode?: ImageResizeMode;
}

const Screen = ({ style, withBackground = false, ...rest }: Props) => {
  const insets = useSafeAreaInsets();

  return withBackground ? (
    <ImageBackground
      source={require('@/../assets/ui/background.png')}
      resizeMode="stretch"
      style={[
        { alignSelf: 'stretch', flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom },
        style,
      ]}
      {...rest}
    />
  ) : (
    <View style={[{ alignSelf: 'stretch', flex: 1 }, style]} {...rest} />
  );
};

export default Screen;
