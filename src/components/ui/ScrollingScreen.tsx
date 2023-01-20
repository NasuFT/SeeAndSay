import { ImageBackground, ImageSourcePropType, ScrollView, ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props extends ScrollViewProps {
  withBackground?: boolean;
  source?: ImageSourcePropType;
}

const ScrollingScreen = ({
  source,
  withBackground,
  contentContainerStyle,
  style,
  ...rest
}: Props) => {
  const insets = useSafeAreaInsets();

  return (
    // <View style={{ flex: 1, justifyContent: 'center' }}>
    //   <ScrollView
    //     keyboardShouldPersistTaps="handled"
    //     {...rest}
    //     contentContainerStyle={[
    //       {
    //         alignItems: 'center',
    //         justifyContent: 'center',
    //         paddingHorizontal: 16,
    //       },
    //       props.contentContainerStyle,
    //     ]}
    //     style={[{ flexGrow: 0 }, props.style]}
    //   />
    // </View>
    withBackground ? (
      <ImageBackground source={require('@/../assets/ui/backgroundcolored.png')} style={{ flex: 1 }}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            { paddingTop: insets.top, paddingBottom: insets.bottom },
            contentContainerStyle,
          ]}
          style={[{}, style]}
          {...rest}
        />
      </ImageBackground>
    ) : null
  );
};

export default ScrollingScreen;
