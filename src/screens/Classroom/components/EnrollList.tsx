import { GestureResponderEvent, StyleProp, TextStyle } from 'react-native';
import { List } from 'react-native-paper';
import { ContentStyle, FlashList } from '@shopify/flash-list';

import { Enroll, User } from '@/types';

interface Props<T> {
  data: T[];
  onItemPress?: (event: GestureResponderEvent, data: T) => void;
  onItemLongPress?: (event: GestureResponderEvent, data: T) => void;
  containerStyle?: ContentStyle;
  textStyle?: StyleProp<TextStyle>;
}

const EnrollList = ({
  data,
  onItemLongPress,
  onItemPress,
  containerStyle,
  textStyle,
}: Props<User>) => {
  return (
    <FlashList
      data={data}
      estimatedItemSize={12}
      contentContainerStyle={containerStyle}
      renderItem={({ item }) => (
        <List.Item
          title={`${item.lastName}, ${item.firstName}`}
          // @ts-ignore
          onPress={(e) => onItemPress?.(e, item)}
          onLongPress={(e) => onItemLongPress?.(e, item)}
          titleStyle={textStyle}
        />
      )}
    />
  );
};

export default EnrollList;
