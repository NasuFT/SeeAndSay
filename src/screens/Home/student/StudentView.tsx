import { useLayoutEffect, useEffect, useState } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AnimatedFAB, Dialog, Portal } from 'react-native-paper';
import { Item } from 'react-navigation-header-buttons';

import { Button, MaterialHeaderButtons, Screen } from '@/components';
import { RootStackScreenProps } from '@/navigators/types';

import ClassroomsList from '../components/ClassroomsList';
import useStudentView from './useStudentView';
import JoinClassroomForm from './JoinClassroomForm';
import TaskOfTheDay from '../components/TaskOfTheDay';
import { loadImages } from '@/utils/image';

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
    isCreatingClassroom,
    fetchClassrooms,
    selectClassroom,
    dailyTask,
    fetchDailyTask,
  } = useStudentView();
  const onDialogPressJoin = async () => {
    await handleUserJoinClassroom();
    hideDialog();
  };

  useEffect(() => {
    fetchDailyTask();
    fetchClassrooms();
  }, []);

  useEffect(() => {
    console.log(dailyTask);
  }, [dailyTask]);

  const handlePressDailyTask = async () => {
    if (!dailyTask) {
      return;
    }

    navigation.navigate('GamePrepare');
  };

  return (
    <Screen style={{ alignItems: 'stretch', paddingHorizontal: 0 }}>
      <TaskOfTheDay
        disabled={!dailyTask}
        style={{ marginTop: 16 }}
        task={dailyTask}
        onPress={handlePressDailyTask}
      />
      <ClassroomsList
        data={classrooms}
        onItemPress={(_, data) => {
          selectClassroom(data);
          navigation.navigate('Classroom');
        }}
        onScroll={onScrollScreen}
      />
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
            <Button onPress={hideDialog} disabled={isCreatingClassroom}>
              Cancel
            </Button>
            <Button
              onPress={onDialogPressJoin}
              disabled={isCreatingClassroom}
              loading={isCreatingClassroom}>
              Join
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Screen>
  );
};

export default StudentView;
