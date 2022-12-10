import { getFullName } from '@/screens/Profile/helper';
import { Enroll } from '@/types';
import { FlashList } from '@shopify/flash-list';
import { GestureResponderEvent } from 'react-native';
import { List } from 'react-native-paper';

interface Props<T> {
  data: T[];
  onItemPress?: (event: GestureResponderEvent, data: T) => void;
  onItemLongPress?: (event: GestureResponderEvent, data: T) => void;
}

const EnrollList = ({ data, onItemLongPress, onItemPress }: Props<Enroll>) => {
  return (
    <FlashList
      data={data}
      estimatedItemSize={12}
      renderItem={({ item }) => (
        <List.Item
          title={getFullName(item.student.firstName, item.student.lastName)}
          // @ts-ignore
          onPress={(e) => onItemPress?.(e, item)}
          onLongPress={(e) => onItemLongPress?.(e, item)}
        />
      )}
    />
  );
};

export default EnrollList;
