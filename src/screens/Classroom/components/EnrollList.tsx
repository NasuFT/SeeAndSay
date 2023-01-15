import { GestureResponderEvent } from 'react-native';
import { List } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';

import { Enroll, User } from '@/types';

interface Props<T> {
  data: T[];
  onItemPress?: (event: GestureResponderEvent, data: T) => void;
  onItemLongPress?: (event: GestureResponderEvent, data: T) => void;
}

const EnrollList = ({ data, onItemLongPress, onItemPress }: Props<User>) => {
  return (
    <FlashList
      data={data}
      estimatedItemSize={12}
      renderItem={({ item }) => (
        <List.Item
          title={`${item.lastName}, ${item.firstName}`}
          // @ts-ignore
          onPress={(e) => onItemPress?.(e, item)}
          onLongPress={(e) => onItemLongPress?.(e, item)}
        />
      )}
    />
  );
};

export default EnrollList;
