import { ScrollView, ScrollViewProps, View } from 'react-native';

interface Props extends ScrollViewProps {}

const ScrollingScreen = (props: Props) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        {...props}
        contentContainerStyle={[
          {
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 16,
          },
          props.contentContainerStyle,
        ]}
        style={[{ flexGrow: 0 }, props.style]}
      />
    </View>
  );
};

export default ScrollingScreen;
