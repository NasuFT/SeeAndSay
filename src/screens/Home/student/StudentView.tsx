import { useCallback, useEffect, useState } from 'react';
import { View, ImageBackground } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Dialog, FAB, IconButton, List, Portal } from 'react-native-paper';

import { Button, Screen } from '@/components';
import { RootStackScreenProps } from '@/navigators/types';

import ClassroomsList from '../components/ClassroomsList';
import useStudentView from './useStudentView';
import JoinClassroomForm from './JoinClassroomForm';
import TaskOfTheDay from '../components/TaskOfTheDay';
import GradeComparison from '../components/GradeComparison';

const StudentView = () => {
  const navigation = useNavigation<RootStackScreenProps<'Home'>['navigation']>();

  // Dialog: Create classroom
  const [isDialogShown, setIsDialogShown] = useState(false);
  const showDialog = () => setIsDialogShown(true);
  const hideDialog = () => setIsDialogShown(false);

  const {
    control,
    classrooms,
    handleUserJoinClassroom,
    isJoiningClassroom,
    getClassrooms,
    isPlayable,
    getRecentSubmissions,
    dailyTask,
    getDailyTask,
    previousSubmission,
    currentSubmission,
  } = useStudentView();
  const onDialogPressJoin = () => {
    hideDialog();
    getClassrooms();
  };

  useEffect(() => {
    getDailyTask();
    getClassrooms();
  }, []);

  useEffect(() => {
    if (dailyTask) {
      getRecentSubmissions();
    }
  }, [dailyTask]);

  useFocusEffect(
    useCallback(() => {
      if (dailyTask) {
        getRecentSubmissions();
      }
    }, [dailyTask])
  );

  const handlePressDailyTask = async () => {
    if (!dailyTask) {
      return;
    }

    navigation.navigate('GamePrepare');
  };

  return (
    <Screen withBackground>
      <IconButton
        icon="account-circle-outline"
        size={24}
        style={{ alignSelf: 'flex-end', borderColor: '#facd89', borderWidth: 2, marginRight: 16 }}
        mode="contained"
        containerColor="#3c5e47"
        iconColor="#ffffff"
        onPress={() => navigation.navigate('Profile')}
      />
      <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
        <ImageBackground
          source={require('@/../assets/ui/taskoftheday.png')}
          resizeMode="contain"
          style={{ aspectRatio: 593 / 807, flex: 1, marginHorizontal: 8 }}>
          <View
            style={{
              flex: 1,
              marginTop: '18.5%',
              marginBottom: '38%',
              marginLeft: '4.5%',
              marginRight: '6.5%',
            }}>
            <TaskOfTheDay
              disabled={!dailyTask || !isPlayable}
              task={dailyTask}
              subtitleDisabled="No task for today!"
              onPress={handlePressDailyTask}
            />
            <GradeComparison
              previousGrade={previousSubmission?.grade}
              currentGrade={currentSubmission?.grade}
              style={{ marginTop: 8 }}
            />
            <List.Subheader style={{ color: '#ffffff', marginTop: 8 }}>Classrooms</List.Subheader>
            <ClassroomsList data={classrooms} />
          </View>
        </ImageBackground>
      </View>

      <FAB
        label="Join"
        icon="plus"
        visible
        style={{ alignSelf: 'flex-end', marginBottom: 24, marginRight: 24 }}
        onPress={showDialog}
      />

      <Portal>
        <Dialog visible={isDialogShown} dismissable={false} onDismiss={hideDialog}>
          <Dialog.Title>Join Classroom</Dialog.Title>
          <Dialog.Content>
            <JoinClassroomForm control={control} />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog} disabled={isJoiningClassroom}>
              Cancel
            </Button>
            <Button
              onPress={handleUserJoinClassroom(onDialogPressJoin)}
              disabled={isJoiningClassroom}
              loading={isJoiningClassroom}>
              Join
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Screen>
  );
};

export default StudentView;
