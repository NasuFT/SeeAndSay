import { Submission, Task } from '@/types';
import { FlashList } from '@shopify/flash-list';
import { format } from 'date-fns';
import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { List } from 'react-native-paper';

interface Props {
  data: Submission[];
  style?: StyleProp<ViewStyle>;
}

const PastTasks = ({ data, style }: Props) => {
  return (
    <View style={[{ flex: 1, alignSelf: 'stretch' }, style]}>
      <List.Subheader>Past Submissions</List.Subheader>
      <FlashList
        data={data}
        estimatedItemSize={12}
        renderItem={({ item }) => {
          const { title, date } = item.task;
          return <List.Item title={title} description={format(date, 'MMMM d, yyyy')} />;
        }}
      />
    </View>
  );
};

export default PastTasks;
