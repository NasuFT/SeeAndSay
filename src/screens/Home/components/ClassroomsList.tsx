import { NativeScrollEvent, NativeSyntheticEvent, GestureResponderEvent } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { List } from 'react-native-paper';

import { Classroom } from '@/types';
import { getFullName } from '../../Profile/helper';

interface Props<T> {
  data: T[];
  onItemPress?: (event: GestureResponderEvent, value: T) => void;
  onItemLongPress?: (event: GestureResponderEvent, value: T) => void;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

const ClassroomsList = ({ data, onItemPress, onScroll, onItemLongPress }: Props<Classroom>) => {
  return (
    <FlashList
      data={data}
      estimatedItemSize={12}
      onScroll={onScroll}
      renderItem={({ item }) => (
        <List.Item
          title={item.name}
          description={getFullName(item.teacher.firstName, item.teacher.lastName)}
          // @ts-ignore
          onPress={(e) => onItemPress?.(e, item)}
          onLongPress={(e) => onItemLongPress?.(e, item)}
          delayLongPress={300}
          titleStyle={{ color: '#ffffff' }}
          descriptionStyle={{ color: '#ffffff' }}
        />
      )}
    />
  );
};

export default ClassroomsList;
