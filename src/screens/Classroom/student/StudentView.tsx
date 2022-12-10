import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import { Screen } from '@/components';
import { RootStackScreenProps } from '@/navigators/types';
import TaskOfTheDay from './components/TaskOfTheDay';
import useStudentView from './useStudentView';

const StudentView = () => {
  const navigation = useNavigation<RootStackScreenProps<'Classroom'>['navigation']>();

  const { dailyTask, fetchDailyTask } = useStudentView();
  useEffect(() => {
    fetchDailyTask();
  }, []);
  const handlePressDailyTask = async () => {
    navigation.navigate('Game');
  };

  return (
    <Screen style={{ paddingHorizontal: 0 }}>
      <TaskOfTheDay
        disabled={!dailyTask}
        style={{ marginTop: 16 }}
        task={dailyTask}
        onPress={handlePressDailyTask}
      />
      {/* <PastTasks
        data={[{ id: '1', date: new Date(), title: 'Placeholder Title', games: {} }]}
        style={{ paddingTop: 16 }}
      /> */}
    </Screen>
  );
};

export default StudentView;
