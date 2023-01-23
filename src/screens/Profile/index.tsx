import React, { useEffect } from 'react';
import { View } from 'react-native';
import {
  Avatar,
  Dialog,
  IconButton,
  Portal,
  Switch,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';

import { Button, Screen } from '@/components';

import useProfileContainer from './useProfileContainer';
import { getFullName, getInitials } from './helper';
import { useNavigation } from '@react-navigation/native';
import { RootStackScreenProps } from '@/navigators/types';

const Profile = () => {
  const { isDarkTheme, toggleDarkTheme, user, signOut, isSigningOut } = useProfileContainer();
  const theme = useTheme();

  const [isDialogShown, setIsDialogShown] = React.useState(false);
  const showDialog = () => setIsDialogShown(true);
  const hideDialog = () => setIsDialogShown(false);

  if (!user) {
    return null;
  }

  const navigation = useNavigation<RootStackScreenProps<'Profile'>['navigation']>();

  return (
    <Screen withBackground style={{ alignItems: 'stretch' }}>
      <IconButton
        icon="arrow-left"
        size={24}
        style={{
          alignSelf: 'flex-start',
          borderColor: '#facd89',
          borderWidth: 2,
          marginLeft: 16,
        }}
        mode="contained"
        containerColor="#3c5e47"
        iconColor="#ffffff"
        onPress={() => navigation.goBack()}
      />
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View
          style={{
            alignItems: 'center',
            borderWidth: 4,
            borderColor: '#facd89',
            backgroundColor: '#3c5e47',
            margin: 16,
            padding: 16,
          }}>
          <Avatar.Text label={getInitials(user.firstName, user.lastName)} size={96} />
          <Text
            variant="displaySmall"
            numberOfLines={1}
            style={{ marginTop: 40, color: '#ffffff' }}>
            {getFullName(user.firstName, user.lastName)}
          </Text>
          <Text variant="bodyLarge" numberOfLines={1} style={{ marginTop: 8, color: '#ffffff' }}>
            {user.email}
          </Text>

          <Button
            style={{ marginTop: 32 }}
            mode="contained"
            onPress={showDialog}
            buttonColor={theme.colors.error}
            textColor={theme.colors.onError}>
            Log out
          </Button>
        </View>
      </View>

      <Portal>
        <Dialog visible={isDialogShown} dismissable={false} onDismiss={hideDialog}>
          <Dialog.Title>Alert</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to log out?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog} disabled={isSigningOut}>
              Cancel
            </Button>
            <Button
              onPress={signOut}
              disabled={isSigningOut}
              loading={isSigningOut}
              textColor={theme.colors.error}>
              Log Out
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Screen>
  );
};

export default Profile;
