import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {}

const Screen = ({ style, ...rest }: Props) => {
  return (
    <View
      {...rest}
      style={[
        { alignItems: 'center', justifyContent: 'center', flex: 1, paddingHorizontal: 16 },
        style,
      ]}
    />
  );
};

export default Screen;
