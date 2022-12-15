import { useEffect, useLayoutEffect, useState } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AnimatedFAB, Dialog, List, Menu, Portal, Snackbar } from 'react-native-paper';
import { Item } from 'react-navigation-header-buttons';
import * as Clipboard from 'expo-clipboard';

import { Button, MaterialHeaderButtons, Screen } from '@/components';
import { RootStackScreenProps } from '@/navigators/types';
import { Classroom } from '@/types';

import useTeacherView from './useTeacherView';
import CreateClassroomForm from './CreateClassroomForm';
import ClassroomsList from '../components/ClassroomsList';
import api from '@/services';

const TeacherView = () => {
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

  // Long Press Item Menu
  const [anchor, setAnchor] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [menuItem, setMenuItem] = useState<Classroom | null>(null);
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => {
    setMenuItem(null);
    setVisible(false);
  };
  const showSnackBar = () => setSnackBarVisible(true);
  const dismissSnackBar = () => setSnackBarVisible(false);

  const {
    control,
    classrooms,
    handleUserCreateClassroom,
    isCreatingClassroom,
    fetchClassrooms,
    selectClassroom,
  } = useTeacherView();
  const onDialogPressCreate = () => {
    hideDialog();
  };

  const onMenuCopyCodePress = () => {
    closeMenu();

    if (!menuItem) {
      return;
    }

    api.clipboard.setString(menuItem.code);
    showSnackBar();
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  return (
    <Screen style={{ alignItems: 'stretch', paddingHorizontal: 0 }}>
      <View style={{ height: 8 }} />
      <List.Subheader>Classrooms</List.Subheader>
      <ClassroomsList
        data={classrooms}
        onItemPress={(_, data) => {
          selectClassroom(data);
          navigation.navigate('Classroom');
        }}
        onItemLongPress={(event, data) => {
          const { pageX, pageY } = event.nativeEvent;
          setAnchor({ x: pageX, y: pageY });
          setMenuItem(data);
          openMenu();
        }}
        onScroll={onScrollScreen}
      />
      <AnimatedFAB
        label="Create"
        icon="plus"
        extended={isFABExtended}
        onPress={showDialog}
        style={{ position: 'absolute', bottom: 24, right: 24 }}
      />
      <Menu visible={visible} onDismiss={closeMenu} anchor={anchor}>
        <Menu.Item title="Copy code" onPress={onMenuCopyCodePress} />
      </Menu>
      <Snackbar visible={snackBarVisible} onDismiss={dismissSnackBar} duration={5000}>
        Copied to clipboard.
      </Snackbar>

      <Portal>
        <Dialog visible={isDialogShown} dismissable={false} onDismiss={hideDialog}>
          <Dialog.Title>Create Classroom</Dialog.Title>
          <Dialog.Content>
            <CreateClassroomForm control={control} />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog} disabled={isCreatingClassroom}>
              Cancel
            </Button>
            <Button
              onPress={handleUserCreateClassroom(onDialogPressCreate)}
              disabled={isCreatingClassroom}
              loading={isCreatingClassroom}>
              Create
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Screen>
  );
};

export default TeacherView;
