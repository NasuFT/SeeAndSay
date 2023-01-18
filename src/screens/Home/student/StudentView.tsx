import { useLayoutEffect, useEffect, useState } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AnimatedFAB, Dialog, List, Portal } from 'react-native-paper';
import { Item } from 'react-navigation-header-buttons';

import { Button, MaterialHeaderButtons, Screen } from '@/components';
import { RootStackScreenProps } from '@/navigators/types';

import ClassroomsList from '../components/ClassroomsList';
import useStudentView from './useStudentView';
import JoinClassroomForm from './JoinClassroomForm';
import TaskOfTheDay from '../components/TaskOfTheDay';
import GradeComparison from '../components/GradeComparison';

const StudentView = () => {
  const navigation = useNavigation<RootStackScreenProps<'Home'>['navigation']>();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <MaterialHeaderButtons>
          <Item
            title="Profile"
            iconName="account-circle-outline"
            onPress={() => navigation.navigate('Profile')}
          />
        </MaterialHeaderButtons>
      ),
    });
  }, []);

  const [isFABExtended, setIsFABExtended] = useState(true);
  const onScrollScreen = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const verticalVelocity = e.nativeEvent.velocity?.y;
    const offset = e.nativeEvent.contentOffset;

    if (!verticalVelocity) {
      return;
    }

    if (verticalVelocity < 0 || offset.y === 0) {
      setIsFABExtended(true);
    } else if (verticalVelocity > 0) {
      setIsFABExtended(false);
    }
  };

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

  useFocusEffect(() => {
    if (dailyTask) {
      getRecentSubmissions();
    }
  });

  const handlePressDailyTask = async () => {
    if (!dailyTask) {
      return;
    }

    navigation.navigate('GamePrepare');
  };

  return (
    <Screen style={{ alignItems: 'stretch', paddingHorizontal: 0 }}>
      <TaskOfTheDay
        disabled={!dailyTask || !isPlayable}
        style={{ marginTop: 16 }}
        task={dailyTask}
        subtitleDisabled="No task for today!"
        onPress={handlePressDailyTask}
      />
      <GradeComparison
        previousGrade={previousSubmission?.grade}
        currentGrade={currentSubmission?.grade}
        style={{ marginTop: 16 }}
      />
      <View style={{ height: 24 }} />
      <List.Subheader>Classrooms</List.Subheader>
      <ClassroomsList data={classrooms} onScroll={onScrollScreen} />
      <AnimatedFAB
        label="Join"
        icon="plus"
        visible={true}
        extended={isFABExtended}
        onPress={showDialog}
        style={{ position: 'absolute', bottom: 24, right: 24 }}
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
